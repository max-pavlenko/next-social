import React from 'react';
import { observer } from 'mobx-react-lite';
import { useRouter } from 'next/router';
import MetaTags from '../src/shared/components/utils/MetaTags';
import AnimatePage from '../src/shared/components/utils/AnimatePage';
import ConfirmEmail from '../src/features/auth/components/ConfirmEmail';
import UsernameForm from '../src/features/auth/components/forms/UsernameForm';
import LoggingForm from '../src/features/auth/components/forms/LoggingForm';
import { auth } from '../libs/firebase';
import User from '../src/features/user/store/User';

const EnterPage = observer(() => {
   const router = useRouter();
   const { username } = User.user;

   const renderContent = () => {
      console.log('auth?.currentUser', auth?.currentUser);
      if (!auth?.currentUser) {
         return <LoggingForm />;
      }
      else if (!auth?.currentUser.emailVerified) {
         return <ConfirmEmail />;
      }
      else if (!username) {
         return <UsernameForm />;
      }
      else {
         router.push(`/${username}`);
      }
      return null;
   };

   return (
     <AnimatePage>
        <main>
           <MetaTags title="Logging" desc="Log in or sign up" />
           {renderContent()}
        </main>
     </AnimatePage>
   );
});

export default EnterPage;
