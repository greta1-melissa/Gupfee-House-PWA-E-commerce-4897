import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { adminService } from '../services/adminService';
import { storageService } from '../services/storageService';

const AdminContext = createContext();

const adminReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, loading: true, error: null };
    case 'LOGIN_SUCCESS':
      return { ...state, loading: false, admin: action.payload, isAuthenticated: true };
    case 'LOGIN_FAILURE':
      return { ...state, loading: false, error: action.payload };
    case 'LOGOUT':
      return { ...state, admin: null, isAuthenticated: false };
    case 'UPDATE_PROFILE':
      return { ...state, admin: { ...state.admin, ...action.payload } };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

const initialState = {
  admin: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

export const AdminProvider = ({ children }) => {
  const [state, dispatch] = useReducer(adminReducer, initialState);

  useEffect(() => {
    const initializeAdmin = async () => {
      try {
        const token = storageService.getAdminToken();
        if (token) {
          const admin = await adminService.verifyToken(token);
          if (admin) {
            dispatch({ type: 'LOGIN_SUCCESS', payload: admin });
          } else {
            storageService.removeAdminToken();
          }
        }
      } catch (error) {
        console.error('Admin initialization error:', error);
        storageService.removeAdminToken();
      }
    };

    initializeAdmin();
  }, []);

  const login = async (credentials) => {
    try {
      dispatch({ type: 'LOGIN_START' });
      const response = await adminService.login(credentials);
      storageService.setAdminToken(response.token);
      dispatch({ type: 'LOGIN_SUCCESS', payload: response.admin });
      return response;
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE', payload: error.message });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await adminService.logout();
      storageService.removeAdminToken();
      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      console.error('Admin logout error:', error);
      storageService.removeAdminToken();
      dispatch({ type: 'LOGOUT' });
    }
  };

  const updateProfile = async (profileData) => {
    const updatedAdmin = await adminService.updateProfile(profileData);
    dispatch({ type: 'UPDATE_PROFILE', payload: updatedAdmin });
    return updatedAdmin;
  };

  const changePassword = async (currentPassword, newPassword) => {
    return await adminService.changePassword(currentPassword, newPassword);
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value = {
    ...state,
    login,
    logout,
    updateProfile,
    changePassword,
    clearError,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};