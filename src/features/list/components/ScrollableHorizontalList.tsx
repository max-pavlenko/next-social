import React, { MouseEvent, useCallback, useEffect, useRef, useState } from 'react';
import styles from '../../../../styles/ScrollableHorizontalList.module.scss';
import debounce from 'lodash.debounce';

export interface HorizontalListData {
   img: string;
}

const ScrollableHorizontalList = ({ data }: { data: HorizontalListData[] }) => {
   const listRef = useRef<HTMLDivElement>(null);
   const [percentage, setPercentage] = useState(0);
   const [xPos, setXPos] = useState({ downAt: 0, upAt: 0, isDowned: false, prevPercentage: 0 });

   const handleMouseUp = (event: MouseEvent<HTMLDivElement>) => {
      setXPos(prevState => {
         return {
            ...prevState, upAt: event.clientX, downAt: 0, isDowned: false, prevPercentage: percentage,
         };
      });
   };

   console.log('perc', percentage);

   function handleMouseDown(event: MouseEvent<HTMLDivElement>) {
      setXPos(prevState => {
         return {
            ...prevState, downAt: event.clientX, isDowned: true,
         };
      });
   }

   function handleMouseMove(event: MouseEvent<HTMLDivElement>) {
      if (xPos.downAt === 0) return;
      const mouseDelta = xPos.downAt - event.clientX, maxDelta = listRef.current!.scrollWidth / 2;
      const percentage = (mouseDelta / maxDelta) * -100, nextPercentageUnconstrained = xPos.prevPercentage + percentage;
      console.log('delta', mouseDelta, listRef.current!.offsetWidth / 2, percentage);
      handleScrollDebounced(Math.max(Math.min(nextPercentageUnconstrained, 0), -100));
   }

   const handleScrollDebounced = useCallback(debounce((percent) => controlPercentage(percent), 3), []);


   function controlPercentage(percentage: number) {
      setPercentage(percentage);
   }

   useEffect(() => {
      console.log('change', -percentage / 100 * listRef.current!.scrollWidth);
      listRef.current!.scrollTo({ behavior: 'smooth', left: -percentage / 100 * listRef.current!.scrollWidth, top: 0 });
   }, [percentage]);

   return (
     <div ref={listRef} style={{ cursor: xPos.isDowned ? 'grabbing' : 'grab' }}
          onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}
          draggable={false} className={styles.items}>
        {
           data.map(({ img }, i) => {
              return <img style={{ objectPosition: `${100 + percentage}% center` }} draggable={false} src={img} key={i} alt="img" />;
           })
        }
     </div>
   );
};

export default ScrollableHorizontalList;
