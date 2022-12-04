import React from "react";
import {Box, Button} from "@mui/material";
import LinkWithoutScroll from "./utils/LinkWithoutScroll";
import {useLocale} from '../translations/useLocale';

const DonatePopup = () => {
  const l = useLocale();

   return (
    <Box
        sx={{
          gap: 2,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
           display: 'flex',
          spacing: 2,
        }}
      className="donate-popup"

    >
      <div className='rainbow' style={{ fontSize: "2rem", color: 'hotpink', userSelect: 'none' }}>❣</div>
      <LinkWithoutScroll href = "/donate">
        <Button
            className = "donate-popup__btn"
            variant = "contained"
        >
          {l.donate}
        </Button>
      </LinkWithoutScroll>
      <LinkWithoutScroll href = "/development">
        <Button
            className = "donate-popup__btn"
            variant = "outlined"
            size = 'small'
            style = {{fontSize: '15px'}}
        >
          🛠
        </Button>
      </LinkWithoutScroll>
    </Box>
  );
};

export default DonatePopup;
