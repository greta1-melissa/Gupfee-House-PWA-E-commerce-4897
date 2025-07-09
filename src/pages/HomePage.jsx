import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SafeIcon from '../components/common/SafeIcon';
import Header from '../components/layout/Header';
import Logo from '../components/common/Logo';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ContactSection from '../components/home/ContactSection';
import ReviewsCarousel from '../components/home/ReviewsCarousel';
import { productService } from '../services/productService';
import { useCart } from '../contexts/CartContext';
import * as FiIcons from 'react-icons/fi';

const { FiStar, FiTrendingUp, FiShield, FiTruck, FiHeart, FiLock, FiCheck } = FiIcons;

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addItem, isInCart } = useCart();

  useEffect(() => {
    const loadFeaturedProducts = async () => {
      try {
        setLoading(true);
        const products = await productService.getFeaturedProducts();
        setFeaturedProducts(products);
      } catch (err) {
        console.error('Error loading featured products:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedProducts();
  }, []);

  const handleAddToCart = async (product) => {
    try {
      await addItem(product);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const features = [
    {
      icon: FiShield,
      title: 'Premium Quality',
      description: 'Hand-selected healthy fish and top-quality supplies for your aquarium',
      color: 'primary'
    },
    {
      icon: FiTrendingUp,
      title: 'Expert Care',
      description: 'Professional guidance and care tips from aquarium specialists',
      color: 'secondary'
    },
    {
      icon: FiTruck,
      title: 'Fast Delivery',
      description: 'Quick and safe delivery with live arrival guarantee',
      color: 'accent'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="relative bg-primary-600 text-white overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black/10"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Premium Betta Fish &<br />
                <span className="text-primary-200">Aquarium Supplies</span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
                Discover our collection of beautiful betta fish, guppies, and premium 
                aquarium supplies for your aquatic paradise
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                to="/products"
                className="bg-white text-primary-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Shop Now
              </Link>
              <Link
                to="/blog"
                className="border-2 border-white/30 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
              >
                Learn More
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Featured Products
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Discover our most popular and highest-rated aquarium products
              </p>
            </motion.div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <LoadingSpinner size="lg" />
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-600 mb-4">Error loading products: {error}</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group bg-white rounded-2xl shadow-soft overflow-hidden hover:shadow-brand-lg transition-all duration-300 hover:-translate-y-2 border border-gray-100"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {product.badge && (
                      <div className="absolute top-4 left-4">
                        <span className="bg-secondary-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                          {product.badge}
                        </span>
                      </div>
                    )}
                    <div className="absolute top-4 right-4">
                      <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-all duration-200 hover:scale-110">
                        <SafeIcon icon={FiHeart} className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                      <Link to={`/products/${product.id}`}>{product.name}</Link>
                    </h3>
                    <div className="flex items-center mb-4">
                      <div className="flex text-secondary-500">
                        {[...Array(5)].map((_, i) => (
                          <SafeIcon
                            key={i}
                            icon={FiStar}
                            className={`w-4 h-4 ${
                              i < Math.floor(product.rating)
                                ? 'text-secondary-500'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-gray-600 text-sm ml-2">
                        ({product.reviews_count} reviews)
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary-600">
                        ${product.price}
                      </span>
                      <button
                        onClick={() => handleAddToCart(product)}
                        className={`${
                          isInCart(product.id)
                            ? 'bg-green-600 hover:bg-green-700'
                            : 'bg-gradient-brand hover:bg-gradient-brand-dark'
                        } text-white px-6 py-2 rounded-xl font-medium transition-all duration-200 shadow-brand hover:shadow-brand-lg transform hover:-translate-y-1 flex items-center space-x-2`}
                      >
                        <SafeIcon
                          icon={isInCart(product.id) ? FiCheck : FiStar}
                          className="w-4 h-4"
                        />
                        <span>{isInCart(product.id) ? 'Added' : 'Add to Cart'}</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gradient-to-br from-primary-50 to-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Why Choose Gupfee House?
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                We provide the best care and quality for your aquatic friends
              </p>
            </motion.div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center bg-white rounded-2xl p-8 shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1 border border-gray-100"
              >
                <div
                  className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 ${
                    feature.color === 'primary'
                      ? 'bg-primary-100 text-primary-600'
                      : feature.color === 'secondary'
                      ? 'bg-secondary-100 text-secondary-600'
                      : 'bg-accent-100 text-accent-600'
                  }`}
                >
                  <SafeIcon icon={feature.icon} className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Carousel */}
      <ReviewsCarousel />

      {/* Contact Section */}
      <ContactSection />

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="mb-6">
                <Logo size="lg" showText={true} textSize="xl" className="mb-4" />
              </div>
              <p className="text-gray-400 leading-relaxed">
                Your trusted source for premium betta fish, guppies, and aquarium supplies.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
              <ul className="space-y-3">
                <li>
                  <Link
                    to="/products"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Products
                  </Link>
                </li>
                <li>
                  <Link
                    to="/cart"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Cart
                  </Link>
                </li>
                <li>
                  <Link
                    to="/wishlist"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Wishlist
                  </Link>
                </li>
                <li>
                  <Link
                    to="/orders"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Orders
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-6">Support</h4>
              <ul className="space-y-3">
                <li>
                  <Link
                    to="/contact"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Shipping Info
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Returns
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-6">Learn</h4>
              <ul className="space-y-3">
                <li>
                  <Link
                    to="/blog"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Fish Care Blog
                  </Link>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Care Guides
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Tips & Tricks
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Community
                  </a>
                </li>
                <li>
                  <Link
                    to="/admin/login"
                    className="flex items-center text-gray-400 hover:text-white transition-colors group"
                  >
                    <SafeIcon
                      icon={FiLock}
                      className="w-4 h-4 mr-2 group-hover:text-primary-300 transition-colors"
                    />
                    <span>Admin Access</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 Gupfee House. All rights reserved. | Private Application
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;