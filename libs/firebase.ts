import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
import { toastNotify } from '../utils/helpers';
import toast from 'react-hot-toast';
import {
   PRODIVER_IDS,
   RESET_PASSWORD_TOAST_DURATION,
   toastStyleConfig,
   UPDATE_PASSWORD_TOAST_DURATION_SUCCESS
} from '../utils/constants';
import User from '../store/User';
import { NextRouter } from 'next/router';
import { reauthenticateWithPopup } from 'firebase/auth';

export default firebase;

export type DocumentReference = firebase.firestore.DocumentReference;
export type QueryDocumentSnapshot = firebase.firestore.QueryDocumentSnapshot;
export type UserCredential = firebase.auth.UserCredential;

const firebaseConfig = {
   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
   storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
   messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
   appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
   measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};
let app;

if (!firebase.apps.length) {
   app = firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth(app);
export const firestore = firebase.firestore(app);
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
export const githubAuthProvider = new firebase.auth.GithubAuthProvider();
export const facebookAuthProvider = new firebase.auth.FacebookAuthProvider();
facebookAuthProvider.addScope('user_birthday');
facebookAuthProvider.addScope('user_friends');
export const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp;
export const storage = firebase.storage(app);
export const STATE_CHANGED = firebase.storage.TaskEvent.STATE_CHANGED;
export const increment = firebase.firestore.FieldValue.increment;

export function convertToJSON(snapshot: QueryDocumentSnapshot) {
   const data = snapshot.data();
   console.log('data', data);
   if (!data) return;
   console.log('---')
   if (data.hasOwnProperty('userPath'))
      return {
         ...data,
         createdAt: data.createdAt?.toMillis() || 0,
         updatedAt: data.updatedAt?.toMillis() || 0,
         userPath: data.userPath
      }
   else return {
      ...data,
      createdAt: data.createdAt?.toMillis() || 0,
      updatedAt: data.updatedAt?.toMillis() || 0,
   }
}

export async function signOut() {
   await toastNotify({successText: 'signed out'}, {
      tryFn: async () => {
         await auth.signOut();
         localStorage.setItem('prolongedAuth', 'false');
         console.log('Signout Succesfull')
      }
   })
}

export const logInWithEmail = async (email: string, password: string) => {
   try {
      await handleLogging(auth.signInWithEmailAndPassword(email, password), User.user.username || 'not_logged_in');
   } catch (e) {
      console.warn(e)
   }
}

export const signUpWithEmail = async (email: string, password: string) => {
   await handleLogging(auth.createUserWithEmailAndPassword(email, password), 'enter')
}

export const verifyEmail = async (redirectURL: string = '') => {
   !auth.currentUser?.emailVerified && await toastNotify({successText: 'send confirm message. Check your email',}, {
      tryFn: async () => {
         await auth.currentUser?.sendEmailVerification({url: process.env['NEXT_PUBLIC_SERVER_URL_PROD'] + `/${redirectURL}`});
      }
   })
}

async function handleLogging(userCredential: Promise<UserCredential>, redirectURL: string = '') {

   userCredential.then(async (userCredential) => {
      console.warn(userCredential);
      const user = userCredential.user;
      await verifyEmail(redirectURL);
      localStorage.setItem('prolongedAuth', 'true');
      console.log('userCredential', userCredential)
   })
       .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          toast.error(errorMessage, toastStyleConfig);
          console.warn(errorCode, errorMessage, error);
       });
}

export const resetPassword = async (email: string) => {
   await toastNotify({successText: 'send reset password message. Check your email'}, {
      tryFn: async () => {
         await auth.sendPasswordResetEmail(email);
      }
   }, {duration: RESET_PASSWORD_TOAST_DURATION})
}

export const deleteAccount = async (router: NextRouter | null = null) => {
   await toastNotify({successText: 'deleted the account',}, {
      tryFn: async () => {
         localStorage.setItem('prolongedAuth', 'false')
         console.log('deleted the account');
         await reauthenticate();
         const batch = firestore.batch();
         firestore
             .collection(`users/${auth.currentUser?.uid}/posts`)
             .get()
             .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                   doc.ref.delete();
                });
             });
         router && await router.push('/');
         batch.delete(firestore.doc(`users/${auth.currentUser?.uid}`));
         batch.delete(firestore.doc(`usernames/${User.user.username}`));
         await auth.currentUser?.delete();
         await auth.signOut();
         User.setUser({...User.user, data: null, username: '' ,});
         User.setPhotoURL('');
         await batch.commit();
      }
   })
}

export const reauthenticate = async () => {
   auth.currentUser?.providerData[0]?.providerId === PRODIVER_IDS.GOOGLE && await reauthenticateWithPopup(auth.currentUser, googleAuthProvider);
}

export const updatePassword = async (newPassword: string) => {
   await toastNotify({successText: 'updated the password. Don\'t forget it',}, {
      tryFn: async () => {
         await reauthenticate();
         await auth.currentUser?.updatePassword(newPassword);
      }
   }, {duration: UPDATE_PASSWORD_TOAST_DURATION_SUCCESS})
}

//import 'firebase/compat/auth';
// import 'firebase/compat/firestore';
// import { getApp, initializeApp } from 'firebase/app';
// import { getAuth, GoogleAuthProvider } from 'firebase/auth';
// import { getFirestore } from 'firebase/firestore';
//
// const firebaseConfig = {
//     apiKey: "AIzaSyCT8fjc4Tt7M_a3IhTCybZS-pXxNjkbJF4",
//     authDomain: "next-social-29d6c.firebaseapp.com",
//     projectId: "next-social-29d6c",
//     storageBucket: "next-social-29d6c.appspot.com",
//     messagingSenderId: "506636086529",
//     appId: "1:506636086529:web:03676255b64ae0922ebf00",
//     measurementId: "G-TH96828P62"
// };
// function createFirebaseApp(config) {
//     try {
//         return getApp();
//     } catch {
//         return initializeApp(config);
//     }
// }
//
// // const firebaseApp = initializeApp(firebaseConfig);
// const firebaseApp = createFirebaseApp(firebaseConfig);
//
// export const auth = getAuth(firebaseApp);
// export const googleAuthProvider = new GoogleAuthProvider();
//
// export const firestore = getFirestore(firebaseApp);
//
// // export const auth = firebase.auth(app);
// // export const firestore = firebase.firestore(app);
// // export const batch = firestore.batch();
// // export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
//
// export function convertToJSON(doc: any) {
//     debugger;
//     const data = doc.get();
//     return {
//         ...data,
//         createdAt: data.createdAt.toMillis(),
//         updatedAt: data.updatedAt.toMillis(),
//     }
// }
