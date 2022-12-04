import {motion} from 'framer-motion';
import React, {ReactNode} from 'react';
import {useRouter} from "next/router";

const AnimatePage = ({children}: {children: ReactNode}) => {
   const variants = {
       hidden: { opacity: -1, x: 0, y: 0 },
       enter: { opacity: 1, x: 0, y: 0 },
       exit: { opacity: 0, x: 0, y: 0 },
   }

   const {route} = useRouter();

   return (
       <motion.div
           key={route}
           animate='enter'
           variants = {variants}
           initial="hidden"
           exit={{opacity: 0, x: 0, y: 0, transition: {duration: 0.15}}}
           transition={{ type: 'tween' }}
       >
          {children}
       </motion.div>
   );
};

export default AnimatePage;
