import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import SafeIcon from '../components/common/SafeIcon';
import Header from '../components/layout/Header';
import * as FiIcons from 'react-icons/fi';

const { FiTruck, FiRotateCcw, FiHelpCircle, FiPackage, FiClock, FiShield, FiDollarSign, FiCheck, FiX, FiAlertCircle } = FiIcons;

const InfoPage = () => {
  const location = useLocation();

  useEffect(() => {
    // Handle anchor links when component mounts or location changes
    if (location.hash) {
      const element = document.getElementById(location.hash.substring(1));
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Support & Information</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to know about shipping, returns, and frequently asked questions.
          </p>
        </motion.div>

        {/* Quick Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-soft p-6 mb-12"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Navigation</h2>
          <div className="flex flex-wrap gap-4">
            <a
              href="#shipping-info"
              className="inline-flex items-center px-4 py-2 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors"
            >
              <SafeIcon icon={FiTruck} className="w-4 h-4 mr-2" />
              Shipping Info
            </a>
            <a
              href="#returns"
              className="inline-flex items-center px-4 py-2 bg-secondary-100 text-secondary-700 rounded-lg hover:bg-secondary-200 transition-colors"
            >
              <SafeIcon icon={FiRotateCcw} className="w-4 h-4 mr-2" />
              Returns
            </a>
            <a
              href="#faq"
              className="inline-flex items-center px-4 py-2 bg-accent-100 text-accent-700 rounded-lg hover:bg-accent-200 transition-colors"
            >
              <SafeIcon icon={FiHelpCircle} className="w-4 h-4 mr-2" />
              FAQ
            </a>
          </div>
        </motion.div>

        {/* Shipping Info Section */}
        <motion.section
          id="shipping-info"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <div className="bg-white rounded-xl shadow-soft p-8">
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
                <SafeIcon icon={FiTruck} className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Shipping Information</h2>
                <p className="text-gray-600">Fast, safe, and reliable delivery for your aquatic friends</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-primary-50 rounded-lg p-6">
                <div className="flex items-center mb-3">
                  <SafeIcon icon={FiPackage} className="w-5 h-5 text-primary-600 mr-2" />
                  <h3 className="font-semibold text-gray-900">Standard Shipping</h3>
                </div>
                <p className="text-gray-600 text-sm mb-2">5-7 business days</p>
                <p className="text-primary-600 font-bold">$5.99</p>
                <p className="text-xs text-gray-500 mt-2">FREE on orders over $75</p>
              </div>

              <div className="bg-secondary-50 rounded-lg p-6">
                <div className="flex items-center mb-3">
                  <SafeIcon icon={FiClock} className="w-5 h-5 text-secondary-600 mr-2" />
                  <h3 className="font-semibold text-gray-900">Expedited Shipping</h3>
                </div>
                <p className="text-gray-600 text-sm mb-2">2-3 business days</p>
                <p className="text-secondary-600 font-bold">$12.99</p>
              </div>

              <div className="bg-accent-50 rounded-lg p-6">
                <div className="flex items-center mb-3">
                  <SafeIcon icon={FiShield} className="w-5 h-5 text-accent-600 mr-2" />
                  <h3 className="font-semibold text-gray-900">Live Fish Shipping</h3>
                </div>
                <p className="text-gray-600 text-sm mb-2">Overnight delivery</p>
                <p className="text-accent-600 font-bold">$24.99</p>
                <p className="text-xs text-gray-500 mt-2">100% Live Arrival Guarantee</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Shipping Policies</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <SafeIcon icon={FiCheck} className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-gray-900">Live Arrival Guarantee</h4>
                      <p className="text-gray-600 text-sm">All live fish are guaranteed to arrive alive and healthy, or we'll replace them at no cost.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <SafeIcon icon={FiCheck} className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-gray-900">Temperature Controlled</h4>
                      <p className="text-gray-600 text-sm">We use insulated boxes with heat/cold packs to maintain optimal temperature during transit.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <SafeIcon icon={FiCheck} className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-gray-900">Secure Packaging</h4>
                      <p className="text-gray-600 text-sm">Each fish is individually bagged with oxygen and cushioned to prevent injury.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <SafeIcon icon={FiAlertCircle} className="w-5 h-5 text-warning-500 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-gray-900">Weather Delays</h4>
                      <p className="text-gray-600 text-sm">Live fish shipments may be delayed during extreme weather conditions to ensure fish safety.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Processing Times</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li><strong>Equipment & Supplies:</strong> 1-2 business days</li>
                    <li><strong>Live Fish:</strong> 2-3 business days (health check required)</li>
                    <li><strong>Custom Orders:</strong> 5-7 business days</li>
                    <li><strong>Weekend Orders:</strong> Processed on next business day</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Returns Section */}
        <motion.section
          id="returns"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-16"
        >
          <div className="bg-white rounded-xl shadow-soft p-8">
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center mr-4">
                <SafeIcon icon={FiRotateCcw} className="w-6 h-6 text-secondary-600" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Returns & Exchanges</h2>
                <p className="text-gray-600">Easy returns and hassle-free exchanges</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <SafeIcon icon={FiCheck} className="w-5 h-5 text-green-500 mr-2" />
                    Eligible Items
                  </h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Equipment and supplies in original packaging</li>
                    <li>• Unused food products within 30 days</li>
                    <li>• Defective or damaged items</li>
                    <li>• Items not as described</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Return Process</h3>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                        <span className="text-xs font-bold text-primary-600">1</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Contact Us</p>
                        <p className="text-sm text-gray-600">Email support@gupfeehouse.com with your order number</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                        <span className="text-xs font-bold text-primary-600">2</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Get Return Label</p>
                        <p className="text-sm text-gray-600">We'll provide a prepaid return shipping label</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                        <span className="text-xs font-bold text-primary-600">3</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Ship Items Back</p>
                        <p className="text-sm text-gray-600">Package items securely and attach the return label</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                        <span className="text-xs font-bold text-primary-600">4</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Receive Refund</p>
                        <p className="text-sm text-gray-600">Refund processed within 3-5 business days of receipt</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <SafeIcon icon={FiX} className="w-5 h-5 text-red-500 mr-2" />
                    Non-Returnable Items
                  </h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Live fish (unless DOA or defective)</li>
                    <li>• Opened or used food products</li>
                    <li>• Custom or personalized items</li>
                    <li>• Items returned after 30 days</li>
                    <li>• Items without original packaging</li>
                  </ul>
                </div>

                <div className="bg-gradient-to-r from-secondary-50 to-warning-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <SafeIcon icon={FiDollarSign} className="w-5 h-5 text-secondary-600 mr-2" />
                    Refund Information
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Refunds processed to original payment method</li>
                    <li>• Processing time: 3-5 business days</li>
                    <li>• Bank processing may take additional 1-2 days</li>
                    <li>• Original shipping costs are non-refundable</li>
                    <li>• Return shipping is free for defective items</li>
                  </ul>
                </div>

                <div className="bg-green-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Live Fish Guarantee</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    If any fish arrive dead or become ill within 7 days of delivery due to shipping stress:
                  </p>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• Take clear photos of the fish</li>
                    <li>• Contact us within 24 hours</li>
                    <li>• We'll provide store credit or replacement</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* FAQ Section */}
        <motion.section
          id="faq"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-16"
        >
          <div className="bg-white rounded-xl shadow-soft p-8">
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center mr-4">
                <SafeIcon icon={FiHelpCircle} className="w-6 h-6 text-accent-600" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
                <p className="text-gray-600">Quick answers to common questions</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Shipping FAQs */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <SafeIcon icon={FiTruck} className="w-5 h-5 text-primary-600 mr-2" />
                  Shipping Questions
                </h3>
                <div className="space-y-6">
                  <div className="border-l-4 border-primary-500 pl-4">
                    <h4 className="font-semibold text-gray-900 mb-2">How do you ensure fish arrive alive?</h4>
                    <p className="text-gray-600 text-sm">We use insulated boxes with oxygen, temperature control, and ship via overnight delivery. Our live arrival guarantee covers any fish that don't arrive in good condition.</p>
                  </div>
                  <div className="border-l-4 border-primary-500 pl-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Do you ship internationally?</h4>
                    <p className="text-gray-600 text-sm">Currently, we only ship within the United States. International shipping requires special permits and quarantine procedures that we don't currently support.</p>
                  </div>
                  <div className="border-l-4 border-primary-500 pl-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Can I track my order?</h4>
                    <p className="text-gray-600 text-sm">Yes! Once your order ships, you'll receive a tracking number via email. You can also check your order status in your account dashboard.</p>
                  </div>
                  <div className="border-l-4 border-primary-500 pl-4">
                    <h4 className="font-semibold text-gray-900 mb-2">What if weather delays my shipment?</h4>
                    <p className="text-gray-600 text-sm">For live fish safety, we may delay shipments during extreme weather. We'll notify you immediately and reschedule delivery for the next suitable shipping day.</p>
                  </div>
                </div>
              </div>

              {/* Care & Product FAQs */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <SafeIcon icon={FiHelpCircle} className="w-5 h-5 text-accent-600 mr-2" />
                  Fish Care & Products
                </h3>
                <div className="space-y-6">
                  <div className="border-l-4 border-accent-500 pl-4">
                    <h4 className="font-semibold text-gray-900 mb-2">How do I acclimate new fish?</h4>
                    <p className="text-gray-600 text-sm">Float the sealed bag in your tank for 15 minutes, then gradually mix tank water with bag water over 30 minutes before releasing the fish.</p>
                  </div>
                  <div className="border-l-4 border-accent-500 pl-4">
                    <h4 className="font-semibold text-gray-900 mb-2">What tank size do bettas need?</h4>
                    <p className="text-gray-600 text-sm">Bettas need a minimum of 5 gallons with a heater and gentle filter. Larger tanks are always better for their health and happiness.</p>
                  </div>
                  <div className="border-l-4 border-accent-500 pl-4">
                    <h4 className="font-semibold text-gray-900 mb-2">How often should I feed my fish?</h4>
                    <p className="text-gray-600 text-sm">Most fish should be fed small amounts 1-2 times daily. Only feed what they can consume in 2-3 minutes to prevent overfeeding.</p>
                  </div>
                  <div className="border-l-4 border-accent-500 pl-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Do you offer aquarium setup services?</h4>
                    <p className="text-gray-600 text-sm">Yes! We provide consultation and setup services for new aquariums. Contact us to schedule a consultation with one of our aquarium specialists.</p>
                  </div>
                </div>
              </div>

              {/* Payment & Account FAQs */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <SafeIcon icon={FiDollarSign} className="w-5 h-5 text-secondary-600 mr-2" />
                  Payment & Account
                </h3>
                <div className="space-y-6">
                  <div className="border-l-4 border-secondary-500 pl-4">
                    <h4 className="font-semibold text-gray-900 mb-2">What payment methods do you accept?</h4>
                    <p className="text-gray-600 text-sm">We accept all major credit cards (Visa, MasterCard, American Express, Discover) and PayPal for secure online payments.</p>
                  </div>
                  <div className="border-l-4 border-secondary-500 pl-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Is my payment information secure?</h4>
                    <p className="text-gray-600 text-sm">Yes, we use industry-standard SSL encryption and never store your payment details on our servers. All transactions are processed securely.</p>
                  </div>
                  <div className="border-l-4 border-secondary-500 pl-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Can I cancel or modify my order?</h4>
                    <p className="text-gray-600 text-sm">You can cancel or modify orders within 2 hours of placement. After that, please contact us immediately as we may have already begun processing.</p>
                  </div>
                  <div className="border-l-4 border-secondary-500 pl-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Do you offer bulk discounts?</h4>
                    <p className="text-gray-600 text-sm">Yes! We offer discounts for large orders and wholesale pricing for retailers. Contact us for a custom quote on bulk purchases.</p>
                  </div>
                </div>
              </div>

              {/* General FAQs */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <SafeIcon icon={FiShield} className="w-5 h-5 text-green-600 mr-2" />
                  General Questions
                </h3>
                <div className="space-y-6">
                  <div className="border-l-4 border-green-500 pl-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Are your fish quarantined?</h4>
                    <p className="text-gray-600 text-sm">Yes, all fish are quarantined for a minimum of 14 days and undergo health checks before being made available for sale.</p>
                  </div>
                  <div className="border-l-4 border-green-500 pl-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Can I visit your store in person?</h4>
                    <p className="text-gray-600 text-sm">Yes! Our physical store is located at 123 Aquarium Street, Fish City, CA 90210. We're open Mon-Fri 9AM-6PM and weekends 10AM-4PM.</p>
                  </div>
                  <div className="border-l-4 border-green-500 pl-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Do you have a loyalty program?</h4>
                    <p className="text-gray-600 text-sm">We're working on launching a loyalty program that will reward frequent customers with points, discounts, and exclusive offers. Stay tuned!</p>
                  </div>
                  <div className="border-l-4 border-green-500 pl-4">
                    <h4 className="font-semibold text-gray-900 mb-2">How can I contact customer support?</h4>
                    <p className="text-gray-600 text-sm">You can reach us via email at support@gupfeehouse.com, phone at +1 (555) 123-FISH, or through our contact form. We respond within 24 hours.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Still Have Questions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-primary-600 to-accent-600 rounded-xl p-8 text-center text-white"
        >
          <h2 className="text-2xl font-bold mb-4">Still Have Questions?</h2>
          <p className="text-primary-100 mb-6 max-w-2xl mx-auto">
            Can't find the answer you're looking for? Our friendly customer support team is here to help you with any questions about our fish, products, or services.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center px-6 py-3 bg-white text-primary-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            <SafeIcon icon={FiHelpCircle} className="w-5 h-5 mr-2" />
            Contact Support
          </a>
        </motion.div>
      </div>
    </div>
  );
};

export default InfoPage;