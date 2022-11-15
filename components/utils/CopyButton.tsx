import React, { useState } from 'react';
import { IconButton, Typography } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

const CopyButton = ({content}: {content: string}) => {
   const [ shouldShowTooltip, setShouldShowTooltip ] = useState(false);
   const [ tooltipText, setTooltipText ] = useState('Copy');

   function handleMouseEnter() {
      setShouldShowTooltip(true)
   }

   function handleMouseLeave() {
      setShouldShowTooltip(false)
      if (tooltipText!=='Copy') setTooltipText('Copy');
   }

   async function handleOptionCopyClick(textToCopy: string) {
      await navigator.clipboard.writeText(textToCopy);
      setTooltipText('Copied!')
   }

   return (
       <IconButton onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={() => handleOptionCopyClick(content)} style={{marginLeft: '10px'}}>
          <Typography style = {{
             position: 'absolute',
             top: 0,
             translate: '0 -115%',
             padding: '3px 6px',
             borderRadius: '6px',
             backgroundColor: '#444',
             color: '#ffa',
             opacity: shouldShowTooltip ? 1 : 0,
          }} variant = 'caption'>{tooltipText}</Typography>
          <ContentCopyIcon/>
       </IconButton>
   );
};

export default CopyButton;
