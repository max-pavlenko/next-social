import { ReactElement } from "react";
import User from "../../store/User";
import { observer } from "mobx-react-lite";
import Link from "next/link";
import { Button, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { auth } from '../../libs/firebase';

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
              <Link href = "/enter">
                 <a onClick = {handleLogInClick}>
                    <Button size = "large" variant = "outlined">
                       Log in 🎀
                    </Button>
                 </a>
              </Link>
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
          <Link href = "/enter">
             <a style = {{color: "peru"}}>Log In</a>
          </Link>
       </Typography>
   );
}
