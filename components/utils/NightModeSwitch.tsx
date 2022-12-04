import {AnimatePresence, motion} from 'framer-motion';
import React, {CSSProperties, useEffect, useState} from 'react';
import {setModeFromLS, switchMode} from "../../utils/helpers";

const NightModeSwitch = ({style}: {style?: CSSProperties}) => {
    const [isLightMode, setIsLightMode] = useState(true);
    const variants = {
        hidden: { opacity: -1, x: 0, y: -50 },
        enter: { opacity: 1, x: 0, y: 0 },
        exit: { opacity: -1, x: 0, y: 100 },
    }

    useEffect(() => {
        setModeFromLS(mode => setIsLightMode(mode))
    }, []);

    return (
        <AnimatePresence mode='sync'>
            <motion.a
                className='darkModeSwitcher'
                style={{...style, backgroundColor: 'transparent', fontSize: '24px', userSelect: 'none'}}
                onClick={() => switchMode(!isLightMode, (isDarkMode)=> setIsLightMode(isDarkMode))}
                variants={variants}
                initial="hidden"
                animate={['enter']}
                key={isLightMode ? 'light' : 'dark'}
                exit='exit'
                transition={{bounce: 1000, damping: 500, duration: 0.13,}}>
                {isLightMode ? '🌇' : '🌆'}
            </motion.a>
        </AnimatePresence>
    );
};

export default NightModeSwitch;