import React, { useState, useEffect } from 'react';
import { useCheckout } from '@stripe/react-stripe-js';

const PayButton = () => {
  const { confirm, canConfirm } = useCheckout();
  const checkout = useCheckout();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

    useEffect(() => {
        checkout.updateEmail('test@example.com');
    }, []);

  const handleClick = async () => {
    try {
      
      setLoading(true);
      const result = await confirm();
      console.log("Pay button click result");
      console.log(result);
      if (result.type === 'error') {
        setError(result.error);
      }
    } catch (error) {
      console.error("Error during payment confirmation:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      <button disabled={loading} onClick={handleClick}>
        Pay
      </button>
      {error && <div>{error.message}</div>}
    </div>
  );
};

export default PayButton;
