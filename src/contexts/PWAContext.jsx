import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { pwaService } from '../services/pwaService';

const PWAContext = createContext();

const pwaReducer = (state, action) => {
  switch (action.type) {
    case 'SET_INSTALLABLE':
      return { ...state, isInstallable: action.payload };
    case 'SET_INSTALLED':
      return { ...state, isInstalled: action.payload };
    case 'SET_ONLINE':
      return { ...state, isOnline: action.payload };
    case 'SET_UPDATE_AVAILABLE':
      return { ...state, updateAvailable: action.payload };
    case 'SET_INSTALL_PROMPT':
      return { ...state, deferredPrompt: action.payload };
    case 'SET_NOTIFICATION_PERMISSION':
      return { ...state, notificationPermission: action.payload };
    default:
      return state;
  }
};

const initialState = {
  isInstallable: false,
  isInstalled: false,
  isOnline: navigator.onLine,
  updateAvailable: false,
  deferredPrompt: null,
  notificationPermission: 'default',
};

export const PWAProvider = ({ children }) => {
  const [state, dispatch] = useReducer(pwaReducer, initialState);

  useEffect(() => {
    const initializePWA = async () => {
      // Check if app is installed
      const isInstalled = await pwaService.isInstalled();
      dispatch({ type: 'SET_INSTALLED', payload: isInstalled });

      // Check notification permission
      const permission = await pwaService.getNotificationPermission();
      dispatch({ type: 'SET_NOTIFICATION_PERMISSION', payload: permission });

      // Listen for install prompt
      const handleBeforeInstallPrompt = (e) => {
        e.preventDefault();
        dispatch({ type: 'SET_INSTALLABLE', payload: true });
        dispatch({ type: 'SET_INSTALL_PROMPT', payload: e });
      };

      // Listen for app installed
      const handleAppInstalled = () => {
        dispatch({ type: 'SET_INSTALLED', payload: true });
        dispatch({ type: 'SET_INSTALLABLE', payload: false });
        dispatch({ type: 'SET_INSTALL_PROMPT', payload: null });
      };

      // Listen for online/offline status
      const handleOnline = () => dispatch({ type: 'SET_ONLINE', payload: true });
      const handleOffline = () => dispatch({ type: 'SET_ONLINE', payload: false });

      // Listen for service worker updates
      const handleSWUpdate = () => {
        dispatch({ type: 'SET_UPDATE_AVAILABLE', payload: true });
      };

      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.addEventListener('appinstalled', handleAppInstalled);
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
      window.addEventListener('swUpdate', handleSWUpdate);

      return () => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.removeEventListener('appinstalled', handleAppInstalled);
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
        window.removeEventListener('swUpdate', handleSWUpdate);
      };
    };

    initializePWA();
  }, []);

  const installApp = async () => {
    if (!state.deferredPrompt) return false;

    try {
      const result = await pwaService.installApp(state.deferredPrompt);
      if (result) {
        dispatch({ type: 'SET_INSTALLABLE', payload: false });
        dispatch({ type: 'SET_INSTALL_PROMPT', payload: null });
      }
      return result;
    } catch (error) {
      console.error('Installation failed:', error);
      return false;
    }
  };

  const requestNotificationPermission = async () => {
    try {
      const permission = await pwaService.requestNotificationPermission();
      dispatch({ type: 'SET_NOTIFICATION_PERMISSION', payload: permission });
      return permission;
    } catch (error) {
      console.error('Notification permission request failed:', error);
      return 'denied';
    }
  };

  const sendNotification = async (title, options = {}) => {
    try {
      return await pwaService.sendNotification(title, options);
    } catch (error) {
      console.error('Failed to send notification:', error);
      return false;
    }
  };

  const updateApp = async () => {
    try {
      const result = await pwaService.updateApp();
      if (result) {
        dispatch({ type: 'SET_UPDATE_AVAILABLE', payload: false });
      }
      return result;
    } catch (error) {
      console.error('App update failed:', error);
      return false;
    }
  };

  const subscribeToNotifications = async () => {
    try {
      return await pwaService.subscribeToNotifications();
    } catch (error) {
      console.error('Failed to subscribe to notifications:', error);
      return null;
    }
  };

  const unsubscribeFromNotifications = async () => {
    try {
      return await pwaService.unsubscribeFromNotifications();
    } catch (error) {
      console.error('Failed to unsubscribe from notifications:', error);
      return false;
    }
  };

  const value = {
    ...state,
    installApp,
    requestNotificationPermission,
    sendNotification,
    updateApp,
    subscribeToNotifications,
    unsubscribeFromNotifications,
  };

  return (
    <PWAContext.Provider value={value}>
      {children}
    </PWAContext.Provider>
  );
};

export const usePWA = () => {
  const context = useContext(PWAContext);
  if (!context) {
    throw new Error('usePWA must be used within a PWAProvider');
  }
  return context;
};