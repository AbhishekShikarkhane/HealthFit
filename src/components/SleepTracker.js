import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { db } from '../db/db';
import { useUserData } from '../context/UserDataContext';

const SleepTracker = ({ onClose }) => {
  const { updateDailyData } = useUserData();
  const [sleepEntries, setSleepEntries] = useState([]);
  const [newSleep, setNewSleep] = useState({
    duration: '',
    quality: 3,
    notes: ''
  });
  const [editingSleep, setEditingSleep] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const loadSleepData = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        const todaysSleep = await db.sleep.where('date').equals(today).toArray();
        setSleepEntries(todaysSleep);
      } catch (error) {
        console.error('Error loading sleep data:', error);
      }
    };

    loadSleepData();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!newSleep.duration || isNaN(newSleep.duration) || newSleep.duration <= 0 || newSleep.duration > 24) {
      newErrors.duration = 'Valid sleep duration is required (0-24 hours)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSleep(prev => ({
      ...prev,
      [name]: name === 'notes' ? value : Number(value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      const sleepData = {
        ...newSleep,
        date: today
      };

      if (editingSleep) {
        // Update existing sleep entry
        await db.sleep.update(editingSleep.id, sleepData);
        setSleepEntries(sleepEntries.map(entry => 
          entry.id === editingSleep.id ? { ...sleepData, id: editingSleep.id } : entry
        ));
        setEditingSleep(null);
      } else {
        // Add new sleep entry
        const id = await db.sleep.add(sleepData);
        setSleepEntries([...sleepEntries, { ...sleepData, id }]);
      }

      // Update daily sleep stats
      await updateDailyData({
        sleepHours: newSleep.duration,
        sleepQuality: newSleep.quality
      });

      // Reset form
      setNewSleep({
        duration: '',
        quality: 3,
        notes: ''
      });
    } catch (error) {
      console.error('Error saving sleep data:', error);
    }
  };

  const handleEdit = (sleep) => {
    setEditingSleep(sleep);
    setNewSleep({
      duration: sleep.duration,
      quality: sleep.quality,
      notes: sleep.notes || ''
    });
  };

  const handleDelete = async (id) => {
    try {
      await db.sleep.delete(id);
      setSleepEntries(sleepEntries.filter(entry => entry.id !== id));

      // Reset daily sleep stats if all entries are deleted
      const remainingEntries = sleepEntries.filter(entry => entry.id !== id);
      if (remainingEntries.length === 0) {
        await updateDailyData({
          sleepHours: 0,
          sleepQuality: 0
        });
      } else {
        // Use the most recent entry's data
        const latestEntry = remainingEntries.reduce((latest, current) => 
          new Date(current.date) > new Date(latest.date) ? current : latest
        );
        await updateDailyData({
          sleepHours: latestEntry.duration,
          sleepQuality: latestEntry.quality
        });
      }
    } catch (error) {
      console.error('Error deleting sleep data:', error);
    }
  };

  const qualityLabels = {
    1: 'Poor',
    2: 'Fair',
    3: 'Good',
    4: 'Very Good',
    5: 'Excellent'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 max-w-md mx-auto"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Sleep Tracker</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mb-6">
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 mb-2">Sleep Duration (hours)</label>
          <input
            type="number"
            name="duration"
            value={newSleep.duration}
            onChange={handleInputChange}
            step="0.1"
            min="0"
            max="24"
            className={`w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.duration ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Hours of sleep"
          />
          {errors.duration && <p className="text-red-500 text-sm mt-1">{errors.duration}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 mb-2">
            Sleep Quality: {qualityLabels[newSleep.quality]}
          </label>
          <input
            type="range"
            name="quality"
            min="1"
            max="5"
            step="1"
            value={newSleep.quality}
            onChange={handleInputChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
          />
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span>Poor</span>
            <span>Fair</span>
            <span>Good</span>
            <span>Very Good</span>
            <span>Excellent</span>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 dark:text-gray-300 mb-2">Notes (Optional)</label>
          <textarea
            name="notes"
            value={newSleep.notes}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Add any notes about your sleep"
            rows="3"
          ></textarea>
        </div>

        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition duration-300"
        >
          {editingSleep ? 'Update Sleep Entry' : 'Add Sleep Entry'}
        </motion.button>
      </form>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Today's Sleep Entries</h3>
        {sleepEntries.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No sleep data logged today</p>
        ) : (
          sleepEntries.map(entry => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-gray-800 dark:text-white">
                    {entry.duration} hours of sleep
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Quality: {qualityLabels[entry.quality]}
                  </p>
                  {entry.notes && <p className="mt-2 text-sm italic text-gray-600 dark:text-gray-300">{entry.notes}</p>}
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

export default SleepTracker;