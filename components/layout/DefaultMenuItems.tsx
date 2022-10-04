import Link from 'next/link';
import User from '../../store/User';
import { Avatar, Divider, ListItemIcon, MenuItem } from '@mui/material';
import { DeleteForeverOutlined, Logout, MenuBookSharp, Settings, UpdateOutlined } from '@mui/icons-material';
import { handleLogOut } from '../../utils/helpers';
import { observer } from 'mobx-react-lite';
import { toastModal } from '../../utils/toastModal';
import { deleteAccount } from '../../libs/firebase';
import { useRouter } from 'next/router';

const DefaultMenuItems = observer(() => {
   const router = useRouter();

   function handleDeleteAccount(event: any) {
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
          <Link href={`/${User.user.username}`}>
             <MenuItem>
                <Avatar /> Profile
             </MenuItem>
          </Link>
          <Link href={`/`}>
             <MenuItem>
                <ListItemIcon>
                   <MenuBookSharp />
                </ListItemIcon>
                All Posts
             </MenuItem>
          </Link>
          <Link href={`/admin`}>
             <MenuItem>
                <ListItemIcon>
                   <Settings fontSize="small" />
                </ListItemIcon>
                Manage posts
             </MenuItem>
          </Link>
          <Divider />
          <Link href={`/update-password`}>
             <MenuItem>
                <ListItemIcon>
                   <UpdateOutlined fontSize="small" />
                </ListItemIcon>
                Update password
             </MenuItem>
          </Link>
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
