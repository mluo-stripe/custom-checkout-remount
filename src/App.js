import React, { useState, useEffect } from 'react';
import './App.css';
import { loadStripe } from '@stripe/stripe-js';
import { CheckoutProvider } from '@stripe/react-stripe-js';
import StripePaymentElement from './StripePaymentElement';
import OrderSummary from './OrderSummary';
import PayButton from './PayButton';

const stripe = loadStripe(
  process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY,
  { betas: ['custom_checkout_beta_5'] }
);
stripe.locale = 'ja';

const App = () => {
  const [clientSecret, setClientSecret] = useState(null);
  const [isAnnual, setIsAnnual] = useState(false);
  const [key, setKey] = useState(0);

  useEffect(() => {
    fetchClientSecret();
  }, [isAnnual]);

  const fetchClientSecret = () => {
    const endpoint = isAnnual
      ? 'http://localhost:3001/create-annual-checkout-session'
      : 'http://localhost:3001/create-monthly-checkout-session';

    fetch(endpoint, {
      method: 'POST',
    })
      .then((response) => response.json())
      .then((json) => {
        setClientSecret(json.clientSecret);
        setKey(prevKey => prevKey + 1);
      });
  };

  const handleToggle = () => {
    setIsAnnual(!isAnnual);
  };

  return (
    <div className="checkout-page">
      <CheckoutContent 
        isAnnual={isAnnual} 
        clientSecret={clientSecret} 
        stripeKey={key} 
        onToggle={handleToggle}
      />
    </div>
  );
};

const CheckoutContent = ({ isAnnual, clientSecret, stripeKey, onToggle }) => {
  if (!clientSecret) {
    return <div>Loading...</div>;
  }

  return (
    <div className="checkout-container">
      <h1>Michael's test Custom Checkout for Crazy Products</h1>

      <div className="email-section">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          placeholder="you@example.com"
        />
      </div>

      <div className="subscription-toggle">
        <label>
          <input
            type="checkbox"
            checked={isAnnual}
            onChange={onToggle}
          />
          {isAnnual ? 'Switch to Monthly' : 'Switch to Annual'}
        </label>
        {isAnnual && <span>(Save 10%)</span>}
      </div>

      <form>
        <CheckoutProvider key={stripeKey} stripe={stripe} options={{ clientSecret }}>
          <OrderSummary />
          <StripePaymentElement />
          <PayButton />
        </CheckoutProvider>
      </form>
    </div>
  );
};

export default App;
