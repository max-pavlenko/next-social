import React, {useState} from 'react';
import {Button} from '@mui/material';
import Loader from '../layout/Loader';
import {AuthProvider} from 'firebase/auth';
import {toastNotify} from '../../utils/helpers';
import {saveURL} from '../../utils/saveURL';
import {auth} from '../../libs/firebase';
import {useRouter} from 'next/router';
import Image from 'next/image';

function ProviderAuthButton({
                               provider,
                               imgSrc,
                               btnTitle,
                            }: { provider: AuthProvider, imgSrc: string, btnTitle: string }) {
   const [ isLoading, setIsLoading ] = useState(false);
   const router = useRouter();

   const signInWithProvider = async () => {
      await toastNotify({successText: 'logged in'}, {
         tryFn: async () => {
            await auth.signInWithPopup(provider).then((userCredential) => {
               const user = userCredential.user;
               console.log(provider+'', userCredential)
            });
            localStorage.setItem('prolongedAuth', 'true')
            setIsLoading(true)
            await saveURL(router);
            setIsLoading(false)
         },
      })
   }

   return (
       <>
          {isLoading && <Loader style = {{position: 'absolute', top: '45%'}}/>}
          <Button variant = 'outlined' className = 'btn-google' onClick = {signInWithProvider}>
                <Image width={30} height={30} src = {imgSrc} alt = {`${btnTitle} logo`}/>
             {btnTitle}
          </Button>
       </>)
}

export default ProviderAuthButton;
