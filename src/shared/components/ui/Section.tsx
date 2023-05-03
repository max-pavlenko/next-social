import React, { FC, ReactNode } from 'react';
import styles from '../../../../styles/AboutUs.module.scss';

type Props = { title: string, headerType?: 'big' | 'usual', children: ReactNode, classname?: string };
const Section: FC<Props> = ({ title, children, headerType = 'usual', classname = '' }) => {
   return (
     <figure style={{ position: 'relative' }} className={`${classname}`}>
        <figcaption className={`${headerType === 'usual' ? styles.smallHeader : styles.header}`}>
           {title}
        </figcaption>
        {children}
     </figure>
   );
};

export default Section;
