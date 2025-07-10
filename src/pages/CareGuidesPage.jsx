import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import SafeIcon from '../components/common/SafeIcon';
import Layout from '../components/layout/Layout';
import * as FiIcons from 'react-icons/fi';

const { FiBook, FiHeart, FiDroplet, FiThermometer, FiClock, FiAlertCircle, FiCheck, FiStar, FiEye, FiShield, FiTrendingUp } = FiIcons;

const CareGuidesPage = () => {
  const location = useLocation();
  const [selectedGuide, setSelectedGuide] = useState(null);

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

  const careGuides = [
    {
      id: 'betta-care',
      title: 'Complete Betta Fish Care Guide',
      description: 'Everything you need to know about caring for betta fish',
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop',
      difficulty: 'Beginner',
      readTime: '10 min',
      category: 'Fish Care',
      content: {
        overview: 'Betta fish, also known as Siamese fighting fish, are one of the most popular aquarium fish. With proper care, they can live 2-4 years and display vibrant colors and personalities.',
        sections: [
          {
            title: 'Tank Requirements',
            icon: FiDroplet,
            content: [
              'Minimum tank size: 5 gallons (larger is better)',
              'Water temperature: 76-82°F (24-28°C)',
              'pH level: 6.5-7.5',
              'Gentle filtration (bettas don\'t like strong currents)',
              'Heater required for temperature stability'
            ]
          },
          {
            title: 'Feeding',
            icon: FiHeart,
            content: [
              'High-quality betta pellets as staple food',
              'Feed 2-4 pellets once or twice daily',
              'Occasional treats: bloodworms, brine shrimp',
              'Fast one day per week to prevent bloating',
              'Remove uneaten food after 2-3 minutes'
            ]
          },
          {
            title: 'Water Maintenance',
            icon: FiDroplet,
            content: [
              'Change 25-50% of water weekly',
              'Use water conditioner to remove chlorine',
              'Test water parameters regularly',
              'Keep ammonia and nitrite at 0 ppm',
              'Nitrate should be below 20 ppm'
            ]
          },
          {
            title: 'Tank Decoration',
            icon: FiEye,
            content: [
              'Provide hiding spots (caves, plants)',
              'Live or silk plants (avoid plastic)',
              'Smooth decorations to prevent fin tears',
              'Leave space at surface for breathing',
              'Dim lighting to reduce stress'
            ]
          }
        ]
      }
    },
    {
      id: 'guppy-care',
      title: 'Guppy Fish Care Guide',
      description: 'Learn how to care for colorful and active guppy fish',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
      difficulty: 'Beginner',
      readTime: '8 min',
      category: 'Fish Care',
      content: {
        overview: 'Guppies are hardy, colorful fish perfect for beginners. They\'re social creatures that thrive in groups and are known for their vibrant colors and active personalities.',
        sections: [
          {
            title: 'Tank Setup',
            icon: FiDroplet,
            content: [
              'Minimum 10 gallons for a small group',
              'Water temperature: 72-78°F (22-26°C)',
              'pH level: 7.0-8.0',
              'Good filtration and aeration',
              'Keep in groups of 3 or more'
            ]
          },
          {
            title: 'Diet and Nutrition',
            icon: FiHeart,
            content: [
              'High-quality tropical fish flakes',
              'Feed small amounts 2-3 times daily',
              'Supplement with live or frozen foods',
              'Vegetable matter (blanched peas, spirulina)',
              'Avoid overfeeding to prevent water quality issues'
            ]
          },
          {
            title: 'Breeding Considerations',
            icon: FiTrendingUp,
            content: [
              'Guppies breed readily in aquariums',
              'Separate pregnant females if desired',
              'Provide hiding spots for fry',
              'Males have colorful tails, females are larger',
              'Can produce offspring every 4-6 weeks'
            ]
          }
        ]
      }
    },
    {
      id: 'aquarium-setup',
      title: 'New Aquarium Setup Guide',
      description: 'Step-by-step guide to setting up your first aquarium',
      image: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400&h=300&fit=crop',
      difficulty: 'Beginner',
      readTime: '15 min',
      category: 'Setup',
      content: {
        overview: 'Setting up your first aquarium can be exciting but overwhelming. This guide will walk you through each step to create a healthy environment for your fish.',
        sections: [
          {
            title: 'Planning Your Tank',
            icon: FiBook,
            content: [
              'Choose appropriate tank size for your fish',
              'Consider placement (away from direct sunlight)',
              'Ensure sturdy, level surface',
              'Plan for electrical outlets nearby',
              'Research compatible fish species'
            ]
          },
          {
            title: 'Essential Equipment',
            icon: FiShield,
            content: [
              'Filter appropriate for tank size',
              'Heater (for tropical fish)',
              'Thermometer for temperature monitoring',
              'LED lighting system',
              'Water testing kit',
              'Substrate (gravel or sand)',
              'Water conditioner'
            ]
          },
          {
            title: 'Cycling Process',
            icon: FiClock,
            content: [
              'Set up tank with equipment running',
              'Add beneficial bacteria supplement',
              'Test water daily for ammonia, nitrite, nitrate',
              'Cycling typically takes 4-6 weeks',
              'Add fish gradually after cycle completes',
              'Monitor water parameters closely'
            ]
          }
        ]
      }
    },
    {
      id: 'water-quality',
      title: 'Water Quality Management',
      description: 'Understanding and maintaining optimal water conditions',
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop',
      difficulty: 'Intermediate',
      readTime: '12 min',
      category: 'Maintenance',
      content: {
        overview: 'Water quality is the foundation of fish health. Understanding key parameters and how to maintain them is crucial for a thriving aquarium.',
        sections: [
          {
            title: 'Key Parameters',
            icon: FiThermometer,
            content: [
              'Temperature: Species-specific ranges',
              'pH: 6.5-8.0 for most freshwater fish',
              'Ammonia: Should always be 0 ppm',
              'Nitrite: Should always be 0 ppm',
              'Nitrate: Keep below 20 ppm',
              'Hardness: Varies by species'
            ]
          },
          {
            title: 'Testing Schedule',
            icon: FiClock,
            content: [
              'Test weekly during normal operation',
              'Test daily during cycling or problems',
              'Keep a log of test results',
              'Test after water changes',
              'Use quality test kits for accuracy'
            ]
          },
          {
            title: 'Problem Solutions',
            icon: FiAlertCircle,
            content: [
              'High ammonia/nitrite: Increase water changes',
              'High nitrate: More frequent water changes',
              'pH swings: Check and adjust gradually',
              'Cloudy water: Check filtration and feeding',
              'Never change more than 50% water at once'
            ]
          }
        ]
      }
    }
  ];

  const categories = [
    { id: 'all', name: 'All Guides', count: careGuides.length },
    { id: 'Fish Care', name: 'Fish Care', count: careGuides.filter(g => g.category === 'Fish Care').length },
    { id: 'Setup', name: 'Setup', count: careGuides.filter(g => g.category === 'Setup').length },
    { id: 'Maintenance', name: 'Maintenance', count: careGuides.filter(g => g.category === 'Maintenance').length }
  ];

  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const filteredGuides = selectedCategory === 'all' 
    ? careGuides 
    : careGuides.filter(guide => guide.category === selectedCategory);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (selectedGuide) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={() => setSelectedGuide(null)}
            className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6 font-medium"
          >
            <SafeIcon icon={FiIcons.FiArrowLeft} className="w-4 h-4 mr-2" />
            Back to Care Guides
          </button>

          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-soft overflow-hidden"
          >
            <div className="relative">
              <img
                src={selectedGuide.image}
                alt={selectedGuide.title}
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-6 left-6 text-white">
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(selectedGuide.difficulty)} mb-2`}>
                  {selectedGuide.difficulty}
                </span>
                <h1 className="text-3xl font-bold mb-2">{selectedGuide.title}</h1>
                <p className="text-lg opacity-90">{selectedGuide.description}</p>
              </div>
            </div>

            <div className="p-8">
              <div className="flex items-center space-x-6 mb-8 text-sm text-gray-600">
                <div className="flex items-center">
                  <SafeIcon icon={FiClock} className="w-4 h-4 mr-2" />
                  {selectedGuide.readTime} read
                </div>
                <div className="flex items-center">
                  <SafeIcon icon={FiBook} className="w-4 h-4 mr-2" />
                  {selectedGuide.category}
                </div>
              </div>

              <div className="prose max-w-none mb-8">
                <p className="text-lg text-gray-700 leading-relaxed">
                  {selectedGuide.content.overview}
                </p>
              </div>

              <div className="space-y-8">
                {selectedGuide.content.sections.map((section, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-50 rounded-xl p-6"
                  >
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
                        <SafeIcon icon={section.icon} className="w-5 h-5 text-primary-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900">{section.title}</h3>
                    </div>
                    <ul className="space-y-3">
                      {section.content.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start">
                          <SafeIcon icon={FiCheck} className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>

              <div className="mt-12 p-6 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Need More Help?</h3>
                <p className="text-gray-600 mb-4">
                  Our aquarium experts are here to help with any questions about fish care.
                </p>
                <button className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors">
                  Contact Our Experts
                </button>
              </div>
            </div>
          </motion.article>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Fish Care Guides</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive guides to help you provide the best care for your aquatic friends.
            From beginner basics to advanced techniques.
          </p>
        </motion.div>

        {/* Category Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-soft p-4 mb-8"
        >
          <div className="flex overflow-x-auto py-1 space-x-2 no-scrollbar">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap flex items-center ${
                  selectedCategory === category.id
                    ? 'bg-gradient-brand text-white shadow-brand'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span>{category.name}</span>
                <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                  selectedCategory === category.id
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {category.count}
                </span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Care Guides Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredGuides.map((guide, index) => (
            <motion.div
              key={guide.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-soft overflow-hidden hover:shadow-brand-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer"
              onClick={() => setSelectedGuide(guide)}
            >
              <div className="relative">
                <img
                  src={guide.image}
                  alt={guide.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(guide.difficulty)}`}>
                    {guide.difficulty}
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <span className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-gray-700">
                    {guide.readTime}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center mb-2">
                  <SafeIcon icon={FiBook} className="w-4 h-4 text-primary-600 mr-2" />
                  <span className="text-sm text-primary-600 font-medium">{guide.category}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 hover:text-primary-600 transition-colors">
                  {guide.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {guide.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                    <SafeIcon icon={FiStar} className="w-4 h-4 text-secondary-500 mr-1" />
                    <span>Expert Recommended</span>
                  </div>
                  <SafeIcon icon={FiIcons.FiArrowRight} className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Tips Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-16 bg-gradient-to-r from-primary-600 to-accent-600 rounded-xl p-8 text-center text-white"
        >
          <h2 className="text-2xl font-bold mb-4">Need Quick Help?</h2>
          <p className="text-primary-100 mb-6 max-w-2xl mx-auto">
            Check out our Tips & Tricks page for quick solutions to common aquarium problems
            and expert advice for keeping your fish healthy and happy.
          </p>
          <button
            onClick={() => window.location.href = '/tips-tricks'}
            className="inline-flex items-center px-6 py-3 bg-white text-primary-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            <SafeIcon icon={FiTrendingUp} className="w-5 h-5 mr-2" />
            View Tips & Tricks
          </button>
        </motion.div>
      </div>
    </Layout>
  );
};

export default CareGuidesPage;