import { useEffect, useRef, useState } from 'react';
import { toastNotify } from '../../../../utils/helpers';
import { ListItemIcon, ListItemText, Menu, MenuItem, Typography } from '@mui/material';
import { ContentCopy, ContentPasteSearchOutlined } from '@mui/icons-material';
import { useLocale } from '../../../../translations/useLocale';

export const ContextMenu = () => {
   const [contextMenu, setContextMenu] = useState<{
      mouseX: number;
      mouseY: number;
   } | null>(null);
   const exactText = useRef('');
   const l = useLocale();

   const elementsToSkip = ['input', 'textarea'];

   useEffect(() => {
      document.addEventListener('mouseup', (event: any) => {
         const selectedText = window.getSelection()!.toString().trim();
         const target = event.target.localName;
         if (!selectedText.length || elementsToSkip.includes(target)) {
            setContextMenu(null);
            return;
         }

         exactText.current = selectedText;
         console.log('exactText.current', exactText.current);
         setContextMenu(
           contextMenu === null
             ? {
                mouseX: event.clientX + 4,
                mouseY: event.clientY + 18,
             }
             : null,
         );
      });
   }, []);

   function handleClose() {
      setContextMenu(null);
   }

   async function handleCopy() {
      handleClose();
      await toastNotify({ successText: 'copied text' }, {
         tryFn: async () => {
            await navigator.clipboard.writeText(exactText.current);
         },
      });
   }

   async function handleSearch() {
      handleClose();
      window.open(`https://www.google.com/search?q=${exactText.current}`, '_blank')!.focus();
   }

   return (
     <Menu
       open={contextMenu !== null}
       onClose={handleClose}
       anchorReference="anchorPosition"
       anchorPosition={
          contextMenu === null ? undefined : { top: contextMenu.mouseY, left: contextMenu.mouseX }
       }
     >
        <MenuItem onClick={handleCopy}>
           <ListItemIcon>
              <ContentCopy fontSize="small" />
           </ListItemIcon>
           <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}><ListItemText>{l.copy}</ListItemText>
              <Typography variant="body2" color="text.secondary">
                 Ctrl + C
              </Typography></div>
        </MenuItem>

        <MenuItem onClick={handleSearch} sx={{ width: '100%' }}>
           <ListItemIcon>
              <ContentPasteSearchOutlined fontSize="small" />
           </ListItemIcon>
           <ListItemText>{l.search}</ListItemText>
        </MenuItem>
     </Menu>
   );
};
