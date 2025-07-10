import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import SafeIcon from '../components/common/SafeIcon';
import Layout from '../components/layout/Layout';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { orderService } from '../services/orderService';
import * as FiIcons from 'react-icons/fi';

const { FiShoppingBag, FiPackage, FiTruck, FiCheck, FiX, FiChevronRight, FiCalendar, FiClock, FiArrowLeft } = FiIcons;

const OrdersPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'detail'

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/orders' } });
      return;
    }

    const loadOrders = async () => {
      setLoading(true);
      try {
        const orderData = await orderService.getOrders();
        setOrders(orderData);
      } catch (err) {
        console.error('Error loading orders:', err);
        setError(err.message || 'Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [isAuthenticated, navigate]);

  const handleOrderSelect = async (order) => {
    try {
      setLoading(true);
      const orderDetails = await orderService.getOrderById(order.id);
      setSelectedOrder(orderDetails);
      setViewMode('detail');
    } catch (err) {
      console.error('Error loading order details:', err);
      // If there's an error, use the basic order info we already have
      setSelectedOrder(order);
      setViewMode('detail');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <SafeIcon icon={FiClock} className="w-5 h-5 text-yellow-500" />;
      case 'processing': return <SafeIcon icon={FiPackage} className="w-5 h-5 text-blue-500" />;
      case 'shipped': return <SafeIcon icon={FiTruck} className="w-5 h-5 text-purple-500" />;
      case 'delivered': return <SafeIcon icon={FiCheck} className="w-5 h-5 text-green-500" />;
      case 'cancelled': return <SafeIcon icon={FiX} className="w-5 h-5 text-red-500" />;
      default: return <SafeIcon icon={FiClock} className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {viewMode === 'list' ? (
            // Order List View
            <motion.div
              key="order-list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
                <Link to="/products" className="text-primary-600 hover:text-primary-700 font-medium">
                  Continue Shopping
                </Link>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                  {error}
                </div>
              )}

              {orders.length === 0 ? (
                <div className="bg-white rounded-xl shadow-soft p-8 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <SafeIcon icon={FiShoppingBag} className="w-8 h-8 text-gray-500" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">No Orders Yet</h2>
                  <p className="text-gray-600 mb-6">
                    You haven't placed any orders yet. Start shopping to place your first order!
                  </p>
                  <Link
                    to="/products"
                    className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Browse Products
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <motion.div
                      key={order.id}
                      className="bg-white rounded-xl shadow-soft overflow-hidden hover:shadow-medium transition-shadow cursor-pointer"
                      whileHover={{ y: -2 }}
                      onClick={() => handleOrderSelect(order)}
                    >
                      <div className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                          <div>
                            <p className="text-sm text-gray-500">Order #{order.order_number}</p>
                            <p className="text-sm text-gray-500">
                              <SafeIcon icon={FiCalendar} className="inline w-4 h-4 mr-1" />
                              {formatDate(order.created_at)}
                            </p>
                          </div>
                          <div className="mt-2 md:mt-0 flex items-center">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                              {getStatusIcon(order.status)}
                              <span className="ml-1 capitalize">{order.status}</span>
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col md:flex-row md:items-center justify-between">
                          <div className="flex items-center mb-4 md:mb-0">
                            <div className="flex -space-x-2 overflow-hidden mr-4">
                              {/* Show up to 3 product images */}
                              {order.order_items?.slice(0, 3).map((item, index) => (
                                <div key={index} className="inline-block h-10 w-10 rounded-full ring-2 ring-white overflow-hidden">
                                  <img
                                    src={item.product_image}
                                    alt={item.product_name}
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                              ))}
                              {/* If there are more items than shown */}
                              {order.order_items?.length > 3 && (
                                <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 ring-2 ring-white">
                                  <span className="text-xs font-medium text-gray-500">
                                    +{order.order_items.length - 3}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {order.order_items?.length || 0} {(order.order_items?.length || 0) === 1 ? 'item' : 'items'}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between md:justify-end w-full md:w-auto">
                            <div className="md:mr-8">
                              <p className="text-sm text-gray-500">Total</p>
                              <p className="text-lg font-semibold text-gray-900">${order.total.toFixed(2)}</p>
                            </div>
                            <SafeIcon icon={FiChevronRight} className="w-5 h-5 text-gray-400" />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            // Order Detail View
            <motion.div
              key="order-detail"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <button
                onClick={() => setViewMode('list')}
                className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6 font-medium"
              >
                <SafeIcon icon={FiArrowLeft} className="w-4 h-4 mr-2" />
                Back to Orders
              </button>

              <div className="bg-white rounded-xl shadow-soft overflow-hidden">
                {/* Order header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <h1 className="text-xl font-semibold text-gray-900">Order #{selectedOrder.order_number}</h1>
                      <p className="text-sm text-gray-500 flex items-center mt-1">
                        <SafeIcon icon={FiCalendar} className="w-4 h-4 mr-1" />
                        Placed on {formatDate(selectedOrder.created_at)}
                      </p>
                    </div>
                    <div className="mt-4 md:mt-0">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedOrder.status)}`}>
                        {getStatusIcon(selectedOrder.status)}
                        <span className="ml-1 capitalize">{selectedOrder.status}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Order progress */}
                {selectedOrder.order_history && (
                  <div className="p-6 border-b border-gray-200 bg-gray-50">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Order Progress</h2>
                    <div className="relative">
                      {/* Progress line */}
                      <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                      
                      {/* Progress steps */}
                      <div className="space-y-6">
                        {selectedOrder.order_history.map((history, index) => (
                          <div key={index} className="relative flex items-start">
                            <div className={`absolute left-6 top-5 -ml-px h-full w-0.5 ${index === selectedOrder.order_history.length - 1 ? 'bg-transparent' : 'bg-gray-200'}`}></div>
                            <div className={`relative flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${getStatusColor(history.status)}`}>
                              {getStatusIcon(history.status)}
                            </div>
                            <div className="ml-4 min-w-0 flex-1">
                              <div className="text-sm font-medium text-gray-900 capitalize">{history.status}</div>
                              <div className="text-sm text-gray-500">{history.notes}</div>
                              <div className="mt-1 text-xs text-gray-500">{formatDate(history.created_at)}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Order items */}
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Items</h2>
                  <div className="divide-y divide-gray-200">
                    {selectedOrder.order_items?.map((item) => (
                      <div key={item.id || item.product_id} className="py-4 flex">
                        <div className="flex-shrink-0 w-20 h-20">
                          <img
                            src={item.product_image}
                            alt={item.product_name}
                            className="w-full h-full object-cover rounded-md"
                          />
                        </div>
                        <div className="ml-4 flex-1">
                          <div className="flex justify-between">
                            <div>
                              <h4 className="text-sm font-medium text-gray-900">{item.product_name}</h4>
                              <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-gray-900">
                                ${parseFloat(item.unit_price).toFixed(2)}
                              </p>
                              <p className="text-sm font-bold text-gray-900">
                                ${parseFloat(item.total_price).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping address */}
                {selectedOrder.shipping_address && (
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Shipping Information</h2>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="font-medium">{selectedOrder.shipping_address.full_name}</p>
                      <p className="text-gray-600 text-sm">{selectedOrder.shipping_address.address_line1}</p>
                      {selectedOrder.shipping_address.address_line2 && (
                        <p className="text-gray-600 text-sm">{selectedOrder.shipping_address.address_line2}</p>
                      )}
                      <p className="text-gray-600 text-sm">
                        {selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.state} {selectedOrder.shipping_address.postal_code}
                      </p>
                      <p className="text-gray-600 text-sm">{selectedOrder.shipping_address.country}</p>
                      {selectedOrder.shipping_address.phone && (
                        <p className="text-gray-600 text-sm">{selectedOrder.shipping_address.phone}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Payment information */}
                {selectedOrder.payment_details && (
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Payment Information</h2>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="font-medium capitalize">
                        {selectedOrder.payment_details.payment_method.replace('_', ' ')}
                      </p>
                      {selectedOrder.payment_details.transaction_data?.card_last4 && (
                        <p className="text-gray-600 text-sm">
                          {selectedOrder.payment_details.transaction_data.card_brand?.toUpperCase() || 'Card'} ending in {selectedOrder.payment_details.transaction_data.card_last4}
                        </p>
                      )}
                      <p className="text-gray-600 text-sm">
                        Status: <span className="capitalize">{selectedOrder.payment_details.status}</span>
                      </p>
                      <p className="text-gray-600 text-sm">
                        Transaction ID: {selectedOrder.payment_details.payment_id}
                      </p>
                    </div>
                  </div>
                )}

                {/* Order summary */}
                <div className="p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">${parseFloat(selectedOrder.subtotal).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-medium">${parseFloat(selectedOrder.shipping_cost).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax</span>
                      <span className="font-medium">${parseFloat(selectedOrder.tax).toFixed(2)}</span>
                    </div>
                    {parseFloat(selectedOrder.discount) > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Discount</span>
                        <span className="font-medium text-green-600">-${parseFloat(selectedOrder.discount).toFixed(2)}</span>
                      </div>
                    )}
                    <div className="border-t pt-3">
                      <div className="flex justify-between">
                        <span className="text-lg font-semibold">Total</span>
                        <span className="text-lg font-semibold text-primary-600">
                          ${parseFloat(selectedOrder.total).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                {selectedOrder.status !== 'cancelled' && selectedOrder.status !== 'delivered' && (
                  <div className="p-6 bg-gray-50 border-t border-gray-200">
                    <div className="flex justify-end space-x-4">
                      <Link
                        to="/support"
                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        Need Help?
                      </Link>
                      {selectedOrder.status === 'pending' && (
                        <button
                          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          onClick={() => {
                            // In a real app, this would open a confirmation dialog
                            // and then call orderService.cancelOrder(selectedOrder.id)
                            alert('In a real app, this would cancel your order.');
                          }}
                        >
                          Cancel Order
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
};

export default OrdersPage;