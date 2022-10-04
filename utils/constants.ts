import { createTheme } from '@mui/material';
import { Dispatch, SetStateAction } from 'react';
import { ToastOptions } from 'react-hot-toast';

export const theme = createTheme({
   palette: {
      primary: {
         main: '#AB09D8'
      },
      secondary: {
         main: '#5C76B7'
      },
      error: {
         main: '#F40B27'
      }
   },
});

export const INTERSECTION_MARGIN = 100;
export const POSTS_PER_PAGE = 2;
export type SetterFor<T> = Dispatch<SetStateAction<T>>;
export const FALLBACK_IMAGE = 'https://i.stack.imgur.com/l60Hf.png';
export const SITE_URL = 'http://localhost:3000';
export const DEFAULT_ERROR_TEXT = 'An error occurred...';
export const RESET_PASSWORD_COOLDOWN_S = 30;
export const RESET_PASSWORD_TOAST_DURATION = 10 * 1000;
export const UPDATE_PASSWORD_TOAST_DURATION_SUCCESS = 5 * 1000;

export const toastStyleConfig: ToastOptions = {
   style: {
      textAlign: 'center'
   },
   position: 'top-center',
}
export enum PRODIVER_IDS {
   GOOGLE = 'google.com',
   PASSWORD = 'password'
}
