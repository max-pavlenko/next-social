import '../styles/globals.css';
import '../styles/nprogress.css';
import NavBar from '../components/layout/NavBar';
import { Toaster } from 'react-hot-toast';
import { createTheme, ThemeProvider } from '@mui/material';
import { useUserData } from '../libs/hooks/useUserData';
import NProgress from 'nprogress';
import { Router, useRouter } from 'next/router';
import { ContextMenu } from '../components/utils/contextMenu';
import Loader from '../components/layout/Loader';
import '../node_modules/flag-icons/css/flag-icons.min.css';
import { Analytics } from '@vercel/analytics/react';
import React, { useEffect, useMemo, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { getDesignTokens, setModeFromLS, switchMode } from '../utils/helpers';
import { observer } from 'mobx-react-lite';
import User from '../store/User';
import Footer from '../components/layout/PageLayout/Footer';
import Draggable from '../components/layout/Draggable';
import SmallToDo from '../components/layout/SmallToDo';
import SmallTabs from '../components/layout/SmallTabs';
import draggable from '../store/Draggable';


NProgress.configure({ showSpinner: true });
Router.events.on('routeChangeStart', NProgress.start);
Router.events.on('routeChangeError', NProgress.done);
Router.events.on('routeChangeComplete', NProgress.done);

// const poppins = Poppins({
//     style: ['normal', 'italic'],
//     weight: ['400', '600'],
//     preload: true,
//     fallback: ['Roboto', 'Arial', 'sans'],
// });

const PROHIBITED_PAGES_FOR_FOOTER: string[] = [];
const TABS = [SmallToDo]

function MyApp({ Component, pageProps }: { Component: any, pageProps: any }) {
  const { isAuthenticating } = useUserData();
  const router = useRouter();
  const url = `${router.route}`;
  const { user: { lightMode } } = User;
  const shouldShowDraggable = useRef<boolean>(false);
  const {route} = useRouter();

  useEffect(() => {
    shouldShowDraggable.current = JSON.parse(localStorage.getItem("shouldDraggableBeShown") || "true");
    localStorage.getItem("mode") ? setModeFromLS() : switchMode(window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches);
    const locale = localStorage.getItem("locale");
    if (locale && locale !== router.defaultLocale) router.replace(router.pathname, router.asPath, { locale });
  }, []);

  const theme = useMemo(() => createTheme(getDesignTokens(lightMode ? "light" : "dark")), [lightMode]);

  if (isAuthenticating) return <><Loader style={{ backgroundColor: "var(--color-bg)" }} /></>;
// <MetaTags desc='Loading...' title='Loading...'/>

  const variants = {
    hidden: { opacity: -1, x: -100, y: 0 },
    enter: { opacity: 1, x: 0, y: 0 },
    exit: { opacity: 0, x: 100, y: 0 },
  }


  return (
    <ThemeProvider theme={theme}>
      <NavBar /> {/*margin: 50 on body*/}
      <div style={{ minHeight: "calc(100vh - 103px)" }}>
        <AnimatePresence mode='wait' onExitComplete={() => {
          window.scrollTo(0, 0);
        }}>
          <motion.div
            key={route}
            whileInView='enter'
            variants = {variants}
            initial="hidden"
            exit={'exit'}
            transition={{ duration: 0.4, type: 'keyframes' }}
          >
          <Component key={url} {...pageProps} />
          </motion.div>
        </AnimatePresence>
      </div>
      {!PROHIBITED_PAGES_FOR_FOOTER.includes(window.location.pathname) && <Footer />}

      {shouldShowDraggable.current && (
        <Draggable>
          <SmallTabs content={TABS} switcherTop={draggable.isMovableAreaCollapsed ? 26 : 50}/>
        </Draggable>
      )}
      <ContextMenu />
      <Analytics />
      <Toaster />
    </ThemeProvider>
  );
}

export default observer(MyApp);
//<style jsx global>{`
//                   html, body {
//                    // font-family: ${poppins.style.fontFamily};
//                   }
//                 `}</style>
