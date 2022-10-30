import { motion } from 'framer-motion';
import React, { ReactNode } from 'react';

const AnimatePage = ({children}: {children: ReactNode}) => {
   const variants = {
      hidden: {opacity: 0, x: 0, y: 0, transition: {duration: 0.5, bounce: 1}},
      enter: {opacity: 1, x: 0, y: 0, transition: {duration: 0.5, bounce: 1}},
      exit: {opacity: -1, x: 0, y: 0, transition: {duration: 0.5, bounce: 1}},
   }
   return (
       <motion.div
           variants = {variants}
           initial = "hidden"
           animate = "enter"
           exit = "exit"
           transition = {{type: 'spring'}}
       >
          {children}
       </motion.div>
   );
};

export default AnimatePage;
