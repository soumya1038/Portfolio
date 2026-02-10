import { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await api.get('/auth/verify');
        setUser(response.data.user);
      } catch (error) {
        // Token is invalid, clear it
        localStorage.removeItem('token');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  /**
   * Login with email and password
   */
  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    
    const { token, user } = response.data;
    
    // Store token
    localStorage.setItem('token', token);
    
    // Update state
    setUser(user);
    
    return response.data;
  };

  /**
   * Logout user
   */
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
