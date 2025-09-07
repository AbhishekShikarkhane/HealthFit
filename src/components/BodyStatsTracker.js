import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { db } from '../db/db';
import { useUserData } from '../context/UserDataContext';

const BodyStatsTracker = ({ onClose }) => {
  const { userData, updateUserData } = useUserData();
  const [bodyStats, setBodyStats] = useState([]);
  const [newStat, setNewStat] = useState({
    weight: '',
    height: '',
    bodyFat: '',
    bmi: '',
    notes: ''
  });
  const [editingStat, setEditingStat] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const loadBodyStats = async () => {
      try {
        const stats = await db.bodyStats.toArray();
        // Sort by date, newest first
        stats.sort((a, b) => new Date(b.date) - new Date(a.date));
        setBodyStats(stats);

        // Pre-fill form with user data if available
        if (userData) {
          setNewStat(prev => ({
            ...prev,
            weight: userData.weight || '',
            height: userData.height || ''
          }));
        }
      } catch (error) {
        console.error('Error loading body stats:', error);
      }
    };

    loadBodyStats();
  }, [userData]);

  const calculateBMI = (weight, height) => {
    if (!weight || !height) return '';
    // BMI = weight(kg) / (height(m))²
    const heightInMeters = height / 100;
    return (weight / (heightInMeters * heightInMeters)).toFixed(1);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!newStat.weight || isNaN(newStat.weight) || newStat.weight <= 0) {
      newErrors.weight = 'Valid weight is required (kg)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedStat = {
      ...newStat,
      [name]: name === 'notes' ? value : value === '' ? '' : Number(value)
    };

    // Auto-calculate BMI when weight or height changes
    if (name === 'weight' || name === 'height') {
      const weight = name === 'weight' ? value : newStat.weight;
      const height = name === 'height' ? value : newStat.height;
      if (weight && height) {
        updatedStat.bmi = calculateBMI(Number(weight), Number(height));
      }
    }

    setNewStat(updatedStat);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      const statData = {
        ...newStat,
        date: today
      };

      if (editingStat) {
        // Update existing stat
        await db.bodyStats.update(editingStat.id, statData);
        setBodyStats(bodyStats.map(stat => 
          stat.id === editingStat.id ? { ...statData, id: editingStat.id } : stat
        ));
        setEditingStat(null);
      } else {
        // Add new stat
        const id = await db.bodyStats.add(statData);
        setBodyStats([{ ...statData, id }, ...bodyStats]);
      }

      // Update user data with latest measurements
      await updateUserData({
        weight: newStat.weight,
        height: newStat.height,
        bodyFat: newStat.bodyFat || undefined,
        bmi: newStat.bmi || undefined
      });

      // Reset form but keep height since it doesn't change often
      setNewStat({
        weight: '',
        height: newStat.height,
        bodyFat: '',
        bmi: '',
        notes: ''
      });
    } catch (error) {
      console.error('Error saving body stats:', error);
    }
  };

  const handleEdit = (stat) => {
    setEditingStat(stat);
    setNewStat({
      weight: stat.weight,
      height: stat.height,
      bodyFat: stat.bodyFat || '',
      bmi: stat.bmi || '',
      notes: stat.notes || ''
    });
  };

  const handleDelete = async (id) => {
    try {
      await db.bodyStats.delete(id);
      setBodyStats(bodyStats.filter(stat => stat.id !== id));

      // If we deleted the most recent entry and there are other entries,
      // update user data with the next most recent entry
      if (bodyStats[0].id === id && bodyStats.length > 1) {
        const nextMostRecent = bodyStats[1];
        await updateUserData({
          weight: nextMostRecent.weight,
          height: nextMostRecent.height,
          bodyFat: nextMostRecent.bodyFat || undefined,
          bmi: nextMostRecent.bmi || undefined
        });
      }
    } catch (error) {
      console.error('Error deleting body stat:', error);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 max-w-md mx-auto"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Body Stats Tracker</h2>
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
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2">Weight (kg)</label>
            <input
              type="number"
              name="weight"
              value={newStat.weight}
              onChange={handleInputChange}
              step="0.1"
              className={`w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.weight ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Weight in kg"
            />
            {errors.weight && <p className="text-red-500 text-sm mt-1">{errors.weight}</p>}
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2">Height (cm)</label>
            <input
              type="number"
              name="height"
              value={newStat.height}
              onChange={handleInputChange}
              step="0.1"
              className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Height in cm"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2">Body Fat % (optional)</label>
            <input
              type="number"
              name="bodyFat"
              value={newStat.bodyFat}
              onChange={handleInputChange}
              step="0.1"
              className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Body fat percentage"
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2">BMI</label>
            <input
              type="text"
              name="bmi"
              value={newStat.bmi}
              readOnly
              className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Auto-calculated"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Auto-calculated from weight & height</p>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 dark:text-gray-300 mb-2">Notes (Optional)</label>
          <textarea
            name="notes"
            value={newStat.notes}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Add any notes about your measurements"
            rows="3"
          ></textarea>
        </div>

        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-teal-700 transition duration-300"
        >
          {editingStat ? 'Update Stats' : 'Save Stats'}
        </motion.button>
      </form>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">History</h3>
        {bodyStats.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No body stats recorded yet</p>
        ) : (
          bodyStats.map(stat => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center">
                    <h4 className="font-medium text-gray-800 dark:text-white">{formatDate(stat.date)}</h4>
                    {bodyStats[0].id === stat.id && (
                      <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full dark:bg-green-900 dark:text-green-200">Latest</span>
                    )}
                  </div>
                  <div className="mt-2 text-sm text-gray-600 dark:text-gray-300 grid grid-cols-2 gap-2">
                    <p>Weight: {stat.weight} kg</p>
                    <p>Height: {stat.height} cm</p>
                    {stat.bodyFat && <p>Body Fat: {stat.bodyFat}%</p>}
                    {stat.bmi && <p>BMI: {stat.bmi}</p>}
                  </div>
                  {stat.notes && <p className="mt-2 text-sm italic text-gray-600 dark:text-gray-300">{stat.notes}</p>}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(stat)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(stat.id)}
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

export default BodyStatsTracker;