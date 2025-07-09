import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Logo from '../components/common/Logo';

const CheckoutPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
              <Logo size="lg" showText={true} textSize="xl" />
            </Link>
          </div>
        </div>
      </header>

      {/* Checkout Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm p-8"
        >
          <h1 className="text-2xl font-bold text-gray-900 mb-8">Checkout</h1>
          <p className="text-gray-600">Checkout functionality will be implemented here.</p>
          <Link
            to="/cart"
            className="mt-6 inline-block bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Back to Cart
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default CheckoutPage;