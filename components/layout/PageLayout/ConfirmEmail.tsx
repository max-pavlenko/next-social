import { Button, Stack, Typography } from '@mui/material';
import { MouseEvent } from 'react';
import { auth, verifyEmail } from '../../../libs/firebase';
import { encodeStr } from '../../../utils/helpers';
import Entered from '../../utils/Entered';

const ConfirmEmail = () => {
   const splittedEmail = auth.currentUser?.email.split(/[@.]/g)
   const finalEmail = encodeStr(splittedEmail[0]) +'@'+encodeStr(splittedEmail[1])+'.'+splittedEmail[2];

   function handleOpenGmail(event: MouseEvent<HTMLButtonElement>) {
      window.open("https://mail.google.com/mail/u/0/#inbox");
   }

   function handleOpenEmail(event: MouseEvent<HTMLButtonElement>) {
      window.open("mailto:user@example.com");
   }

   return (
       <Stack gap={2}>
         <Typography textAlign='center' variant='h4'>To proceed, you have to confirm your email. {finalEmail}</Typography>
          <Button size='large' variant='contained' sx={{alignSelf: 'center'}} onClick={()=>verifyEmail()}>Resend email</Button>
          <Button size='large' variant='contained' sx={{alignSelf: 'center'}} onClick={handleOpenGmail}>Check Gmail</Button>
          <Button size='large' variant='outlined' sx={{alignSelf: 'center'}} onClick={handleOpenEmail}>Check Default EMail</Button>
          <Entered styles={{alignSelf: 'center'}}/>
       </Stack>
   );
};

export default ConfirmEmail;
