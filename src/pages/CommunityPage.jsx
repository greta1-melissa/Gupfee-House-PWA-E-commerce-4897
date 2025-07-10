import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../components/common/SafeIcon';
import Layout from '../components/layout/Layout';
import * as FiIcons from 'react-icons/fi';

const { FiUsers, FiMessageCircle, FiHeart, FiStar, FiCalendar, FiEye, FiThumbsUp, FiShare2, FiBookmark, FiTrendingUp, FiAward, FiCamera, FiEdit3, FiClock } = FiIcons;

const CommunityPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  const categories = [
    { id: 'all', name: 'All Posts', count: 156 },
    { id: 'showcase', name: 'Tank Showcase', count: 45 },
    { id: 'help', name: 'Need Help', count: 38 },
    { id: 'discussion', name: 'General Discussion', count: 42 },
    { id: 'breeding', name: 'Breeding', count: 18 },
    { id: 'equipment', name: 'Equipment Reviews', count: 13 }
  ];

  const communityPosts = [
    {
      id: 1,
      type: 'showcase',
      title: 'My 20-gallon planted betta tank setup!',
      content: 'Finally finished setting up my dream betta tank. Took 3 months to cycle and get the plants established. My betta Fish seems to love it!',
      author: {
        name: 'Sarah M.',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b586?w=150&h=150&fit=crop&crop=face',
        level: 'Expert Aquarist',
        joinDate: '2 years ago'
      },
      images: [
        'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop'
      ],
      timeAgo: '2 hours ago',
      likes: 24,
      comments: 8,
      views: 156,
      tags: ['betta', 'planted-tank', 'showcase']
    },
    {
      id: 2,
      type: 'help',
      title: 'Help! My guppy has white spots - is this ich?',
      content: 'I noticed small white spots on my male guppy this morning. Water parameters are all normal. Could this be ich? What should I do?',
      author: {
        name: 'Mike Chen',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        level: 'Beginner',
        joinDate: '3 months ago'
      },
      images: [
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'
      ],
      timeAgo: '4 hours ago',
      likes: 12,
      comments: 15,
      views: 89,
      tags: ['guppy', 'disease', 'help-needed'],
      urgent: true
    },
    {
      id: 3,
      type: 'discussion',
      title: 'Best plants for beginners? Share your favorites!',
      content: 'Starting my first planted tank and looking for low-maintenance plants that won\'t die on me. What are your go-to beginner plants?',
      author: {
        name: 'Emma Rodriguez',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        level: 'Enthusiast',
        joinDate: '8 months ago'
      },
      timeAgo: '6 hours ago',
      likes: 18,
      comments: 23,
      views: 234,
      tags: ['plants', 'beginner', 'discussion']
    },
    {
      id: 4,
      type: 'breeding',
      title: 'Successfully bred my first batch of guppy fry!',
      content: 'After months of trying, I finally have healthy guppy fry! Here are some tips that worked for me...',
      author: {
        name: 'David Kim',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        level: 'Advanced',
        joinDate: '1 year ago'
      },
      images: [
        'https://images.unsplash.com/photo-1571752726703-5e7d1f6a986d?w=400&h=300&fit=crop'
      ],
      timeAgo: '1 day ago',
      likes: 31,
      comments: 12,
      views: 178,
      tags: ['guppy', 'breeding', 'success-story']
    },
    {
      id: 5,
      type: 'equipment',
      title: 'Review: Aquarium Heater Pro - 3 months later',
      content: 'Been using the Aquarium Heater Pro for 3 months now. Here\'s my honest review of its performance...',
      author: {
        name: 'Lisa Thompson',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
        level: 'Expert Aquarist',
        joinDate: '3 years ago'
      },
      timeAgo: '2 days ago',
      likes: 19,
      comments: 7,
      views: 145,
      tags: ['equipment', 'review', 'heater']
    }
  ];

  const topContributors = [
    {
      name: 'Sarah M.',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b586?w=150&h=150&fit=crop&crop=face',
      posts: 47,
      likes: 892,
      badge: 'Expert Aquarist'
    },
    {
      name: 'James Wilson',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      posts: 38,
      likes: 654,
      badge: 'Plant Specialist'
    },
    {
      name: 'Lisa Thompson',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
      posts: 29,
      likes: 523,
      badge: 'Equipment Expert'
    }
  ];

  const getTypeIcon = (type) => {
    switch (type) {
      case 'showcase': return FiCamera;
      case 'help': return FiMessageCircle;
      case 'discussion': return FiUsers;
      case 'breeding': return FiHeart;
      case 'equipment': return FiStar;
      default: return FiMessageCircle;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'showcase': return 'bg-purple-100 text-purple-800';
      case 'help': return 'bg-red-100 text-red-800';
      case 'discussion': return 'bg-blue-100 text-blue-800';
      case 'breeding': return 'bg-pink-100 text-pink-800';
      case 'equipment': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredPosts = selectedCategory === 'all' 
    ? communityPosts 
    : communityPosts.filter(post => post.type === selectedCategory);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Aquarist Community
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connect with fellow fish enthusiasts, share your tank setups, get expert advice, 
            and learn from the experiences of our vibrant aquarium community.
          </p>
        </motion.div>

        {/* Community Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          {[
            { label: 'Active Members', value: '2,847', icon: FiUsers },
            { label: 'Posts This Month', value: '156', icon: FiEdit3 },
            { label: 'Expert Answers', value: '89', icon: FiAward },
            { label: 'Success Stories', value: '34', icon: FiTrendingUp }
          ].map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-soft p-6 text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <SafeIcon icon={stat.icon} className="w-6 h-6 text-primary-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-gray-600 text-sm">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Filters and Sort */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-soft p-6 mb-6"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
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

                {/* Sort Options */}
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="recent">Most Recent</option>
                    <option value="popular">Most Popular</option>
                    <option value="discussed">Most Discussed</option>
                  </select>
                </div>
              </div>
            </motion.div>

            {/* New Post Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-r from-primary-600 to-accent-600 rounded-xl p-6 mb-6 text-white"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Share with the Community</h3>
                  <p className="text-primary-100">
                    Show off your tank, ask for help, or start a discussion!
                  </p>
                </div>
                <button className="bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center space-x-2">
                  <SafeIcon icon={FiEdit3} className="w-5 h-5" />
                  <span>Create Post</span>
                </button>
              </div>
            </motion.div>

            {/* Community Posts */}
            <div className="space-y-6">
              {filteredPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-soft overflow-hidden hover:shadow-medium transition-all duration-300"
                >
                  <div className="p-6">
                    {/* Post Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={post.author.avatar}
                          alt={post.author.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="font-semibold text-gray-900">{post.author.name}</h4>
                            <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full">
                              {post.author.level}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <SafeIcon icon={FiClock} className="w-3 h-3" />
                            <span>{post.timeAgo}</span>
                            <span>•</span>
                            <span>Member for {post.author.joinDate}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {post.urgent && (
                          <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                            Urgent
                          </span>
                        )}
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(post.type)}`}>
                          <SafeIcon icon={getTypeIcon(post.type)} className="w-3 h-3 inline mr-1" />
                          {post.type.charAt(0).toUpperCase() + post.type.slice(1)}
                        </span>
                      </div>
                    </div>

                    {/* Post Content */}
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">{post.title}</h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">{post.content}</p>

                    {/* Post Images */}
                    {post.images && post.images.length > 0 && (
                      <div className={`grid gap-2 mb-4 ${
                        post.images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'
                      }`}>
                        {post.images.map((image, imgIndex) => (
                          <img
                            key={imgIndex}
                            src={image}
                            alt={`Post image ${imgIndex + 1}`}
                            className="w-full h-48 object-cover rounded-lg"
                          />
                        ))}
                      </div>
                    )}

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-xs"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* Post Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center space-x-6">
                        <button className="flex items-center space-x-2 text-gray-500 hover:text-red-500 transition-colors">
                          <SafeIcon icon={FiHeart} className="w-5 h-5" />
                          <span className="text-sm">{post.likes}</span>
                        </button>
                        <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors">
                          <SafeIcon icon={FiMessageCircle} className="w-5 h-5" />
                          <span className="text-sm">{post.comments}</span>
                        </button>
                        <div className="flex items-center space-x-2 text-gray-500">
                          <SafeIcon icon={FiEye} className="w-5 h-5" />
                          <span className="text-sm">{post.views}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
                          <SafeIcon icon={FiBookmark} className="w-5 h-5" />
                        </button>
                        <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
                          <SafeIcon icon={FiShare2} className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Top Contributors */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-xl shadow-soft p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <SafeIcon icon={FiAward} className="w-5 h-5 text-primary-600 mr-2" />
                  Top Contributors
                </h3>
                <div className="space-y-4">
                  {topContributors.map((contributor, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <img
                        src={contributor.avatar}
                        alt={contributor.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{contributor.name}</div>
                        <div className="text-xs text-gray-500">{contributor.badge}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">{contributor.posts}</div>
                        <div className="text-xs text-gray-500">{contributor.likes} likes</div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Community Guidelines */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white rounded-xl shadow-soft p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Community Guidelines</h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-start space-x-2">
                    <SafeIcon icon={FiHeart} className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <span>Be kind and respectful to all members</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <SafeIcon icon={FiCamera} className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span>Share high-quality photos of your tanks</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <SafeIcon icon={FiMessageCircle} className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Provide helpful and accurate advice</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <SafeIcon icon={FiBookmark} className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                    <span>Use relevant tags for better discovery</span>
                  </div>
                </div>
              </motion.div>

              {/* Quick Links */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white rounded-xl shadow-soft p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
                <div className="space-y-3">
                  <a
                    href="/care-guides"
                    className="flex items-center space-x-3 text-gray-600 hover:text-primary-600 transition-colors"
                  >
                    <SafeIcon icon={FiIcons.FiBook} className="w-4 h-4" />
                    <span>Care Guides</span>
                  </a>
                  <a
                    href="/tips-tricks"
                    className="flex items-center space-x-3 text-gray-600 hover:text-primary-600 transition-colors"
                  >
                    <SafeIcon icon={FiIcons.FiZap} className="w-4 h-4" />
                    <span>Tips & Tricks</span>
                  </a>
                  <a
                    href="/products"
                    className="flex items-center space-x-3 text-gray-600 hover:text-primary-600 transition-colors"
                  >
                    <SafeIcon icon={FiIcons.FiShoppingBag} className="w-4 h-4" />
                    <span>Shop Products</span>
                  </a>
                  <a
                    href="/contact"
                    className="flex items-center space-x-3 text-gray-600 hover:text-primary-600 transition-colors"
                  >
                    <SafeIcon icon={FiIcons.FiMail} className="w-4 h-4" />
                    <span>Contact Experts</span>
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CommunityPage;