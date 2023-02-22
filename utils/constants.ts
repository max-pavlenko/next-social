import {createTheme} from '@mui/material';
import {ToastOptions} from 'react-hot-toast';
import {onEmailClick, onTelegramClick} from '../pages/development';
import username from "../pages/[username]";

export const theme = createTheme({
   palette: {

      mode: 'dark',
      primary: {
         main: '#AB09D8',
      },
      secondary: {
         main: '#5C76B7'
      },
      error: {
         main: '#F40B27'
      },
      contrastThreshold: 3,
      tonalOffset: 0.2
   },
});

export const INTERSECTION_MARGIN = 90;
export const POSTS_PER_PAGE = 4;
export const FALLBACK_IMAGE = '/images/default.png';
export const DEFAULT_ERROR_TEXT = 'An error occurred...';
export const RESET_PASSWORD_COOLDOWN_S = 30;
export const RESET_PASSWORD_TOAST_DURATION = 10 * 1000;
export const UPDATE_PASSWORD_TOAST_DURATION_SUCCESS = 5 * 1000;
export const TELEGRAM_NAME = 'billyherrin';
export const EMAIL = 'pavlienko1112@gmail.com'

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

export const FEATURES_TO_DO = [
   {name: 'Customization', desc: 'You can choose the colors you like to enhance site\'s look',},
   {name: 'Audio integration', desc: 'You will be able to play some music or video right here',}
]
export const FEEDBACK_MEANS = [
   {type: 'Telegram', color: 'blue', content: `@${TELEGRAM_NAME}`, clickHandler: onTelegramClick},
   {type: 'Email', color: 'red', content: EMAIL, clickHandler: onEmailClick},
]

type RouteBase = {
   path: string,
   href?: string
}

export interface NamedRoute extends RouteBase {
   name: string;
   nameFn?: never;
}

export interface NamedFnRoute extends RouteBase {
   nameFn: (obj: Record<string, any>) => string;
   name?: never;
}

export const ROUTES: (NamedRoute | NamedFnRoute)[] = [
   {name: `Home`, path: '/', href: '/'},
   {name: `Donation`, path: '/donate', href: '/'},
   {nameFn: ({username}) => `User ${username}`, path: '/[username]', href: '/'},
   {nameFn: ({ slug }) => `Post ${slug}`, path: '/[username]/[slug]', href: '/'},
]
