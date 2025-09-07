import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserData } from '../context/UserDataContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import MealTracker from '../components/MealTracker';
import WorkoutTracker from '../components/WorkoutTracker';
import SleepTracker from '../components/SleepTracker';
import HydrationTracker from '../components/HydrationTracker';
import BodyStatsTracker from '../components/BodyStatsTracker';
import ModalOverlay from '../components/ModalOverlay';

const Dashboard = () => {
  const [activeTracker, setActiveTracker] = useState(null);
  
  const openTracker = (tracker) => {
    setActiveTracker(tracker);
  };
  
  const closeTracker = () => {
    setActiveTracker(null);
  };
  const { userData } = useUserData();

  // Sample data for charts
  const weeklyCaloriesData = [
    { name: 'Mon', calories: 1800 },
    { name: 'Tue', calories: 2000 },
    { name: 'Wed', calories: 1700 },
    { name: 'Thu', calories: 1900 },
    { name: 'Fri', calories: 2100 },
    { name: 'Sat', calories: 1600 },
    { name: 'Sun', calories: userData.dailyData.calories },
  ];

  const nutritionData = [
    { name: 'Protein', value: userData.dailyData.protein, color: '#4F46E5' },
    { name: 'Carbs', value: userData.dailyData.carbs, color: '#10B981' },
    { name: 'Fat', value: userData.dailyData.fat, color: '#F59E0B' },
  ];

  const sleepData = [
    { name: 'Mon', hours: 7 },
    { name: 'Tue', hours: 6.5 },
    { name: 'Wed', hours: 8 },
    { name: 'Thu', hours: 7.5 },
    { name: 'Fri', hours: 6 },
    { name: 'Sat', hours: 8.5 },
    { name: 'Sun', hours: userData.dailyData.sleep },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-8 relative"
    >
      <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Calories Chart */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Weekly Calories</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyCaloriesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  borderColor: '#374151',
                  color: '#F9FAFB' 
                }} 
              />
              <Bar dataKey="calories" fill="#4F46E5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Nutrition Breakdown */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Nutrition Breakdown</h2>
          <div className="flex items-center justify-center h-[300px]">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={nutritionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {nutritionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    borderColor: '#374151',
                    color: '#F9FAFB' 
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Sleep Chart */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Sleep Tracking</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={sleepData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  borderColor: '#374151',
                  color: '#F9FAFB' 
                }} 
              />
              <Bar dataKey="hours" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Hydration Tracker */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Hydration Tracker</h2>
          <div className="flex flex-col items-center justify-center h-[300px]">
            <div className="relative w-48 h-48 mb-4">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#1E40AF"
                  strokeWidth="10"
                  strokeDasharray="283"
                  strokeDashoffset={283 - (283 * (userData.dailyData.water / 8))}
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#DBEAFE"
                  strokeWidth="10"
                  strokeOpacity="0.3"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-4xl font-bold text-blue-600 dark:text-blue-400">{userData.dailyData.water}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">of 8 glasses</span>
              </div>
            </div>
            <div className="flex space-x-2">
              {[...Array(8)].map((_, i) => (
                <div 
                  key={i} 
                  className={`w-8 h-12 rounded-full ${i < userData.dailyData.water ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-700'}`}
                ></div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Quick Actions */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <motion.button
              className="bg-red-600 text-white p-4 rounded-lg flex flex-col items-center justify-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => openTracker('workout')}
            >
              <span className="text-lg font-semibold">Log Workout</span>
            </motion.button>
            
            <motion.button
              className="bg-green-600 text-white p-4 rounded-lg flex flex-col items-center justify-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => openTracker('meal')}
            >
              <span className="text-lg font-semibold">Log Meal</span>
            </motion.button>
            
            <motion.button
              className="bg-blue-600 text-white p-4 rounded-lg flex flex-col items-center justify-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => openTracker('hydration')}
            >
              <span className="text-lg font-semibold">Add Water</span>
            </motion.button>
            
            <motion.button
              className="bg-purple-600 text-white p-4 rounded-lg flex flex-col items-center justify-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => openTracker('sleep')}
            >
              <span className="text-lg font-semibold">Log Sleep</span>
            </motion.button>
            
            <motion.button
              className="bg-teal-600 text-white p-4 rounded-lg flex flex-col items-center justify-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => openTracker('bodyStats')}
            >
              <span className="text-lg font-semibold">Body Stats</span>
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Tracker Modals */}
       <AnimatePresence>
         {activeTracker === 'meal' && (
           <ModalOverlay onClose={closeTracker}>
             <MealTracker onClose={closeTracker} />
           </ModalOverlay>
         )}
         {activeTracker === 'workout' && (
           <ModalOverlay onClose={closeTracker}>
             <WorkoutTracker onClose={closeTracker} />
           </ModalOverlay>
         )}
         {activeTracker === 'sleep' && (
           <ModalOverlay onClose={closeTracker}>
             <SleepTracker onClose={closeTracker} />
           </ModalOverlay>
         )}
         {activeTracker === 'hydration' && (
           <ModalOverlay onClose={closeTracker}>
             <HydrationTracker onClose={closeTracker} />
           </ModalOverlay>
         )}
         {activeTracker === 'bodyStats' && (
           <ModalOverlay onClose={closeTracker}>
             <BodyStatsTracker onClose={closeTracker} />
           </ModalOverlay>
         )}
       </AnimatePresence>
    </motion.div>
  );
};

export default Dashboard;