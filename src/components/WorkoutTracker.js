import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { db } from '../db/db';
import { useUserData } from '../context/UserDataContext';

const WorkoutTracker = ({ onClose }) => {
  const { updateDailyData } = useUserData();
  const [workouts, setWorkouts] = useState([]);
  const [newWorkout, setNewWorkout] = useState({
    name: '',
    type: 'strength',
    duration: '',
    caloriesBurned: '',
    notes: ''
  });
  const [editingWorkout, setEditingWorkout] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const loadWorkouts = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        const todaysWorkouts = await db.workouts.where('date').equals(today).toArray();
        setWorkouts(todaysWorkouts);
      } catch (error) {
        console.error('Error loading workouts:', error);
      }
    };

    loadWorkouts();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!newWorkout.name.trim()) newErrors.name = 'Workout name is required';
    if (!newWorkout.duration || isNaN(newWorkout.duration) || newWorkout.duration <= 0) {
      newErrors.duration = 'Valid duration is required (minutes)';
    }
    if (!newWorkout.caloriesBurned || isNaN(newWorkout.caloriesBurned) || newWorkout.caloriesBurned <= 0) {
      newErrors.caloriesBurned = 'Valid calories burned is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewWorkout(prev => ({
      ...prev,
      [name]: name === 'name' || name === 'type' || name === 'notes' ? value : Number(value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      const workoutData = {
        ...newWorkout,
        date: today
      };

      if (editingWorkout) {
        // Update existing workout
        await db.workouts.update(editingWorkout.id, workoutData);
        setWorkouts(workouts.map(workout => 
          workout.id === editingWorkout.id ? { ...workoutData, id: editingWorkout.id } : workout
        ));
        setEditingWorkout(null);
      } else {
        // Add new workout
        const id = await db.workouts.add(workoutData);
        setWorkouts([...workouts, { ...workoutData, id }]);
      }

      // Update daily workout stats
      const totalCaloriesBurned = workouts.reduce(
        (sum, workout) => sum + (workout.id === editingWorkout?.id ? 0 : workout.caloriesBurned), 
        0
      ) + newWorkout.caloriesBurned;
      
      const totalWorkoutMinutes = workouts.reduce(
        (sum, workout) => sum + (workout.id === editingWorkout?.id ? 0 : workout.duration), 
        0
      ) + newWorkout.duration;

      await updateDailyData({
        caloriesBurned: totalCaloriesBurned,
        workoutMinutes: totalWorkoutMinutes
      });

      // Reset form
      setNewWorkout({
        name: '',
        type: 'strength',
        duration: '',
        caloriesBurned: '',
        notes: ''
      });
    } catch (error) {
      console.error('Error saving workout:', error);
    }
  };

  const handleEdit = (workout) => {
    setEditingWorkout(workout);
    setNewWorkout({
      name: workout.name,
      type: workout.type,
      duration: workout.duration,
      caloriesBurned: workout.caloriesBurned,
      notes: workout.notes || ''
    });
  };

  const handleDelete = async (id) => {
    try {
      await db.workouts.delete(id);
      const updatedWorkouts = workouts.filter(workout => workout.id !== id);
      setWorkouts(updatedWorkouts);

      // Update daily workout stats
      const totalCaloriesBurned = updatedWorkouts.reduce(
        (sum, workout) => sum + workout.caloriesBurned, 
        0
      );
      
      const totalWorkoutMinutes = updatedWorkouts.reduce(
        (sum, workout) => sum + workout.duration, 
        0
      );

      await updateDailyData({
        caloriesBurned: totalCaloriesBurned,
        workoutMinutes: totalWorkoutMinutes
      });
    } catch (error) {
      console.error('Error deleting workout:', error);
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
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Workout Tracker</h2>
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
          <label className="block text-gray-700 dark:text-gray-300 mb-2">Workout Name</label>
          <input
            type="text"
            name="name"
            value={newWorkout.name}
            onChange={handleInputChange}
            className={`w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Enter workout name"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 mb-2">Workout Type</label>
          <select
            name="type"
            value={newWorkout.type}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="strength">Strength Training</option>
            <option value="cardio">Cardio</option>
            <option value="flexibility">Flexibility</option>
            <option value="hiit">HIIT</option>
            <option value="sports">Sports</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2">Duration (min)</label>
            <input
              type="number"
              name="duration"
              value={newWorkout.duration}
              onChange={handleInputChange}
              className={`w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.duration ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Minutes"
            />
            {errors.duration && <p className="text-red-500 text-sm mt-1">{errors.duration}</p>}
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2">Calories Burned</label>
            <input
              type="number"
              name="caloriesBurned"
              value={newWorkout.caloriesBurned}
              onChange={handleInputChange}
              className={`w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.caloriesBurned ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Calories"
            />
            {errors.caloriesBurned && <p className="text-red-500 text-sm mt-1">{errors.caloriesBurned}</p>}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 dark:text-gray-300 mb-2">Notes (Optional)</label>
          <textarea
            name="notes"
            value={newWorkout.notes}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Add any notes about your workout"
            rows="3"
          ></textarea>
        </div>

        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-300"
        >
          {editingWorkout ? 'Update Workout' : 'Add Workout'}
        </motion.button>
      </form>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Today's Workouts</h3>
        {workouts.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No workouts logged today</p>
        ) : (
          workouts.map(workout => (
            <motion.div
              key={workout.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-gray-800 dark:text-white">{workout.name}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{workout.type}</p>
                  <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                    <p>{workout.duration} minutes | {workout.caloriesBurned} calories burned</p>
                    {workout.notes && <p className="mt-1 italic">{workout.notes}</p>}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(workout)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(workout.id)}
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

export default WorkoutTracker;