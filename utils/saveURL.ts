import { auth, firestore } from '../libs/firebase';
import { NextRouter } from 'next/router';

export const saveURL = async (router: NextRouter) => {
   let userDoc, user;
   const urlPageBeforeLogging = localStorage.getItem('pageURLBeforeLeaveForLogin');
   if (urlPageBeforeLogging) {
      localStorage.setItem('pageURLBeforeLeaveForLogin', '');
   } else {
      userDoc = firestore.collection('users').doc(auth.currentUser.uid);
      user = (await userDoc.get()).data()
   }
   await router.push(urlPageBeforeLogging ? urlPageBeforeLogging : '/' + user.username);
}
