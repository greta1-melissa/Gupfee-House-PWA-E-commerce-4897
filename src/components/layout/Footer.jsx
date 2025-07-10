import React from 'react';
import { Link } from 'react-router-dom';
import SafeIcon from '../common/SafeIcon';
import Logo from '../common/Logo';
import * as FiIcons from 'react-icons/fi';

const { FiLock } = FiIcons;

const Footer = () => {
  return (
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
                <Link to="/products" className="text-gray-400 hover:text-white transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-gray-400 hover:text-white transition-colors">
                  Cart
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="text-gray-400 hover:text-white transition-colors">
                  Wishlist
                </Link>
              </li>
              <li>
                <Link to="/orders" className="text-gray-400 hover:text-white transition-colors">
                  Orders
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-6">Support</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/info#shipping-info" className="text-gray-400 hover:text-white transition-colors">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link to="/info#returns" className="text-gray-400 hover:text-white transition-colors">
                  Returns
                </Link>
              </li>
              <li>
                <Link to="/info#faq" className="text-gray-400 hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-6">Learn</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/blog" className="text-gray-400 hover:text-white transition-colors">
                  Fish Care Blog
                </Link>
              </li>
              <li>
                <Link to="/care-guides" className="text-gray-400 hover:text-white transition-colors">
                  Care Guides
                </Link>
              </li>
              <li>
                <Link to="/tips-tricks" className="text-gray-400 hover:text-white transition-colors">
                  Tips & Tricks
                </Link>
              </li>
              <li>
                <Link to="/community" className="text-gray-400 hover:text-white transition-colors">
                  Community
                </Link>
              </li>
              <li>
                <Link to="/admin/login" className="flex items-center text-gray-400 hover:text-white transition-colors group">
                  <SafeIcon icon={FiLock} className="w-4 h-4 mr-2 group-hover:text-primary-300 transition-colors" />
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
  );
};

export default Footer;