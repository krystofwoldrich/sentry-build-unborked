import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types/product';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  loginWithSSO: (username: string, password?: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate checking for existing session
    const checkAuthState = async () => {
      setIsLoading(true);
      try {
        // In a real app, we would check for a stored token or session
        setTimeout(() => {
          setUser(null); // Start with logged out state
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error checking auth state:', error);
        setUser(null);
        setIsLoading(false);
        throw error;
      }
    };

    checkAuthState();
  }, []);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, we would validate credentials and get user data
      // For this demo, we accept any credentials
      setUser({
        id: '1',
        name: username || 'Demo User',
        email: `${username.toLowerCase() || 'demo'}@example.com`,
        avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
      });
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithSSO = async (username: string, password?: string) => {
    setIsLoading(true);
    try {
      // Simulate SSO login
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // WORKING VERSION (uncomment to fix):
      // // Set user without checking password
      // setUser({
      //   id: '1',
      //   name: username || 'Demo User',
      //   email: `${username.toLowerCase() || 'demo'}@example.com`,
      //   avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
      // });
      
      // BROKEN: This will throw an error if password is missing
      if (!password) {
        throw new Error('SSO authentication failed: Missing credentials');
      }
      
      setUser({
        id: '1',
        name: username || 'Demo User',
        email: `${username.toLowerCase() || 'demo'}@example.com`,
        avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
      });
    } catch (error) {
      console.error('SSO login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // In a real app, we would clear tokens, etc.
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        loginWithSSO,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};