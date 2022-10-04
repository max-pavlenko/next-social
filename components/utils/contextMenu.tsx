import { useEffect, useRef, useState } from 'react';
import { toastNotify } from '../../utils/helpers';
import { ListItemIcon, ListItemText, Menu, MenuItem, Typography } from '@mui/material';
import { ContentCopy, ContentPasteSearchOutlined } from '@mui/icons-material';

export const ContextMenu = () => {
   const [ contextMenu, setContextMenu ] = useState<{
      mouseX: number;
      mouseY: number;
   } | null>(null);
   const exactText = useRef('');

   useEffect(() => {
      document.addEventListener('mouseup', (event: any) => {
         const selectedText = window.getSelection().toString().trim();
         const target = event.target.localName;
         if (!selectedText.length || target==='input') {
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
      await toastNotify({successText: 'copied text: ' + exactText.current}, {
         tryFn: async () => {
            await navigator.clipboard.writeText(exactText.current);
         }
      });
   }

   async function handleSearch() {
      handleClose();
      window.open('https://www.google.com/search?q=' + exactText.current, '_blank').focus();
   }

   return (
       <Menu
           open = {contextMenu !== null}
           onClose = {handleClose}
           anchorReference = "anchorPosition"
           anchorPosition = {
              contextMenu !== null
                  ? {top: contextMenu.mouseY, left: contextMenu.mouseX}
                  : undefined
           }
       >
          <MenuItem onClick = {handleCopy} sx = {{width: '175px'}}>
             <ListItemIcon>
                <ContentCopy fontSize = "small"/>
             </ListItemIcon>
             <ListItemText>Copy</ListItemText>
             <Typography variant = "body2" color = "text.secondary">
                Ctrl + C
             </Typography>
          </MenuItem>

          <MenuItem onClick = {handleSearch} sx = {{width: '175px'}}>
             <ListItemIcon>
                <ContentPasteSearchOutlined fontSize = "small"/>
             </ListItemIcon>
             <ListItemText>Search</ListItemText>
          </MenuItem>
       </Menu>
   )
}
