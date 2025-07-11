import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/layout/Layout';

const ProfilePage = () => {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm p-8"
        >
          <h1 className="text-2xl font-bold text-gray-900 mb-8">My Profile</h1>
          <p className="text-gray-600">Profile management will be implemented here.</p>
        </motion.div>
      </div>
    </Layout>
  );
};

export default ProfilePage;