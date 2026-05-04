import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AppData } from '../types';
import { loadData, saveData } from '../utils/storage';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  data: AppData;
  updateData: (newData: Partial<AppData>) => void;
  refreshData: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [data, setData] = useState<AppData>(() => loadData());
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('isac_current_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error loading user:', error);
        localStorage.removeItem('isac_current_user');
      }
    }
    setIsInitialized(true);
  }, []);

  const login = (username: string, password: string): boolean => {
    const foundUser = data.users.find(
      u => u.username === username && u.password === password
    );

    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('isac_current_user', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('isac_current_user');
  };

  const updateData = (newData: Partial<AppData>) => {
    const updatedData = { ...data, ...newData };
    setData(updatedData);
    saveData(updatedData);
  };

  const refreshData = () => {
    setData(loadData());
  };

  if (!isInitialized) {
    return <div>Carregando...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, data, updateData, refreshData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};