import { Button } from '@mui/material';
import User from '../../store/User';
import { observer } from 'mobx-react-lite';
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import Loader from './Loader';
import { useRouter } from 'next/router';
import MenuAccount from './MenuAccount';
import { handleLogOut } from '../../utils/helpers';
import { FALLBACK_IMAGE } from '../../utils/constants';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { auth, firestore } from '../../libs/firebase';
import { useMenu } from '../../libs/hooks/useMenu';
import DefaultMenuItems from './DefaultMenuItems';
import LinkWithoutScroll from '../utils/LinkWithoutScroll';
import LocalesNames from '../../translations/localesNames';
import { useLocale } from '../../translations/useLocale';
import useLessThenMediaQuery from '../../libs/hooks/useLessThenMediaQuery';
import NightModeSwitch from '../utils/NightModeSwitch';

const debounce = require('lodash.debounce');

const NavBar = observer(({ classname = '' }: { classname?: string }) => {
   const { photoURL, user } = User;
   const [userRealtime] = useDocumentData(firestore.doc(`users/${auth.currentUser?.uid}`));
   const [userState, setUserState] = useState<typeof User>(null!);
   const { menuElement, handleClick } = useMenu(<DefaultMenuItems />);
   const selectRef = useRef<HTMLSelectElement>(null);
   const langOptionRef = useRef<HTMLOptionElement>(null);
   const { isScreenWidthLessThen400 } = useLessThenMediaQuery(400);
   const [isNavBarVisible, setIsNavBarVisible] = useState(true);
   const [isLoading, setIsLoading] = useState(false);
   const previousY = useRef(0);
   const l = useLocale();
   const router = useRouter();
   const languages = router.locales!.map(locale => ({ locale, langName: LocalesNames[locale] || 'unknown' }));
   let flagCode = router.locale === 'en' ? 'us' : router.locale;
   flagCode = flagCode === 'ru' ? '' : flagCode;

   const handleScroll = e => {
      setIsNavBarVisible(previousY.current > window.scrollY);
      previousY.current = window.scrollY;
   };
   const handleScrollDebounced = useCallback(debounce(handleScroll, 50), []);

   useEffect(() => {
      document.addEventListener('scroll', handleScrollDebounced);
      return () => {
         document.removeEventListener('scroll', handleScrollDebounced);
      };
   }, []);

   function handleLoadComplete() {
      setIsLoading(false);
   }

   useEffect(() => {
      if (!userRealtime) return;
      setUserState(userRealtime);
      console.log('userRealtime', userRealtime);
   }, [userRealtime]);

   function handleLoadStart() {
      setIsLoading(true);
   }

   // const navigationItems: { element: JSX.Element, path: string }[] = [
   //    {
   //       element: <Button
   //           sx = {{
   //              size: {
   //                 xs: "small",
   //                 md: "medium",
   //              },
   //           }}
   //           onClick = {() => handleLogOut(router)}
   //           color = "error"
   //           variant = "outlined"
   //           className = "btn-blue"
   //       >
   //          Log out
   //       </Button>,
   //       path: '/enter'
   //    },
   //    {
   //       element: <Button variant = "text" className = "btn-blue">
   //          Manage posts
   //       </Button>,
   //       path: '/admin'
   //    },
   //    {
   //       element: <Button variant = "text" className = "btn-blue">
   //          enter
   //       </Button>,
   //       path: '/enter'
   //    },
   // ]

   const variants = {
      hidden: { opacity: 0, x: -100, y: 0, transition: { duration: 0.5, bounce: 1 } },
      enter: { opacity: 1, x: 0, y: 0, transition: { duration: 0.5, bounce: 1 } },
      exit: { opacity: 1, x: 100, y: 0, transition: { duration: 0.5, bounce: 1 } },
   };

   async function handleLanguageChange(e) {
      const locale = e.target.value;
      localStorage.setItem('locale', locale);
      await router.push(router.pathname, router.asPath, { locale });
   }

   return (
     <nav className={`navbar ${classname} ${isNavBarVisible ? '' : 'hideTop'}`}>
        <ul>
           <li style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              {!isScreenWidthLessThen400 && <LinkWithoutScroll href="/">
                <button style={{ margin: 0 }} className="btn-logo">Swr</button>
              </LinkWithoutScroll>}
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                 <span className={`fi fi-${flagCode}`} />
                 <select ref={selectRef} value={router.locale} className="language-select"
                         onChange={handleLanguageChange}
                         name="language">
                    {languages.map((language) => (
                      <option data-lang={language.locale} ref={langOptionRef} key={language.locale}
                              className="language-option" value={language.locale}>
                         {language.langName}
                      </option>
                    ))}
                 </select>
                 <NightModeSwitch />

              </div>
           </li>

           <Loader shouldShow={isLoading && !user?.username} />

           {user.username && (
             <div className="main-options push-left">
                {/* <LayoutGroup> */}
                {/*    {navigationItems.map(({path, element}) => ( */}
                {/*        <li> */}
                {/*           <LinkWithoutScroll href = {path}> */}
                {/*              {element} */}
                {/*           </LinkWithoutScroll> */}
                {/*           {isActiveLink(path, router.pathname) && ( */}
                {/*               <motion.div */}
                {/*                   layoutId = "navigation-underline" */}
                {/*                   className = "navigation-underline" */}
                {/*                   variants={variants} */}
                {/*                   initial = "hidden" */}
                {/*                   animate = "enter" */}
                {/*                   exit = "exit" */}
                {/*                   transition = {{type: 'spring'}} */}
                {/*               /> */}
                {/*           )} */}
                {/*        </li> */}
                {/*    ))} */}
                {/* </LayoutGroup> */}
                <li>
                   <LinkWithoutScroll href="/enter">
                      <Button
                        sx={{
                           size: {
                              xs: 'small',
                              md: 'medium',
                           },
                        }}
                        onClick={() => handleLogOut(router)}
                        color="error"
                        variant="outlined"
                        className="btn-blue"
                      >
                         {l.logOut}
                      </Button>
                   </LinkWithoutScroll>
                </li>
                <li>
                   <LinkWithoutScroll href="/admin">
                      <Button variant="contained" className="btn-blue">
                         {l.managePosts}
                      </Button>
                   </LinkWithoutScroll>
                </li>

                {user.username && (
                  <li>
                     <a style={{ position: 'relative' }} onClick={handleClick}>
                        <Image
                          quality={95}
                          onLoadingComplete={handleLoadComplete}
                          onLoadStart={handleLoadStart}
                          width={30}
                          priority={false}
                          height={30}
                          src={userState?.photoURL || photoURL || FALLBACK_IMAGE}
                          alt="User avatar"
                        />
                        <div style={{
                           borderRadius: '50%',
                           backgroundColor: 'limegreen',
                           width: 15,
                           height: 14,
                           position: 'absolute',
                           bottom: 5,
                           right: 0,
                           border: '4px solid var(--color-white)',
                        }} />
                     </a>
                     {menuElement}
                  </li>
                )}
             </div>
           )}

           {!user.username && !isLoading && (
             <>
                <li className="login-btn">
                   <LinkWithoutScroll href="/enter">
                      <Button
                        variant="contained"
                        color="secondary"
                        style={{ whiteSpace: 'nowrap' }}
                        className="btn-blue"
                      >
                         {l.logIn}
                      </Button>
                   </LinkWithoutScroll>
                </li>
             </>
           )}
           {user.username && !isLoading && <MenuAccount />}
        </ul>
     </nav>
   );
});

export default NavBar;
