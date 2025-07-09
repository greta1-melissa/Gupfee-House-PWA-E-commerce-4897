import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SafeIcon from '../../components/common/SafeIcon';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { orderService } from '../../services/orderService';
import * as FiIcons from 'react-icons/fi';

const { 
  FiShoppingBag, FiPackage, FiTruck, FiCheck, FiX, 
  FiSearch, FiFilter, FiArrowLeft, FiEye
} = FiIcons;

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'detail'
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [orderUpdating, setOrderUpdating] = useState(false);
  const [statusNote, setStatusNote] = useState('');

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      try {
        const orderData = await orderService.getAdminOrders();
        setOrders(orderData);
      } catch (err) {
        console.error('Error loading orders:', err);
        setError(err.message || 'Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

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

  const handleUpdateOrderStatus = async (newStatus) => {
    if (!selectedOrder) return;
    
    setOrderUpdating(true);
    try {
      const result = await orderService.updateOrderStatus(
        selectedOrder.id, 
        newStatus, 
        statusNote || `Status updated to ${newStatus}`
      );
      
      if (result.success) {
        // Update local state
        setSelectedOrder({
          ...selectedOrder,
          status: newStatus,
          order_history: [
            ...(selectedOrder.order_history || []),
            {
              status: newStatus,
              notes: statusNote || `Status updated to ${newStatus}`,
              created_at: new Date().toISOString()
            }
          ]
        });
        
        // Update order in the list
        setOrders(orders.map(order => 
          order.id === selectedOrder.id 
            ? { ...order, status: newStatus } 
            : order
        ));
        
        // Clear the note field
        setStatusNote('');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    } finally {
      setOrderUpdating(false);
    }
  };

  // Filter and search
  const filteredOrders = orders.filter(order => {
    // Filter by status
    if (filterStatus !== 'all' && order.status !== filterStatus) {
      return false;
    }
    
    // Search by order number or customer name
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesOrderNumber = order.order_number.toLowerCase().includes(searchLower);
      const matchesCustomerName = order.shipping_address?.full_name?.toLowerCase().includes(searchLower);
      
      return matchesOrderNumber || matchesCustomerName;
    }
    
    return true;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <SafeIcon icon={FiShoppingBag} className="w-5 h-5 text-yellow-500" />;
      case 'processing':
        return <SafeIcon icon={FiPackage} className="w-5 h-5 text-blue-500" />;
      case 'shipped':
        return <SafeIcon icon={FiTruck} className="w-5 h-5 text-purple-500" />;
      case 'delivered':
        return <SafeIcon icon={FiCheck} className="w-5 h-5 text-green-500" />;
      case 'cancelled':
        return <SafeIcon icon={FiX} className="w-5 h-5 text-red-500" />;
      default:
        return <SafeIcon icon={FiShoppingBag} className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex justify-center items-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {viewMode === 'list' ? (
            // Order List View
            <motion.div
              key="admin-order-list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
              </div>

              {/* Filters and Search */}
              <div className="bg-white rounded-xl shadow-soft p-4 mb-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <SafeIcon icon={FiSearch} className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      placeholder="Search orders by number or customer name"
                    />
                  </div>
                  
                  <div className="flex items-center">
                    <SafeIcon icon={FiFilter} className="mr-2 h-5 w-5 text-gray-400" />
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                    >
                      <option value="all">All Statuses</option>
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                  {error}
                </div>
              )}

              <div className="bg-white rounded-xl shadow-soft overflow-hidden">
                <div className="flex flex-col">
                  <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Order
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Date
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Customer
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Total
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Items
                            </th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {filteredOrders.length === 0 ? (
                            <tr>
                              <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                                No orders found matching your criteria
                              </td>
                            </tr>
                          ) : (
                            filteredOrders.map((order) => (
                              <tr 
                                key={order.id}
                                className="hover:bg-gray-50 transition-colors cursor-pointer"
                                onClick={() => handleOrderSelect(order)}
                              >
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {order.order_number}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {formatDate(order.created_at)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {order.shipping_address?.full_name || 'N/A'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                    {getStatusIcon(order.status)}
                                    <span className="ml-1 capitalize">{order.status}</span>
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  ${parseFloat(order.total).toFixed(2)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {order.order_items?.length || 0}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleOrderSelect(order);
                                    }}
                                    className="text-primary-600 hover:text-primary-900 mr-3"
                                  >
                                    <SafeIcon icon={FiEye} className="w-5 h-5" />
                                  </button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            // Order Detail View  
            <motion.div
              key="admin-order-detail"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <button
                onClick={() => setViewMode('list')}
                className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-2 font-medium"
              >
                <SafeIcon icon={FiArrowLeft} className="w-4 h-4 mr-2" />
                Back to Orders
              </button>

              <div className="bg-white rounded-xl shadow-soft p-6">
                <h1 className="text-xl font-semibold text-gray-900 mb-4">
                  Order #{selectedOrder?.order_number}
                </h1>
                
                {/* Status Update Form */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Update Order Status</h2>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="status-note" className="block text-sm font-medium text-gray-700 mb-1">
                        Status Note
                      </label>
                      <textarea
                        id="status-note"
                        value={statusNote}
                        onChange={(e) => setStatusNote(e.target.value)}
                        rows="2"
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        placeholder="Add a note about this status update (optional)"
                      />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleUpdateOrderStatus('processing')}
                        disabled={orderUpdating || selectedOrder?.status === 'processing'}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 disabled:opacity-50"
                      >
                        <SafeIcon icon={FiPackage} className="w-4 h-4 mr-1" />
                        Mark as Processing
                      </button>
                      
                      <button
                        onClick={() => handleUpdateOrderStatus('shipped')}
                        disabled={orderUpdating || selectedOrder?.status === 'shipped'}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-purple-700 bg-purple-100 hover:bg-purple-200 disabled:opacity-50"
                      >
                        <SafeIcon icon={FiTruck} className="w-4 h-4 mr-1" />
                        Mark as Shipped
                      </button>
                      
                      <button
                        onClick={() => handleUpdateOrderStatus('delivered')}
                        disabled={orderUpdating || selectedOrder?.status === 'delivered'}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 disabled:opacity-50"
                      >
                        <SafeIcon icon={FiCheck} className="w-4 h-4 mr-1" />
                        Mark as Delivered
                      </button>
                    </div>
                  </div>
                </div>

                {/* Order Details */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedOrder?.status)}`}>
                        {getStatusIcon(selectedOrder?.status)}
                        <span className="ml-1 capitalize">{selectedOrder?.status}</span>
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total</p>
                      <p className="text-lg font-semibold">${parseFloat(selectedOrder?.total || 0).toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminOrders;