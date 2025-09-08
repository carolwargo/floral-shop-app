// client/src/context/AuthContext.jsx
import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState({ items: [] });
  const [error, setError] = useState(null);

  const login = async (email, password) => {
    try {
      setError(null);
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      const { token } = res.data;
      console.log('Login token:', token);
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser({ email });
      await fetchCart(token); // Pass token directly
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
      console.error('Login error:', err);
    }
  };

  const fetchCart = async (token) => {
    try {
      const authToken = token || localStorage.getItem('token');
      console.log('Fetching cart with token:', authToken);
      if (!authToken) {
        throw new Error('No token found');
      }
      const res = await axios.get('http://localhost:5000/api/cart', {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      setCart(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch cart');
      console.error('Fetch cart error:', err);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      console.log('Initial token:', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchCart(token);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setCart({ items: [] });
    setError(null);
  };

  return (
    <AuthContext.Provider value={{ user, cart, error, login, logout, fetchCart }}>
      {children}
    </AuthContext.Provider>
  );
};