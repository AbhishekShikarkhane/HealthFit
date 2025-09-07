import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useUserData } from '../context/UserDataContext';
import { FaShare, FaTwitter, FaFacebook, FaLinkedin } from 'react-icons/fa';
import { HiOutlineClipboardCheck, HiOutlineInformationCircle } from 'react-icons/hi';

const Challenges = () => {
  const { userData } = useUserData();
  const [activeTab, setActiveTab] = useState('active');
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [progressValue, setProgressValue] = useState(0);
  const [progressNote, setProgressNote] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Sample challenge data
  const challenges = {
    active: [
      {
        id: 1,
        title: '30-Day Fitness Challenge',
        description: 'Complete a workout every day for 30 days to build consistency and improve overall fitness.',
        category: 'Workout',
        difficulty: 'Intermediate',
        duration: '30 days',
        progress: 10,
        startDate: '2023-06-01',
        endDate: '2023-06-30',
        rewards: ['Badge: Consistency King', '500 Points']
      },
      {
        id: 2,
        title: 'Hydration Hero',
        description: 'Drink at least 8 glasses of water every day for 14 days to improve hydration and overall health.',
        category: 'Nutrition',
        difficulty: 'Beginner',
        duration: '14 days',
        progress: 5,
        startDate: '2023-06-05',
        endDate: '2023-06-19',
        rewards: ['Badge: Hydration Hero', '200 Points']
      },
      {
        id: 3,
        title: '10K Steps Daily',
        description: 'Walk at least 10,000 steps every day for 21 days to improve cardiovascular health and burn calories.',
        category: 'Activity',
        difficulty: 'Beginner',
        duration: '21 days',
        progress: 7,
        startDate: '2023-06-03',
        endDate: '2023-06-24',
        rewards: ['Badge: Step Master', '300 Points']
      }
    ],
    completed: [
      {
        id: 4,
        title: 'Protein Power',
        description: 'Consume at least 100g of protein daily for 7 days to support muscle recovery and growth.',
        category: 'Nutrition',
        difficulty: 'Intermediate',
        duration: '7 days',
        progress: 7,
        startDate: '2023-05-20',
        endDate: '2023-05-27',
        rewards: ['Badge: Protein Pro', '150 Points']
      },
      {
        id: 5,
        title: 'Meditation Week',
        description: 'Meditate for at least 10 minutes every day for 7 days to reduce stress and improve mental clarity.',
        category: 'Wellness',
        difficulty: 'Beginner',
        duration: '7 days',
        progress: 7,
        startDate: '2023-05-15',
        endDate: '2023-05-22',
        rewards: ['Badge: Zen Master', '150 Points']
      }
    ],
    available: [
      {
        id: 6,
        title: '100 Push-up Challenge',
        description: 'Build up to doing 100 push-ups in a single day over the course of 30 days.',
        category: 'Strength',
        difficulty: 'Advanced',
        duration: '30 days',
        rewards: ['Badge: Push-up Pro', '400 Points']
      },
      {
        id: 7,
        title: 'Sugar-Free Month',
        description: 'Eliminate added sugars from your diet for 30 days to reset your taste buds and improve health.',
        category: 'Nutrition',
        difficulty: 'Advanced',
        duration: '30 days',
        rewards: ['Badge: Sugar Slayer', '500 Points']
      },
      {
        id: 8,
        title: 'Early Bird',
        description: 'Wake up at 6 AM every day for 14 days to establish a consistent morning routine.',
        category: 'Lifestyle',
        difficulty: 'Intermediate',
        duration: '14 days',
        rewards: ['Badge: Early Riser', '250 Points']
      },
      {
        id: 9,
        title: 'Flexibility Focus',
        description: 'Complete a 15-minute stretching routine every day for 21 days to improve flexibility.',
        category: 'Flexibility',
        difficulty: 'Beginner',
        duration: '21 days',
        rewards: ['Badge: Flexibility Master', '300 Points']
      }
    ]
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Workout': 'bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200',
      'Nutrition': 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
      'Activity': 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200',
      'Wellness': 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200',
      'Strength': 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200',
      'Lifestyle': 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200',
      'Flexibility': 'bg-pink-100 dark:bg-pink-900 text-pink-800 dark:text-pink-200'
    };
    
    return colors[category] || 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200';
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      'Beginner': 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
      'Intermediate': 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200',
      'Advanced': 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
    };
    
    return colors[difficulty] || 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200';
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const calculateDaysLeft = (endDate) => {
    const end = new Date(endDate);
    const today = new Date();
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  // New functions for button functionality
  const handleLogProgress = (challenge) => {
    setSelectedChallenge(challenge);
    setProgressValue(challenge.progress);
    setShowProgressModal(true);
  };

  const handleViewDetails = (challenge) => {
    setSelectedChallenge(challenge);
    setShowDetailsModal(true);
  };

  const handleShareAchievement = (challenge) => {
    setSelectedChallenge(challenge);
    setShowShareModal(true);
  };

  const handleStartChallenge = (challenge) => {
    // In a real app, this would update the database
    // For now, we'll just show a success message
    setSelectedChallenge(challenge);
    setSuccessMessage(`You've started the ${challenge.title} challenge!`);
    setShowSuccessMessage(true);
    
    // Hide the message after 3 seconds
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);
  };

  const handleSubmitProgress = () => {
    // In a real app, this would update the database
    // For now, we'll just show a success message
    setShowProgressModal(false);
    setSuccessMessage(`Progress updated for ${selectedChallenge.title}!`);
    setShowSuccessMessage(true);
    
    // Hide the message after 3 seconds
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);
  };

  const handleShare = (platform) => {
    // In a real app, this would open the sharing dialog for the selected platform
    // For now, we'll just show a success message
    setShowShareModal(false);
    setSuccessMessage(`Shared to ${platform}!`);
    setShowSuccessMessage(true);
    
    // Hide the message after 3 seconds
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-8"
    >
      <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">Challenges</h1>
      
      {/* Success Message */}
      {showSuccessMessage && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-md"
        >
          <div className="flex items-center">
            <div className="py-1">
              <HiOutlineClipboardCheck className="h-6 w-6 text-green-500 mr-2" />
            </div>
            <div>
              <p className="font-bold">Success!</p>
              <p>{successMessage}</p>
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Tabs */}
      <div className="flex mb-8 border-b border-gray-200 dark:border-gray-700">
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'active' ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400' : 'text-gray-500 dark:text-gray-400'}`}
          onClick={() => setActiveTab('active')}
        >
          Active Challenges
        </button>
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'completed' ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400' : 'text-gray-500 dark:text-gray-400'}`}
          onClick={() => setActiveTab('completed')}
        >
          Completed
        </button>
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'available' ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400' : 'text-gray-500 dark:text-gray-400'}`}
          onClick={() => setActiveTab('available')}
        >
          Available Challenges
        </button>
      </div>
      
      {/* Active Challenges */}
      {activeTab === 'active' && (
        <div className="space-y-6">
          {challenges.active.map(challenge => (
            <motion.div
              key={challenge.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden"
              whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
            >
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">{challenge.title}</h3>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className={`px-2 py-1 text-xs rounded-lg ${getCategoryColor(challenge.category)}`}>
                        {challenge.category}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-lg ${getDifficultyColor(challenge.difficulty)}`}>
                        {challenge.difficulty}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs rounded-lg">
                        {challenge.duration}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-300 mb-4">{challenge.description}</p>
                    
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                      <span>{formatDate(challenge.startDate)} - {formatDate(challenge.endDate)}</span>
                      <span className="mx-2">•</span>
                      <span>{calculateDaysLeft(challenge.endDate)} days left</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <div className="relative h-24 w-24 mb-2">
                      <svg className="h-24 w-24" viewBox="0 0 36 36">
                        <path
                          d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#E5E7EB"
                          strokeWidth="3"
                          className="dark:stroke-gray-700"
                        />
                        <path
                          d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#4F46E5"
                          strokeWidth="3"
                          strokeDasharray={`${challenge.progress / (parseInt(challenge.duration) || 1) * 100}, 100`}
                          className="dark:stroke-indigo-400"
                        />
                        <text x="18" y="20.5" textAnchor="middle" className="text-lg font-medium fill-gray-800 dark:fill-white">
                          {Math.round(challenge.progress / (parseInt(challenge.duration) || 1) * 100)}%
                        </text>
                      </svg>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Day {challenge.progress} of {challenge.duration.split(' ')[0]}
                    </span>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h4 className="font-medium text-gray-800 dark:text-white mb-2">Rewards</h4>
                  <div className="flex flex-wrap gap-2">
                    {challenge.rewards.map((reward, index) => (
                      <span key={index} className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 text-xs rounded-lg">
                        {reward}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end space-x-4">
                  <motion.button
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex items-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleLogProgress(challenge)}
                  >
                    <HiOutlineClipboardCheck className="mr-2" />
                    Log Progress
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
      
      {/* Completed Challenges */}
      {activeTab === 'completed' && (
        <div className="space-y-6">
          {challenges.completed.map(challenge => (
            <motion.div
              key={challenge.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden"
              whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
            >
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                  <div>
                    <div className="flex items-center mb-2">
                      <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{challenge.title}</h3>
                      <span className="ml-2 px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded-lg">
                        Completed
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className={`px-2 py-1 text-xs rounded-lg ${getCategoryColor(challenge.category)}`}>
                        {challenge.category}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-lg ${getDifficultyColor(challenge.difficulty)}`}>
                        {challenge.difficulty}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs rounded-lg">
                        {challenge.duration}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-300 mb-4">{challenge.description}</p>
                    
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                      <span>Completed on {formatDate(challenge.endDate)}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <div className="relative h-24 w-24 mb-2">
                      <svg className="h-24 w-24" viewBox="0 0 36 36">
                        <path
                          d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#E5E7EB"
                          strokeWidth="3"
                          className="dark:stroke-gray-700"
                        />
                        <path
                          d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#10B981"
                          strokeWidth="3"
                          strokeDasharray="100, 100"
                          className="dark:stroke-green-500"
                        />
                        <text x="18" y="20.5" textAnchor="middle" className="text-lg font-medium fill-gray-800 dark:fill-white">
                          100%
                        </text>
                      </svg>
                    </div>
                    <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                      Challenge Complete!
                    </span>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h4 className="font-medium text-gray-800 dark:text-white mb-2">Rewards Earned</h4>
                  <div className="flex flex-wrap gap-2">
                    {challenge.rewards.map((reward, index) => (
                      <span key={index} className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 text-xs rounded-lg">
                        {reward}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end space-x-4">
                  <motion.button
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 flex items-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleViewDetails(challenge)}
                  >
                    <HiOutlineInformationCircle className="mr-2" />
                    View Details
                  </motion.button>
                  <motion.button
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex items-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleShareAchievement(challenge)}
                  >
                    <FaShare className="mr-2" />
                    Share Achievement
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
      
      {/* Available Challenges */}
      {activeTab === 'available' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {challenges.available.map(challenge => (
            <motion.div
              key={challenge.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden h-full"
              whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
            >
              <div className="p-6 flex flex-col h-full">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">{challenge.title}</h3>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className={`px-2 py-1 text-xs rounded-lg ${getCategoryColor(challenge.category)}`}>
                      {challenge.category}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-lg ${getDifficultyColor(challenge.difficulty)}`}>
                      {challenge.difficulty}
                    </span>
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs rounded-lg">
                      {challenge.duration}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{challenge.description}</p>
                </div>
                
                <div className="mt-auto">
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="font-medium text-gray-800 dark:text-white mb-2">Rewards</h4>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {challenge.rewards.map((reward, index) => (
                        <span key={index} className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 text-xs rounded-lg">
                          {reward}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <motion.button
                    className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleStartChallenge(challenge)}
                  >
                    Start Challenge
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Progress Modal */}
      {showProgressModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full"
          >
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
              Log Progress for {selectedChallenge?.title}
            </h3>
            
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 mb-2">Current Progress: Day {progressValue}</label>
              <input 
                type="range" 
                min="0" 
                max={selectedChallenge?.duration.split(' ')[0]} 
                value={progressValue} 
                onChange={(e) => setProgressValue(parseInt(e.target.value))} 
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span>0</span>
                <span>{selectedChallenge?.duration.split(' ')[0]}</span>
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 dark:text-gray-300 mb-2">Notes (optional)</label>
              <textarea 
                value={progressNote} 
                onChange={(e) => setProgressNote(e.target.value)} 
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                rows="3"
                placeholder="Add notes about your progress..."
              ></textarea>
            </div>
            
            <div className="flex justify-end space-x-4">
              <button 
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                onClick={() => setShowProgressModal(false)}
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                onClick={handleSubmitProgress}
              >
                Save Progress
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full"
          >
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
              {selectedChallenge?.title} Details
            </h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-700 dark:text-gray-300">Description</h4>
                <p className="text-gray-600 dark:text-gray-400">{selectedChallenge?.description}</p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-700 dark:text-gray-300">Duration</h4>
                <p className="text-gray-600 dark:text-gray-400">{selectedChallenge?.duration}</p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-700 dark:text-gray-300">Completion Date</h4>
                <p className="text-gray-600 dark:text-gray-400">{formatDate(selectedChallenge?.endDate)}</p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-700 dark:text-gray-300">Rewards Earned</h4>
                <div className="flex flex-wrap gap-2 mt-1">
                  {selectedChallenge?.rewards.map((reward, index) => (
                    <span key={index} className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 text-xs rounded-lg">
                      {reward}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button 
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                onClick={() => setShowDetailsModal(false)}
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full"
          >
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
              Share Your Achievement
            </h3>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Share your completion of the {selectedChallenge?.title} challenge with your friends and followers!
            </p>
            
            <div className="flex justify-center space-x-6 mb-6">
              <motion.button 
                className="flex flex-col items-center text-blue-600 dark:text-blue-400"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleShare('Twitter')}
              >
                <FaTwitter className="h-10 w-10 mb-2" />
                <span>Twitter</span>
              </motion.button>
              
              <motion.button 
                className="flex flex-col items-center text-blue-800 dark:text-blue-500"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleShare('Facebook')}
              >
                <FaFacebook className="h-10 w-10 mb-2" />
                <span>Facebook</span>
              </motion.button>
              
              <motion.button 
                className="flex flex-col items-center text-blue-700 dark:text-blue-400"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleShare('LinkedIn')}
              >
                <FaLinkedin className="h-10 w-10 mb-2" />
                <span>LinkedIn</span>
              </motion.button>
            </div>
            
            <div className="flex justify-end">
              <button 
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                onClick={() => setShowShareModal(false)}
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default Challenges;