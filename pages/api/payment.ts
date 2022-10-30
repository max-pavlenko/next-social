import { NextApiRequest, NextApiResponse } from 'next';
import * as env from 'dotenv'

env.config();
const stripe = require('stripe')(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY)
const storeItems = [
   {priceInCents: 10000, name: '10$'},
   {priceInCents: 1000, name: '1$'},
   {priceInCents: 3000, name: '3$'},
   {priceInCents: 15000, name: '15$'},
   {priceInCents: 5000, name: '5$'},
]

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
   console.log(req.method.toUpperCase())
   try {
      const {donation, items} = req.body
      const session = await stripe.checkout.sessions.create({
         payment_method_types: [ 'card' ],
         cancel_url: process.env.NEXT_PUBLIC_SERVER_URL + '/donate',
         success_url: process.env.NEXT_PUBLIC_SERVER_URL + '/success',
         mode: 'payment',
         line_items: [{
               price_data: {
                  currency: 'usd',
                  product_data: {
                     name: 'Donation Support'
                  },
                  unit_amount: donation * 100,
               },
               quantity: 1,
            }]
      })
      res.status(200).json({url: session.url});
   } catch (e) {
      res.status(500).json(e.message);
      console.warn(e)
   }
}
