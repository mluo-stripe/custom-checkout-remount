import React from 'react';
import { PaymentElement } from '@stripe/react-stripe-js';

const StripePaymentElement = () => {
  return (
    <PaymentElement options={{
      layout: 'accordion',
      readonly: true
    }}/>
  );
};

export default StripePaymentElement;
