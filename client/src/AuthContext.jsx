import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from './api';

const AuthContext = createContext(null);

const STORAGE_KEY = 'quantum_user';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.token && parsed?.user) {
          setToken(parsed.token);
          setUser(parsed.user);
        }
      }
    } catch (_) {
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setLoading(false);
    }
  }, []);

  const saveSession = (userData, jwtToken) => {
    const session = { user: userData, token: jwtToken };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    setUser(userData);
    setToken(jwtToken);
  };

  const register = useCallback(async (formData) => {
    const { data } = await authAPI.register(formData);
    saveSession(data.user, data.token);
    return data;
  }, []);

  const login = useCallback(async (credentials) => {
    const { data } = await authAPI.login(credentials);
    saveSession(data.user, data.token);
    return data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
    setToken(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, register, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
