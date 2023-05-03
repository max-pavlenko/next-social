import React, { CSSProperties, FC } from 'react';
import styles from '../../../../styles/Loader.module.scss';

type Props = { isVisible?: boolean, style?: CSSProperties }
const Loader: FC<Props> = ({ isVisible = true, style = {} }) => {
   if (!isVisible) return <></>;

   return (
     <div style={style} className={styles.loader}>
        <svg className={styles.circular} viewBox="25 25 50 50">
           <circle className={styles.path} cx="50" cy="50" r="20" fill="none" strokeWidth="2"
                   strokeMiterlimit="10" />
        </svg>
     </div>
   );
};

export default Loader;
