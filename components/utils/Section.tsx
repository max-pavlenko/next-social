import React, { ReactNode} from 'react';
import styles from "../../styles/AboutUs.module.scss";

const Section = ({title, children, headerType = 'usual', classname=''}: {title: string, headerType?: 'big' | 'usual', children: ReactNode, classname?: string}) => {
    return (
        <figure style={{position: 'relative'}} className={`${classname}`}>
            <figcaption className={`${headerType === 'usual' ? styles.smallHeader : styles.header}`}>
                {title}
            </figcaption>
            {children}
        </figure>
    );
};

export default Section;