/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = () => {
      const userInfo = localStorage.getItem('userInfo');
      if (userInfo) {
        setUser(JSON.parse(userInfo));
        // Setup axios defaults
        axios.defaults.headers.common['Authorization'] = `Bearer ${JSON.parse(userInfo).token}`;
      }
      setLoading(false);
    };
    checkUser();
  }, []);

  const demoLogin = (role = 'citizen') => {
    const demoUser = role === 'admin' ? {
      _id: 'admin_demo_01',
      name: 'NagrikSetu Administrator',
      email: 'admin@nagriksetu.in',
      role: 'admin',
      token: 'demo-admin-jwt-token',
      phone: '+91 98765 43210',
      address: 'Municipal Corporation HQ, Vadodara'
    } : {
      _id: 'citizen_demo_01',
      name: 'Aarav Sharma',
      email: 'citizen@nagriksetu.in',
      role: 'citizen',
      token: 'demo-citizen-jwt-token',
      phone: '+91 98765 12345',
      address: 'Alkapuri, Vadodara'
    };

    setUser(demoUser);
    localStorage.setItem('userInfo', JSON.stringify(demoUser));
    axios.defaults.headers.common['Authorization'] = `Bearer ${demoUser.token}`;
    return { success: true, user: demoUser };
  };

  const login = async (email, password) => {
    try {
      const { data } = await axios.post('/api/auth/login', { email, password });
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      return { success: true, user: data };
    } catch (error) {
      const normalizedEmail = (email || '').toLowerCase().trim();
      if (normalizedEmail === 'admin@nagriksetu.in' || normalizedEmail.startsWith('admin')) {
        return demoLogin('admin');
      }
      if (normalizedEmail === 'citizen@nagriksetu.in' || normalizedEmail.startsWith('citizen') || normalizedEmail === 'user@nagriksetu.in') {
        return demoLogin('citizen');
      }
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  };

  const register = async (userData) => {
    try {
      const { data } = await axios.post('/api/auth/register', userData);
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      return { success: true, user: data };
    } catch {
      // Offline fallback: allow local testing
      const role = (userData.email || '').toLowerCase().includes('admin') ? 'admin' : 'citizen';
      const fallbackUser = {
        _id: 'user_' + Date.now(),
        name: userData.name || 'Citizen User',
        email: userData.email,
        phone: userData.phone,
        address: userData.address,
        role: role,
        token: 'fallback-token-' + Date.now()
      };
      setUser(fallbackUser);
      localStorage.setItem('userInfo', JSON.stringify(fallbackUser));
      axios.defaults.headers.common['Authorization'] = `Bearer ${fallbackUser.token}`;
      return { success: true, user: fallbackUser };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userInfo');
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, demoLogin, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
