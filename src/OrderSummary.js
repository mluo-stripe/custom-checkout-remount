import React from 'react';
import { useCheckout } from '@stripe/react-stripe-js';

const OrderSummary = () => {
  const { currency, total, recurring, taxAmounts } = useCheckout();

  // Determine if the subscription is annual
  const isAnnual = recurring.interval === 'year';

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount / 100);
  };

  return (
    <div className="order-summary">
      <h2>Order Summary</h2>
      <div className="order-item">
        <span>Item Name</span>
        <span>{formatCurrency(total.total)}{isAnnual ? '/year' : '/month'}</span>
      </div>
      <hr />
      <div className="order-total">
        <span>Total:</span>
        <span>{formatCurrency(total.total)}{isAnnual ? '/year' : '/month'}</span>
      </div>
      {taxAmounts.length > 0 && (
        <div className="order-tax">
          <span>Tax:</span>
          <span>{formatCurrency(taxAmounts[0].amount)}</span>
        </div>
      )}
    </div>
  );
};

export default OrderSummary;
