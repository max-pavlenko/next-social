import { motion } from 'framer-motion';
import React, { ReactNode, useState } from 'react';
import Dropdown from './Dropdown';
import stylesFAQ from '../../styles/FAQ.module.scss';
import styles from '../../styles/AboutUs.module.scss';

export interface TabData {
  tabTitle: string,
  data: { title: string, content: string }[]
}

const Faq = ({ dropdownsData, children }: { dropdownsData: Record<string, TabData>, children: ReactNode }) => {
  const [currentTab, setCurrentTab] = useState<TabData>(dropdownsData[Object.keys(dropdownsData)[0]]);

  const variants = {
    hidden: { opacity: -1, x: 0 },
    enter: { opacity: 1, x: 0 },
    exit: { opacity: -1, x: 0 }
  };

  return (
    <div className={stylesFAQ.FAQ}>
      <div className={stylesFAQ.categories}>
        {Object.entries(dropdownsData).map(([key, value], i) => {
          return <motion.a style={{
            padding: '6px 14px',
            borderRadius: 8,
            position: 'relative',
            backgroundColor: 'var(--color-white)'
          }} key={i} onClick={() => setCurrentTab(value)}>
            <span>{value.tabTitle}</span>
            {currentTab.tabTitle === value.tabTitle && (
              <motion.div className={styles.borderOver} style={{ borderRadius: 8 }} id="bdrs" layoutId="bdrs" />
            )}
          </motion.a>;
        })}

      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          {currentTab.data.map(({ content, title }, i) => <motion.div style={{ width: 'min-content' }} key={title}
          animate="enter" initial="hidden" exit="exit" variants={variants}>
            <Dropdown title={title} content={content} />
            {i < currentTab.data.length - 1 && <div className="smallDelimeter" />}
          </motion.div>)}
        </div>
        {children}
      </div>
    </div>);
};

export default Faq;