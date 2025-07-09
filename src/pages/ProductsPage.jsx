import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SafeIcon from '../components/common/SafeIcon';
import Header from '../components/layout/Header';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { productService } from '../services/productService';
import * as FiIcons from 'react-icons/fi';

const { FiFilter, FiGrid, FiList, FiHeart, FiShoppingCart, FiStar } = FiIcons;

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const allProducts = await productService.getAllProducts();
        setProducts(allProducts);
      } catch (err) {
        console.error('Error loading products:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const categories = [
    { id: 'all', name: 'All Products', count: products.length },
    { id: 'fish', name: 'Fish', count: products.filter(p => p.category === 'fish').length },
    { id: 'equipment', name: 'Equipment', count: products.filter(p => p.category === 'equipment').length },
    { id: 'food', name: 'Food', count: products.filter(p => p.category === 'food').length },
    { id: 'accessories', name: 'Accessories', count: products.filter(p => p.category === 'accessories').length }
  ];

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header cartCount={0} />

      {/* Page Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Our Products</h1>
          <p className="text-gray-600">Discover our premium collection of fish and aquarium supplies</p>
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
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <div className="lg:w-1/4">
              <div className="bg-white rounded-2xl shadow-soft p-6 sticky top-24">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
                <ul className="space-y-2">
                  {categories.map(category => (
                    <li key={category.id}>
                      <button
                        onClick={() => setSelectedCategory(category.id)}
                        className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 flex items-center justify-between ${
                          selectedCategory === category.id
                            ? 'bg-gradient-brand text-white shadow-brand'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <span>{category.name}</span>
                        <span className={`text-sm px-2 py-1 rounded-full ${
                          selectedCategory === category.id
                            ? 'bg-white/20 text-white'
                            : 'bg-gray-100 text-gray-500'
                        }`}>
                          {category.count}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:w-3/4">
              {/* Toolbar */}
              <div className="bg-white rounded-2xl shadow-soft p-4 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <SafeIcon icon={FiFilter} className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-600 font-medium">
                      {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
                    </span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-lg transition-all duration-200 ${
                          viewMode === 'grid'
                            ? 'bg-primary-100 text-primary-600'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <SafeIcon icon={FiGrid} className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-lg transition-all duration-200 ${
                          viewMode === 'list'
                            ? 'bg-primary-100 text-primary-600'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <SafeIcon icon={FiList} className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Products Grid */}
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`group bg-white rounded-2xl shadow-soft overflow-hidden hover:shadow-brand-lg transition-all duration-300 hover:-translate-y-1 ${
                      viewMode === 'list' ? 'flex' : ''
                    }`}
                  >
                    <div className={`relative ${viewMode === 'list' ? 'w-1/3' : ''}`}>
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className={`object-cover group-hover:scale-110 transition-transform duration-500 ${
                          viewMode === 'list' ? 'w-full h-full' : 'w-full h-64'
                        }`}
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
                    <div className={`p-6 ${viewMode === 'list' ? 'w-2/3 flex flex-col justify-between' : ''}`}>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                          <Link to={`/products/${product.id}`}>
                            {product.name}
                          </Link>
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
                        {viewMode === 'list' && (
                          <p className="text-gray-600 text-sm mb-4">
                            {product.description}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-primary-600">
                          ${product.price}
                        </span>
                        <button className="bg-gradient-brand text-white px-6 py-2 rounded-xl font-medium hover:bg-gradient-brand-dark transition-all duration-200 shadow-brand hover:shadow-brand-lg transform hover:-translate-y-1 flex items-center space-x-2">
                          <SafeIcon icon={FiShoppingCart} className="w-4 h-4" />
                          <span>Add to Cart</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;