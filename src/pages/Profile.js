import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useUserData } from '../context/UserDataContext';

const Profile = () => {
  const { userData, setUserData } = useUserData();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: userData.name || '',
    email: userData.email || '',
    height: userData.height || '',
    weight: userData.weight || '',
    age: userData.age || '',
    gender: userData.gender || 'male',
    fitnessGoal: userData.fitnessGoal || 'weight_loss',
    activityLevel: userData.activityLevel || 'moderate'
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setUserData({
        ...userData,
        name: formData.name,
        email: formData.email,
        height: parseFloat(formData.height) || 0,
        weight: parseFloat(formData.weight) || 0,
        age: parseInt(formData.age) || 0,
        gender: formData.gender,
        fitnessGoal: formData.fitnessGoal,
        activityLevel: formData.activityLevel
      });
      setIsEditing(false);
      setIsSaving(false);
    }, 1000);
  };

  const activityLevelLabels = {
    sedentary: 'Sedentary (little or no exercise)',
    light: 'Lightly active (light exercise 1-3 days/week)',
    moderate: 'Moderately active (moderate exercise 3-5 days/week)',
    active: 'Active (hard exercise 6-7 days/week)',
    very_active: 'Very active (very hard exercise & physical job)'
  };

  const fitnessGoalLabels = {
    weight_loss: 'Weight Loss',
    muscle_gain: 'Muscle Gain',
    endurance: 'Endurance',
    flexibility: 'Flexibility',
    general_fitness: 'General Fitness'
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-8"
    >
      <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">Your Profile</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        <div className="p-6 md:p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Personal Information</h2>
            {!isEditing && (
              <motion.button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Edit Profile
              </motion.button>
            )}
          </div>
          
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                
                <div>
                  <label htmlFor="height" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    id="height"
                    name="height"
                    value={formData.height}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                
                <div>
                  <label htmlFor="weight" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    id="weight"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                
                <div>
                  <label htmlFor="age" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Age
                  </label>
                  <input
                    type="number"
                    id="age"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                
                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Gender
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer_not_to_say">Prefer not to say</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="fitnessGoal" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Fitness Goal
                  </label>
                  <select
                    id="fitnessGoal"
                    name="fitnessGoal"
                    value={formData.fitnessGoal}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    {Object.entries(fitnessGoalLabels).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="activityLevel" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Activity Level
                  </label>
                  <select
                    id="activityLevel"
                    name="activityLevel"
                    value={formData.activityLevel}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    {Object.entries(activityLevelLabels).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="flex space-x-4 pt-4">
                <motion.button
                  type="submit"
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </motion.button>
                
                <motion.button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={isSaving}
                >
                  Cancel
                </motion.button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Full Name</h3>
                  <p className="mt-1 text-lg text-gray-900 dark:text-white">{userData.profile.name || 'Not set'}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Email Address</h3>
                  <p className="mt-1 text-lg text-gray-900 dark:text-white">{userData.profile.email || 'Not set'}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Height</h3>
                  <p className="mt-1 text-lg text-gray-900 dark:text-white">
                    {userData.profile.height ? `${userData.profile.height} cm` : 'Not set'}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Weight</h3>
                  <p className="mt-1 text-lg text-gray-900 dark:text-white">
                    {userData.profile.weight ? `${userData.profile.weight} kg` : 'Not set'}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Age</h3>
                  <p className="mt-1 text-lg text-gray-900 dark:text-white">
                    {userData.profile.age || 'Not set'}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Gender</h3>
                  <p className="mt-1 text-lg text-gray-900 dark:text-white capitalize">
                    {userData.profile.gender?.replace('_', ' ') || 'Not set'}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Fitness Goal</h3>
                  <p className="mt-1 text-lg text-gray-900 dark:text-white">
                    {userData.profile.fitnessGoal ? fitnessGoalLabels[userData.profile.fitnessGoal] : 'Not set'}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Activity Level</h3>
                  <p className="mt-1 text-lg text-gray-900 dark:text-white">
                    {userData.profile.activityLevel ? activityLevelLabels[userData.profile.activityLevel] : 'Not set'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        <div className="p-6 md:p-8">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">Account Settings</h2>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-800 dark:text-white">Change Password</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Update your password for better security</p>
              </div>
              <motion.button
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Change
              </motion.button>
            </div>
            
            <div className="flex justify-between items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-800 dark:text-white">Notification Settings</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Manage your notification preferences</p>
              </div>
              <motion.button
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Manage
              </motion.button>
            </div>
            
            <div className="flex justify-between items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-800 dark:text-white">Privacy Settings</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Control your data and privacy options</p>
              </div>
              <motion.button
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Manage
              </motion.button>
            </div>
            
            <div className="flex justify-between items-center p-4 border border-red-200 dark:border-red-900 rounded-lg">
              <div>
                <h3 className="font-medium text-red-600 dark:text-red-400">Delete Account</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Permanently delete your account and all data</p>
              </div>
              <motion.button
                className="px-4 py-2 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Delete
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;