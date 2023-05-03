import React, { FC, PropsWithChildren } from 'react';
import styles from '../../../../../styles/FooterColumn.module.scss';

type Props = { title: string }
const FooterColumn: FC<PropsWithChildren<Props>> = ({ children, title = '' }) => {
   return (
     <>
        <div className={styles.column}>
           {title && <h3 style={{ userSelect: 'none' }}>{title}</h3>}
           <div className={styles.content}>
              {children}
           </div>
        </div>
        <div className="vertical-delimeter" />
     </>
   );
};

export default FooterColumn;
