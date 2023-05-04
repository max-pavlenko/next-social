import { auth, firestore } from '../libs/firebase';
import { IUser } from '../src/features/user/store/User';

export const saveURL = async (cb: ({ url, user }: { url: string, user: IUser }) => void = () => {
}) => {
   const urlPageBeforeLogging = localStorage.getItem('pageURLBeforeLeaveForLogin');
   if (urlPageBeforeLogging) {
      localStorage.setItem('pageURLBeforeLeaveForLogin', '');
   }
   else {
      const userDoc = firestore.collection('users').doc(auth.currentUser!.uid);
      const user = (await userDoc.get()).data() as IUser;
      cb({ url: urlPageBeforeLogging || '', user });
   }
};
