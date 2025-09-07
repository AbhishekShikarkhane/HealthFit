import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useUserData } from '../context/UserDataContext';
import { useTheme } from '../context/ThemeContext';
import InteractiveImages from '../components/InteractiveImages';

const Home = () => {
  const navigate = useNavigate();
  const { userData } = useUserData();
  const { theme, colorScheme } = useTheme();
  
  // Get color scheme variables
  const getGradientClass = () => {
    const colors = {
      indigo: 'from-indigo-500 to-indigo-600',
      teal: 'from-teal-400 to-teal-500',
      rose: 'from-rose-400 to-rose-500',
      amber: 'from-amber-400 to-amber-500',
      blue: 'from-blue-400 to-blue-500'
    };
    return colors[colorScheme] || colors.indigo;
  };
  
  const getButtonColorClass = () => {
    const colors = {
      indigo: 'bg-white text-indigo-600 hover:bg-indigo-50',
      teal: 'bg-white text-teal-600 hover:bg-teal-50',
      rose: 'bg-white text-rose-600 hover:bg-rose-50',
      amber: 'bg-white text-amber-600 hover:bg-amber-50',
      blue: 'bg-white text-blue-600 hover:bg-blue-50'
    };
    return colors[colorScheme] || colors.indigo;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-8 pt-4 md:pt-8"
    >
      <motion.div 
        className={`bg-gradient-to-r ${getGradientClass()} rounded-xl p-6 md:p-8 text-white mb-8 shadow-lg transform-gpu`}
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 15 }}
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
          <div className="mb-6 md:mb-0">
            <motion.h1 
              className="text-3xl md:text-4xl font-bold mb-3 md:mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
            >
              Welcome to HealthFit
            </motion.h1>
            <motion.p 
              className="text-base md:text-xl mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, type: 'spring' }}
            >
              Your personal health and fitness companion
            </motion.p>
            <motion.button
              className={`${getButtonColorClass()} px-5 py-2.5 md:px-6 md:py-3 rounded-lg font-semibold shadow-md`}
              whileHover={{ scale: 1.05, boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.1)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/dashboard')}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, type: 'spring' }}
            >
              Go to Dashboard
            </motion.button>
          </div>
          <motion.div
            className="w-full md:w-1/3 flex justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, type: 'spring', stiffness: 100 }}
          >
            <img 
              src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" 
              alt="Fitness" 
              className="rounded-lg shadow-lg max-h-56 md:max-h-64 object-cover drop-shadow-xl"
              loading="lazy"
            />
          </motion.div>
        </div>
      </motion.div>

      {/* Progress Cards */}
      <h2 className="text-xl md:text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">Your Progress</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-10">
        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow p-5 md:p-6 border-l-4 border-blue-500 transform-gpu"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5, type: 'spring', stiffness: 100 }}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
          <h3 className="text-base md:text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">Calories</h3>
          <div className="flex items-center">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-4">
              <span className="text-blue-600 dark:text-blue-300 text-xl font-bold">{userData.dailyData.calories}</span>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Daily Goal</p>
              <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">2000 kcal</p>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-3 dark:bg-gray-700 overflow-hidden">
            <motion.div 
              className="bg-blue-500 h-2 rounded-full" 
              initial={{ width: 0 }}
              animate={{ width: '75%' }}
              transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
            ></motion.div>
          </div>
        </motion.div>

        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow p-5 md:p-6 border-l-4 border-cyan-500 transform-gpu"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5, type: 'spring', stiffness: 100 }}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
          <h3 className="text-base md:text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">Hydration</h3>
          <div className="flex items-center">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-cyan-100 dark:bg-cyan-900 flex items-center justify-center mr-4">
              <span className="text-cyan-600 dark:text-cyan-300 text-xl font-bold">{userData.dailyData.water}</span>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Daily Goal</p>
              <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">8 glasses</p>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-3 dark:bg-gray-700 overflow-hidden">
            <motion.div 
              className="bg-cyan-500 h-2 rounded-full" 
              initial={{ width: 0 }}
              animate={{ width: '65%' }}
              transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
            ></motion.div>
          </div>
        </motion.div>

        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow p-5 md:p-6 border-l-4 border-orange-500 transform-gpu"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5, type: 'spring', stiffness: 100 }}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
          <h3 className="text-base md:text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">Workouts</h3>
          <div className="flex items-center">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center mr-4">
              <span className="text-orange-600 dark:text-orange-300 text-xl font-bold">{userData.dailyData.workouts.length}</span>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Today's Goal</p>
              <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">1 workout</p>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-3 dark:bg-gray-700 overflow-hidden">
            <motion.div 
              className="bg-orange-500 h-2 rounded-full" 
              initial={{ width: 0 }}
              animate={{ width: '80%' }}
              transition={{ delay: 0.7, duration: 0.8, ease: "easeOut" }}
            ></motion.div>
          </div>
        </motion.div>

        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow p-5 md:p-6 border-l-4 border-purple-500 transform-gpu"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5, type: 'spring', stiffness: 100 }}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
          <h3 className="text-base md:text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">Sleep</h3>
          <div className="flex items-center">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mr-4">
              <span className="text-purple-600 dark:text-purple-300 text-xl font-bold">{userData.dailyData.sleep}</span>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Hours</p>
              <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">Goal: 8h</p>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-3 dark:bg-gray-700 overflow-hidden">
            <motion.div 
              className="bg-purple-500 h-2 rounded-full" 
              initial={{ width: 0 }}
              animate={{ width: '81%' }}
              transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
            ></motion.div>
          </div>
        </motion.div>
      </div>
      
      {/* Featured Sections */}
      <motion.div
        className="mb-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <h2 className={`text-2xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
          Featured Workouts
        </h2>
        <InteractiveImages section="home" />
      </motion.div>
      
      <motion.div
        className="mb-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <h2 className={`text-2xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
          Nutrition Tips
        </h2>
        <InteractiveImages section="nutrition" />
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <motion.button
              className="bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 p-4 rounded-lg flex flex-col items-center justify-center shadow-sm hover:shadow-md transition-shadow transform-gpu"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/exercise-library')}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
            >
              <span className="text-lg font-semibold">Start Workout</span>
            </motion.button>
            
            <motion.button
              className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 p-4 rounded-lg flex flex-col items-center justify-center shadow-sm hover:shadow-md transition-shadow transform-gpu"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/meal-planner')}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              <span className="text-lg font-semibold">Plan Meals</span>
            </motion.button>
            
            <motion.button
              className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 p-4 rounded-lg flex flex-col items-center justify-center shadow-sm hover:shadow-md transition-shadow transform-gpu"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/meditation-yoga')}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.3 }}
            >
              <span className="text-lg font-semibold">Meditate</span>
            </motion.button>
            
            <motion.button
              className="bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 p-4 rounded-lg flex flex-col items-center justify-center shadow-sm hover:shadow-md transition-shadow transform-gpu"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/workout-generator')}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.3 }}
            >
              <span className="text-lg font-semibold">Generate Plan</span>
            </motion.button>
          </div>
        </motion.div>

        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 transform-gpu"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, type: 'spring', stiffness: 100 }}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
          <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Your Streaks</h2>
          <div className="space-y-4">
            <motion.div 
              className="flex items-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.3 }}
            >
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center mr-4 shadow-inner">
                <motion.span 
                  className="text-red-600 dark:text-red-300 text-lg font-bold"
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.9, type: 'spring' }}
                >
                  {userData.streaks.workout}
                </motion.span>
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">Workout Streak</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Keep it up!</p>
              </div>
            </motion.div>
            
            <motion.div 
              className="flex items-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.3 }}
            >
              <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mr-4 shadow-inner">
                <motion.span 
                  className="text-green-600 dark:text-green-300 text-lg font-bold"
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.0, type: 'spring' }}
                >
                  {userData.streaks.nutrition}
                </motion.span>
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">Nutrition Streak</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Eating healthy!</p>
              </div>
            </motion.div>
            
            <motion.div 
              className="flex items-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.3 }}
            >
              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-4 shadow-inner">
                <motion.span 
                  className="text-blue-600 dark:text-blue-300 text-lg font-bold"
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.1, type: 'spring' }}
                >
                  {userData.streaks.hydration}
                </motion.span>
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">Hydration Streak</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Staying hydrated!</p>
              </div>
            </motion.div>
            
            <motion.div 
              className="flex items-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.3 }}
            >
              <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mr-4 shadow-inner">
                <motion.span 
                  className="text-purple-600 dark:text-purple-300 text-lg font-bold"
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.2, type: 'spring' }}
                >
                  {userData.streaks.sleep}
                </motion.span>
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">Sleep Streak</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Good sleep habits!</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Home;