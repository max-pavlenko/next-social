import React, { useState } from 'react';
import { toastNotify } from '../../utils/helpers';
import { auth, firestore, googleAuthProvider } from '../../libs/firebase';
import { Button } from '@mui/material';
import { useRouter } from 'next/router';
import Loader from '../layout/Loader';
import { saveURL } from '../../utils/saveURL';

function GoogleButton() {
   const router = useRouter();
   const [ isLoading, setIsLoading ] = useState(false);


   const signInWithGoogle = async () => {
      await toastNotify({successText: 'logged in'}, {
         tryFn: async () => {
            await auth.signInWithPopup(googleAuthProvider).then((userCredential) => {
               const user = userCredential.user;
               console.log('userCredentialGoogle', userCredential)
            });
            await saveURL(setIsLoading, router);
         },
         errorFn: (e) => {
            console.log(e)
         }
      })
   }
   return (
       <>
          {isLoading && <Loader style={{position: 'absolute', top: '45%'}}/>}
       <Button variant = 'outlined' className = 'btn-google' onClick = {signInWithGoogle}>
          <img width = '100%' height = '100%'
               src = 'https://www.freepnglogos.com/uploads/google-logo-png/google-logo-png-webinar-optimizing-for-success-google-business-webinar-13.png'
               alt = 'Google logo'/>
          Google
       </Button>
       </>)
}

export default GoogleButton;
