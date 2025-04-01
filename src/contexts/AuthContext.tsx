
import React, { createContext, useState, useContext, useEffect } from 'react';

type User = {
  id: string;
  email: string;
  name: string;
  role: 'creator' | 'visitor';
};

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: async () => false,
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Check for existing session on load
  useEffect(() => {
    const savedUser = localStorage.getItem('intentSim_user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Failed to parse user data', error);
        localStorage.removeItem('intentSim_user');
      }
    }
  }, []);

  // For a simple implementation, we'll use a mock login
  // In a real app, this would connect to a backend authentication service
  const login = async (email: string, password: string): Promise<boolean> => {
    // This is a mock authentication - replace with real auth in production
    if ((email === 'creator@intentsim.org' && password === 'creator123') || 
        (email === 'thevoidintent@intentsim.org' && password === 'intentsim')) {
      const userData: User = {
        id: '1',
        email,
        name: email === 'thevoidintent@intentsim.org' ? 'TheVoidIntent' : 'IntentSim Creator',
        role: 'creator',
      };
      
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('intentSim_user', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('intentSim_user');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
