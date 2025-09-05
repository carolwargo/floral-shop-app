//Stripe Payments Backend const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
//Stripe Payments Frontend const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);