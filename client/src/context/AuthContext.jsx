import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState({ items: [] });

  const signup = async (email, password, name) => {
    const res = await axios.post('http://localhost:5000/api/auth/signup', { email, password, name });
    setUser(res.data.user);
    localStorage.setItem('token', res.data.token);
  };

  const login = async (email, password) => {
    const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
    setUser(res.data.user);
    localStorage.setItem('token', res.data.token);
    await fetchCart();
  };

  const logout = () => {
    setUser(null);
    setCart({ items: [] });
    localStorage.removeItem('token');
  };

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const res = await axios.get('http://localhost:5000/api/cart', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCart(res.data);
      }
    } catch (error) {
      console.error('Fetch cart error:', error);
    }
  };

  const addToCart = async (productId, quantity) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        'http://localhost:5000/api/cart/add',
        { productId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCart(res.data);
    } catch (error) {
      console.error('Add to cart error:', error);
      alert(error.response?.data?.message || 'Failed to add to cart');
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setUser({}); // Placeholder; fetch user data if needed
      fetchCart();
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, cart, signup, login, logout, addToCart }}>
      {children}
    </AuthContext.Provider>
  );
};