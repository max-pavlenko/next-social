import { Button, Stack, Typography } from '@mui/material';
import { MouseEvent } from 'react';
import { auth, signOut, verifyEmail } from '../../../../libs/firebase';
import { encodeStr } from '../../../../utils/helpers';

const ConfirmEmail = () => {
   const splittedEmail = auth.currentUser?.email!.split(/[@.]/g)!;
   const finalEmail = `${encodeStr(splittedEmail[0])}@${encodeStr(splittedEmail[1])}.${splittedEmail[2]}`;

   function handleOpenGmail(event: MouseEvent<HTMLButtonElement>) {
      window.open('https://mail.google.com/mail/u/0/#inbox');
   }

   function handleOpenEmail(event: MouseEvent<HTMLButtonElement>) {
      window.open('mailto:user@example.com');
   }

   return (
     <Stack gap={2} alignItems="center">
        <Typography textAlign="center" variant="h4">To proceed, you have to confirm your email. {finalEmail}</Typography>
        <Button size="large" variant="contained" onClick={() => verifyEmail()}>Resend email</Button>
        <Button size="large" variant="contained" onClick={handleOpenGmail}>Check Gmail</Button>
        <Button size="large" variant="outlined" onClick={handleOpenEmail}>Check Default EMail</Button>
        <Button style={{ margin: '10px 0' }} onClick={signOut} variant="outlined">Return to login</Button>
     </Stack>
   );
};

export default ConfirmEmail;
