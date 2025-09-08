import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const { cart } = useContext(AuthContext);
  const [clientSecret, setClientSecret] = useState('');
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();

  const fetchClientSecret = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in again');
        navigate('/login');
        return null;
      }
      const res = await axios.post(
        'http://localhost:5000/api/payments/create-payment-intent',
        { amount: 5998, currency: 'usd' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data.clientSecret;
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Session expired. Please log in again.');
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        setError(err.response?.data?.message || 'Failed to initialize payment');
      }
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);

    if (!stripe || !elements) {
      setError('Payment system not ready');
      setProcessing(false);
      return;
    }

    // Fetch a fresh clientSecret
    const newClientSecret = await fetchClientSecret();
    if (!newClientSecret) {
      setProcessing(false);
      return;
    }
    setClientSecret(newClientSecret);

    const cardElement = elements.getElement(CardElement);
    const { error, paymentIntent } = await stripe.confirmCardPayment(newClientSecret, {
      payment_method: { card: cardElement },
    });

    if (error) {
      setError(error.message);
      setProcessing(false);
    } else if (paymentIntent.status === 'succeeded') {
      setProcessing(false);
      alert('Payment successful!');
      navigate('/cart');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      <h2>Checkout</h2>
      {cart.items.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          <h3>Order Summary</h3>
          {cart.items.map((item) => (
            <div key={item._id}>
              <p>{item.productId.name} x {item.quantity}: ${(item.productId.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
          <p>Total: ${cart.items.reduce((sum, item) => sum + item.productId.price * item.quantity, 0).toFixed(2)}</p>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <form onSubmit={handleSubmit}>
            <CardElement />
            <button type="submit" disabled={!stripe || processing} style={{ marginTop: '10px' }}>
              {processing ? 'Processing...' : 'Pay Now'}
            </button>
          </form>
        </>
      )}
    </div>
  );
}

function Checkout() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
}

export default Checkout;