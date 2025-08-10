import { createContext, useState, type ReactNode } from 'react';
import type { IUserSession } from '../interfaces/Session';
import type { ISessionContext } from '../interfaces/Contexts';
import { useNavigate } from 'react-router';

export const SessionContext = createContext<ISessionContext | undefined>(undefined);

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IUserSession | null>(null);
  const navigate = useNavigate();

  const login = (userData: IUserSession) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
    navigate('/');
  };

  const getUserSession = () => {
    return user;
  }

  const validateSession = () => {
    if (user == null) {
      navigate('/');
    }
  }

  return (
    <SessionContext.Provider value={{ user, login, logout, getUserSession, validateSession }}>
      {children}
    </SessionContext.Provider>
  );
};