import React, { useState, useCallback, createContext, useContext } from 'react';
import Notification from '../components/Notification';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState({ message: null, type: 'info' });

  const showNotification = useCallback((message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification({ message: null, type: 'info' });
    }, 3000);
  }, []);

  const hideNotification = () => setNotification({ message: null, type: 'info' });

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      <Notification message={notification.message} type={notification.type} onClose={hideNotification} />
