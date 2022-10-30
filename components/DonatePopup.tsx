import React from "react";
import { Button, Stack } from "@mui/material";
import LinkWithoutScroll from "./utils/LinkWithoutScroll";
import { useLocale } from '../translations/useLocale';

const DonatePopup = () => {
  const l = useLocale();

  return (
    <Stack
      className="donate-popup"
      gap={2}
      flexDirection="row"
      justifyContent="center"
      alignItems="center"
      spacing={2}
    >
      <div className='rainbow' style={{ fontSize: "2rem", color: 'hotpink', pointerEvents: 'none' }}>❣</div>
      <LinkWithoutScroll href="/donate">
        <Button
          className="donate-popup__btn"
          sx={{ margin: "0 !important" }}
          variant="contained"
        >
          {l.donate}
        </Button>
      </LinkWithoutScroll>
    </Stack>
  );
};

export default DonatePopup;
