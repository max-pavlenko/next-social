import styles from '../../../../styles/TwitchAnimation.module.scss';

const TwitchAnimation = () => {
   return (
     <div className={styles.wrapper}>
        <div className={styles.main}>
           <div className={`${styles.eye} ${styles.eyeLeft}`} />
           <div className={`${styles.eye} ${styles.eyeRight}`} />
        </div>
        <div className={`${styles.rect} ${styles.topRect}`} />
        <div className={`${styles.rect} ${styles.rightRect}`} />
     </div>
   );
};

export default TwitchAnimation;
