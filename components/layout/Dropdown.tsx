import { motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import styles from '../../styles/Dropdown.module.scss';

const Dropdown = ({ title, content }: { title: string, content: string }) => {
  const [isOpened, setIsOpened] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  function handleDropdownClick(e: any) {
    e.preventDefault();
    e.stopPropagation();
    setIsOpened(prevState => {
      return !prevState;
    });
    setClickCount(prevState => ++prevState);
  }

  return (
    <motion.div className={styles.dropdown} onClick={handleDropdownClick}>
      <div style={{ display: "flex", alignItems: "center", userSelect: "none", }}>
        <div style={{
          fontWeight: "bold",
          fontSize: 19,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          flex: 1,
        }}>{title}</div>
        <svg color="var(--color-border)"
             style={{ marginLeft: 10, width: 17, fill: 'var(--color-border)', rotate: `${clickCount * 180}deg` }} xmlns="http://www.w3.org/2000/svg" shapeRendering="geometricPrecision" textRendering="geometricPrecision" imageRendering="optimizeQuality" fillRule="evenodd" clipRule="evenodd" viewBox="0 0 512 298.04"><path fillRule="nonzero" d="M12.08 70.78c-16.17-16.24-16.09-42.54.15-58.7 16.25-16.17 42.54-16.09 58.71.15L256 197.76 441.06 12.23c16.17-16.24 42.46-16.32 58.71-.15 16.24 16.16 16.32 42.46.15 58.7L285.27 285.96c-16.24 16.17-42.54 16.09-58.7-.15L12.08 70.78z"/></svg>

        {/*<Icon ref={chevronRef} color="var(--color-border)" icon="chevronDown" size={30}*/}
        {/*      style={{ marginLeft: 10, rotate: `${isOpened ? "180deg" : shouldGoTo360 ? "360deg" : "0deg"}` }} />*/}
      </div>
        <motion.div onClick={e => e.stopPropagation()}
                    style={{ marginTop: isOpened ? '15px' : '5px', cursor: 'default', overflow: 'hidden', transition: '0.2s all', maxHeight: `${isOpened ? '220px' : 0}`,
                      textAlign: "justify" }} >
          {content}
        </motion.div>
    </motion.div>
  );
};

export default Dropdown;