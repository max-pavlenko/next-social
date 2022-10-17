import User from '../../store/User';
import { Divider, ListItemIcon, MenuItem } from '@mui/material';
import { DeleteForeverOutlined, Logout, MenuBookSharp, Settings, UpdateOutlined } from '@mui/icons-material';
import RecentActorsIcon from '@mui/icons-material/RecentActors';
import { handleLogOut } from '../../utils/helpers';
import { observer } from 'mobx-react-lite';
import { toastModal } from '../../utils/toastModal';
import { deleteAccount } from '../../libs/firebase';
import { useRouter } from 'next/router';
import LinkWithoutScroll from '../utils/LinkWithoutScroll';

const DefaultMenuItems = observer(() => {
   const router = useRouter();

   function handleDeleteAccount() {
      console.log("deleting the account");
      toastModal(
          "Do you want to delete your account? Yes, forever!",
          async () => {
             await deleteAccount(router);
          }
      );
   }

   return (
       <>
          <LinkWithoutScroll href={`/${User.user.username}`}>
             <MenuItem>
                <ListItemIcon>
                   <RecentActorsIcon fontSize="medium" />
                </ListItemIcon>
                 Profile
             </MenuItem>
          </LinkWithoutScroll>
          <LinkWithoutScroll href={`/`}>
             <MenuItem>
                <ListItemIcon>
                   <MenuBookSharp />
                </ListItemIcon>
                All Posts
             </MenuItem>
          </LinkWithoutScroll>
          <LinkWithoutScroll href={`/admin`}>
             <MenuItem>
                <ListItemIcon>
                   <Settings fontSize="small" />
                </ListItemIcon>
                Manage posts
             </MenuItem>
          </LinkWithoutScroll>
          <Divider />
          <LinkWithoutScroll href={`/update-password`}>
             <MenuItem>
                <ListItemIcon>
                   <UpdateOutlined fontSize="small" />
                </ListItemIcon>
                Update password
             </MenuItem>
          </LinkWithoutScroll>
          <MenuItem onClick={handleDeleteAccount}>
             <ListItemIcon>
                <DeleteForeverOutlined fontSize="small" />
             </ListItemIcon>
             Delete account
          </MenuItem>
          <MenuItem onClick={() => handleLogOut(router)}>
             <ListItemIcon>
                <Logout fontSize="small" />
             </ListItemIcon>
             Logout
          </MenuItem>
       </>
   );
});

export default DefaultMenuItems;
