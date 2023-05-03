import React, { FC, PropsWithChildren } from 'react';
import { Box } from '@mui/material';
import { BoxProps } from '@mui/material/Box/Box';
import styles from '../../../../styles/Popup.module.scss';

type Props = BoxProps;

const Popup: FC<PropsWithChildren<Props>> = ({ children, ...props }) => {
   return (
     <Box
       className={styles.popup}
       {...props}
     >
        {children}
     </Box>
   );
};

export default Popup;
