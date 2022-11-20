import { signOut } from '../../libs/firebase';
import { Button } from '@mui/material';
import { CSSProperties } from 'react';

const Entered = ({styles = {}}: { styles?: CSSProperties }) => {
   return (
       <>
          <Button style = {styles} onClick = {signOut} variant = 'outlined'>Return to login</Button>
          <div style={{margin: '10px 0'}} />
          {/* <UpdatePasswordPage/> */}
       </>
   );
};

export default Entered;
