import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SafeIcon from '../components/common/SafeIcon';
import Header from '../components/layout/Header';
import toast from 'react-hot-toast';
import * as FiIcons from 'react-icons/fi';

const { FiMail, FiPhone, FiMapPin, FiClock, FiSend, FiMessageCircle, FiHelpCircle, FiShoppingBag } = FiIcons;

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    category: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Message sent successfully! We\'ll get back to you within 24 hours.');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        category: 'general'
      });
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: FiMail,
      title: 'Email Us',
      info: 'support@gupfeehouse.com',
      description: 'Send us an email anytime'
    },
    {
      icon: FiPhone,
      title: 'Call Us',
      info: '+1 (555) 123-FISH',
      description: 'Mon-Fri 9AM-6PM PST'
    },
    {
      icon: FiMapPin,
      title: 'Visit Us',
      info: '123 Aquarium Street, Fish City, CA 90210',
      description: 'Our physical store location'
    },
    {
      icon: FiClock,
      title: 'Business Hours',
      info: 'Mon-Fri: 9AM-6PM PST',
      description: 'Weekend: 10AM-4PM PST'
    }
  ];

  const categories = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'orders', label: 'Order Support' },
    { value: 'products', label: 'Product Questions' },
    { value: 'care', label: 'Fish Care Advice' },
    { value: 'shipping', label: 'Shipping & Returns' },
    { value: 'technical', label: 'Technical Support' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Have a question about our fish or need aquarium advice? We're here to help! 
            Our team of aquarium experts is ready to assist you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl shadow-soft p-8"
          >
            <div className="flex items-center mb-6">
              <SafeIcon icon={FiMessageCircle} className="w-6 h-6 text-primary-600 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900">Send us a Message</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                >
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  placeholder="What's this about?"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows="6"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors resize-vertical"
                  placeholder="Tell us how we can help you..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-brand text-white py-3 px-6 rounded-lg hover:bg-gradient-brand-dark transition-all duration-200 shadow-brand hover:shadow-brand-lg transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
              >
                <SafeIcon icon={FiSend} className="w-5 h-5" />
                <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
              </button>
            </form>
          </motion.div>

          {/* Get in Touch Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div className="bg-white rounded-xl shadow-soft p-8">
              <div className="flex items-center mb-6">
                <SafeIcon icon={FiHelpCircle} className="w-6 h-6 text-primary-600 mr-3" />
                <h2 className="text-2xl font-semibold text-gray-900">Get in Touch</h2>
              </div>
              
              <div className="space-y-6">
                {contactInfo.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start space-x-4"
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                      <SafeIcon icon={item.icon} className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                      <p className="text-gray-800 font-medium">{item.info}</p>
                      <p className="text-gray-600 text-sm">{item.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            
            {/* Need Immediate Help */}
            <div className="bg-white rounded-xl shadow-soft p-8">
              <h3 className="text-xl font-semibold mb-4">Need Immediate Help?</h3>
              <div className="space-y-4">
                <Link
                  to="/orders"
                  className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <SafeIcon icon={FiShoppingBag} className="w-5 h-5 mr-3 text-primary-600" />
                  <div>
                    <p className="font-medium text-gray-900">Check Order Status</p>
                    <p className="text-sm text-gray-600">Track your recent orders</p>
                  </div>
                </Link>
                <Link
                  to="/blog"
                  className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <SafeIcon icon={FiHelpCircle} className="w-5 h-5 mr-3 text-primary-600" />
                  <div>
                    <p className="font-medium text-gray-900">Fish Care Guides</p>
                    <p className="text-sm text-gray-600">Browse our care articles</p>
                  </div>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-16 bg-white rounded-xl shadow-soft p-8"
        >
          <h2 className="text-2xl font-semibold text-gray-900 mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { question: "What's your live arrival guarantee?", answer: "We guarantee all fish arrive alive and healthy. If any fish don't arrive in good condition, we'll replace them at no cost." },
              { question: "How do you ship live fish?", answer: "We use insulated boxes with oxygen and temperature control. All shipments are sent overnight to ensure fish safety." },
              { question: "Do you offer aquarium setup services?", answer: "Yes! We provide consultation and setup services for new aquariums. Contact us to schedule a consultation." },
              { question: "What if I have issues with my order?", answer: "Contact us immediately if there are any issues. Our customer service team is here to help resolve any problems." }
            ].map((faq, index) => (
              <div key={index} className="border-l-4 border-primary-500 pl-4">
                <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactPage;