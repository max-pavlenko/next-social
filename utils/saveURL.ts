import { auth, firestore } from '../libs/firebase';
import { NextRouter } from 'next/router';
import { SetterFor } from './constants';

export const saveURL = async (loadingSetter: SetterFor<boolean>, router: NextRouter) => {
   let userDoc, user;
   const urlPageBeforeLogging = localStorage.getItem('pageURLBeforeLeaveForLogin');
   if (urlPageBeforeLogging) {
      localStorage.setItem('pageURLBeforeLeaveForLogin', '');
   } else {
      userDoc = firestore.collection('users').doc(auth.currentUser.uid);
      user = (await userDoc.get()).data()
   }
   loadingSetter(true);
   await router.push(urlPageBeforeLogging ? urlPageBeforeLogging : '/' + user.username);
   loadingSetter(false);
}
