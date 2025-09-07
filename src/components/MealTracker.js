import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { db } from '../db/db';
import { useUserData } from '../context/UserDataContext';

const MealTracker = ({ onClose }) => {
  const { updateDailyData } = useUserData();
  const [meals, setMeals] = useState([]);
  const [newMeal, setNewMeal] = useState({
    name: '',
    type: 'breakfast',
    calories: '',
    protein: '',
    carbs: '',
    fat: ''
  });
  const [editingMeal, setEditingMeal] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const loadMeals = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        const todaysMeals = await db.meals.where('date').equals(today).toArray();
        setMeals(todaysMeals);
      } catch (error) {
        console.error('Error loading meals:', error);
      }
    };

    loadMeals();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!newMeal.name.trim()) newErrors.name = 'Meal name is required';
    if (!newMeal.calories || isNaN(newMeal.calories) || newMeal.calories <= 0) {
      newErrors.calories = 'Valid calories are required';
    }
    if (!newMeal.protein || isNaN(newMeal.protein) || newMeal.protein < 0) {
      newErrors.protein = 'Valid protein amount is required';
    }
    if (!newMeal.carbs || isNaN(newMeal.carbs) || newMeal.carbs < 0) {
      newErrors.carbs = 'Valid carbs amount is required';
    }
    if (!newMeal.fat || isNaN(newMeal.fat) || newMeal.fat < 0) {
      newErrors.fat = 'Valid fat amount is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMeal(prev => ({
      ...prev,
      [name]: name === 'name' ? value : name === 'type' ? value : Number(value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      const mealData = {
        ...newMeal,
        date: today
      };

      if (editingMeal) {
        // Update existing meal
        await db.meals.update(editingMeal.id, mealData);
        setMeals(meals.map(meal => meal.id === editingMeal.id ? { ...mealData, id: editingMeal.id } : meal));
        setEditingMeal(null);
      } else {
        // Add new meal
        const id = await db.meals.add(mealData);
        setMeals([...meals, { ...mealData, id }]);
      }

      // Update daily nutrition totals
      const totalCalories = meals.reduce((sum, meal) => sum + (meal.id === editingMeal?.id ? 0 : meal.calories), 0) + newMeal.calories;
      const totalProtein = meals.reduce((sum, meal) => sum + (meal.id === editingMeal?.id ? 0 : meal.protein), 0) + newMeal.protein;
      const totalCarbs = meals.reduce((sum, meal) => sum + (meal.id === editingMeal?.id ? 0 : meal.carbs), 0) + newMeal.carbs;
      const totalFat = meals.reduce((sum, meal) => sum + (meal.id === editingMeal?.id ? 0 : meal.fat), 0) + newMeal.fat;

      await updateDailyData({
        calories: totalCalories,
        protein: totalProtein,
        carbs: totalCarbs,
        fat: totalFat
      });

      // Reset form
      setNewMeal({
        name: '',
        type: 'breakfast',
        calories: '',
        protein: '',
        carbs: '',
        fat: ''
      });
    } catch (error) {
      console.error('Error saving meal:', error);
    }
  };

  const handleEdit = (meal) => {
    setEditingMeal(meal);
    setNewMeal({
      name: meal.name,
      type: meal.type,
      calories: meal.calories,
      protein: meal.protein,
      carbs: meal.carbs,
      fat: meal.fat
    });
  };

  const handleDelete = async (id) => {
    try {
      await db.meals.delete(id);
      const updatedMeals = meals.filter(meal => meal.id !== id);
      setMeals(updatedMeals);

      // Update daily nutrition totals
      const totalCalories = updatedMeals.reduce((sum, meal) => sum + meal.calories, 0);
      const totalProtein = updatedMeals.reduce((sum, meal) => sum + meal.protein, 0);
      const totalCarbs = updatedMeals.reduce((sum, meal) => sum + meal.carbs, 0);
      const totalFat = updatedMeals.reduce((sum, meal) => sum + meal.fat, 0);

      await updateDailyData({
        calories: totalCalories,
        protein: totalProtein,
        carbs: totalCarbs,
        fat: totalFat
      });
    } catch (error) {
      console.error('Error deleting meal:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 max-w-md mx-auto"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Meal Tracker</h2>
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
          <label className="block text-gray-700 dark:text-gray-300 mb-2">Meal Name</label>
          <input
            type="text"
            name="name"
            value={newMeal.name}
            onChange={handleInputChange}
            className={`w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Enter meal name"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 mb-2">Meal Type</label>
          <select
            name="type"
            value={newMeal.type}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
            <option value="snack">Snack</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2">Calories</label>
            <input
              type="number"
              name="calories"
              value={newMeal.calories}
              onChange={handleInputChange}
              className={`w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.calories ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Calories"
            />
            {errors.calories && <p className="text-red-500 text-sm mt-1">{errors.calories}</p>}
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2">Protein (g)</label>
            <input
              type="number"
              name="protein"
              value={newMeal.protein}
              onChange={handleInputChange}
              className={`w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.protein ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Protein"
            />
            {errors.protein && <p className="text-red-500 text-sm mt-1">{errors.protein}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2">Carbs (g)</label>
            <input
              type="number"
              name="carbs"
              value={newMeal.carbs}
              onChange={handleInputChange}
              className={`w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.carbs ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Carbs"
            />
            {errors.carbs && <p className="text-red-500 text-sm mt-1">{errors.carbs}</p>}
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2">Fat (g)</label>
            <input
              type="number"
              name="fat"
              value={newMeal.fat}
              onChange={handleInputChange}
              className={`w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.fat ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Fat"
            />
            {errors.fat && <p className="text-red-500 text-sm mt-1">{errors.fat}</p>}
          </div>
        </div>

        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-300"
        >
          {editingMeal ? 'Update Meal' : 'Add Meal'}
        </motion.button>
      </form>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Today's Meals</h3>
        {meals.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No meals logged today</p>
        ) : (
          meals.map(meal => (
            <motion.div
              key={meal.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-gray-800 dark:text-white">{meal.name}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{meal.type}</p>
                  <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                    <p>{meal.calories} calories</p>
                    <p>Protein: {meal.protein}g | Carbs: {meal.carbs}g | Fat: {meal.fat}g</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(meal)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(meal.id)}
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

export default MealTracker;