import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiStar, FiChevronLeft, FiChevronRight, FiQuote } = FiIcons;

const ReviewsCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const reviews = [
    {
      id: 1,
      name: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b586?w=150&h=150&fit=crop&crop=face',
      rating: 5,
      review: 'Amazing quality fish! My betta arrived healthy and vibrant. The packaging was excellent and the customer service was outstanding. Highly recommend Gupfee House!',
      product: 'Premium Betta Fish',
      location: 'California, USA',
      date: '2 weeks ago'
    },
    {
      id: 2,
      name: 'Michael Chen',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      rating: 5,
      review: 'The guppy trio I ordered exceeded my expectations. Beautiful colors and very active fish. The aquarium heater works perfectly too. Great experience overall!',
      product: 'Colorful Guppy Fish Trio',
      location: 'New York, USA',
      date: '1 month ago'
    },
    {
      id: 3,
      name: 'Emma Rodriguez',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      rating: 5,
      review: 'Exceptional service and healthy fish! The team provided great advice for my first aquarium setup. My fish are thriving and the equipment quality is top-notch.',
      product: 'Aquarium Starter Kit',
      location: 'Texas, USA',
      date: '3 weeks ago'
    },
    {
      id: 4,
      name: 'David Kim',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      rating: 5,
      review: 'Fast shipping and excellent packaging. The fish arrived in perfect condition. The care instructions were very detailed and helpful. Will definitely order again!',
      product: 'Premium Guppy Fish Pair',
      location: 'Florida, USA',
      date: '1 week ago'
    },
    {
      id: 5,
      name: 'Lisa Thompson',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
      rating: 5,
      review: 'The best fish store online! Great selection, healthy fish, and amazing customer support. They helped me choose the perfect fish for my community tank.',
      product: 'Community Fish Selection',
      location: 'Washington, USA',
      date: '2 months ago'
    },
    {
      id: 6,
      name: 'James Wilson',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      rating: 5,
      review: 'Outstanding quality and service! The aquarium equipment is professional grade and the fish are absolutely beautiful. Gupfee House is now my go-to fish supplier.',
      product: 'Aquarium Heater Pro',
      location: 'Oregon, USA',
      date: '5 days ago'
    }
  ];

  const nextReview = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % reviews.length);
  };

  const prevReview = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + reviews.length) % reviews.length);
  };

  const goToReview = (index) => {
    setCurrentIndex(index);
  };

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      nextReview();
    }, 5000); // Change review every 5 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying, currentIndex]);

  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);

  return (
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
              What Our Customers Say
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Don't just take our word for it. Here's what fish enthusiasts are saying about their experience with Gupfee House.
            </p>
          </motion.div>
        </div>

        <div 
          className="relative max-w-4xl mx-auto"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Main Review Display */}
          <div className="relative overflow-hidden rounded-2xl bg-gray-50 min-h-[400px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="p-8 md:p-12"
              >
                <div className="text-center">
                  {/* Quote Icon */}
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-6">
                    <SafeIcon icon={FiQuote} className="w-8 h-8 text-primary-600" />
                  </div>

                  {/* Star Rating */}
                  <div className="flex justify-center mb-6">
                    {[...Array(5)].map((_, i) => (
                      <SafeIcon
                        key={i}
                        icon={FiStar}
                        className="w-6 h-6 text-secondary-500 mr-1"
                      />
                    ))}
                  </div>

                  {/* Review Text */}
                  <blockquote className="text-xl md:text-2xl text-gray-800 font-medium mb-8 leading-relaxed max-w-3xl mx-auto">
                    "{reviews[currentIndex].review}"
                  </blockquote>

                  {/* Customer Info */}
                  <div className="flex items-center justify-center space-x-4">
                    <img
                      src={reviews[currentIndex].avatar}
                      alt={reviews[currentIndex].name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="text-left">
                      <h4 className="font-semibold text-gray-900 text-lg">
                        {reviews[currentIndex].name}
                      </h4>
                      <p className="text-gray-600">
                        Purchased: {reviews[currentIndex].product}
                      </p>
                      <p className="text-gray-500 text-sm">
                        {reviews[currentIndex].location} • {reviews[currentIndex].date}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevReview}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center text-gray-600 hover:text-primary-600 hover:scale-110"
          >
            <SafeIcon icon={FiChevronLeft} className="w-6 h-6" />
          </button>
          
          <button
            onClick={nextReview}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center text-gray-600 hover:text-primary-600 hover:scale-110"
          >
            <SafeIcon icon={FiChevronRight} className="w-6 h-6" />
          </button>

          {/* Dot Indicators */}
          <div className="flex justify-center space-x-2 mt-8">
            {reviews.map((_, index) => (
              <button
                key={index}
                onClick={() => goToReview(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentIndex
                    ? 'bg-primary-600 scale-125'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>

          {/* Review Counter */}
          <div className="text-center mt-6">
            <p className="text-gray-500 text-sm">
              {currentIndex + 1} of {reviews.length} reviews
            </p>
          </div>
        </div>

        {/* Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16"
        >
          {[
            { number: '5,000+', label: 'Happy Customers' },
            { number: '4.9/5', label: 'Average Rating' },
            { number: '99%', label: 'Live Arrival Rate' }
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                {stat.number}
              </div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ReviewsCarousel;