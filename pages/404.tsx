import React from 'react';
import { Button, Typography } from '@mui/material';
import MetaTags from '../components/utils/MetaTags';
import LinkWithoutScroll from '../components/utils/LinkWithoutScroll';
import AnimatePage from '../components/utils/AnimatePage';
import { useLocale } from '../translations/useLocale';

const NotFound = () => {
   const l = useLocale();

   return (
       <AnimatePage>
          <main>
             <MetaTags title = 'Not Found' desc = 'Requested page couldn`t be found or it doesnt exist!'
                       />
             <Typography fontWeight={700} fontFamily='Cabin Sketch, sans-serif' textAlign = 'center' variant = 'h3'>{l.notFound}...◾
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
