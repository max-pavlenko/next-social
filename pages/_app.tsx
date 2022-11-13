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
import { AnimatePresence } from 'framer-motion';
import "../node_modules/flag-icons/css/flag-icons.min.css";
import { Poppins } from '@next/font/google'


NProgress.configure({showSpinner: true});
Router.events.on('routeChangeStart', NProgress.start);

Router.events.on('routeChangeError', NProgress.done);

Router.events.on('routeChangeComplete', NProgress.done)

const poppins = Poppins({
   style: ['normal', 'italic'],
   weight: ['400', '600'],
   preload: true,
   fallback: ['Roboto', 'Arial', 'sans'],
});

function MyApp({Component, pageProps}) {
   const {pathname} = useRouter();

   const {isAuthenticating, user} = useUserData();

   if (isAuthenticating && !user?.uid) return <Loader/>;
   console.log('isAuthenticating', isAuthenticating)

   return (
       <ThemeProvider theme = {theme}>
          <NavBar/>
          <AnimatePresence onExitComplete = {() => window.scrollTo(0, 0)}>
             <Component key = {pathname} {...pageProps} />
             <ContextMenu/>
          </AnimatePresence>
          <Toaster/>
       </ThemeProvider>
   )
}

export default MyApp
//<style jsx global>{`
//                   html, body {
//                    // font-family: ${poppins.style.fontFamily};
//                   }
//                 `}</style>
