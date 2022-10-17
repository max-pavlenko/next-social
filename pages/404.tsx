import React from 'react';
import { Button, Typography } from '@mui/material';
import MetaTags from '../components/utils/MetaTags';
import LinkWithoutScroll from '../components/utils/LinkWithoutScroll';
import AnimatePage from '../components/utils/AnimatePage';

const NotFound = () => {
   return (
       <AnimatePage>
          <main>
             <MetaTags title = 'Page Not Found' desc = 'Requested page couldn`t be found or it doesnt exist!'
                       imagePath = 'public/vercel.svg'/>
             <Typography textAlign = 'center' variant = 'h3'>Requested page doesn't seem to exist...◾
             </Typography>
             <LinkWithoutScroll href = '/'>
                <div style = {{display: 'flex', justifyContent: 'center'}}>
                   <Button size = 'large' sx = {{mx: 'auto', mt: '20px'}} variant = 'contained' color = 'secondary'>
                      Go Home
                   </Button>
                </div>
             </LinkWithoutScroll>
          </main>
       </AnimatePage>
   );
};

export default NotFound;
