import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SafeIcon from '../components/common/SafeIcon';
import Logo from '../components/common/Logo';
import * as FiIcons from 'react-icons/fi';

const { FiArrowLeft } = FiIcons;

const BlogPostPage = () => {
  const { slug } = useParams();
  
  const post = {
    title: 'Complete Guide to Betta Fish Care',
    content: 'This is where the full blog post content would go...',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=400&fit=crop',
    date: '2024-01-15',
    author: 'Gupfee House Team'
  };

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

      {/* Post Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          to="/blog"
          className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6"
        >
          <SafeIcon icon={FiArrowLeft} className="w-4 h-4 mr-2" />
          Back to Blog
        </Link>

        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm overflow-hidden"
        >
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-96 object-cover"
          />
          <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{post.title}</h1>
            <div className="text-gray-600 mb-8">
              By {post.author} • {post.date}
            </div>
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed">{post.content}</p>
            </div>
          </div>
        </motion.article>
      </div>
    </div>
  );
};

export default BlogPostPage;