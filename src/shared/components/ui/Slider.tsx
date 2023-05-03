import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';
import styles from '../../../../styles/AboutUs.module.scss';
import Icon from './Icon';

export interface Slide {
   img: string;
}

const SLIDESHOW_SPEED_MS = 3000;

const Slider = ({ sliderData }: { sliderData: Slide[] }) => {
   const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
   const variantsRef = useRef(getVariants(true));
   const [isSlideshowEnabled, setIsSlideshowEnabled] = useState(false);

   useEffect(() => {
      const timeID = isSlideshowEnabled ? setInterval(() => {
         console.log('currentSlideIndex', currentSlideIndex);
         const computedIndex = currentSlideIndex + 1 === sliderData.length ? 0 : currentSlideIndex + 1;
         setCurrentSlideIndex(computedIndex);
      }, SLIDESHOW_SPEED_MS) : 0;
      return () => clearTimeout(timeID);
   }, [currentSlideIndex, isSlideshowEnabled, sliderData.length]);

   function handleChangeSlide(index: number) {
      let computedIndex = index;
      if (index < 0) {
         computedIndex = sliderData.length - 1;
         variantsRef.current = getVariants(false);
      }
      else if (index >= sliderData.length) {
         computedIndex = 0;
         variantsRef.current = getVariants(true);
      }
      else {
         console.warn('indexes', computedIndex, currentSlideIndex);
         variantsRef.current = getVariants(computedIndex > currentSlideIndex);
      }
      setCurrentSlideIndex(computedIndex);
   }

   function getVariants(isMovingRight: boolean = true) {
      return {
         hidden: { opacity: 0, x: `${isMovingRight ? 100 : -100}%` },
         enter: { opacity: 1, x: 0 },
         exit: { opacity: 0, x: `${isMovingRight ? -100 : 100}%` },
      };
   }

   return (
     <>
        <div className={styles.slider}>
           <>
              <a onClick={() => setIsSlideshowEnabled(prev => !prev)}
                 className={`${styles.playSlideShow}`}>
                 {<Icon size={22} color="var(--color-border)" icon={isSlideshowEnabled ? 'pause' : 'play'} />}
              </a>

              <a onClick={() => handleChangeSlide(currentSlideIndex - 1)}
                 className={`${styles.arrowBack} ${styles.arrow}`}>
                 <span style={{ transform: 'scaleX(0.5)', userSelect: 'none' }}>&lt;</span>
              </a>
              <AnimatePresence mode="sync">
                 <motion.div
                   variants={variantsRef.current}
                   transition={{ type: 'tween', duration: 0.3 }}
                   key={currentSlideIndex}
                   animate="enter"
                   initial="hidden"
                   exit="exit"
                   className={styles.sliderImageAnimated}
                 >
                    {`${sliderData[currentSlideIndex].img} Logo📸`}
                 </motion.div>
              </AnimatePresence>
              <a onClick={() => handleChangeSlide(currentSlideIndex + 1)}
                 className={`${styles.arrowForward} ${styles.arrow}`}>
                 <span style={{ transform: 'scaleX(0.5)', userSelect: 'none' }}>&gt;</span>
              </a>
           </>
        </div>
        <div className={styles.dotsWrapper}>
           {sliderData.map(({ img }, i) => (
             <a onClick={() => handleChangeSlide(i)} className={`slideDot ${i === currentSlideIndex && 'activeDot'}`} key={img} />
           ))}
        </div>
     </>
   );
};

export default Slider;
