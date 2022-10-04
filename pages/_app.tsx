import '../styles/globals.css'
import '../styles/nprogress.css'
import NavBar from '../components/layout/NavBar';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from '@mui/material';
import { useUserData } from '../libs/hooks/useUserData';
import { theme } from '../utils/constants';
import NProgress from 'nprogress';
import { Router, useRouter } from 'next/router';
import { ContextMenu } from '../components/utils/contextMenu';
import Loader from '../components/layout/Loader';

NProgress.configure({showSpinner: true});
Router.events.on('routeChangeStart', NProgress.start);

Router.events.on('routeChangeError', NProgress.done);

Router.events.on('routeChangeComplete', NProgress.done)

function MyApp({Component, pageProps}) {
   const {route} = useRouter();

   const {isAuthenticating} = useUserData();

   if (isAuthenticating) return <Loader/>;
   console.log('isAuthenticating', isAuthenticating)

   return <ThemeProvider theme = {theme}>

             <NavBar/>
             <Component key = {route} {...pageProps} />

      <Toaster/>
      <ContextMenu/>
   </ThemeProvider>
}

export default MyApp
