import { createTheme } from '@mui/material';
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
export const FALLBACK_IMAGE = 'https://i.stack.imgur.com/l60Hf.png';
export const SITE_URL = process.env.NEXT_PUBLIC_SERVER_URL;
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

export enum PROVIDERS_IMAGES {
   GOOGLE = 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/1200px-Google_%22G%22_Logo.svg.png',
   GITHUB = 'https://cdn-icons-png.flaticon.com/512/25/25231.png',
   FACEBOOK = 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Facebook_logo_%28square%29.png/800px-Facebook_logo_%28square%29.png'
}

export enum FIREBASE_ERRORS{
   POPUP_CLOSED = 'auth/popup-closed-by-user'
}
