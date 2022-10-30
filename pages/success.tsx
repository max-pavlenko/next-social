import React, { useState } from "react";
import { Button, Container, Stack, Typography } from "@mui/material";
import LinkWithoutScroll from "../components/utils/LinkWithoutScroll";

const SuccessDonationPage = () => {
   const [ showConfetti, setShowConfetti ] = useState(true);
   const confettiOptions = {
      force: 0.4,
      duration: 5000,
      particleCount: 200,
      height: 1100,
      width: 1400,
   };

   return (
       <Container>
          <Stack gap = {3} alignItems = "center">
             <Typography textAlign = "center" variant = "h3">
                Thanks for your support! 💟
             </Typography>
             <LinkWithoutScroll href = "/">
                <Button variant = "outlined">Home</Button>
             </LinkWithoutScroll>
            <Button color='secondary' variant='outlined' onClick={()=>setShowConfetti(prevState => !prevState)}>🎉</Button>
          </Stack>
              {/* <Container */}
              {/*     style = {{ */}
              {/*        overflow: "hidden", */}
              {/*        pointerEvents: "none", */}
              {/*        position: "absolute", */}
              {/*        top: 0, */}
              {/*        left: 0, */}
              {/*        right: 0, */}
              {/*        bottom: 0, */}
              {/*     }} */}
              {/* > */}
              {/*    <div style = {{position: "absolute", left: "50%", top: "10%"}}> */}
              {/*       <ConfettiExplosion */}
              {/*           colors={["#FF0080", "#00FF00", "#F917FF", '#26EBFF', '#FF9000', '#071DFF', '#F9B18F', '#FA8CFF']} */}
              {/*           force = {0.6} */}
              {/*           duration = {5000} */}
              {/*           particleCount = {230} */}
              {/*           height = {1600} */}
              {/*           width = {1000} */}
              {/*           // floorHeight = {1600} */}
              {/*           // floorWidth = {1600} */}
              {/*       /> */}
              {/*    </div> */}
              {/* </Container> */}
       </Container>
   );
};

export default SuccessDonationPage;
