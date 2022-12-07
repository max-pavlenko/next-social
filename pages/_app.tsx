import '../styles/globals.css'
import '../styles/nprogress.css'
import NavBar from '../components/layout/NavBar';
import {Toaster} from 'react-hot-toast';
import {createTheme, ThemeProvider} from '@mui/material';
import {useUserData} from '../libs/hooks/useUserData';
import NProgress from 'nprogress';
import {Router, useRouter} from 'next/router';
import {ContextMenu} from '../components/utils/contextMenu';
import Loader from '../components/layout/Loader';
import "../node_modules/flag-icons/css/flag-icons.min.css";
import {Analytics} from '@vercel/analytics/react';
import React, {useEffect, useMemo} from 'react';
import MetaTags from '../components/utils/MetaTags';
import {AnimatePresence} from "framer-motion";
import {getDesignTokens, setModeFromLS, switchMode} from "../utils/helpers";
import {observer} from "mobx-react-lite";
import User from '../store/User';


NProgress.configure({showSpinner: true});
Router.events.on('routeChangeStart', NProgress.start);
Router.events.on('routeChangeError', NProgress.done);
Router.events.on('routeChangeComplete', NProgress.done)

// const poppins = Poppins({
//     style: ['normal', 'italic'],
//     weight: ['400', '600'],
//     preload: true,
//     fallback: ['Roboto', 'Arial', 'sans'],
// });

function MyApp({Component, pageProps}) {
    const {isAuthenticating} = useUserData();
    const router = useRouter()
    const url = `${router.route}`
    const {user: {lightMode}} = User;

    useEffect(() => {
        localStorage.getItem('mode') ? setModeFromLS() : switchMode(window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches);
        const locale = localStorage.getItem('locale');
        if (locale && locale !== router.defaultLocale) router.replace(router.pathname, router.asPath, {locale});
    }, [])

    const theme = useMemo(() => createTheme(getDesignTokens(lightMode ? 'light' : 'dark')), [lightMode]);

    if (isAuthenticating) return <><MetaTags desc='Loading...' title='Loading...'/><Loader
        style={{backgroundColor: 'var(--color-bg)'}}/></>;


    return (
        <ThemeProvider theme={theme}>
            <NavBar/>
            <AnimatePresence mode='wait' onExitComplete={() => window.scrollTo(0, 0)}>
                <Component key={url} {...pageProps} />
            </AnimatePresence>

            <ContextMenu/>
            <Analytics/>
            <Toaster/>
        </ThemeProvider>
    )
}

export default observer(MyApp)
//<style jsx global>{`
//                   html, body {
//                    // font-family: ${poppins.style.fontFamily};
//                   }
//                 `}</style>
