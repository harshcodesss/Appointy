import { createContext, useState, useEffect, useCallback } from 'react';
import { authAPI, userAPI } from '../api/axios';

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(false);

  const role = user?.role || null;
  const isAuthenticated = !!token;
  const isAdmin = role === 'admin';
  const isDoctor = role === 'doctor';
  const isUser = role === 'user';

  // Persist token & user to localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  // Load user profile when token changes (non-admin)
  const loadProfile = useCallback(async () => {
    if (!token || role === 'admin') return;
    try {
      const { data } = await userAPI.getProfile();
      if (data.success) {
        setUser((prev) => ({ ...prev, ...data.user }));
      }
    } catch {
      // Token might be invalid
    }
  }, [token, role]);

  useEffect(() => {
    if (token && role === 'user') {
      loadProfile();
    }
  }, [token, role, loadProfile]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await authAPI.login({ email, password });
      if (data.success) {
        setToken(data.token);
        setUser({ ...data.user, role: 'user' });
        return { success: true };
      }
      return { success: false, message: data.message };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const { data } = await authAPI.register({ name, email, password });
      if (data.success) {
        setToken(data.token);
        setUser({ ...data.user, role: 'user' });
        return { success: true };
      }
      return { success: false, message: data.message };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Registration failed' };
    } finally {
      setLoading(false);
    }
  };

  const loginAdmin = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await authAPI.loginAdmin({ email, password });
      if (data.success) {
        setToken(data.token);
        setUser({ role: 'admin', email });
        return { success: true };
      }
      return { success: false, message: data.message };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const value = {
    user, setUser, token, role, loading,
    isAuthenticated, isAdmin, isDoctor, isUser,
    login, register, loginAdmin, logout, loadProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
