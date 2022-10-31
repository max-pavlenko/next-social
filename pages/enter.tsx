import User from '../store/User';
import { observer } from 'mobx-react-lite';
import UsernameForm from '../components/Forms/UsernameForm';
import LoggingForm from '../components/Forms/LoggingForm';
import ConfirmEmail from '../components/layout/PageLayout/ConfirmEmail';
import Entered from '../components/utils/Entered';
import MetaTags from '../components/utils/MetaTags';
import React from 'react';
import { auth } from '../libs/firebase';
import AnimatePage from '../components/utils/AnimatePage';

const EnterPage = observer(() => {
   const {username} = User.user;
   return (
       <AnimatePage>
          <main>
             <MetaTags title = 'Logging' desc = 'Log in or sign up' imagePath = '/vercel.svg'/>
             {
                auth.currentUser ?
                    !auth.currentUser.emailVerified ? <ConfirmEmail/>
                        : username ? <Entered/> : <UsernameForm/>
                    : (<LoggingForm/>)
             }
          </main>
       </AnimatePage>
   );
});

export default EnterPage;
