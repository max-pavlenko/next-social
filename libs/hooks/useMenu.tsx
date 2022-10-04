import { MouseEvent, ReactElement, ReactNode, useState } from 'react';
import { Menu } from '@mui/material';

export function useMenu(children: ReactNode | ReactElement[]) {
   const [ anchorEl, setAnchorEl ] = useState<null | HTMLElement>(null);
   const open = Boolean(anchorEl);

   const handleClick = (event: MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
   };

   const handleClose = () => {
      setAnchorEl(null);
   };

   return {
      anchorEl,
      isOpen: Boolean(anchorEl),
      handleClick,
      handleClose,
      menuElement: (
          <Menu
              anchorEl = {anchorEl}
              id = "account-menu"
              open = {open}
              onClose = {handleClose}
              onClick = {handleClose}
              PaperProps = {{
                 elevation: 0,
                 sx: {
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                    mt: 1.5,
                    '& .MuiAvatar-root': {
                       width: 32,
                       height: 32,
                       ml: -0.5,
                       mr: 1,
                    },
                    '&:before': {
                       content: '""',
                       display: 'block',
                       position: 'absolute',
                       top: 0,
                       left: 80,
                       width: 10,
                       height: 10,
                       bgcolor: 'background.paper',
                       transform: 'translateY(-50%) rotate(45deg)',
                       zIndex: 0,
                    },
                 },
              }}
              transformOrigin = {{horizontal: 'center', vertical: 'top'}}
              anchorOrigin = {{horizontal: 'center', vertical: 'bottom'}}
          >
             <div>
                {children}
             </div>
          </Menu>
      )
   }
}
