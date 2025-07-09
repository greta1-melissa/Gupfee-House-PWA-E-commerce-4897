import React from 'react';
import { motion } from 'framer-motion';

const AdminOrders = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm p-8"
        >
          <h1 className="text-2xl font-bold text-gray-900 mb-8">Order Management</h1>
          <p className="text-gray-600">Manage customer orders here.</p>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminOrders;