import React, {ReactNode, useState} from 'react';
import styles from "../../styles/AboutUs.module.scss";
import {Typography} from "@mui/material";
import {AnimatePresence, motion} from "framer-motion";

export type Tab = {title: string, content: ReactNode | string}

const Tabs = ({tabsData}: {tabsData: Tab[]}) => {
    const [currentTab, setCurrentTab] = useState(tabsData[0]);

    function handleTabClick(tabData: Tab) {
        setCurrentTab(tabData)
    }

    const variants = {
        hidden: {opacity: -1, x: 0},
        enter: {opacity: 1, x: 0},
        exit: {opacity: -1, x: 0},
    }

    return (
        <div className={styles.tabbedBox}>
            <div className={styles.tabsContainer}>
                {tabsData.map(({title, content}, i) => (
                    <a key={i} onClick={() => handleTabClick({title, content})}
                       className={`${styles.tab} ${title === currentTab.title && styles.activeTab}`}>
                        <Typography style={{fontFamily: 'Nunito, sans-serif',}}>
                            {title}
                        </Typography>
                        {title === currentTab.title ? (
                            <motion.div id='underline' className={styles.underlineBottom}
                                        layoutId="underline"/>
                        ) : null}
                    </a>
                ))}
                <div className={styles.removeBorders}/>
            </div>
            <AnimatePresence mode='wait'>
                <motion.div transition={{type: 'tween', duration: 0.15,}} key={currentTab.title}
                            animate='enter' initial="hidden"
                            exit='exit' variants={variants}>
                    <Typography>
                        {currentTab.content}
                    </Typography>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default Tabs;