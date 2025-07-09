import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import SafeIcon from '../components/common/SafeIcon';
import Header from '../components/layout/Header';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { orderService } from '../services/orderService';
import { paymentService } from '../services/paymentService';
import toast from 'react-hot-toast';
import * as FiIcons from 'react-icons/fi';

const { 
  FiArrowLeft, FiArrowRight, FiShoppingBag, FiMapPin, FiCreditCard, 
  FiCheck, FiPlus, FiLock, FiDollarSign, FiClock
} = FiIcons;

const CheckoutPage = () => {
  const { isAuthenticated, user } = useAuth();
  const { items, getCartTotal } = useCart();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [orderProcessing, setOrderProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderConfirmation, setOrderConfirmation] = useState(null);
  
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    full_name: user?.name || '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'United States',
    phone: '',
    is_default: false
  });

  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [cardDetails, setCardDetails] = useState({
    cardName: '',
    cardNumber: '',
    cardExpiry: '',
    cardCVC: ''
  });

  // Shipping options
  const [shippingOptions, setShippingOptions] = useState({
    standard: { price: 5.99, name: 'Standard Shipping', description: '5-7 business days' },
    expedited: { price: 12.99, name: 'Expedited Shipping', description: '2-3 business days' },
  });
  const [selectedShipping, setSelectedShipping] = useState('standard');

  // Order summary
  const subtotal = getCartTotal();
  const shipping = shippingOptions[selectedShipping].price;
  const tax = parseFloat((subtotal * 0.0725).toFixed(2)); // 7.25% tax rate
  const total = parseFloat((subtotal + shipping + tax).toFixed(2));

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/checkout' } });
    }

    if (items.length === 0) {
      toast.error('Your cart is empty');
      navigate('/cart');
    }

    // Calculate shipping options based on cart total
    const shippingCalc = orderService.calculateShipping(subtotal);
    setShippingOptions(shippingCalc);

    // Load addresses
    const loadAddresses = async () => {
      setLoading(true);
      try {
        const addressList = await orderService.getShippingAddresses();
        setAddresses(addressList);
        
        // Select default address if exists
        const defaultAddress = addressList.find(addr => addr.is_default);
        if (defaultAddress) {
          setSelectedAddress(defaultAddress);
        } else if (addressList.length > 0) {
          setSelectedAddress(addressList[0]);
        } else {
          setShowAddressForm(true);
        }
      } catch (error) {
        console.error('Error loading addresses:', error);
        toast.error('Could not load shipping addresses');
      } finally {
        setLoading(false);
      }
    };

    // Load payment methods
    const loadPaymentMethods = () => {
      const methods = paymentService.getSupportedPaymentMethods();
      setPaymentMethods(methods);
    };

    loadAddresses();
    loadPaymentMethods();
  }, [isAuthenticated, navigate, items, subtotal]);

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const savedAddress = await orderService.addShippingAddress(newAddress);
      setAddresses([...addresses, savedAddress]);
      setSelectedAddress(savedAddress);
      setShowAddressForm(false);
      toast.success('Shipping address added');
    } catch (error) {
      console.error('Error saving address:', error);
      toast.error('Failed to save shipping address');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    
    if (paymentMethod === 'credit_card') {
      // Validate card details
      const { cardName, cardNumber, cardExpiry, cardCVC } = cardDetails;
      
      if (!cardName || cardName.trim().length < 3) {
        toast.error('Please enter the cardholder name');
        return;
      }
      
      if (!cardNumber || cardNumber.replace(/\s/g, '').length < 15) {
        toast.error('Please enter a valid card number');
        return;
      }
      
      if (!cardExpiry || !cardExpiry.match(/^\d{2}\/\d{2}$/)) {
        toast.error('Please enter a valid expiration date (MM/YY)');
        return;
      }
      
      if (!cardCVC || !cardCVC.match(/^\d{3,4}$/)) {
        toast.error('Please enter a valid CVC code');
        return;
      }
    }
    
    setCurrentStep(3);
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error('Please select a shipping address');
      setCurrentStep(1);
      return;
    }

    setOrderProcessing(true);

    try {
      // Process payment
      const paymentResult = await paymentService.processPayment({
        method: paymentMethod,
        amount: total,
        currency: 'USD',
        cardName: cardDetails.cardName,
        cardNumber: cardDetails.cardNumber,
        cardExpiry: cardDetails.cardExpiry,
        cardCVC: cardDetails.cardCVC
      });

      if (!paymentResult.success) {
        throw new Error(paymentResult.error || 'Payment failed');
      }

      // Create order
      const orderData = {
        shipping_address: selectedAddress,
        items: items,
        subtotal: subtotal,
        shipping_cost: shipping,
        tax: tax,
        total: total,
        payment_method: paymentMethod,
        notes: 'Order placed through website'
      };

      const orderResult = await orderService.createOrder(orderData);

      if (!orderResult.id) {
        throw new Error('Failed to create order');
      }

      setOrderConfirmation(orderResult);
      setOrderComplete(true);
      toast.success('Order placed successfully!');
    } catch (error) {
      console.error('Order processing error:', error);
      toast.error(error.message || 'Failed to place order');
    } finally {
      setOrderProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex justify-center items-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {orderComplete ? (
          <OrderConfirmation 
            order={orderConfirmation} 
            navigate={navigate} 
          />
        ) : (
          <>
            {/* Checkout Progress */}
            <div className="mb-8">
              <div className="flex items-center justify-between max-w-3xl mx-auto">
                <div className="flex-1 relative">
                  <div className={`h-1 ${currentStep >= 1 ? 'bg-primary-500' : 'bg-gray-200'}`}></div>
                  <div className={`absolute top-0 left-0 -mt-3 flex items-center justify-center w-6 h-6 rounded-full ${
                    currentStep === 1 ? 'bg-primary-500 text-white' : 
                    currentStep > 1 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    {currentStep > 1 ? <SafeIcon icon={FiCheck} className="w-4 h-4" /> : 1}
                  </div>
                  <div className="absolute top-0 -mt-8 left-0 text-xs font-medium text-gray-500">
                    Shipping
                  </div>
                </div>
                <div className="flex-1 relative">
                  <div className={`h-1 ${currentStep >= 2 ? 'bg-primary-500' : 'bg-gray-200'}`}></div>
                  <div className={`absolute top-0 left-1/2 -translate-x-1/2 -mt-3 flex items-center justify-center w-6 h-6 rounded-full ${
                    currentStep === 2 ? 'bg-primary-500 text-white' : 
                    currentStep > 2 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    {currentStep > 2 ? <SafeIcon icon={FiCheck} className="w-4 h-4" /> : 2}
                  </div>
                  <div className="absolute top-0 -mt-8 left-1/2 -translate-x-1/2 text-xs font-medium text-gray-500">
                    Payment
                  </div>
                </div>
                <div className="flex-1 relative">
                  <div className={`h-1 ${currentStep >= 3 ? 'bg-primary-500' : 'bg-gray-200'}`}></div>
                  <div className={`absolute top-0 right-0 -mt-3 flex items-center justify-center w-6 h-6 rounded-full ${
                    currentStep === 3 ? 'bg-primary-500 text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    3
                  </div>
                  <div className="absolute top-0 -mt-8 right-0 text-xs font-medium text-gray-500">
                    Review
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Checkout Form */}
              <motion.div 
                className="lg:col-span-2 space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {/* Step 1: Shipping */}
                {currentStep === 1 && (
                  <div className="bg-white rounded-xl shadow-soft p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                      <SafeIcon icon={FiMapPin} className="w-5 h-5 mr-2 text-primary-500" />
                      Shipping Address
                    </h2>

                    {!showAddressForm && (
                      <div className="space-y-4 mb-6">
                        {addresses.map(address => (
                          <div 
                            key={address.id} 
                            className={`border rounded-lg p-4 cursor-pointer transition-all ${
                              selectedAddress?.id === address.id 
                                ? 'border-primary-500 bg-primary-50' 
                                : 'border-gray-200 hover:border-primary-300'
                            }`}
                            onClick={() => setSelectedAddress(address)}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium">{address.full_name}</p>
                                <p className="text-gray-600 text-sm">{address.address_line1}</p>
                                {address.address_line2 && (
                                  <p className="text-gray-600 text-sm">{address.address_line2}</p>
                                )}
                                <p className="text-gray-600 text-sm">
                                  {address.city}, {address.state} {address.postal_code}
                                </p>
                                <p className="text-gray-600 text-sm">{address.country}</p>
                                {address.phone && (
                                  <p className="text-gray-600 text-sm">{address.phone}</p>
                                )}
                              </div>
                              <div className="flex h-5 items-center">
                                <input
                                  type="radio"
                                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-600"
                                  checked={selectedAddress?.id === address.id}
                                  onChange={() => setSelectedAddress(address)}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        <button
                          type="button"
                          onClick={() => setShowAddressForm(true)}
                          className="flex items-center text-primary-600 hover:text-primary-700 font-medium"
                        >
                          <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
                          Add a new address
                        </button>
                      </div>
                    )}

                    {showAddressForm && (
                      <form onSubmit={handleAddressSubmit} className="space-y-4 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="col-span-2">
                            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                              Full Name
                            </label>
                            <input
                              type="text"
                              id="fullName"
                              value={newAddress.full_name}
                              onChange={e => setNewAddress({ ...newAddress, full_name: e.target.value })}
                              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                              required
                            />
                          </div>

                          <div className="col-span-2">
                            <label htmlFor="addressLine1" className="block text-sm font-medium text-gray-700 mb-1">
                              Address Line 1
                            </label>
                            <input
                              type="text"
                              id="addressLine1"
                              value={newAddress.address_line1}
                              onChange={e => setNewAddress({ ...newAddress, address_line1: e.target.value })}
                              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                              required
                              placeholder="Street address, P.O. box"
                            />
                          </div>

                          <div className="col-span-2">
                            <label htmlFor="addressLine2" className="block text-sm font-medium text-gray-700 mb-1">
                              Address Line 2 (Optional)
                            </label>
                            <input
                              type="text"
                              id="addressLine2"
                              value={newAddress.address_line2}
                              onChange={e => setNewAddress({ ...newAddress, address_line2: e.target.value })}
                              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                              placeholder="Apartment, suite, unit, building, floor, etc."
                            />
                          </div>

                          <div>
                            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                              City
                            </label>
                            <input
                              type="text"
                              id="city"
                              value={newAddress.city}
                              onChange={e => setNewAddress({ ...newAddress, city: e.target.value })}
                              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                              required
                            />
                          </div>

                          <div>
                            <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                              State / Province
                            </label>
                            <input
                              type="text"
                              id="state"
                              value={newAddress.state}
                              onChange={e => setNewAddress({ ...newAddress, state: e.target.value })}
                              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                              required
                            />
                          </div>

                          <div>
                            <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
                              Postal Code
                            </label>
                            <input
                              type="text"
                              id="postalCode"
                              value={newAddress.postal_code}
                              onChange={e => setNewAddress({ ...newAddress, postal_code: e.target.value })}
                              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                              required
                            />
                          </div>

                          <div>
                            <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                              Country
                            </label>
                            <select
                              id="country"
                              value={newAddress.country}
                              onChange={e => setNewAddress({ ...newAddress, country: e.target.value })}
                              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                              required
                            >
                              <option value="United States">United States</option>
                              <option value="Canada">Canada</option>
                              <option value="United Kingdom">United Kingdom</option>
                              <option value="Australia">Australia</option>
                            </select>
                          </div>

                          <div className="col-span-2">
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                              Phone Number
                            </label>
                            <input
                              type="tel"
                              id="phone"
                              value={newAddress.phone}
                              onChange={e => setNewAddress({ ...newAddress, phone: e.target.value })}
                              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                              placeholder="For delivery questions"
                            />
                          </div>

                          <div className="col-span-2">
                            <div className="flex items-center">
                              <input
                                id="default-address"
                                type="checkbox"
                                checked={newAddress.is_default}
                                onChange={e => setNewAddress({ ...newAddress, is_default: e.target.checked })}
                                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-600"
                              />
                              <label htmlFor="default-address" className="ml-2 block text-sm text-gray-700">
                                Set as default address
                              </label>
                            </div>
                          </div>
                        </div>

                        <div className="flex space-x-3">
                          {addresses.length > 0 && (
                            <button
                              type="button"
                              onClick={() => setShowAddressForm(false)}
                              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                            >
                              Cancel
                            </button>
                          )}
                          <button
                            type="submit"
                            className="flex-1 px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                          >
                            Save Address
                          </button>
                        </div>
                      </form>
                    )}

                    {/* Shipping Method */}
                    <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                      <SafeIcon icon={FiClock} className="w-5 h-5 mr-2 text-primary-500" />
                      Shipping Method
                    </h2>
                    <div className="space-y-3 mb-6">
                      <div 
                        className={`border rounded-lg p-4 cursor-pointer transition-all ${
                          selectedShipping === 'standard' 
                            ? 'border-primary-500 bg-primary-50' 
                            : 'border-gray-200 hover:border-primary-300'
                        }`}
                        onClick={() => setSelectedShipping('standard')}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{shippingOptions.standard.name}</p>
                            <p className="text-gray-600 text-sm">{shippingOptions.standard.description}</p>
                          </div>
                          <div className="flex items-center space-x-4">
                            <span className="font-medium">
                              {shippingOptions.standard.price === 0 
                                ? 'FREE' 
                                : `$${shippingOptions.standard.price.toFixed(2)}`
                              }
                            </span>
                            <input
                              type="radio"
                              className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-600"
                              checked={selectedShipping === 'standard'}
                              onChange={() => setSelectedShipping('standard')}
                            />
                          </div>
                        </div>
                      </div>

                      <div 
                        className={`border rounded-lg p-4 cursor-pointer transition-all ${
                          selectedShipping === 'expedited' 
                            ? 'border-primary-500 bg-primary-50' 
                            : 'border-gray-200 hover:border-primary-300'
                        }`}
                        onClick={() => setSelectedShipping('expedited')}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{shippingOptions.expedited.name}</p>
                            <p className="text-gray-600 text-sm">{shippingOptions.expedited.description}</p>
                          </div>
                          <div className="flex items-center space-x-4">
                            <span className="font-medium">${shippingOptions.expedited.price.toFixed(2)}</span>
                            <input
                              type="radio"
                              className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-600"
                              checked={selectedShipping === 'expedited'}
                              onChange={() => setSelectedShipping('expedited')}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between mt-8">
                      <Link 
                        to="/cart" 
                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                      >
                        <SafeIcon icon={FiArrowLeft} className="w-4 h-4 mr-2" />
                        Back to Cart
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          if (!selectedAddress) {
                            toast.error('Please select or add a shipping address');
                            return;
                          }
                          setCurrentStep(2);
                        }}
                        className="inline-flex items-center px-6 py-2 border border-transparent rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
                      >
                        Continue to Payment
                        <SafeIcon icon={FiArrowRight} className="w-4 h-4 ml-2" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 2: Payment */}
                {currentStep === 2 && (
                  <div className="bg-white rounded-xl shadow-soft p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                      <SafeIcon icon={FiCreditCard} className="w-5 h-5 mr-2 text-primary-500" />
                      Payment Method
                    </h2>

                    <div className="space-y-4 mb-6">
                      {paymentMethods.map(method => (
                        <div 
                          key={method.id} 
                          className={`border rounded-lg p-4 cursor-pointer transition-all ${
                            paymentMethod === method.id 
                              ? 'border-primary-500 bg-primary-50' 
                              : 'border-gray-200 hover:border-primary-300'
                          }`}
                          onClick={() => setPaymentMethod(method.id)}
                        >
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <SafeIcon 
                                icon={FiIcons[method.icon]} 
                                className="w-5 h-5 text-gray-600 mr-3" 
                              />
                              <span className="font-medium">{method.name}</span>
                            </div>
                            <input
                              type="radio"
                              className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-600"
                              checked={paymentMethod === method.id}
                              onChange={() => setPaymentMethod(method.id)}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    {paymentMethod === 'credit_card' && (
                      <form onSubmit={handlePaymentSubmit} className="space-y-4 mb-6 border-t pt-6">
                        <div>
                          <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-1">
                            Name on Card
                          </label>
                          <input
                            type="text"
                            id="cardName"
                            value={cardDetails.cardName}
                            onChange={e => setCardDetails({ ...cardDetails, cardName: e.target.value })}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                            required
                          />
                        </div>

                        <div>
                          <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                            Card Number
                          </label>
                          <input
                            type="text"
                            id="cardNumber"
                            value={cardDetails.cardNumber}
                            onChange={e => {
                              // Format card number with spaces
                              const value = e.target.value.replace(/\D/g, '');
                              const formattedValue = value.replace(/(\d{4})(?=\d)/g, '$1 ');
                              setCardDetails({ ...cardDetails, cardNumber: formattedValue });
                            }}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                            required
                            maxLength="19" // 16 digits + 3 spaces
                            placeholder="4242 4242 4242 4242"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="cardExpiry" className="block text-sm font-medium text-gray-700 mb-1">
                              Expiration Date
                            </label>
                            <input
                              type="text"
                              id="cardExpiry"
                              value={cardDetails.cardExpiry}
                              onChange={e => {
                                // Format expiry date as MM/YY
                                let value = e.target.value.replace(/\D/g, '');
                                if (value.length > 2) {
                                  value = value.substring(0, 2) + '/' + value.substring(2, 4);
                                }
                                setCardDetails({ ...cardDetails, cardExpiry: value });
                              }}
                              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                              required
                              maxLength="5" // MM/YY
                              placeholder="MM/YY"
                            />
                          </div>

                          <div>
                            <label htmlFor="cardCVC" className="block text-sm font-medium text-gray-700 mb-1">
                              CVC
                            </label>
                            <input
                              type="text"
                              id="cardCVC"
                              value={cardDetails.cardCVC}
                              onChange={e => {
                                const value = e.target.value.replace(/\D/g, '');
                                setCardDetails({ ...cardDetails, cardCVC: value });
                              }}
                              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                              required
                              maxLength="4"
                              placeholder="123"
                            />
                          </div>
                        </div>

                        <div className="flex items-center text-sm text-gray-500 mt-4">
                          <SafeIcon icon={FiLock} className="w-4 h-4 mr-2" />
                          <span>Your payment information is secure and encrypted</span>
                        </div>
                      </form>
                    )}

                    {paymentMethod === 'paypal' && (
                      <div className="border-t pt-6 mb-6">
                        <p className="text-gray-600 mb-4">
                          You'll be redirected to PayPal to complete your purchase securely.
                        </p>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <div className="flex items-center">
                            <SafeIcon icon={FiDollarSign} className="w-5 h-5 text-blue-600 mr-3" />
                            <span className="font-medium text-blue-800">PayPal checkout is simulated in this demo</span>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between mt-8">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(1)}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                      >
                        <SafeIcon icon={FiArrowLeft} className="w-4 h-4 mr-2" />
                        Back to Shipping
                      </button>
                      <button
                        type="button"
                        onClick={handlePaymentSubmit}
                        className="inline-flex items-center px-6 py-2 border border-transparent rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
                      >
                        Review Order
                        <SafeIcon icon={FiArrowRight} className="w-4 h-4 ml-2" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3: Review */}
                {currentStep === 3 && (
                  <div className="bg-white rounded-xl shadow-soft p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Review Your Order</h2>

                    {/* Shipping Address */}
                    <div className="mb-6">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-medium text-gray-900 mb-2 flex items-center">
                          <SafeIcon icon={FiMapPin} className="w-4 h-4 mr-2 text-primary-500" />
                          Shipping Address
                        </h3>
                        <button
                          type="button"
                          onClick={() => setCurrentStep(1)}
                          className="text-sm text-primary-600 hover:text-primary-700"
                        >
                          Edit
                        </button>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="font-medium">{selectedAddress?.full_name}</p>
                        <p className="text-gray-600 text-sm">{selectedAddress?.address_line1}</p>
                        {selectedAddress?.address_line2 && (
                          <p className="text-gray-600 text-sm">{selectedAddress.address_line2}</p>
                        )}
                        <p className="text-gray-600 text-sm">
                          {selectedAddress?.city}, {selectedAddress?.state} {selectedAddress?.postal_code}
                        </p>
                        <p className="text-gray-600 text-sm">{selectedAddress?.country}</p>
                        {selectedAddress?.phone && (
                          <p className="text-gray-600 text-sm">{selectedAddress.phone}</p>
                        )}
                      </div>
                      <div className="mt-2">
                        <p className="text-gray-600 text-sm">
                          <span className="font-medium">Shipping Method:</span> {shippingOptions[selectedShipping].name} ({shippingOptions[selectedShipping].description})
                        </p>
                      </div>
                    </div>

                    {/* Payment Method */}
                    <div className="mb-6">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-medium text-gray-900 mb-2 flex items-center">
                          <SafeIcon icon={FiCreditCard} className="w-4 h-4 mr-2 text-primary-500" />
                          Payment Method
                        </h3>
                        <button
                          type="button"
                          onClick={() => setCurrentStep(2)}
                          className="text-sm text-primary-600 hover:text-primary-700"
                        >
                          Edit
                        </button>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center">
                          <SafeIcon 
                            icon={paymentMethod === 'credit_card' ? FiCreditCard : FiDollarSign} 
                            className="w-5 h-5 text-gray-600 mr-3" 
                          />
                          <div>
                            <p className="font-medium">
                              {paymentMethod === 'credit_card' ? 'Credit/Debit Card' : 'PayPal'}
                            </p>
                            {paymentMethod === 'credit_card' && cardDetails.cardNumber && (
                              <p className="text-gray-600 text-sm">
                                •••• •••• •••• {cardDetails.cardNumber.slice(-4)}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Items */}
                    <div className="mb-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-2 flex items-center">
                        <SafeIcon icon={FiShoppingBag} className="w-4 h-4 mr-2 text-primary-500" />
                        Items ({items.length})
                      </h3>
                      <div className="divide-y divide-gray-200">
                        {items.map(item => (
                          <div key={item.id} className="py-4 flex">
                            <div className="flex-shrink-0 w-20 h-20">
                              <img 
                                src={item.image} 
                                alt={item.name} 
                                className="w-full h-full object-cover rounded-md" 
                              />
                            </div>
                            <div className="ml-4 flex-1">
                              <div className="flex justify-between">
                                <div>
                                  <h4 className="text-sm font-medium text-gray-900">{item.name}</h4>
                                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                </div>
                                <p className="text-sm font-medium text-gray-900">
                                  ${(item.price * item.quantity).toFixed(2)}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between mt-8">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(2)}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                      >
                        <SafeIcon icon={FiArrowLeft} className="w-4 h-4 mr-2" />
                        Back to Payment
                      </button>
                      <button
                        type="button"
                        onClick={handlePlaceOrder}
                        disabled={orderProcessing}
                        className="inline-flex items-center px-6 py-2 border border-transparent rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {orderProcessing ? (
                          <>
                            <LoadingSpinner size="sm" color="white" />
                            <span className="ml-2">Processing...</span>
                          </>
                        ) : (
                          <>
                            Place Order
                            <SafeIcon icon={FiCheck} className="w-4 h-4 ml-2" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Order Summary */}
              <motion.div 
                className="lg:col-span-1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="bg-white rounded-xl shadow-soft p-6 sticky top-24">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>

                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-medium">
                        {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax</span>
                      <span className="font-medium">${tax.toFixed(2)}</span>
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

                  {/* Item list */}
                  <div className="mt-6">
                    <h3 className="text-sm font-medium text-gray-900 mb-2">
                      {items.length} {items.length === 1 ? 'Item' : 'Items'} in Cart
                    </h3>
                    <div className="max-h-60 overflow-y-auto">
                      {items.map(item => (
                        <div key={item.id} className="flex py-2 border-b border-gray-200 last:border-b-0">
                          <div className="flex-shrink-0 w-12 h-12">
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              className="w-full h-full object-cover rounded-md" 
                            />
                          </div>
                          <div className="ml-3 flex-1 flex flex-col">
                            <div className="flex justify-between text-sm">
                              <p className="font-medium text-gray-900 truncate">{item.name}</p>
                              <p className="font-medium text-gray-900 ml-4">
                                ${(item.price * item.quantity).toFixed(2)}
                              </p>
                            </div>
                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// Order Confirmation Component
const OrderConfirmation = ({ order, navigate }) => {
  return (
    <motion.div 
      className="max-w-3xl mx-auto bg-white rounded-xl shadow-soft p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <SafeIcon icon={FiCheck} className="w-8 h-8 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
        <p className="text-gray-600">
          Thank you for your purchase. Your order has been placed successfully.
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 mb-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-sm text-gray-500">Order Number</p>
            <p className="font-medium">{order.order_number}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Order Date</p>
            <p className="font-medium">
              {new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>

        <div>
          <p className="text-sm text-gray-500">Status</p>
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mt-1">
            Processing
          </div>
        </div>
      </div>

      <div className="space-y-4 mb-8">
        <p className="text-gray-600">
          We've sent a confirmation email to your email address with all the details of your order.
        </p>
        <p className="text-gray-600">
          You can track your order status in the <Link to="/orders" className="text-primary-600 hover:text-primary-700 font-medium">My Orders</Link> section.
        </p>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => navigate('/orders')}
          className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          View My Orders
        </button>
        <button
          onClick={() => navigate('/products')}
          className="flex-1 px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Continue Shopping
        </button>
      </div>
    </motion.div>
  );
};

export default CheckoutPage;