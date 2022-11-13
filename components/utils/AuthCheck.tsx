import { ReactElement } from "react";
import User from "../../store/User";
import { observer } from "mobx-react-lite";
import { Button, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { auth } from '../../libs/firebase';
import LinkWithoutScroll from './LinkWithoutScroll';

// @ts-ignore
const AuthCheck = observer(({
                               shouldShowAccessText = true,
                               children,
                            }: { shouldShowAccessText?: boolean, children: ReactElement, }) => {
       const {data, username: loggedInUserName} = User.user;
       const router = useRouter();
       const currentRoute = router.asPath;

       const userIsNotLoggedIn = !data || !loggedInUserName;

       function handleLogInClick() {
          localStorage.setItem("pageURLBeforeLeaveForLogin", currentRoute);
       }

       if (!shouldShowAccessText && userIsNotLoggedIn)
          return (
              <LinkWithoutScroll href = "/enter">

                    <Button size = "large" variant = "outlined">
                       Log in 🎀
                    </Button>

              </LinkWithoutScroll>
          );

       if (userIsNotLoggedIn) return <RestrictedText/>;
       else if (!auth.currentUser?.emailVerified) return router.push("/enter");
       else return children;
    }
);

export default AuthCheck;

function RestrictedText({additionalText = ""}: { additionalText?: string }) {
   return (
       <Typography variant = "h5" textAlign = "center">
          You must be logged in{additionalText || ""} to have an access.&nbsp;
          <LinkWithoutScroll style = {{color: "peru"}} href = "/enter">
             Log In
          </LinkWithoutScroll>
       </Typography>
   );
}
