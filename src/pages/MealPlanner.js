import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useUserData } from '../context/UserDataContext';
import { PencilIcon, PlusIcon, TrashIcon, CheckIcon, XMarkIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { db } from '../db/db';

const MealPlanner = () => {
  const { userData } = useUserData();
  const [activeTab, setActiveTab] = useState('today');
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [editingMeal, setEditingMeal] = useState(null);
  const [editedMealData, setEditedMealData] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [showAiPanel, setShowAiPanel] = useState(false);
  const [dietaryPreference, setDietaryPreference] = useState('No Restrictions');
  const [calorieTarget, setCalorieTarget] = useState('2000');
  
  // State for meals
  const [meals, setMeals] = useState([]);

  // Load meals from IndexedDB
  useEffect(() => {
    const loadMeals = async () => {
      try {
        // In a real app, this would load from the database
        console.log('Loading meals from database...');
        // Initialize with sample data
        setMeals(mealPlans.today);
      } catch (error) {
        console.error('Error loading meals:', error);
      }
    };
    
    loadMeals();
  }, []);

  // Sample meal data
  const mealPlans = {
    today: [
      {
        id: 'breakfast-1',
        type: 'Breakfast',
        time: '7:00 AM',
        calories: 450,
        protein: 25,
        carbs: 45,
        fat: 15,
        image: '/images/meal-breakfast.svg',
        items: [
          { name: 'Greek Yogurt', amount: '1 cup', calories: 150, protein: 15, carbs: 10, fat: 5 },
          { name: 'Granola', amount: '1/2 cup', calories: 200, protein: 5, carbs: 30, fat: 8 },
          { name: 'Berries', amount: '1 cup', calories: 100, protein: 5, carbs: 5, fat: 2 }
        ]
      },
      {
        id: 'lunch-1',
        type: 'Lunch',
        time: '12:30 PM',
        calories: 650,
        protein: 35,
        carbs: 60,
        fat: 25,
        image: '/images/meal-lunch.svg',
        items: [
          { name: 'Grilled Chicken', amount: '6 oz', calories: 300, protein: 30, carbs: 0, fat: 10 },
          { name: 'Brown Rice', amount: '1 cup', calories: 200, protein: 5, carbs: 45, fat: 5 },
          { name: 'Steamed Vegetables', amount: '1 cup', calories: 150, protein: 0, carbs: 15, fat: 10 }
        ]
      },
      {
        id: 'dinner-1',
        type: 'Dinner',
        time: '7:00 PM',
        calories: 550,
        protein: 30,
        carbs: 50,
        fat: 20,
        image: '/images/meal-dinner.svg',
        items: [
          { name: 'Salmon', amount: '6 oz', calories: 300, protein: 25, carbs: 0, fat: 15 },
          { name: 'Quinoa', amount: '1 cup', calories: 150, protein: 5, carbs: 35, fat: 3 },
          { name: 'Roasted Vegetables', amount: '1 cup', calories: 100, protein: 0, carbs: 15, fat: 2 }
        ]
      },
      {
        id: 'snack-1',
        type: 'Snack',
        time: '3:30 PM',
        calories: 150,
        protein: 10,
        carbs: 15,
        fat: 5,
        items: [
          { name: 'Protein Bar', amount: '1 bar', calories: 150, protein: 10, carbs: 15, fat: 5 }
        ]
      }
    ],
    week: [
      {
        day: 'Monday',
        meals: [
          { type: 'Breakfast', name: 'Oatmeal with Fruit' },
          { type: 'Lunch', name: 'Chicken Salad' },
          { type: 'Dinner', name: 'Grilled Salmon with Vegetables' }
        ]
      },
      {
        day: 'Tuesday',
        meals: [
          { type: 'Breakfast', name: 'Protein Smoothie' },
          { type: 'Lunch', name: 'Turkey Wrap' },
          { type: 'Dinner', name: 'Vegetable Stir Fry' }
        ]
      },
      {
        day: 'Wednesday',
        meals: [
          { type: 'Breakfast', name: 'Greek Yogurt with Granola' },
          { type: 'Lunch', name: 'Quinoa Bowl' },
          { type: 'Dinner', name: 'Baked Chicken with Sweet Potato' }
        ]
      },
      {
        day: 'Thursday',
        meals: [
          { type: 'Breakfast', name: 'Avocado Toast' },
          { type: 'Lunch', name: 'Tuna Salad' },
          { type: 'Dinner', name: 'Lentil Soup with Bread' }
        ]
      },
      {
        day: 'Friday',
        meals: [
          { type: 'Breakfast', name: 'Egg White Omelette' },
          { type: 'Lunch', name: 'Grilled Chicken Wrap' },
          { type: 'Dinner', name: 'Baked Fish with Roasted Vegetables' }
        ]
      },
      {
        day: 'Saturday',
        meals: [
          { type: 'Breakfast', name: 'Protein Pancakes' },
          { type: 'Lunch', name: 'Mediterranean Salad' },
          { type: 'Dinner', name: 'Lean Steak with Asparagus' }
        ]
      },
      {
        day: 'Sunday',
        meals: [
          { type: 'Breakfast', name: 'Fruit Smoothie Bowl' },
          { type: 'Lunch', name: 'Vegetable Soup' },
          { type: 'Dinner', name: 'Grilled Tofu with Brown Rice' }
        ]
      }
    ]
  };

  const handleMealClick = (meal) => {
    setSelectedMeal(meal);
  };

  const handleEditMeal = (meal) => {
    setEditingMeal(meal);
    setEditedMealData({...meal});
  };

  const handleCancelEdit = () => {
    setEditingMeal(null);
    setEditedMealData(null);
  };

  const handleSaveEdit = () => {
    // Update the meal in the state
    const updatedMeals = meals.map(meal => 
      meal.id === editingMeal.id ? editedMealData : meal
    );
    setMeals(updatedMeals);
    setEditingMeal(null);
    setEditedMealData(null);
    
    // In a real app, save to database
    console.log('Saving updated meal:', editedMealData);
  };

  const handleDeleteMeal = (mealId) => {
    const updatedMeals = meals.filter(meal => meal.id !== mealId);
    setMeals(updatedMeals);
    if (selectedMeal && selectedMeal.id === mealId) {
      setSelectedMeal(null);
    }
    
    // In a real app, delete from database
    console.log('Deleting meal:', mealId);
  };

  const handleAddItem = () => {
    if (!editedMealData) return;
    
    const newItem = { name: '', amount: '', calories: 0, protein: 0, carbs: 0, fat: 0 };
    setEditedMealData({
      ...editedMealData,
      items: [...editedMealData.items, newItem]
    });
  };

  const handleRemoveItem = (index) => {
    if (!editedMealData) return;
    
    const updatedItems = [...editedMealData.items];
    updatedItems.splice(index, 1);
    
    setEditedMealData({
      ...editedMealData,
      items: updatedItems
    });
  };

  const handleItemChange = (index, field, value) => {
    if (!editedMealData) return;
    
    const updatedItems = [...editedMealData.items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: field === 'name' || field === 'amount' ? value : Number(value)
    };
    
    // Recalculate meal totals
    const totals = updatedItems.reduce((acc, item) => ({
      calories: acc.calories + item.calories,
      protein: acc.protein + item.protein,
      carbs: acc.carbs + item.carbs,
      fat: acc.fat + item.fat
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
    
    setEditedMealData({
      ...editedMealData,
      items: updatedItems,
      ...totals
    });
  };

  const generateAiMeal = () => {
    setIsGenerating(true);
    
    // Simulate AI meal generation
    setTimeout(() => {
      const newMeal = {
        id: `meal-${Date.now()}`,
        type: 'AI Generated Meal',
        time: '6:00 PM',
        calories: 550,
        protein: 35,
        carbs: 45,
        fat: 20,
        image: '/images/meal-dinner.svg',
        items: [
          { name: 'Grilled Salmon', amount: '6 oz', calories: 300, protein: 30, carbs: 0, fat: 12 },
          { name: 'Sweet Potato', amount: '1 medium', calories: 150, protein: 2, carbs: 35, fat: 0 },
          { name: 'Asparagus', amount: '1 cup', calories: 40, protein: 3, carbs: 5, fat: 0 },
          { name: 'Olive Oil', amount: '1 tbsp', calories: 60, protein: 0, carbs: 0, fat: 8 }
        ],
        aiGenerated: true
      };
      
      setMeals([...meals, newMeal]);
      setSelectedMeal(newMeal);
      setIsGenerating(false);
      setShowAiPanel(false);
      setAiPrompt('');
    }, 2000);
  };

  const calculateTotalNutrition = () => {
    if (activeTab !== 'today') return { calories: 0, protein: 0, carbs: 0, fat: 0 };
    
    return meals.reduce((totals, meal) => {
      return {
        calories: totals.calories + meal.calories,
        protein: totals.protein + meal.protein,
        carbs: totals.carbs + meal.carbs,
        fat: totals.fat + meal.fat
      };
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
  };

  const totalNutrition = calculateTotalNutrition();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-8"
    >
      <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">Meal Planner</h1>
      
      {/* Tabs */}
      <div className="flex mb-8 border-b border-gray-200 dark:border-gray-700">
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'today' ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400' : 'text-gray-500 dark:text-gray-400'}`}
          onClick={() => setActiveTab('today')}
        >
          Today's Meals
        </button>
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'week' ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400' : 'text-gray-500 dark:text-gray-400'}`}
          onClick={() => setActiveTab('week')}
        >
          Weekly Plan
        </button>
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'custom' ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400' : 'text-gray-500 dark:text-gray-400'}`}
          onClick={() => setActiveTab('custom')}
        >
          Create Custom Plan
        </button>
      </div>
      
      {/* AI Meal Generator Button */}
      {activeTab === 'today' && (
        <div className="mb-6 flex justify-end">
          <motion.button
            className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg shadow-md hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAiPanel(!showAiPanel)}
          >
            <SparklesIcon className="h-5 w-5 mr-2" />
            AI Meal Generator
          </motion.button>
        </div>
      )}
      
      {/* AI Meal Generator Panel */}
      {showAiPanel && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8"
        >
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">AI Meal Generator</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Dietary Preference</label>
              <select 
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                value={dietaryPreference}
                onChange={(e) => setDietaryPreference(e.target.value)}
              >
                <option>No Restrictions</option>
                <option>Vegetarian</option>
                <option>Vegan</option>
                <option>Keto</option>
                <option>Paleo</option>
                <option>Gluten-Free</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Calorie Target</label>
              <select 
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                value={calorieTarget}
                onChange={(e) => setCalorieTarget(e.target.value)}
              >
                <option value="1500">1500 calories</option>
                <option value="1800">1800 calories</option>
                <option value="2000">2000 calories</option>
                <option value="2200">2200 calories</option>
                <option value="2500">2500 calories</option>
              </select>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Describe what you want (optional)</label>
            <textarea
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="E.g., A high-protein dinner with chicken and vegetables"
              rows="3"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
            ></textarea>
          </div>
          
          <div className="flex justify-end space-x-4">
            <motion.button
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAiPanel(false)}
            >
              Cancel
            </motion.button>
            
            <motion.button
              className="flex items-center px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg shadow-md hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={generateAiMeal}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <motion.div 
                    className="h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  />
                  Generating...
                </>
              ) : (
                <>
                  <SparklesIcon className="h-5 w-5 mr-2" />
                  Generate Meal
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      )}
      
      {/* Today's Meals View */}
      {activeTab === 'today' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {meals.map((meal, index) => (
                <motion.div
                  key={meal.id}
                  className={`bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden cursor-pointer ${selectedMeal === meal ? 'ring-2 ring-indigo-500' : ''} ${meal.aiGenerated ? 'border-l-4 border-purple-500' : ''}`}
                  whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                  onClick={() => handleMealClick(meal)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {meal.image && (
                    <div className="h-40 overflow-hidden flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                      <img src={meal.image} alt={meal.type} className="w-full h-full object-contain" />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                        {meal.type}
                        {meal.aiGenerated && (
                          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                            <SparklesIcon className="h-3 w-3 mr-1" />
                            AI
                          </span>
                        )}
                      </h3>
                      <span className="text-sm text-gray-500 dark:text-gray-400">{meal.time}</span>
                    </div>
                    
                    <div className="space-y-2">
                      {meal.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between">
                          <span className="text-gray-700 dark:text-gray-300">{item.name}</span>
                          <span className="text-gray-500 dark:text-gray-400">{item.amount}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between">
                      <div>
                        <span className="block text-sm text-gray-500 dark:text-gray-400">Calories</span>
                        <span className="font-medium text-gray-800 dark:text-white">{meal.calories}</span>
                      </div>
                      <div>
                        <span className="block text-sm text-gray-500 dark:text-gray-400">Protein</span>
                        <span className="font-medium text-gray-800 dark:text-white">{meal.protein}g</span>
                      </div>
                      <div>
                        <span className="block text-sm text-gray-500 dark:text-gray-400">Carbs</span>
                        <span className="font-medium text-gray-800 dark:text-white">{meal.carbs}g</span>
                      </div>
                      <div>
                        <span className="block text-sm text-gray-500 dark:text-gray-400">Fat</span>
                        <span className="font-medium text-gray-800 dark:text-white">{meal.fat}g</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-2">
                      <motion.button
                        className="p-1 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditMeal(meal);
                        }}
                      >
                        <PencilIcon className="h-5 w-5" />
                      </motion.button>
                      <motion.button
                        className="p-1 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteMeal(meal.id);
                        }}
                      >
                        <TrashIcon className="h-5 w-5" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          
          <div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden sticky top-4">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">Daily Nutrition Summary</h3>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-700 dark:text-gray-300">Calories</span>
                      <span className="text-gray-700 dark:text-gray-300">{totalNutrition.calories} / 2000</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                      <div 
                        className="bg-indigo-600 h-2.5 rounded-full" 
                        style={{ width: `${Math.min((totalNutrition.calories / 2000) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-700 dark:text-gray-300">Protein</span>
                      <span className="text-gray-700 dark:text-gray-300">{totalNutrition.protein}g / 100g</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                      <div 
                        className="bg-red-500 h-2.5 rounded-full" 
                        style={{ width: `${Math.min((totalNutrition.protein / 100) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-700 dark:text-gray-300">Carbs</span>
                      <span className="text-gray-700 dark:text-gray-300">{totalNutrition.carbs}g / 250g</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                      <div 
                        className="bg-green-500 h-2.5 rounded-full" 
                        style={{ width: `${Math.min((totalNutrition.carbs / 250) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-700 dark:text-gray-300">Fat</span>
                      <span className="text-gray-700 dark:text-gray-300">{totalNutrition.fat}g / 65g</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                      <div 
                        className="bg-yellow-500 h-2.5 rounded-full" 
                        style={{ width: `${Math.min((totalNutrition.fat / 65) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8">
                  <h4 className="font-medium text-gray-800 dark:text-white mb-4">Recommended Adjustments</h4>
                  <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Good protein intake for muscle maintenance</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-yellow-500 mr-2">!</span>
                      <span>Consider reducing carbohydrate intake</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">i</span>
                      <span>Drink at least 2 more glasses of water</span>
                    </li>
                  </ul>
                </div>
                
                <motion.button
                  className="w-full mt-6 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Adjust Meal Plan
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Edit Meal Modal */}
      {editingMeal && editedMealData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div 
            className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden w-full max-w-3xl"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Edit Meal</h3>
                <button 
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  onClick={handleCancelEdit}
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Meal Type</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    value={editedMealData.type}
                    onChange={(e) => setEditedMealData({...editedMealData, type: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Time</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    value={editedMealData.time}
                    onChange={(e) => setEditedMealData({...editedMealData, time: e.target.value})}
                  />
                </div>
              </div>
              
              <h4 className="font-medium text-gray-800 dark:text-white mb-4">Food Items</h4>
              
              <div className="space-y-4 mb-6">
                {editedMealData.items.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-4">
                      <input 
                        type="text" 
                        placeholder="Food name"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        value={item.name}
                        onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                      />
                    </div>
                    <div className="col-span-2">
                      <input 
                        type="text" 
                        placeholder="Amount"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        value={item.amount}
                        onChange={(e) => handleItemChange(index, 'amount', e.target.value)}
                      />
                    </div>
                    <div className="col-span-1">
                      <input 
                        type="number" 
                        placeholder="Cal"
                        className="w-full px-2 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        value={item.calories}
                        onChange={(e) => handleItemChange(index, 'calories', e.target.value)}
                      />
                    </div>
                    <div className="col-span-1">
                      <input 
                        type="number" 
                        placeholder="Prot"
                        className="w-full px-2 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        value={item.protein}
                        onChange={(e) => handleItemChange(index, 'protein', e.target.value)}
                      />
                    </div>
                    <div className="col-span-1">
                      <input 
                        type="number" 
                        placeholder="Carb"
                        className="w-full px-2 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        value={item.carbs}
                        onChange={(e) => handleItemChange(index, 'carbs', e.target.value)}
                      />
                    </div>
                    <div className="col-span-1">
                      <input 
                        type="number" 
                        placeholder="Fat"
                        className="w-full px-2 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        value={item.fat}
                        onChange={(e) => handleItemChange(index, 'fat', e.target.value)}
                      />
                    </div>
                    <div className="col-span-2 flex justify-end">
                      <button 
                        className="p-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                        onClick={() => handleRemoveItem(index)}
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <button 
                className="flex items-center text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 mb-6"
                onClick={handleAddItem}
              >
                <PlusIcon className="h-5 w-5 mr-1" />
                Add Item
              </button>
              
              <div className="flex justify-end space-x-4">
                <motion.button
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCancelEdit}
                >
                  Cancel
                </motion.button>
                
                <motion.button
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSaveEdit}
                >
                  Save Changes
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
      
      {/* Weekly Plan View */}
      {activeTab === 'week' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Day</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Breakfast</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Lunch</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Dinner</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {mealPlans.week.map((day, index) => (
                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-white">{day.day}</td>
                      {day.meals.map((meal, idx) => (
                        <td key={idx} className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                          {meal.type === 'Breakfast' && meal.name}
                          {meal.type === 'Lunch' && meal.name}
                          {meal.type === 'Dinner' && meal.name}
                        </td>
                      ))}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                        <button className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 mr-3">Edit</button>
                        <button className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-6 flex justify-end">
              <motion.button
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Generate New Weekly Plan
              </motion.button>
            </div>
          </div>
        </div>
      )}
      
      {/* Custom Plan View */}
      {activeTab === 'custom' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <div className="p-6">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">Create Your Custom Meal Plan</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Dietary Preference</label>
                <select className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  <option>No Restrictions</option>
                  <option>Vegetarian</option>
                  <option>Vegan</option>
                  <option>Keto</option>
                  <option>Paleo</option>
                  <option>Gluten-Free</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Calorie Target</label>
                <select className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  <option>1500 calories</option>
                  <option>1800 calories</option>
                  <option>2000 calories</option>
                  <option>2200 calories</option>
                  <option>2500 calories</option>
                  <option>Custom</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Meals Per Day</label>
                <select className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  <option>3 meals</option>
                  <option>4 meals</option>
                  <option>5 meals</option>
                  <option>6 meals</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Plan Duration</label>
                <select className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  <option>1 day</option>
                  <option>3 days</option>
                  <option>7 days</option>
                  <option>14 days</option>
                  <option>30 days</option>
                </select>
              </div>
            </div>
            
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Exclude Ingredients</label>
              <input 
                type="text" 
                placeholder="e.g. peanuts, shellfish, dairy"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            
            <div className="mt-6">
              <h4 className="font-medium text-gray-800 dark:text-white mb-4">Macronutrient Distribution</h4>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-700 dark:text-gray-300">Protein: 30%</span>
                    <span className="text-gray-700 dark:text-gray-300">150g</span>
                  </div>
                  <input type="range" min="10" max="60" value="30" className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-700 dark:text-gray-300">Carbs: 40%</span>
                    <span className="text-gray-700 dark:text-gray-300">200g</span>
                  </div>
                  <input type="range" min="10" max="60" value="40" className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-700 dark:text-gray-300">Fat: 30%</span>
                    <span className="text-gray-700 dark:text-gray-300">67g</span>
                  </div>
                  <input type="range" min="10" max="60" value="30" className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex justify-end space-x-4">
              <motion.button
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Reset
              </motion.button>
              
              <motion.button
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Generate Meal Plan
              </motion.button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default MealPlanner;