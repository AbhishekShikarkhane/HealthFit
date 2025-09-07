import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute, FaHeart, FaRegHeart, FaTimes, FaArrowLeft } from 'react-icons/fa';

const MeditationYoga = () => {
  const [activeTab, setActiveTab] = useState('meditation');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDuration, setSelectedDuration] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [activeSession, setActiveSession] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [savedSessions, setSavedSessions] = useState([]);
  const [showGuidedMessage, setShowGuidedMessage] = useState(false);
  
  const audioRef = useRef(null);
  const videoRef = useRef(null);
  const intervalRef = useRef(null);

  // Sample meditation data
  const meditationData = [
    {
      id: 1,
      title: 'Mindful Breathing',
      description: 'Focus on your breath to calm the mind and reduce stress.',
      category: 'mindfulness',
      duration: 10,
      level: 'beginner',
      imageUrl: '/images/workout-placeholder.svg',
      audioUrl: '#',
      instructor: 'Sarah Johnson'
    },
    {
      id: 2,
      title: 'Body Scan Relaxation',
      description: 'Progressively relax your body from head to toe to release tension.',
      category: 'relaxation',
      duration: 15,
      level: 'beginner',
      imageUrl: '/images/workout-placeholder.svg',
      audioUrl: '#',
      instructor: 'Michael Chen'
    },
    {
      id: 3,
      title: 'Loving-Kindness Meditation',
      description: 'Develop compassion for yourself and others through guided visualization.',
      category: 'compassion',
      duration: 20,
      level: 'intermediate',
      imageUrl: '/images/workout-placeholder.svg',
      audioUrl: '#',
      instructor: 'Emma Wilson'
    },
    {
      id: 4,
      title: 'Chakra Balancing',
      description: 'Align and balance your energy centers for improved wellbeing.',
      category: 'spiritual',
      duration: 30,
      level: 'advanced',
      imageUrl: '/images/workout-placeholder.svg',
      audioUrl: '#',
      instructor: 'Raj Patel'
    },
    {
      id: 5,
      title: 'Sleep Meditation',
      description: 'Prepare your mind and body for restful sleep.',
      category: 'relaxation',
      duration: 15,
      level: 'beginner',
      imageUrl: '/images/workout-placeholder.svg',
      audioUrl: '#',
      instructor: 'Lisa Thompson'
    },
    {
      id: 6,
      title: 'Focused Attention',
      description: 'Sharpen your concentration and mental clarity.',
      category: 'mindfulness',
      duration: 10,
      level: 'intermediate',
      imageUrl: '/images/workout-placeholder.svg',
      audioUrl: '#',
      instructor: 'David Kim'
    }
  ];

  // Sample yoga data
  const yogaData = [
    {
      id: 1,
      title: 'Morning Flow',
      description: 'Energize your day with this gentle flow sequence.',
      category: 'vinyasa',
      duration: 20,
      level: 'beginner',
      imageUrl: '/images/workout-placeholder.svg',
      videoUrl: '#',
      instructor: 'Maya Patel'
    },
    {
      id: 2,
      title: 'Power Yoga',
      description: 'Build strength and flexibility with this dynamic practice.',
      category: 'power',
      duration: 45,
      level: 'advanced',
      imageUrl: '/images/workout-placeholder.svg',
      videoUrl: '#',
      instructor: 'Jake Wilson'
    },
    {
      id: 3,
      title: 'Yin Yoga for Relaxation',
      description: 'Hold passive poses to target deep connective tissues and promote relaxation.',
      category: 'yin',
      duration: 30,
      level: 'intermediate',
      imageUrl: '/images/workout-placeholder.svg',
      videoUrl: '#',
      instructor: 'Sophia Lee'
    },
    {
      id: 4,
      title: 'Hatha Basics',
      description: 'Learn the fundamental poses and breathing techniques of yoga.',
      category: 'hatha',
      duration: 30,
      level: 'beginner',
      imageUrl: '/images/workout-placeholder.svg',
      videoUrl: '#',
      instructor: 'Robert Johnson'
    },
    {
      id: 5,
      title: 'Restorative Yoga',
      description: 'Use props to support your body in passive poses for deep relaxation.',
      category: 'restorative',
      duration: 45,
      level: 'beginner',
      imageUrl: '/images/workout-placeholder.svg',
      videoUrl: '#',
      instructor: 'Olivia Martinez'
    },
    {
      id: 6,
      title: 'Ashtanga Primary Series',
      description: 'Follow this traditional sequence of poses linked with breath.',
      category: 'ashtanga',
      duration: 60,
      level: 'advanced',
      imageUrl: '/images/workout-placeholder.svg',
      videoUrl: '#',
      instructor: 'Thomas Brown'
    }
  ];

  // Filter data based on selected filters
  const getFilteredData = () => {
    const dataToFilter = activeTab === 'meditation' ? meditationData : yogaData;
    
    return dataToFilter.filter(item => {
      const categoryMatch = selectedCategory === 'all' || item.category === selectedCategory;
      const durationMatch = selectedDuration === 'all' || 
        (selectedDuration === 'short' && item.duration <= 15) ||
        (selectedDuration === 'medium' && item.duration > 15 && item.duration <= 30) ||
        (selectedDuration === 'long' && item.duration > 30);
      const levelMatch = selectedLevel === 'all' || item.level === selectedLevel;
      
      return categoryMatch && durationMatch && levelMatch;
    });
  };

  // Get unique categories for filter options
  const getCategories = () => {
    const data = activeTab === 'meditation' ? meditationData : yogaData;
    const categories = [...new Set(data.map(item => item.category))];
    return categories;
  };

  const filteredData = getFilteredData();
  const categories = getCategories();

  // Start a session
  const startSession = (item) => {
    setActiveSession(item);
    setIsPlaying(true);
    setCurrentTime(0);
    setShowGuidedMessage(true);
    
    // Hide guided message after 3 seconds
    setTimeout(() => {
      setShowGuidedMessage(false);
    }, 3000);

    // Set up interval to update progress
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrentTime(prev => {
        if (prev >= item.duration * 60) {
          clearInterval(intervalRef.current);
          setIsPlaying(false);
          return item.duration * 60;
        }
        return prev + 1;
      });
    }, 1000);
  };

  // Toggle play/pause
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      // Resume interval
      intervalRef.current = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= activeSession.duration * 60) {
            clearInterval(intervalRef.current);
            setIsPlaying(false);
            return activeSession.duration * 60;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      // Pause interval
      clearInterval(intervalRef.current);
    }
  };

  // Close active session
  const closeSession = () => {
    setActiveSession(null);
    setIsPlaying(false);
    clearInterval(intervalRef.current);
  };

  // Toggle mute
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  // Handle volume change
  const handleVolumeChange = (e) => {
    const value = parseFloat(e.target.value);
    setVolume(value);
    setIsMuted(value === 0);
  };

  // Toggle save session
  const toggleSaveSession = (item) => {
    const isAlreadySaved = savedSessions.some(session => session.id === item.id && session.title === item.title);
    
    if (isAlreadySaved) {
      setSavedSessions(savedSessions.filter(session => !(session.id === item.id && session.title === item.title)));
    } else {
      setSavedSessions([...savedSessions, item]);
    }
  };

  // Format time (seconds to MM:SS)
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Calculate progress percentage
  const calculateProgress = () => {
    if (!activeSession) return 0;
    return (currentTime / (activeSession.duration * 60)) * 100;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-8"
    >
      <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">Meditation & Yoga</h1>
      
      {/* Tabs */}
      <div className="flex mb-8 border-b border-gray-200 dark:border-gray-700">
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'meditation' ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400' : 'text-gray-500 dark:text-gray-400'}`}
          onClick={() => {
            setActiveTab('meditation');
            setSelectedCategory('all');
          }}
        >
          Meditation
        </button>
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'yoga' ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400' : 'text-gray-500 dark:text-gray-400'}`}
          onClick={() => {
            setActiveTab('yoga');
            setSelectedCategory('all');
          }}
        >
          Yoga
        </button>
      </div>
      
      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>
          
          {/* Duration Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Duration</label>
            <select
              value={selectedDuration}
              onChange={(e) => setSelectedDuration(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Durations</option>
              <option value="short">Short (≤ 15 min)</option>
              <option value="medium">Medium (16-30 min)</option>
              <option value="long">Long (> 30 min)</option>
            </select>
          </div>
          
          {/* Level Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Level</label>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredData.length > 0 ? (
          filteredData.map(item => (
            <motion.div
              key={item.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden h-full"
              whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="h-48 bg-gray-200 dark:bg-gray-700 relative">
                <img 
                  src={item.imageUrl} 
                  alt={item.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 px-2 py-1 bg-indigo-600 text-white text-xs rounded-lg">
                  {item.duration} min
                </div>
                <div className="absolute bottom-2 left-2 px-2 py-1 bg-white dark:bg-gray-800 text-gray-800 dark:text-white text-xs rounded-lg">
                  {item.level.charAt(0).toUpperCase() + item.level.slice(1)}
                </div>
                <button 
                  onClick={() => toggleSaveSession(item)}
                  className="absolute top-2 left-2 p-2 text-white bg-gray-800 bg-opacity-50 rounded-full hover:bg-opacity-70 transition-all"
                >
                  {savedSessions.some(session => session.id === item.id && session.title === item.title) ? 
                    <FaHeart className="text-red-500" /> : 
                    <FaRegHeart />}
                </button>
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{item.title}</h3>
                  <span className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 text-xs rounded-lg">
                    {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                  </span>
                </div>
                
                <p className="text-gray-600 dark:text-gray-300 mb-4">{item.description}</p>
                
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <span>Instructor: {item.instructor}</span>
                </div>
                
                <motion.button
                  className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => startSession(item)}
                >
                  {activeTab === 'meditation' ? 'Start Meditation' : 'Start Yoga Session'}
                </motion.button>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No {activeTab === 'meditation' ? 'meditation' : 'yoga'} sessions found matching your filters.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedDuration('all');
                setSelectedLevel('all');
              }}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
      
      {/* Saved Sessions Section */}
      {savedSessions.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
            Saved Sessions
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {savedSessions.map(item => (
              <motion.div
                key={`saved-${item.id}`}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden flex flex-col"
                whileHover={{ y: -3, boxShadow: '0 8px 15px -5px rgba(0, 0, 0, 0.1)' }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <div className="h-32 bg-gray-200 dark:bg-gray-700 relative">
                  <img 
                    src={item.imageUrl} 
                    alt={item.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 px-2 py-1 bg-indigo-600 text-white text-xs rounded-lg">
                    {item.duration} min
                  </div>
                  <button 
                    onClick={() => toggleSaveSession(item)}
                    className="absolute top-2 left-2 p-2 text-white bg-gray-800 bg-opacity-50 rounded-full hover:bg-opacity-70 transition-all"
                  >
                    <FaHeart className="text-red-500" />
                  </button>
                </div>
                
                <div className="p-4 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">{item.title}</h3>
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-2">
                      <span>{item.category.charAt(0).toUpperCase() + item.category.slice(1)} • {item.level.charAt(0).toUpperCase() + item.level.slice(1)}</span>
                    </div>
                  </div>
                  
                  <motion.button
                    className="w-full px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => startSession(item)}
                  >
                    Start Session
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
      
      {/* Featured Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
          Featured {activeTab === 'meditation' ? 'Meditation' : 'Yoga'} Programs
        </h2>
        
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg overflow-hidden">
          <div className="p-8 md:flex items-center">
            <div className="md:w-2/3 mb-6 md:mb-0 md:pr-8">
              <span className="inline-block px-3 py-1 bg-white bg-opacity-20 text-white text-sm rounded-full mb-4">
                {activeTab === 'meditation' ? '21-Day Program' : '30-Day Challenge'}
              </span>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                {activeTab === 'meditation' ? 'Mindfulness Mastery' : 'Yoga for Strength & Flexibility'}
              </h3>
              <p className="text-indigo-100 mb-6">
                {activeTab === 'meditation' 
                  ? 'Transform your relationship with stress and develop a consistent meditation practice in just 21 days.'
                  : 'Build strength, improve flexibility, and enhance your overall wellbeing with this comprehensive 30-day yoga program.'}
              </p>
              <motion.button
                className="px-6 py-3 bg-white text-indigo-600 font-medium rounded-lg hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Join Program
              </motion.button>
            </div>
            <div className="md:w-1/3">
              <img 
                src="/images/workout-placeholder.svg" 
                alt="Featured Program" 
                className="w-full h-48 md:h-64 object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MeditationYoga;