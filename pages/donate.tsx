import React, {useState} from 'react';
import Stripe from 'stripe';
import {Button, Container, Grid, TextField, Typography} from '@mui/material';
import axios from 'axios';
import AnimatePage from '../components/utils/AnimatePage';
import {useLocale} from '../translations/useLocale';
import MetaTags from '../components/utils/MetaTags';
import {motion} from 'framer-motion';
import LinkWithoutScroll from "../components/utils/LinkWithoutScroll";
import Breadcrumbs from "../components/utils/Breadcrumbs";

interface IPrice extends Stripe.Price {
}

interface IProps {
   prices: IPrice[]
}

const DonatePage = ({prices}: IProps) => {
   const [ amount, setAmount ] = useState<string | number>('1');
   const l = useLocale();
   const [ isDonateLoaderVisible, setIsDonateLoaderVisible ] = useState(false);
   const [ dots, setDots ] = useState('');

   const handleDonate = async () => {
      let intervalID;
      try {
         intervalID = setInterval(() => setDots(prevState => prevState.length < 3 ? prevState + '.' : ''), 350);
         const res = await axios.post('/api/payment', {
            items: [
               {id: 1, quantity: 2},
               {id: 2, quantity: 1},
            ],
            donation: amount,
         });
         window.location = res.data.url;
         clearInterval(intervalID);
         setDots('');
      } catch (e) {
         clearInterval(intervalID)
         setDots('');
         setIsDonateLoaderVisible(false);
         console.warn(e)
      }
   };

   const variants = {
      hidden: { opacity: -1, x: 0, y: -40 },
      enter: { opacity: 1, x: 0, y: 0 },
      exit: { opacity: 0, x: 0, y: 0 },
   }

   return (
       <AnimatePage>
          <MetaTags title='Donation' desc='Donate to support our work, and eventually enhance our future' />
          <Container>
             <Typography variant = 'h4' textAlign = 'center'>{l.donationDescription}! ✨
             </Typography>
             <Grid my = {3} justifyContent = 'center' container spacing = {2}>
                <Grid item xs = {9}>
                   <motion.div whileInView='enter'
                               variants = {variants}
                               viewport={{once: false, amount: 0.2}}
                               initial="hidden"
                               exit='exit'
                               transition={{type: 'tween', duration: 0.3, delay: 0.2}}>
                   <TextField value = {amount} onChange = {e => {
                      setAmount(+e.target.value)
                   }} inputProps = {{min: 1}} type = 'number' fullWidth label = 'Amount, $' placeholder = '1.5'/>
                   </motion.div>
                </Grid>
                <Grid alignItems = 'center' textAlign = 'center' item xs = {4}>
                   <motion.div animate='enter'
                               variants = {variants}
                               viewport={{once: false,  amount: 0.2}}
                               initial="hidden"
                               exit='exit'
                               transition={{type: 'tween', duration: 0.3, delay: 0.5}}>
                   <Button onClick = {handleDonate} fullWidth size = 'large' variant = 'contained'>
                      <span style = {{position: 'relative'}}>
                         {`${l.donate}`}
                         <span style = {{position: 'absolute', bottom: '0', right: '0', translate: '100% 0'}}>{`${dots}`}</span>
                      </span>
                   </Button>
                   </motion.div>
                </Grid>
                <Grid justifyContent = 'center' mt={1} container>
                   <Grid item>
                      <motion.div animate='enter'
                                  variants = {variants}
                                  viewport={{once: false, amount: 0.2}}
                                  initial="hidden"
                                  exit='exit'
                                  transition={{type: 'tween', duration: 0.3, delay: 0.7}}>
                         <LinkWithoutScroll className='highlight' href="/about-us">
                            Why you should trust us
                         </LinkWithoutScroll>
                      </motion.div>
                   </Grid>
                </Grid>
             </Grid>
          </Container>
       </AnimatePage>
   );
};

export default DonatePage;
