import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePWA } from '../../contexts/PWAContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiWifiOff, FiWifi } = FiIcons;

const OfflineIndicator = () => {
  const { isOnline } = usePWA();

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-0 left-0 right-0 bg-red-600 text-white px-4 py-2 text-center text-sm font-medium z-50"
        >
          <div className="flex items-center justify-center space-x-2">
            <SafeIcon icon={FiWifiOff} className="w-4 h-4" />
            <span>You're offline. Some features may not be available.</span>
          </div>
        </motion.div>
      )}
      
      {isOnline && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-0 left-0 right-0 bg-green-600 text-white px-4 py-2 text-center text-sm font-medium z-50"
          style={{ display: 'none' }} // Only show when coming back online
        >
          <div className="flex items-center justify-center space-x-2">
            <SafeIcon icon={FiWifi} className="w-4 h-4" />
            <span>You're back online!</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OfflineIndicator;