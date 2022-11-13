import { useEffect, useState } from 'react';

export default (width: number) => {
   const [isScreenWidthLessThen, setIsScreenWidthLessThen] = useState(false);
   useEffect(()=>{
      setIsScreenWidthLessThen(window.matchMedia(`(max-width: ${width}px)`).matches)
   }, [])

   useEffect(() => {
      window.addEventListener('resize', handleResize)

      return ()=>{
         window.removeEventListener('resize', handleResize)
      }
   }, []);

   const handleResize = () => {
      setIsScreenWidthLessThen(window.matchMedia(`(max-width: ${width}px)`).matches)
   };

   return {
      [`isScreenWidthLessThen${width}`]: isScreenWidthLessThen,
      [`setIsScreenWidthLessThen${width}`]: (() => setIsScreenWidthLessThen(window.matchMedia(`(max-width: ${width}px)`).matches)),
   };
};
