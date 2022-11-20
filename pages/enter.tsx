import User from '../store/User';
import { observer } from 'mobx-react-lite';
import UsernameForm from '../components/Forms/UsernameForm';
import LoggingForm from '../components/Forms/LoggingForm';
import ConfirmEmail from '../components/layout/PageLayout/ConfirmEmail';
import MetaTags from '../components/utils/MetaTags';
import React from 'react';
import { auth } from '../libs/firebase';
import AnimatePage from '../components/utils/AnimatePage';
import { useRouter } from 'next/router';

const EnterPage = observer(() => {
   const {username} = User.user;
   const router = useRouter();
   return (
       <AnimatePage>
          <main>
             <MetaTags title = 'Logging' desc = 'Log in or sign up'/>
             {
                auth.currentUser ?
                    !auth.currentUser.emailVerified ? <ConfirmEmail/>
                        : username ? (() => {
                           router.push('/'+username)
                           return null;
                        })() : <UsernameForm/>
                    : (<LoggingForm/>)
             }
          </main>
       </AnimatePage>
   );
});

export default EnterPage;
