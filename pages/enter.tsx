import User from '../store/User';
import { observer } from 'mobx-react-lite';
import UsernameForm from '../components/Forms/UsernameForm';
import LoggingForm from '../components/Forms/LoggingForm';
import ConfirmEmail from '../components/layout/PageLayout/ConfirmEmail';
import MetaTags from '../components/utils/MetaTags';
import React from 'react';
import { auth } from '../libs/firebase';
import AnimatePage from '../components/utils/AnimatePage';
import vercel from '../public/vercel.svg';

const EnterPage = observer(() => {
   const {username} = User.user;
   return (
       <AnimatePage>
          <MetaTags title='Here we go...' desc='Here we go...' imagePath={vercel} />
          <main>
             <MetaTags title = 'Logging' desc = 'Log in or sign up' imagePath = '/vercel.svg'/>
             {
                auth.currentUser ?
                    !auth.currentUser.emailVerified ? <ConfirmEmail/>
                        : username ? null : <UsernameForm/>
                    : (<LoggingForm/>)
             }
          </main>
       </AnimatePage>
   );
});

export default EnterPage;
