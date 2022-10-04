import { firestore, signOut } from '../libs/firebase';
import { IPost } from '../models/Post';
import { Timestamp } from 'firebase/firestore';
import toast, { ToastOptions } from 'react-hot-toast';
import { FirebaseError } from '@firebase/util';
import User from '../store/User';
import { NextRouter } from 'next/router';
import { SetStateAction } from 'react';
import { DEFAULT_ERROR_TEXT, toastStyleConfig } from './constants';
import * as Yup from 'yup';

/**
 * Get a user/{uid} document with username
 * @param username
 *  */
export async function getUserWithUsername(username: string) {
   const usersRef = firestore.collection('users');
   const query = usersRef.where('username', '==', username).limit(1);
   try {
      const userDoc = (await query.get()).docs[0];
      return userDoc;
   } catch (e) {
      console.log(e)
   }
}

export async function handleLogOut(router: NextRouter) {
   await signOut();
   //router.push('/').then(r => r);
   User.setUser({ data: null, username: null});
   User.setPhotoURL('');
}

export const toastNotify = async ({successText, errorText}: { successText: string, errorText?: string }, {
   tryFn,
   errorFn = null
}: { tryFn: () => void, errorFn?: (error) => void | null }, configOptions: ToastOptions = {}) => {
   const config = {...Object.assign(toastStyleConfig, configOptions)};
   try {
      await tryFn();
      toast.success(`Successfully ${successText}!`, config)
   } catch (e: any) {
      const error = e as FirebaseError;
      errorFn ? errorFn(error) : toast.error(errorText || `${DEFAULT_ERROR_TEXT}\n${error.message}`, config);
      console.warn(error)
   }
}

export function convertPostDateToFBCompatible(post: IPost) {
   return typeof post.createdAt === 'number' ? Timestamp.fromMillis(post.createdAt) : post.createdAt
}

export const invertBool: SetStateAction<boolean> = (prevVal) => {
   return !prevVal;
}

export const encodeStr = (str: string, filler: string = '*') =>{
   return str.split('').map((char, i, arr) => i >= 1 && i < arr.length - 1 ? filler : char).join('')
}

export const validationSchemaPassword = (passwordName: string) =>{
   return Yup.string()
       .min(6, `${passwordName} password should be of minimum 6 characters length`)
       .max(30, `${passwordName} password should be of maximum 30 characters length`)
       .required(`${passwordName} password is required`)
}

