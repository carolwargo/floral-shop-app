//client/src/context/AuthContext.jsx
import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState({ items: [] });
  const [error, setError] = useState(null);

  const isTokenExpired = (token) => {
    try {
      const decoded = jwtDecode(token);
      return decoded.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  };

  // LOGIN
  const login = async (email, password) => {
    try {
      setError(null);
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      const { token } = res.data;
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const decoded = jwtDecode(token);
      setUser({ name: decoded.name || email, email, isAdmin: decoded.isAdmin || false });
      await fetchCart(token);
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
      console.error('Login error:', err);
    }
  };

  // SIGNUP
  const signup = async (email, password, name) => {
    try {
      setError(null);
      const res = await axios.post('http://localhost:5000/api/auth/register', { email, password, name });
      const { token } = res.data;
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const decoded = jwtDecode(token);
      setUser({ name: decoded.name || name, email, isAdmin: decoded.isAdmin || false });
      await fetchCart(token);
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed');
      console.error('Signup error:', err);
    }
  };

  // FETCH CART
  const fetchCart = async (token) => {
    try {
      const authToken = token || localStorage.getItem('token');
      if (!authToken || isTokenExpired(authToken)) {
        throw new Error('No valid token found');
      }
      const res = await axios.get('http://localhost:5000/api/cart', {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      setCart(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch cart');
      console.error('Fetch cart error:', err);
      if (err.message === 'No valid token found') {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
      }
    }
  };

  // LOGOUT
  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setCart({ items: [] });
    setError(null);
  };

  // INITIALIZE USER
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !isTokenExpired(token)) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const decoded = jwtDecode(token);
      setUser({ name: decoded.name || decoded.email, email: decoded.email, isAdmin: decoded.isAdmin || false });
      fetchCart(token);
    } else if (token) {
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    }
  }, []);

  // CART ITEM COUNT
  const cartItemsCount = cart.items.reduce((total, item) => total + (item.quantity || 1), 0);

  return (
    <AuthContext.Provider value={{ user, cart, cartItemsCount, error, login, logout, signup, fetchCart }}>
      {children}
    </AuthContext.Provider>
  );
};
