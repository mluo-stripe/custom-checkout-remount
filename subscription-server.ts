import Express from 'express';
require('dotenv').config();
import Stripe from 'stripe';
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not defined in environment variables');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-09-30.acacia; custom_checkout_beta=v1' as any,
});

const app = Express();
const cors = require('cors');
app.use(Express.json());
app.use(cors()); // Enable CORS for all origins


app.post('/create-monthly-checkout-session', async (req: Express.Request, res: Express.Response) => {
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Monthly Plan',
          },
          unit_amount: 2000,
          recurring: {
            interval: 'month', // Could be 'day', 'week', 'month', or 'year'
          },
        },
        quantity: 1,
        adjustable_quantity: {
          enabled: true,  
          maximum: 100,
          minimum: 0,
        },
      },
    ],
    mode: 'subscription',
    ui_mode: 'custom',
    // The URL of your payment completion page
    return_url: 'http://localhost:3001/success',
    // automatic_tax: {enabled: true}
  });

  console.log(session.id);
  res.json({clientSecret: session.client_secret});
});

app.post('/create-annual-checkout-session', async (req: Express.Request, res: Express.Response) => {
    const monthlyPrice = 2000; // $20.00
    const annualPrice = Math.round(monthlyPrice * 12 * 0.9); // 10% discount for annual, rounded to nearest cent
  
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Annual Plan',
            },
            unit_amount: annualPrice,
            recurring: {
              interval: 'year',
            },
          },
          quantity: 1,
          adjustable_quantity: {
            enabled: true,  
            maximum: 100,
            minimum: 0,
          },
        },
      ],
      mode: 'subscription',
      ui_mode: 'custom',
      // The URL of your payment completion page
      return_url: 'http://localhost:3001/success',
      // automatic_tax: {enabled: true}
    });
  
    console.log(session.id);
    res.json({clientSecret: session.client_secret});
  });
  
  
app.get('/', (req, res) => {
    res.send('Welcome to the homepage!');
  });

  app.get('/success', (req, res) => {
    res.send('Success');
  });

app.listen(3001, () => {
  console.log('Running on port 3001');
});