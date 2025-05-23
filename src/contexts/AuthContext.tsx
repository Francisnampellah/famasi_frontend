import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthService } from '../services/authService';

interface User {
  id: string;
  email: string;
  role: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (token) {
        setToken(token);
        try {
          const userData = await AuthService.getCurrentUser();
          setUser(userData);
        } catch (error) {
          // If getting current user fails, try to refresh the token
          if (refreshToken) {
            try {
              const { token: newToken, refreshToken: newRefreshToken } = await AuthService.refreshToken(refreshToken);
              localStorage.setItem('token', newToken);
              localStorage.setItem('refreshToken', newRefreshToken);
              setToken(newToken);
              const userData = await AuthService.getCurrentUser();
              setUser(userData);
            } catch (refreshError) {
              // If refresh token fails, clear everything
              localStorage.removeItem('token');
              localStorage.removeItem('refreshToken');
              setToken(null);
              setUser(null);
            }
          } else {
            // If no refresh token, clear everything
            localStorage.removeItem('token');
            setToken(null);
            setUser(null);
          }
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const { token, refreshToken, user } = await AuthService.login(email, password);
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);
    setToken(token);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
