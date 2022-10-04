import Link from "next/link";
import { Avatar, Button, Container, Divider, ListItemIcon, MenuItem } from "@mui/material";
import User from "../../store/User";
import { observer } from "mobx-react-lite";
import Image from "next/future/image";
import { MouseEvent, useEffect, useState } from "react";
import Loader from "./Loader";
import { useRouter } from "next/router";
import MenuAccount from "./MenuAccount";
import { handleLogOut } from "../../utils/helpers";
import { FALLBACK_IMAGE } from "../../utils/constants";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { auth, deleteAccount, firestore } from "../../libs/firebase";
import {
  DeleteForeverOutlined,
  Logout,
  MenuBookSharp,
  Settings,
  UpdateOutlined,
} from "@mui/icons-material";
import { toastModal } from "../../utils/toastModal";
import { useMenu } from "../../libs/hooks/useMenu";
import DefaultMenuItems from './DefaultMenuItems';

const NavBar = observer(() => {
  const [isLoading, setIsLoading] = useState(false);
  const { photoURL, user } = User;
  const router = useRouter();
  const [userRealtime] = useDocumentData(firestore.doc("users/" + auth.currentUser?.uid));
  const [userState, setUserState] = useState(null);
  const {menuElement, handleClick} = useMenu(<DefaultMenuItems/>);

  function handleLoadComplete() {
    setIsLoading(false);
  }

  useEffect(() => {
    if (!userRealtime) return;
    setUserState(userRealtime);
    console.log("userRealtime", userRealtime);
  }, [userRealtime]);

  function handleLoadStart() {
    setIsLoading(false);
  }

  return (
    <nav className="navbar">
      <ul className="navbar-list">
        <li>
          <Link href="/">
            <button className="btn-logo">NXT</button>
          </Link>
        </li>

        <Loader shouldShow={isLoading && !user?.username} />

        {user.username && (
          <>
            <li className="push-left">
              <Link href="/enter">
                <Button
                  sx={{
                    size: {
                      xs: "small",
                      md: "medium",
                    },
                  }}
                  onClick={() => handleLogOut(router)}
                  color="error"
                  variant="outlined"
                  className="btn-blue"
                >
                  Log out
                </Button>
              </Link>
            </li>
            <li>
              <Link href="/admin">
                <Button variant="contained" className="btn-blue">
                  Manage posts
                </Button>
              </Link>
            </li>

            {user.username && (
              <li>
                <a tabIndex={0} onClick={handleClick}>
                  <Image
                    quality={90}
                    onLoadingComplete={handleLoadComplete}
                    onLoadStart={handleLoadStart}
                    width={30}
                    height={30}
                    src={userState?.photoURL || photoURL || FALLBACK_IMAGE}
                    alt="User avatar"
                  />
                </a>
                {menuElement}
              </li>
            )}
          </>
        )}

        {!user.username && !isLoading && (
          <>
            <li>
              <Link href="/enter">
                <Button
                  variant="contained"
                  color="secondary"
                  className="btn-blue"
                >
                  Log in
                </Button>
              </Link>
            </li>
          </>
        )}
      </ul>
      <MenuAccount />
    </nav>
  );
});

export default NavBar;
