import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SafeIcon from '../components/common/SafeIcon';
import Layout from '../components/layout/Layout';
import { useCart } from '../contexts/CartContext';
import * as FiIcons from 'react-icons/fi';

const { FiTrash2, FiPlus, FiMinus, FiShoppingBag } = FiIcons;

const CartPage = () => {
  const { items, removeItem, updateQuantity, getCartTotal } = useCart();
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    setCartItems(items);
  }, [items]);

  const handleQuantityChange = (itemId, change) => {
    const item = cartItems.find(item => item.id === itemId);
    if (item) {
      const newQuantity = item.quantity + change;
      if (newQuantity >= 1 && newQuantity <= (item.stock || 999)) {
        updateQuantity(itemId, newQuantity);
      }
    }
  };

  const handleRemoveItem = (itemId) => {
    removeItem(itemId);
  };

  const subtotal = getCartTotal();
  const shipping = subtotal > 0 ? 5.99 : 0;
  const total = subtotal + shipping;

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm">
              {cartItems.length === 0 ? (
                <div className="p-8 text-center">
                  <SafeIcon icon={FiShoppingBag} className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
                  <p className="text-gray-600 mb-6">Add some products to get started!</p>
                  <Link
                    to="/products"
                    className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Shop Now
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {cartItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-6 flex items-center space-x-4"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                        <p className="text-primary-600 font-semibold">${item.price}</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <button
                          className="p-1 text-gray-400 hover:text-gray-600"
                          onClick={() => handleQuantityChange(item.id, -1)}
                        >
                          <SafeIcon icon={FiMinus} className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          className="p-1 text-gray-400 hover:text-gray-600"
                          onClick={() => handleQuantityChange(item.id, 1)}
                        >
                          <SafeIcon icon={FiPlus} className="w-4 h-4" />
                        </button>
                      </div>
                      <button
                        className="p-2 text-red-500 hover:text-red-700"
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        <SafeIcon icon={FiTrash2} className="w-5 h-5" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          {cartItems.length > 0 && (
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-lg shadow-sm p-6"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">${shipping.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold">Total</span>
                      <span className="text-lg font-semibold text-primary-600">
                        ${total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
                <Link
                  to="/checkout"
                  className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors text-center block"
                >
                  Proceed to Checkout
                </Link>
                <Link
                  to="/products"
                  className="w-full mt-3 border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors text-center block"
                >
                  Continue Shopping
                </Link>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;