import User from '../../store/User';
import { Divider, ListItemIcon, MenuItem } from '@mui/material';
import { Logout, MenuBookSharp, Settings, UpdateOutlined } from '@mui/icons-material';
import RecentActorsIcon from '@mui/icons-material/RecentActors';
import { handleLogOut } from '../../utils/helpers';
import { toastModal } from '../../utils/toastModal';
import { deleteAccount } from '../../libs/firebase';
import { useRouter } from 'next/router';
import LinkWithoutScroll from '../utils/LinkWithoutScroll';
import { useLocale } from '../../translations/useLocale';

const DefaultMenuItems = () => {
   const router = useRouter();
   const l = useLocale();

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
                {l.profile}
             </MenuItem>
          </LinkWithoutScroll>
          <LinkWithoutScroll href={`/`}>
             <MenuItem>
                <ListItemIcon>
                   <MenuBookSharp />
                </ListItemIcon>
                {l.allPosts}
             </MenuItem>
          </LinkWithoutScroll>
          <LinkWithoutScroll href={`/admin`}>
             <MenuItem>
                <ListItemIcon>
                   <Settings fontSize="small" />
                </ListItemIcon>
                {l.managePosts}
             </MenuItem>
          </LinkWithoutScroll>
          <Divider />
          <LinkWithoutScroll href={`/update-password`}>
             <MenuItem>
                <ListItemIcon>
                   <UpdateOutlined fontSize="small" />
                </ListItemIcon>
                {l.updatePassword}
             </MenuItem>
          </LinkWithoutScroll>
          {/* <MenuItem onClick={handleDeleteAccount}> */}
          {/*    <ListItemIcon> */}
          {/*       <DeleteForeverOutlined fontSize="small" /> */}
          {/*    </ListItemIcon> */}
          {/*    {l.deleteAccount} */}
          {/* </MenuItem> */}
          <MenuItem onClick={() => handleLogOut(router)}>
             <ListItemIcon>
                <Logout fontSize="small" />
             </ListItemIcon>
             {l.logOut}
          </MenuItem>
       </>
   );
};

export default DefaultMenuItems;
