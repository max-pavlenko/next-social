import React, { useEffect, useRef, useState } from "react";
import { Button, Container, Stack, Typography } from "@mui/material";
import LinkWithoutScroll from "../components/utils/LinkWithoutScroll";
import ReactConfetti from 'react-confetti';
import MetaTags from '../components/utils/MetaTags';

const SuccessDonationPage = () => {
   const [ showConfetti, setShowConfetti ] = useState(true);
   const width = useRef(0);
   const height = useRef(0);

   useEffect(() => {
   width.current = window.innerWidth;
   height.current = window.innerHeight;
   }, []);

   return (
       <Container>
          <MetaTags title='Thanks for donation!' desc='We are happy that we have such supportive and devoted community!' />
          <Stack gap = {3} alignItems = "center">
             <Typography textAlign = "center" variant = "h3">
                Thanks for your support! 💟
             </Typography>
             <LinkWithoutScroll href = "/">
                <Button variant = "outlined">Home</Button>
             </LinkWithoutScroll>
             <Button color = 'secondary' variant = 'outlined'
                     onClick = {() => setShowConfetti(prevState => !prevState)}>{showConfetti ? '❌' : '🎉'}</Button>
          </Stack>

          <div
              style={{
                 position: "absolute",
                 top: 0,
                 left: 0,
                 width: "100%",
                 height: "100%",
                  pointerEvents: 'none'
              }}
          >
             {showConfetti && <ReactConfetti width={width.current} height={height.current} tweenDuration={7000} numberOfPieces={500} recycle={false} onConfettiComplete = {() => setShowConfetti(false)}/>}
          </div>
       </Container>
   );
};

export default SuccessDonationPage;
