import React, { createContext, useState, ReactNode } from 'react';

interface NotificationContextType {
  message: string | null;
  setMessage: (msg: string | null) => void;
}

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [message, setMessage] = useState<string | null>(null);

  return <NotificationContext.Provider value={{ message, setMessage }}>{children}</NotificationContext.Provider>;
};
