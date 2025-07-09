import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePWA } from '../../contexts/PWAContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiRefreshCw, FiX } = FiIcons;

const PWAUpdateNotification = () => {
  const { updateAvailable, updateApp } = usePWA();
  const [isVisible, setIsVisible] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      const success = await updateApp();
      if (success) {
        // Reload the page to get the new version
        window.location.reload();
      }
    } catch (error) {
      console.error('Update failed:', error);
      setIsUpdating(false);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
  };

  if (!updateAvailable || !isVisible) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -100 }}
        className="fixed top-4 right-4 left-4 md:left-auto md:w-80 bg-success-600 text-white rounded-lg shadow-2xl p-4 z-50"
      >
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <SafeIcon icon={FiRefreshCw} className="w-4 h-4 text-white" />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium mb-1">
              Update Available
            </h3>
            <p className="text-sm text-white text-opacity-90 mb-3">
              A new version of Gupfee House is available. Update now to get the latest features and improvements.
            </p>
            
            <div className="flex space-x-2">
              <button
                onClick={handleUpdate}
                disabled={isUpdating}
                className="flex items-center space-x-2 bg-white text-success-600 px-3 py-1.5 rounded-md text-sm font-medium hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <SafeIcon 
                  icon={FiRefreshCw} 
                  className={`w-4 h-4 ${isUpdating ? 'animate-spin' : ''}`} 
                />
                <span>{isUpdating ? 'Updating...' : 'Update Now'}</span>
              </button>
              
              <button
                onClick={handleDismiss}
                className="px-3 py-1.5 text-sm font-medium text-white text-opacity-90 hover:text-white transition-colors"
              >
                Later
              </button>
            </div>
          </div>
          
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 p-1 text-white text-opacity-70 hover:text-white transition-colors"
          >
            <SafeIcon icon={FiX} className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PWAUpdateNotification;