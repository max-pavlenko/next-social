import React, { FC, useState } from 'react';
import { IconButton, IconButtonProps, SvgIconTypeMap, Typography } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { OverridableComponent } from '@mui/types';

type Props = {
   tooltipText: string,
   MUIicon?: OverridableComponent<SvgIconTypeMap> & { muiName: string },
   onMouseLeave: () => void,
   onMouseEnter: () => void,
   onClick: () => void,
} & IconButtonProps

const ButtonWithTooltip: FC<Props> = ({ MUIicon = <ContentCopyIcon />, onMouseLeave, onMouseEnter, tooltipText, onClick, ...props }) => {
   const [isTooltipVisible, setIsTooltipVisible] = useState(false);

   function handleMouseLeave() {
      onMouseLeave();
      setIsTooltipVisible(false);
   }

   function handleMouseEnter() {
      onMouseEnter();
      setIsTooltipVisible(true);
   }

   return (
     <IconButton style={{ marginLeft: '10px' }} {...props} onMouseLeave={handleMouseLeave} onClick={onClick} onMouseEnter={handleMouseEnter}>
        <Typography style={{
           position: 'absolute',
           top: 0,
           translate: '0 -115%',
           padding: '3px 6px',
           borderRadius: '6px',
           backgroundColor: '#444',
           color: '#ffa',
           opacity: isTooltipVisible ? 1 : 0,
        }} variant="caption">{tooltipText}</Typography>
        <>{MUIicon}</>
     </IconButton>
   );
};

export default ButtonWithTooltip;
