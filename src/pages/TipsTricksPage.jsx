import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import SafeIcon from '../components/common/SafeIcon';
import Layout from '../components/layout/Layout';
import * as FiIcons from 'react-icons/fi';

const { FiLightbulb, FiZap, FiTool, FiHeart, FiDroplet, FiThermometer, FiClock, FiAlertCircle, FiCheck, FiStar, FiEye, FiShield, FiTrendingUp, FiActivity, FiTarget } = FiIcons;

const TipsTricksPage = () => {
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

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

  const tips = [
    {
      id: 1,
      title: 'Quick Water Temperature Fix',
      description: 'Emergency method to adjust water temperature safely',
      category: 'Emergency',
      difficulty: 'Beginner',
      timeToRead: '2 min',
      icon: FiThermometer,
      content: {
        problem: 'Your aquarium water is too hot or too cold and you need to adjust it quickly.',
        solution: [
          'For hot water: Add small amounts of cooler dechlorinated water gradually',
          'For cold water: Use aquarium heater or add slightly warmer water',
          'Never change temperature more than 2°F per hour',
          'Float ice cubes in sealed plastic bags for emergency cooling',
          'Monitor fish behavior during temperature changes'
        ],
        tips: [
          'Keep spare heaters for emergency situations',
          'Invest in a backup power source for heaters',
          'Check temperature daily with a reliable thermometer'
        ]
      }
    },
    {
      id: 2,
      title: 'Crystal Clear Water in 24 Hours',
      description: 'Fast method to clear cloudy aquarium water',
      category: 'Water Quality',
      difficulty: 'Intermediate',
      timeToRead: '3 min',
      icon: FiDroplet,
      content: {
        problem: 'Your aquarium water has become cloudy and you need it clear quickly.',
        solution: [
          'Stop feeding for 24 hours to reduce organic waste',
          'Increase filtration by adding filter floss or activated carbon',
          'Perform a 25% water change with dechlorinated water',
          'Add beneficial bacteria supplement to boost filtration',
          'Check and clean filter media if needed'
        ],
        tips: [
          'Cloudy water is often caused by overfeeding',
          'Green cloudiness usually indicates algae bloom',
          'White cloudiness often means bacterial bloom'
        ]
      }
    },
    {
      id: 3,
      title: 'Betta Bubble Nest Secrets',
      description: 'Encourage your betta to build beautiful bubble nests',
      category: 'Fish Behavior',
      difficulty: 'Beginner',
      timeToRead: '2 min',
      icon: FiHeart,
      content: {
        problem: 'You want to encourage your betta fish to build bubble nests as a sign of health and happiness.',
        solution: [
          'Maintain water temperature between 78-80°F',
          'Keep water level slightly lower to reduce surface tension',
          'Provide floating plants or leaves for nest anchoring',
          'Ensure gentle or no surface agitation from filters',
          'Feed high-quality protein-rich foods regularly'
        ],
        tips: [
          'Bubble nests indicate a healthy, happy betta',
          'Male bettas build nests even without females present',
          'Don\'t disturb the nest - let your betta enjoy it'
        ]
      }
    },
    {
      id: 4,
      title: 'Algae Prevention Masterclass',
      description: 'Keep algae under control with these proven methods',
      category: 'Maintenance',
      difficulty: 'Intermediate',
      timeToRead: '4 min',
      icon: FiShield,
      content: {
        problem: 'Preventing algae growth before it becomes a major problem in your aquarium.',
        solution: [
          'Limit lighting to 8-10 hours per day maximum',
          'Keep nitrate levels below 20 ppm through regular water changes',
          'Don\'t overfeed - remove uneaten food within 5 minutes',
          'Add live plants to compete with algae for nutrients',
          'Clean glass weekly to prevent algae buildup'
        ],
        tips: [
          'Brown algae (diatoms) are common in new tanks',
          'Green spot algae indicates good water quality',
          'Blue-green algae (cyanobacteria) needs immediate attention'
        ]
      }
    },
    {
      id: 5,
      title: 'Fish Stress Detection',
      description: 'Early warning signs that your fish are stressed',
      category: 'Fish Health',
      difficulty: 'Beginner',
      timeToRead: '3 min',
      icon: FiActivity,
      content: {
        problem: 'Learning to identify stress in fish before it leads to serious health problems.',
        solution: [
          'Watch for rapid gill movement or gasping at surface',
          'Look for faded colors or unusual hiding behavior',
          'Check for torn fins, white spots, or unusual swimming patterns',
          'Monitor appetite - stressed fish often stop eating',
          'Test water parameters immediately if stress signs appear'
        ],
        tips: [
          'Stress is often the first sign of water quality problems',
          'New fish may show stress for 1-2 weeks while acclimating',
          'Quarantine new fish to prevent disease transmission'
        ]
      }
    },
    {
      id: 6,
      title: 'DIY Aquarium Vacuum',
      description: 'Create an effective gravel vacuum from household items',
      category: 'DIY',
      difficulty: 'Beginner',
      timeToRead: '2 min',
      icon: FiTool,
      content: {
        problem: 'You need to clean aquarium gravel but don\'t have a commercial vacuum.',
        solution: [
          'Use a clear plastic bottle and aquarium tubing',
          'Cut the bottom off the bottle for the vacuum chamber',
          'Attach tubing to the bottle neck opening',
          'Start siphon by sucking on tube end (use valve to avoid water in mouth)',
          'Move vacuum over gravel to remove debris'
        ],
        tips: [
          'Practice the siphon technique before using in tank',
          'Clean only 1/3 of gravel per cleaning session',
          'Commercial vacuums are more efficient for regular use'
        ]
      }
    },
    {
      id: 7,
      title: 'Power Outage Fish Care',
      description: 'Keep your fish safe during electrical outages',
      category: 'Emergency',
      difficulty: 'Intermediate',
      timeToRead: '4 min',
      icon: FiZap,
      content: {
        problem: 'Maintaining fish health when power is out and equipment isn\'t working.',
        solution: [
          'Wrap tank in blankets to maintain temperature',
          'Use battery-powered air pump if available',
          'Manually agitate water surface every few hours',
          'Don\'t feed fish during outages to reduce oxygen demand',
          'Monitor temperature and add warm water if needed'
        ],
        tips: [
          'Fish can survive 2-3 days without filtration if not overcrowded',
          'Cold water fish tolerate temperature drops better than tropical fish',
          'Invest in battery backup systems for critical equipment'
        ]
      }
    },
    {
      id: 8,
      title: 'Perfect Feeding Schedule',
      description: 'Optimize feeding times and amounts for healthier fish',
      category: 'Feeding',
      difficulty: 'Beginner',
      timeToRead: '3 min',
      icon: FiClock,
      content: {
        problem: 'Establishing the right feeding routine for optimal fish health.',
        solution: [
          'Feed adult fish once or twice daily at consistent times',
          'Give only what fish can consume in 2-3 minutes',
          'Fast fish one day per week to aid digestion',
          'Vary diet with different foods throughout the week',
          'Remove uneaten food promptly to maintain water quality'
        ],
        tips: [
          'Young fish need more frequent feeding (3-4 times daily)',
          'Overfeeding is more harmful than underfeeding',
          'Fish can survive several days without food if necessary'
        ]
      }
    },
    {
      id: 9,
      title: 'Natural Plant Fertilizer',
      description: 'Boost plant growth with simple homemade fertilizers',
      category: 'Plants',
      difficulty: 'Intermediate',
      timeToRead: '3 min',
      icon: FiTrendingUp,
      content: {
        problem: 'Your aquarium plants aren\'t growing well and you need a natural fertilizer boost.',
        solution: [
          'Use liquid fertilizer specifically designed for aquariums',
          'Add root tabs near heavy root feeder plants',
          'Maintain CO2 levels with liquid carbon supplements',
          'Ensure proper lighting duration and intensity',
          'Trim dead leaves regularly to redirect energy'
        ],
        tips: [
          'Fish waste provides natural nitrogen for plants',
          'Red plants usually need more iron supplementation',
          'Fast-growing plants help control algae naturally'
        ]
      }
    },
    {
      id: 10,
      title: 'Fish Compatibility Quick Check',
      description: 'Avoid fish conflicts with this simple compatibility guide',
      category: 'Fish Selection',
      difficulty: 'Beginner',
      timeToRead: '2 min',
      icon: FiTarget,
      content: {
        problem: 'Ensuring new fish will get along with your existing aquarium community.',
        solution: [
          'Research adult size of all fish before purchasing',
          'Match water parameter requirements (pH, temperature, hardness)',
          'Consider temperament - aggressive vs peaceful species',
          'Ensure similar dietary needs for easier feeding',
          'Plan for adequate swimming space for all fish'
        ],
        tips: [
          'Introduce new fish gradually to reduce aggression',
          'Quarantine new arrivals for 2-3 weeks',
          'Some fish are better in groups, others prefer solitude'
        ]
      }
    }
  ];

  const categories = [
    { id: 'all', name: 'All Tips', count: tips.length },
    { id: 'Emergency', name: 'Emergency', count: tips.filter(t => t.category === 'Emergency').length },
    { id: 'Water Quality', name: 'Water Quality', count: tips.filter(t => t.category === 'Water Quality').length },
    { id: 'Fish Health', name: 'Fish Health', count: tips.filter(t => t.category === 'Fish Health').length },
    { id: 'Maintenance', name: 'Maintenance', count: tips.filter(t => t.category === 'Maintenance').length },
    { id: 'DIY', name: 'DIY', count: tips.filter(t => t.category === 'DIY').length },
    { id: 'Feeding', name: 'Feeding', count: tips.filter(t => t.category === 'Feeding').length },
    { id: 'Plants', name: 'Plants', count: tips.filter(t => t.category === 'Plants').length },
    { id: 'Fish Selection', name: 'Fish Selection', count: tips.filter(t => t.category === 'Fish Selection').length },
    { id: 'Fish Behavior', name: 'Fish Behavior', count: tips.filter(t => t.category === 'Fish Behavior').length }
  ];

  // Filter tips based on category and search
  const filteredTips = tips.filter(tip => {
    const matchesCategory = selectedCategory === 'all' || tip.category === selectedCategory;
    const matchesSearch = tip.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tip.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tip.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Emergency': 'bg-red-100 text-red-800',
      'Water Quality': 'bg-blue-100 text-blue-800',
      'Fish Health': 'bg-green-100 text-green-800',
      'Maintenance': 'bg-purple-100 text-purple-800',
      'DIY': 'bg-orange-100 text-orange-800',
      'Feeding': 'bg-yellow-100 text-yellow-800',
      'Plants': 'bg-emerald-100 text-emerald-800',
      'Fish Selection': 'bg-indigo-100 text-indigo-800',
      'Fish Behavior': 'bg-pink-100 text-pink-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Tips & Tricks</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Quick solutions, expert advice, and proven techniques to solve common aquarium problems
            and enhance your fish-keeping experience.
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-soft p-6 mb-8"
        >
          {/* Search Bar */}
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SafeIcon icon={FiIcons.FiSearch} className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Search tips and tricks..."
            />
          </div>

          {/* Category Filters */}
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

        {/* Results Count */}
        <div className="flex items-center mb-6">
          <SafeIcon icon={FiLightbulb} className="w-5 h-5 text-gray-600 mr-2" />
          <span className="text-gray-600 font-medium">
            {filteredTips.length} tip{filteredTips.length !== 1 ? 's' : ''} found
            {searchTerm && (
              <span className="ml-2">
                for "<span className="font-semibold">{searchTerm}</span>"
              </span>
            )}
          </span>
        </div>

        {/* Tips Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTips.map((tip, index) => (
            <motion.div
              key={tip.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-soft overflow-hidden hover:shadow-brand-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <SafeIcon icon={tip.icon} className="w-6 h-6 text-primary-600" />
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(tip.difficulty)}`}>
                      {tip.difficulty}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(tip.category)}`}>
                      {tip.category}
                    </span>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2">{tip.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{tip.description}</p>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <SafeIcon icon={FiClock} className="w-4 h-4 mr-1" />
                    {tip.timeToRead}
                  </div>
                  <div className="flex items-center">
                    <SafeIcon icon={FiStar} className="w-4 h-4 text-secondary-500 mr-1" />
                    Quick Fix
                  </div>
                </div>

                {/* Expandable Content */}
                <details className="group">
                  <summary className="cursor-pointer bg-gray-50 hover:bg-gray-100 rounded-lg p-3 transition-colors">
                    <span className="font-medium text-primary-600">View Solution</span>
                    <SafeIcon icon={FiIcons.FiChevronDown} className="w-4 h-4 text-gray-400 float-right group-open:rotate-180 transition-transform" />
                  </summary>
                  
                  <div className="mt-4 space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                        <SafeIcon icon={FiAlertCircle} className="w-4 h-4 text-orange-500 mr-2" />
                        Problem
                      </h4>
                      <p className="text-gray-700 text-sm">{tip.content.problem}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                        <SafeIcon icon={FiCheck} className="w-4 h-4 text-green-500 mr-2" />
                        Solution
                      </h4>
                      <ul className="space-y-1">
                        {tip.content.solution.map((step, stepIndex) => (
                          <li key={stepIndex} className="flex items-start text-sm text-gray-700">
                            <span className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-bold mr-2 mt-0.5 flex-shrink-0">
                              {stepIndex + 1}
                            </span>
                            {step}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                        <SafeIcon icon={FiLightbulb} className="w-4 h-4 text-yellow-500 mr-2" />
                        Pro Tips
                      </h4>
                      <ul className="space-y-1">
                        {tip.content.tips.map((protip, tipIndex) => (
                          <li key={tipIndex} className="flex items-start text-sm text-gray-700">
                            <SafeIcon icon={FiStar} className="w-3 h-3 text-secondary-500 mr-2 mt-1 flex-shrink-0" />
                            {protip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </details>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredTips.length === 0 && (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <SafeIcon icon={FiIcons.FiSearch} className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tips found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search terms or category filters.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
              className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-16 bg-gradient-to-r from-primary-600 to-accent-600 rounded-xl p-8 text-center text-white"
        >
          <h2 className="text-2xl font-bold mb-4">Need More Detailed Guidance?</h2>
          <p className="text-primary-100 mb-6 max-w-2xl mx-auto">
            Check out our comprehensive Care Guides for in-depth information about fish care,
            tank setup, and long-term maintenance strategies.
          </p>
          <button
            onClick={() => window.location.href = '/care-guides'}
            className="inline-flex items-center px-6 py-3 bg-white text-primary-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            <SafeIcon icon={FiIcons.FiBook} className="w-5 h-5 mr-2" />
            View Care Guides
          </button>
        </motion.div>
      </div>
    </Layout>
  );
};

export default TipsTricksPage;