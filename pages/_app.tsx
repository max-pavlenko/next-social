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
import {Poppins} from '@next/font/google'
import {Analytics} from '@vercel/analytics/react';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import MetaTags from '../components/utils/MetaTags';
import {AnimatePresence} from "framer-motion";
import {getDesignTokens, setModeFromLS} from "../utils/helpers";
import {observer} from "mobx-react-lite";
import User from '../store/User';


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
    const previousY = useRef(0);
    const [isNavBarVisible, setIsNavBarVisible] = useState(true);
    const {isAuthenticating} = useUserData();
    const router = useRouter()
    const url = `https://wallis.dev${router.route}`
    const {user: {lightMode}} = User;

    useEffect(() => {
        setModeFromLS();
        const locale = localStorage.getItem('locale')
        if (locale && locale !== router.defaultLocale) router.replace(router.pathname, router.asPath, {locale});

        document.addEventListener('scroll', handleScroll);
        return () => {
            document.removeEventListener('scroll', handleScroll)
        }
    }, [])

    const handleScroll = e => {
        setIsNavBarVisible(previousY.current >= window.scrollY);
        previousY.current = window.scrollY;
    }

    const theme = useMemo(() => createTheme(getDesignTokens(lightMode ? 'light' : 'dark')), [lightMode]);

    if (isAuthenticating) return <><MetaTags desc='Loading...' title='Loading...'/><Loader
        style={{backgroundColor: 'var(--color-bg)'}}/></>;


    return (
        <ThemeProvider theme={theme}>
            <NavBar classname={isNavBarVisible ? '' : 'hideTop'}/>
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
