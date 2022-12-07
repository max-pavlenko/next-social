import {AnimatePresence, motion} from 'framer-motion';
import {observer} from 'mobx-react-lite';
import React, {CSSProperties, useEffect, useState} from 'react';
import {setModeFromLS, switchMode} from "../../utils/helpers";
import User from "../../store/User";

const NightModeSwitch = ({style}: {style?: CSSProperties}) => {
    const {user: {lightMode}} = User;
    const [isLightMode, setIsLightMode] = useState(lightMode);
    const variants = {
        hidden: { opacity: -1, x: 0, y: -50 },
        enter: { opacity: 1, x: 0, y: 0 },
        exit: { opacity: -1, x: 0, y: 100 },
    }

    useEffect(() => {
        setModeFromLS(mode => setIsLightMode(mode))
    }, []);

    return (
        <AnimatePresence mode='wait'>
            <motion.a
                className='darkModeSwitcher'
                style={{...style, backgroundColor: 'transparent', fontSize: '24px', userSelect: 'none'}}
                onClick={() => switchMode(!isLightMode, (isDarkMode)=> setIsLightMode(isDarkMode))}
                variants={variants}
                initial="hidden"
                animate={['enter']}
                key={isLightMode ? 'light' : 'dark'}
                exit='exit'
                transition={{bounce: 1000, damping: 500, duration: 0.1,}}>
                {isLightMode ? '🌇' : '🌆'}
            </motion.a>
        </AnimatePresence>
    );
};

export default observer(NightModeSwitch);