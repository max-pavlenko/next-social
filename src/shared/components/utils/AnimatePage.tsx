import React, { ReactNode } from 'react';

const AnimatePage = ({children}: {children: ReactNode}) => {
   const variants = {
       hidden: { opacity: -1, x: 0, y: 0 },
       enter: { opacity: 1, x: 0, y: 0 },
       exit: { opacity: 0, x: 0, y: 0 },
   }

   return (
       <div
           // key={route}
           // whileInView='enter'
           // variants = {variants}
           // initial="hidden"
           // exit={{opacity: 0, x: 0, y: 0}}
           // transition={{ type: 'tween', duration: 0.35 }}
       >
          {children}
       </div>
   );
};

export default AnimatePage;
