import { Avatar, IconButton, Tooltip } from '@mui/material';
import { CSSProperties } from 'react';
import { observer } from 'mobx-react-lite';
import User from '../../store/User';
import { useMenu } from '../../libs/hooks/useMenu';
import DefaultMenuItems from './DefaultMenuItems';

const MenuAccount = observer(({styles = {}}: { styles?: CSSProperties }) => {
   const {handleClick, menuElement, isOpen} = useMenu(<DefaultMenuItems/>)

   return (
       <div style = {styles} className = 'menu-account'>
          <Tooltip title = "Account settings">
             <IconButton
                 onClick = {handleClick}
                 size = "small"
                 aria-controls = {isOpen ? 'account-menu' : undefined}
                 aria-haspopup = "true"
                 aria-expanded = {isOpen ? 'true' : undefined}
             >
                <Avatar sx = {{width: 50, height: 50}}>{User.user?.username?.slice(0, 1)?.toUpperCase()}</Avatar>
             </IconButton>
          </Tooltip>
          {menuElement}

       </div>
   );
});

export default MenuAccount;
