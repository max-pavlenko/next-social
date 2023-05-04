import React, { useCallback, useEffect, useRef, useState } from 'react';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import IconButton from '@mui/material/IconButton';
import PauseCircleOutlinedIcon from '@mui/icons-material/PauseCircleOutlined';
import PlayCircleOutlineRoundedIcon from '@mui/icons-material/PlayCircleOutlineRounded';
import styles from '../../../../styles/Player.module.scss';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import VolumeDownIcon from '@mui/icons-material/VolumeDown';
import { debounce } from 'lodash';
import RangeInput from '../../../shared/components/ui/RangeInput';
import { firestore } from '../../../../libs/firebase';

type Props = {
   isInitiallyMuted?: boolean,
   title?: string,
   srcs: string[]
}
const Player = ({
   isInitiallyMuted = false,
   title = 'Default',
   srcs = [],
}: Props) => {
   const [isPlaying, setIsPlaying] = useState(false);
   const [volume, setVolume] = useState(0.15);
   const [isMuted, setIsMuted] = useState<boolean>(isInitiallyMuted);
   const [currentTimeS, setCurrentTimeS] = useState(0);
   const [progressInS, setProgressInS] = useState(0);
   const [error, setError] = useState('');
   const [audioDuration, setAudioDuration] = useState(0);
   const [isAudioReady, setIsAudioReady] = useState(false);

   const audioCtxRef = useRef<AudioContext>(new AudioContext());
   const analyserNodeRef = useRef<AnalyserNode>(audioCtxRef.current.createAnalyser());
   const gainNodeRef = useRef<GainNode>(audioCtxRef.current.createGain());
   const audioElRef = useRef<HTMLAudioElement>(null);
   const bufferLengthRef = useRef<number>(analyserNodeRef.current.frequencyBinCount);
   const dataArray = useRef(new Uint8Array(bufferLengthRef.current));
   const canvasRef = useRef<HTMLCanvasElement>(null);
   const canvasCtxRef = useRef<CanvasRenderingContext2D | null>(null);
   const trackRef = useRef<MediaElementAudioSourceNode | null>(null);
   const prevVolume = useRef(volume);
   const playerRef = useRef<HTMLDivElement>(null);
   const bufferedProgressBarRef = useRef<HTMLDivElement>(null);
   const shouldRenderSoundBars = useRef(true);

   const [currentSongIndex, setCurrentSongIndex] = useState(0);

   useEffect(() => {
      console.log('check', isAudioReady, audioElRef.current!.paused);
      isAudioReady && !isPlaying && togglePlay();
   }, [isAudioReady]);

   useEffect(() => {
      isPlaying && updateFrequency();
   }, [isPlaying]);

   useEffect(() => {
      const songTime = localStorage.getItem('songTime');
      attachEvents();
      canvasCtxRef.current = canvasRef.current!.getContext('2d')!;

      if (trackRef.current) return;
      if (songTime) audioElRef.current!.currentTime = Number(songTime);
      trackRef.current = audioCtxRef.current.createMediaElementSource(audioElRef.current!);
      analyserNodeRef.current.getByteFrequencyData(dataArray.current);
      trackRef.current.connect(gainNodeRef.current).connect(analyserNodeRef.current).connect(audioCtxRef.current.destination);
      console.log('volemg', Number(localStorage.getItem('volume')));
      firestore.collection('users').get().then(d => console.log('users', d.docs.map(doc => doc.data())));

      changeVolume(Number(localStorage.getItem('volume')));
      return () => {
         window.removeEventListener('beforeunload', handleUnload);
      };
   }, []);

  function attachEvents() {
    window.addEventListener("beforeunload", handleUnload);
  }

  function handleUnload() {
    console.log(volume);
    localStorage.setItem("volume", String(volume));
    localStorage.setItem("songTime", String(audioElRef.current!.currentTime));
  }

  function changeVolume(value: number, accountOnMuted = true) {
    isMuted && accountOnMuted && setIsMuted(false);
    if (!gainNodeRef.current) return;
    setVolume(value);
    gainNodeRef.current.gain.value = value;
  }

  function handleAudioTimeUpdate() {
    const audioCurrentTime = audioElRef.current!.currentTime;
    setProgressInS(audioCurrentTime);
    setCurrentTimeS(audioCurrentTime);
  }

  const debouncedSeekTo = useCallback(debounce(seekTo, 3), []);
  const debouncedChangeSoundBarsRender = useCallback(debounce(cancelSoundBarsRender, 100), []);

  function cancelSoundBarsRender() {
      setTimeout(()=>{
        shouldRenderSoundBars.current = false
      }, 300)
  }

  function seekTo(timeInSecs: number) {
    audioElRef.current!.currentTime = timeInSecs;
    buildSoundBarsInCanvas();
  }

  function getTimeString(timeInS: number) {
    const seconds = `${parseInt(`${timeInS % 60}`, 10)}`.padStart(2, "0");
    const minutes = `${parseInt(`${Math.floor(timeInS / 60)}`, 10)}`.padStart(2, "0");

    return `${minutes}:${seconds}`;
  }

  async function togglePlay() {
     const audioEl = audioElRef.current!;
     try {
        (audioCtxRef.current.state === 'suspended' && currentSongIndex === 0) && await audioCtxRef.current.resume();
     } catch (e) {
        console.warn('err22', e);
     }
     if (audioElRef.current!.paused) {
        await audioEl.play();
        setIsPlaying(true);
     }
     else {
        audioEl.pause();
        setIsPlaying(false);
     }
  }

  function handlePlay() {
    shouldRenderSoundBars.current = true;
    setIsPlaying(true);
    // updateFrequency();
  }

  function handleLoadStart() {
    setIsAudioReady(false);
    setIsPlaying(false);
  }

  function handleCanPlayThrough() {
    setIsAudioReady(true);
  }

  function updateFrequency() {
    if (!shouldRenderSoundBars.current) {
      return;
    }

    console.log('current', dataArray.current);
    buildSoundBarsInCanvas()
    requestAnimationFrame(updateFrequency);
  }

  function buildSoundBarsInCanvas() {
    analyserNodeRef.current.getByteFrequencyData(dataArray.current);
    const canvas = canvasRef.current!;
    const canvasCtx = canvasCtxRef.current!;
     if (!canvas) return;

    const barWidth = 7;
    const barGap = 5;
    const HEIGHT_MULTIPLIER = 1.15;
    const bufferPercentage = 60;
    const bufferSize = (bufferLengthRef.current * bufferPercentage) / 100;
    let x = barGap;

    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
    const barCount = (canvasRef.current!.width / (barWidth + barGap));
    console.log('barCount', barCount, canvasRef.current!.width, );

    // this is a loss representation of the frequency
    // some data are loss to fit the size of the canvas
    for (let i = 0; i < barCount; i++) {
      // get percentage of i value
      const iPerc = Math.round((i * 100) / barCount);
      // what the i percentage maps to in the frequency data
      const pos = Math.round((bufferSize * iPerc) / 100);
      const frequency = dataArray.current[pos];
      // frequency value in percentage
      const frequencyPerc = (frequency * 100) / 255;
      // frequency percentage value in pixel in relation to the canvas height
      const barHeight = ((frequencyPerc * canvas.height) / 100) * HEIGHT_MULTIPLIER;
      // flip the height so the bar is drawn from the bottom
      const y = canvas.height - barHeight;

      canvasCtx.fillStyle = `rgb(${frequency}, 100 , 255)`;
      canvasCtx.fillRect(x, y, barWidth, barHeight);

      x += (barWidth + barGap);
    }
  }

  function handlePause() {
    debouncedChangeSoundBarsRender();
    setIsPlaying(false);
  }

  async function handleAudioEnd() {
     console.log('end?', currentSongIndex, audioElRef.current!.paused, srcs.length - 1);

     if (currentSongIndex === srcs.length - 1) {
        setCurrentSongIndex(0);
     }
     else {
        setCurrentSongIndex(prevState => ++prevState);
     }

     // audioElRef.current!.pause();
  }

  async function handleAudioBegin() {
     console.log('begin?', currentSongIndex, audioElRef.current!.paused, srcs.length - 1);

     if (currentSongIndex === 0) {
        setCurrentSongIndex(srcs.length - 1);
     }
     else {
        setCurrentSongIndex(prevState => --prevState);
     }
  }

  function handleAudioError() {
    setError(audioElRef.current!.error?.message || "");
    console.warn(audioElRef.current!.error);
  }

  function handleLoadMetaData() {
    setAudioDuration(audioElRef.current!.duration);
  }

  const handleMuteBtnClick = () => {
     if (isMuted) {
        changeVolume(prevVolume.current, false);
     }
     else {
        prevVolume.current = volume;
        changeVolume(0, false);
     }
     setIsMuted(prevState => !prevState);
  };

  function handleOnProgress() {
    const bufferedEnd = audioElRef.current!.buffered.end(audioElRef.current!.buffered.length - 1);
    const duration = audioElRef.current!.duration;
    if (duration > 0) {
      bufferedProgressBarRef.current!.style.width = ((bufferedEnd / duration) * 100) + "%";
    }
  }

  return (
    <>
      <div ref={playerRef} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>

        <audio src={srcs[currentSongIndex]} ref={audioElRef}
               onProgress={handleOnProgress}
               onCanPlayThrough={handleCanPlayThrough}
               onLoadStart={handleLoadStart}
               onLoadedMetadata={handleLoadMetaData} onPlay={handlePlay} onError={handleAudioError}
               onEnded={handleAudioEnd}
               onPause={handlePause} onTimeUpdate={handleAudioTimeUpdate} style={{ display: "none" }} />
          <img style={{ width: "30%", borderRadius: "8px", objectFit: "cover" }}
               src="https://cdn.saleminteractivemedia.com/shared/images/default-cover-art.png" alt="music cover" />
        {/*<div className={`${styles.volumeBar} ${volume > 1 ? 'over' : 'half'}`}>
          <IconButton style={{backgroundColor: 'var(--color-border)'}} onClick={handleMuteBtnClick}>{isMuted || volume === 0 ? <VolumeOffIcon /> : (volume < 0.5 ? <VolumeDownIcon /> : <VolumeUpIcon />)}</IconButton>
          <div className={styles.sliderLeftShadow} style={{
            width: (VOLUME_BAR_WIDTH - VOLUME_BAR_THUMB_SIZE) * volume,
            left: `calc(-${VOLUME_BAR_WIDTH}px)`,
          }} />
          <input title='volume' ref={volumeElRef} type="range" min="0" max="1" step="0.01" value={volume}
                 onChange={e => changeVolume(+e.target.value)} className={styles.volumeField} />
        </div>*/}

          <div className={`${styles.progressIndicator}`}>
            <div style={{ padding: 15, width: 300 }}>
              <div style={{position: 'relative', pointerEvents: 'none'}}>
                <div ref={bufferedProgressBarRef} className={styles.bufferedProgressBar} />
                <canvas ref={canvasRef} className={styles.canvas} />
              </div>
              <input style={{ zIndex: 1 }} title={title} type="range" max={audioDuration}
                     onChange={(e) => debouncedSeekTo(+e.target.value)} value={progressInS}
                     className={styles.progressBar}
              />
            </div>
            <span className={styles.currentTime}>{getTimeString(currentTimeS)}</span>
            <span className={styles.duration}>{getTimeString(audioDuration)}</span>
        </div>
        <div style={{ display: "flex", gap: 5 }}>
          <IconButton onClick={handleAudioBegin} color="primary">
            {<SkipPreviousIcon />}
          </IconButton>
          <IconButton onClick={togglePlay} color="primary">
            {isPlaying ? <PauseCircleOutlinedIcon /> : <PlayCircleOutlineRoundedIcon />}
          </IconButton>
          <IconButton onClick={handleAudioEnd} color="primary">
            {<SkipNextIcon />}
          </IconButton>
        </div>
        <div className="hover" style={{ display: "flex", gap: 7 }}>
          <IconButton className="hover" size="small" style={{ backgroundColor: "var(--color-border)" }}
                      onClick={handleMuteBtnClick}>
            {isMuted || volume === 0 ? <VolumeOffIcon /> : (volume < 0.5 ? <VolumeDownIcon /> : <VolumeUpIcon />)}
          </IconButton>
          <RangeInput value={volume} onChange={e => {
            const inputValue = +e.target.value;
            changeVolume(inputValue);
          }} style={{ width: 200 }} min={0} max={1} step={0.02} />
        </div>
      </div>
    </>
  );
};

