import { FC, ReactElement } from 'react';
import User from '../../user/store/User';
import { observer } from 'mobx-react-lite';
import { Button, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { auth } from '../../../../libs/firebase';
import LinkWithoutScroll from '../../../shared/components/ui/LinkWithoutScroll';
import MetaTags from '../../../shared/components/utils/MetaTags';

type Props = { shouldShowAccessText?: boolean, children: ReactElement, }

const AuthCheck: FC<Props> = observer(({ shouldShowAccessText = true, children }) => {
     const { data, username: loggedInUserName } = User.user;
     const router = useRouter();
     const currentRoute = router.asPath;

     const userIsNotLoggedIn = !data || !loggedInUserName;

     function handleLogInClick() {
        localStorage.setItem('pageURLBeforeLeaveForLogin', currentRoute);
     }

     if (!shouldShowAccessText && userIsNotLoggedIn) {
        return (
          <LinkWithoutScroll href="/enter">
             <Button size="large" variant="outlined">
                Log in 🎀
             </Button>
          </LinkWithoutScroll>
        );
     }

     if (userIsNotLoggedIn) {
        return <RestrictedText />;
     }
     else if (!auth.currentUser?.emailVerified) {
        router.push('/enter');
        return null;
     }
     else {
        return children;
     }
  },
);

export default AuthCheck;

function RestrictedText({ additionalText = '' }: { additionalText?: string }) {
   return (
     <Typography variant="h5" textAlign="center">
        <MetaTags title="Not Authorized" desc="Please, authorize to proceed" />
        You must be logged in{additionalText || ''} to have an access.&nbsp;
        <LinkWithoutScroll style={{ color: 'var(--color-blue)', fontWeight: 600 }} href="/enter">
           Log In
        </LinkWithoutScroll>
     </Typography>
   );
}
