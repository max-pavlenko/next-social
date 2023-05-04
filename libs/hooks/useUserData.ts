import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, firestore } from '../firebase';
import { useEffect, useState } from 'react';
import User from '../../src/features/user/store/User';

export const useUserData = () => {
   const [ user ] = useAuthState(auth);
   const [ isAuthenticating, setIsAuthenticating ] = useState(true);

   useEffect(() => {
      let unsubscribe: any;
      if (user) {
         setIsAuthenticating(true);
         console.log('useUserdata', user);
         const userRef = firestore.collection('users').doc(user.uid);
         unsubscribe = userRef.onSnapshot(async (doc) => {
            setIsAuthenticating(false);
            const data = doc.data();
            User.setUser({...User.user, username: data?.username, data: user});
            User.setPhotoURL(data?.photoURL);
         });
      } else {
         setIsAuthenticating(localStorage.getItem('prolongedAuth') === 'true');
         User.setUser({ ...User.user, data: null, username: '' });
         User.setPhotoURL('');
      }
      return () => {
         return unsubscribe;
      };
   }, [ user ]);

   return {user, isAuthenticating};
}
