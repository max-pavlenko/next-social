import React, { useState } from 'react';
import Stripe from 'stripe';
import { Button, Container, Grid, TextField, Typography } from '@mui/material';
import axios from 'axios';
import AnimatePage from '../components/utils/AnimatePage';
import { useLocale } from '../translations/useLocale';
import MetaTags from '../components/utils/MetaTags';
import vercel from '../public/vercel.svg';

interface IPrice extends Stripe.Price {
}

interface IProps {
   prices: IPrice[]
}

const DonatePage = ({prices}: IProps) => {
   const [ amount, setAmount ] = useState<string | number>('1');
   const l = useLocale();

   const handleDonate = async () => {
      try {
         const res = await axios.post('/api/payment', {
            items: [
               {id: 1, quantity: 2},
               {id: 2, quantity: 1},
            ],
            donation: amount,
         });
         window.location = res.data.url;
      } catch (e) {
         console.warn(e)
      }
   };
   return (
       <AnimatePage>
          <MetaTags title='Donation' desc='Donate to support our work, and enhance your life' imagePath={vercel} />
          <Container>
             <Typography variant = 'h4' textAlign = 'center'>{l.donationDescription}! ✨
             </Typography>
             <Grid my = {3} justifyContent = 'center' container spacing = {2}>
                <Grid item xs = {9}>
                   <TextField value = {amount} onChange = {e => {
                      setAmount(+e.target.value)
                   }} inputProps = {{min: 1}} type = 'number' fullWidth label = 'Amount, $' placeholder = '1.5'/>
                </Grid>
                <Grid alignItems = 'center' textAlign = 'center' item xs = {4}>
                   <Button fullWidth size = 'large' variant = 'contained' onClick = {handleDonate}>
                      {l.donate}
                   </Button>
                </Grid>
             </Grid>
          </Container>
       </AnimatePage>
   );
};

export default DonatePage;
