import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { db } from '../db/db';
import { useUserData } from '../context/UserDataContext';

const HydrationTracker = ({ onClose }) => {
  const { userData, updateDailyData } = useUserData();
  const [hydrationEntries, setHydrationEntries] = useState([]);
  const [newHydration, setNewHydration] = useState({
    amount: 250, // Default to 250ml (a glass of water)
    time: new Date().toTimeString().slice(0, 5)
  });
  const [editingHydration, setEditingHydration] = useState(null);
  const [errors, setErrors] = useState({});
  const [dailyTotal, setDailyTotal] = useState(0);
  const [dailyGoal, setDailyGoal] = useState(2500); // Default 2.5L

  useEffect(() => {
    const loadHydrationData = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        const todaysHydration = await db.hydration.where('date').equals(today).toArray();
        setHydrationEntries(todaysHydration);
        
        // Calculate daily total
        const total = todaysHydration.reduce((sum, entry) => sum + entry.amount, 0);
        setDailyTotal(total);
        
        // Get user's hydration goal if available
        if (userData && userData.hydrationGoal) {
          setDailyGoal(userData.hydrationGoal);
        }
      } catch (error) {
        console.error('Error loading hydration data:', error);
      }
    };

    loadHydrationData();
  }, [userData]);

  const validateForm = () => {
    const newErrors = {};
    if (!newHydration.amount || isNaN(newHydration.amount) || newHydration.amount <= 0) {
      newErrors.amount = 'Valid amount is required (ml)';
    }
    if (!newHydration.time) {
      newErrors.time = 'Time is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewHydration(prev => ({
      ...prev,
      [name]: name === 'amount' ? Number(value) : value
    }));
  };

  const handleQuickAdd = (amount) => {
    setNewHydration(prev => ({
      ...prev,
      amount
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      const hydrationData = {
        ...newHydration,
        date: today
      };

      if (editingHydration) {
        // Update existing hydration entry
        await db.hydration.update(editingHydration.id, hydrationData);
        const updatedEntries = hydrationEntries.map(entry => 
          entry.id === editingHydration.id ? { ...hydrationData, id: editingHydration.id } : entry
        );
        setHydrationEntries(updatedEntries);
        setEditingHydration(null);
        
        // Recalculate total
        const newTotal = updatedEntries.reduce((sum, entry) => sum + entry.amount, 0);
        setDailyTotal(newTotal);
      } else {
        // Add new hydration entry
        const id = await db.hydration.add(hydrationData);
        const updatedEntries = [...hydrationEntries, { ...hydrationData, id }];
        setHydrationEntries(updatedEntries);
        
        // Update total
        const newTotal = dailyTotal + hydrationData.amount;
        setDailyTotal(newTotal);
      }

      // Update daily hydration stats
      await updateDailyData({
        hydration: dailyTotal + (editingHydration ? newHydration.amount - editingHydration.amount : newHydration.amount),
        hydrationGoal: dailyGoal
      });

      // Reset form
      setNewHydration({
        amount: 250,
        time: new Date().toTimeString().slice(0, 5)
      });
    } catch (error) {
      console.error('Error saving hydration data:', error);
    }
  };

  const handleEdit = (hydration) => {
    setEditingHydration(hydration);
    setNewHydration({
      amount: hydration.amount,
      time: hydration.time || new Date().toTimeString().slice(0, 5)
    });
  };

  const handleDelete = async (id) => {
    try {
      const entryToDelete = hydrationEntries.find(entry => entry.id === id);
      await db.hydration.delete(id);
      const updatedEntries = hydrationEntries.filter(entry => entry.id !== id);
      setHydrationEntries(updatedEntries);
      
      // Update total
      const newTotal = dailyTotal - entryToDelete.amount;
      setDailyTotal(newTotal);

      // Update daily hydration stats
      await updateDailyData({
        hydration: newTotal,
        hydrationGoal: dailyGoal
      });
    } catch (error) {
      console.error('Error deleting hydration data:', error);
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    // Convert 24h format to 12h format
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const progressPercentage = Math.min(100, (dailyTotal / dailyGoal) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 max-w-md mx-auto"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Hydration Tracker</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Daily Progress</h3>
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
            {dailyTotal}ml / {dailyGoal}ml
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4 dark:bg-gray-700">
          <motion.div 
            className="bg-blue-500 h-4 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.5 }}
          ></motion.div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mb-6">
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 mb-2">Amount (ml)</label>
          <input
            type="number"
            name="amount"
            value={newHydration.amount}
            onChange={handleInputChange}
            className={`w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.amount ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Water amount in ml"
          />
          {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 mb-2">Quick Add</label>
          <div className="flex space-x-2">
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleQuickAdd(250)}
              className="flex-1 bg-blue-100 text-blue-700 py-2 px-3 rounded-md hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800"
            >
              250ml
            </motion.button>
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleQuickAdd(500)}
              className="flex-1 bg-blue-100 text-blue-700 py-2 px-3 rounded-md hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800"
            >
              500ml
            </motion.button>
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleQuickAdd(1000)}
              className="flex-1 bg-blue-100 text-blue-700 py-2 px-3 rounded-md hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800"
            >
              1000ml
            </motion.button>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 dark:text-gray-300 mb-2">Time</label>
          <input
            type="time"
            name="time"
            value={newHydration.time}
            onChange={handleInputChange}
            className={`w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.time ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.time && <p className="text-red-500 text-sm mt-1">{errors.time}</p>}
        </div>

        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
        >
          {editingHydration ? 'Update Entry' : 'Add Water'}
        </motion.button>
      </form>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Today's Hydration</h3>
        {hydrationEntries.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No hydration data logged today</p>
        ) : (
          hydrationEntries.map(entry => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="text-blue-500 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v14m-7-7h14" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-white">{entry.amount}ml</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{formatTime(entry.time)}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(entry)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
};

export default HydrationTracker;