import { firestore, signOut } from "../libs/firebase";
import { IPost } from "../models/Post";
import { Timestamp } from "firebase/firestore";
import toast, { ToastOptions } from "react-hot-toast";
import { FirebaseError } from "@firebase/util";
import User from "../store/User";
import { NextRouter } from "next/router";
import { SetStateAction } from "react";
import { DEFAULT_ERROR_TEXT, FIREBASE_ERRORS, toastStyleConfig } from "./constants";
import * as Yup from "yup";
import { PaletteMode } from "@mui/material";
import { grey } from "@mui/material/colors";

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
   User.setUser({
      ...User.user,
      data: null, username: null,
   });
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
      if(errorFn){
         errorFn(error);
      }
      else {
         if(error?.code === FIREBASE_ERRORS.POPUP_CLOSED) return;
         toast.error(errorText || `${DEFAULT_ERROR_TEXT}\n${error?.message || '...'}`, config);
      }
      console.warn(error);
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

export const validateSchemaPassword = (passwordName: string) =>{
   return Yup.string()
       .min(6, `${passwordName} password should be of minimum 6 characters length`)
       .max(30, `${passwordName} password should be of maximum 30 characters length`)
       .required(`${passwordName} password is required`)
}

export function hanlePasteImage(setter) {
   return function (event) {
      const {files} = (event.clipboardData);
      iterateOverFiles(files, ({file, url})=>{
            console.log('result', url, file);
         setter(prev => [ ...prev, {img: url, id: Date.now()} ]);
      })
      // const file = files[0];
      // if(!file) return;
      // const fileType = file.type.split('/')[0];
      // //const blob = file.getAsFile();
      // const reader = new FileReader();
      // reader.readAsDataURL(file);
      // setter(prev => [ ...prev, {img: window.URL.createObjectURL(file), id: Date.now()} ]);
      // reader.onload = async function (event) { // @ts-ignore
      //    const {currentTarget: {result}} = event
      //    console.log('result', result);
      //    return null;
      // };
   }
}

export function downloadFile(type: string, blob: File | Blob){
   const url = window.URL.createObjectURL(blob);
   const a = document.createElement('a');
   a.href = url;
   a.download = type + '_' + Math.random().toFixed(6).slice(2)+'.'+blob.type.split('/')[1];
   document.body.appendChild(a);
   a.click();
   document.body.removeChild(a)
}

export function iterateOverFiles(files: FileList, resultCallback: ({file, url}: {file: File, url: string})=>void ){
   if (files.length > 0) {
      const keys = Object.keys(files)
      keys.forEach((key) => {
         let file = files[key]
         let reader = new FileReader();
         reader.onload = (e) => resultCallback({file, url: e.target.result as string})

         reader.readAsDataURL(files[key])
      })
   }
}

export function switchMode(isLightMode: boolean, callback: (isDarkMode: boolean) => void = () => {}) {
   localStorage.setItem('mode', (isLightMode).toString());
   User.setDarkMode(isLightMode);
   const modeToDelete = isLightMode === false ? 'light' : 'dark';
   const modeToToggle = modeToDelete === 'dark' ? 'light' : 'dark';

   document.documentElement.dataset[modeToToggle] = 'any value for this just to work';
   delete document.documentElement.dataset[modeToDelete];

   callback(isLightMode)
}

export function setModeFromLS(callback: (isDarkMode: boolean) => void = () => {}) {
   const mode = localStorage.getItem('mode')
   console.log('mode', mode === 'true')
   if (mode == null || (mode !== 'false' && mode !== 'true')) return;
   switchMode(mode === 'true', (isDarkMode)=> callback(isDarkMode));
}

export const getDesignTokens = (mode: PaletteMode) => ({
   palette: {
      mode,
      ...{
         contrastThreshold: 3,
         tonalOffset: 0.2
      },
      ...(mode === 'light'
          ? {
             primary: {
                main: '#AB09D8',
             },
             secondary: {
                main: '#5C76B7'
             },
             error: {
                main: '#F40B27'
             },

          }
          : {
             primary: {
                main: '#d562ff',
             },
             secondary: {
                main: '#03dcff'
             },
             error: {
                main: '#ff5b5b'
             },
             text: {
                primary: '#fff',
                secondary: grey[500],
             },
          }),
   },
});