/*
function t(){
  return <figure className={styles.audioPlayer}>
    <figcaption className={styles.audioName}>{error ? error : title}</figcaption>
    <audio ref={audioElRef}
           onLoadedMetadata={handleLoadMetaData} onPlay={handlePlay} onError={handleAudioError} onEnded={handleAudioEnd}
           onPause={handlePause} onTimeUpdate={handleAudioTimeUpdate} style={{ display: 'none' }} />

    <button onClick={togglePlay}
            className={`${styles.playBtn} ${isPlaying && 'playing'}`}>{isPlaying ? 'pause' : 'play'}</button>
    <div className={`${styles.progressIndicator}`}>
      <span className={styles.currentTime}>{getTimeString(currentTimeS)}</span>
      <input title={title} type="range" max={audioDurationRef.current} onChange={(e) => seekTo(+e.target.value)} value={progressInS}
             className={styles.progressBar} />
      <span className={styles.duration}>{getTimeString(audioElRef.current?.duration || 0)}</span>
      <canvas className={styles.canvas} ref={canvasRef} style={{ width: '100%', height: '20px' }}></canvas>
    </div>
    <div className={`${styles.volumeBar} ${volume > 1 ? 'over' : 'half'}`}>
      <IconButton style={{backgroundColor: 'var(--color-border)'}} onClick={handleMuteBtnClick}>{isMuted ? <VolumeOffIcon /> : <VolumeUpIcon />}</IconButton>
      <div className={styles.sliderLeftShadow} style={{
        width: (VOLUME_BAR_WIDTH - VOLUME_BAR_THUMB_SIZE) * volume,
        left: `calc(-${VOLUME_BAR_WIDTH}px)`,
      }} />
      <input title='volume' ref={volumeElRef} type="range" min="0" max="1" step="0.01" value={volume}
             onChange={e => changeVolume(+e.target.value)} className={styles.volumeField} /></div>
  </figure>
}
*/

export default Player;
