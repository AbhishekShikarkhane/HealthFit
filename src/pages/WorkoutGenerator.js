import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useUserData } from '../context/UserDataContext';
import { db } from '../db/db';
import { Link, useNavigate } from 'react-router-dom';
import { PlayIcon, BookmarkIcon, ShareIcon, XMarkIcon, PauseIcon } from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid';
import { FaVolumeMute, FaVolumeUp, FaPlay, FaPause, FaStepForward, FaStepBackward } from 'react-icons/fa';

const WorkoutGenerator = () => {
  const { userData } = useUserData();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    goal: 'strength',
    duration: 30,
    equipment: 'minimal',
    focusArea: 'full_body',
    intensity: 'moderate',
  });
  const [generatedWorkout, setGeneratedWorkout] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [savedWorkouts, setSavedWorkouts] = useState([]);
  const [showSavedMessage, setShowSavedMessage] = useState(false);
  const [recommendedVideos, setRecommendedVideos] = useState([]);
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  
  // Load saved workouts on component mount
  useEffect(() => {
    const loadSavedWorkouts = async () => {
      try {
        const workouts = await db.savedWorkouts.toArray();
        setSavedWorkouts(workouts.map(workout => workout.id));
      } catch (error) {
        console.error('Error loading saved workouts:', error);
      }
    };
    
    loadSavedWorkouts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsGenerating(true);
    setGeneratedWorkout(null);
    setRecommendedVideos([]);
    
    // Simulate API call delay
    setTimeout(() => {
      const workout = generateWorkout();
      setGeneratedWorkout(workout);
      setIsGenerating(false);
      
      // Generate recommended videos
      generateRecommendedVideos(workout);
    }, 1500);
  };
  
  const generateRecommendedVideos = (workout) => {
    // Sample video data - in a real app, this would come from an API
    const sampleVideos = [
      {
        id: 'v1',
        title: 'Proper Form for ' + workout.exercises[0].name,
        thumbnail: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        url: 'https://www.youtube.com/watch?v=IODxDxX7oi4',
        duration: '4:25',
        channel: 'FitnessPro'
      },
      {
        id: 'v2',
        title: workout.goal.charAt(0).toUpperCase() + workout.goal.slice(1) + ' Training Tips',
        thumbnail: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        url: 'https://www.youtube.com/watch?v=UBMk30rjy0o',
        duration: '8:12',
        channel: 'TrainRight'
      },
      {
        id: 'v3',
        title: formData.focusArea.split('_').join(' ').charAt(0).toUpperCase() + formData.focusArea.split('_').join(' ').slice(1) + ' Workout Guide',
        thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        url: 'https://www.youtube.com/watch?v=vc1E5CfRfos',
        duration: '12:45',
        channel: 'GymLife'
      }
    ];
    
    setRecommendedVideos(sampleVideos);
  };

  const generateWorkout = () => {
    // Sample exercise database
    const exercises = {
      strength: {
        upper: ['Push-ups', 'Pull-ups', 'Bench Press', 'Shoulder Press', 'Bicep Curls', 'Tricep Dips'],
        lower: ['Squats', 'Lunges', 'Deadlifts', 'Leg Press', 'Calf Raises', 'Glute Bridges'],
        core: ['Planks', 'Crunches', 'Russian Twists', 'Leg Raises', 'Mountain Climbers', 'Ab Rollouts']
      },
      cardio: {
        upper: ['Boxing', 'Battle Ropes', 'Rowing', 'Arm Ergometer', 'Swimming'],
        lower: ['Running', 'Cycling', 'Jump Rope', 'Stair Climber', 'Elliptical'],
        core: ['Mountain Climbers', 'Burpees', 'Jumping Jacks', 'High Knees', 'Bicycle Crunches']
      },
      flexibility: {
        upper: ['Arm Circles', 'Shoulder Stretch', 'Tricep Stretch', 'Child\'s Pose', 'Cat-Cow Stretch'],
        lower: ['Hamstring Stretch', 'Quad Stretch', 'Calf Stretch', 'Hip Flexor Stretch', 'Butterfly Stretch'],
        core: ['Cobra Pose', 'Seated Twist', 'Supine Twist', 'Cat-Cow Stretch', 'Downward Dog']
      }
    };

    // Determine sets and reps based on goal and intensity
    let sets, reps, rest;
    switch(formData.goal) {
      case 'strength':
        sets = formData.intensity === 'high' ? 5 : formData.intensity === 'moderate' ? 4 : 3;
        reps = formData.intensity === 'high' ? '6-8' : formData.intensity === 'moderate' ? '8-10' : '10-12';
        rest = formData.intensity === 'high' ? '90-120 sec' : formData.intensity === 'moderate' ? '60-90 sec' : '30-60 sec';
        break;
      case 'cardio':
        sets = formData.intensity === 'high' ? 4 : formData.intensity === 'moderate' ? 3 : 2;
        reps = formData.intensity === 'high' ? '45 sec' : formData.intensity === 'moderate' ? '30 sec' : '20 sec';
        rest = formData.intensity === 'high' ? '15 sec' : formData.intensity === 'moderate' ? '30 sec' : '45 sec';
        break;
      case 'flexibility':
        sets = 1;
        reps = formData.intensity === 'high' ? '60 sec hold' : formData.intensity === 'moderate' ? '45 sec hold' : '30 sec hold';
        rest = '15 sec';
        break;
      default:
        sets = 3;
        reps = '10';
        rest = '60 sec';
    }

    // Select exercises based on focus area and goal
    let selectedExercises = [];
    if (formData.focusArea === 'full_body') {
      selectedExercises = [
        ...getRandomExercises(exercises[formData.goal].upper, 2),
        ...getRandomExercises(exercises[formData.goal].lower, 2),
        ...getRandomExercises(exercises[formData.goal].core, 2)
      ];
    } else if (formData.focusArea === 'upper') {
      selectedExercises = [
        ...getRandomExercises(exercises[formData.goal].upper, 4),
        ...getRandomExercises(exercises[formData.goal].core, 2)
      ];
    } else if (formData.focusArea === 'lower') {
      selectedExercises = [
        ...getRandomExercises(exercises[formData.goal].lower, 4),
        ...getRandomExercises(exercises[formData.goal].core, 2)
      ];
    } else if (formData.focusArea === 'core') {
      selectedExercises = [
        ...getRandomExercises(exercises[formData.goal].core, 4),
        ...getRandomExercises(exercises[formData.goal].upper, 1),
        ...getRandomExercises(exercises[formData.goal].lower, 1)
      ];
    }

    // Create workout plan
    const workout = {
      id: `workout-${Date.now()}`,
      name: `${formData.intensity.charAt(0).toUpperCase() + formData.intensity.slice(1)} ${formData.goal.charAt(0).toUpperCase() + formData.goal.slice(1)} Workout`,
      duration: formData.duration,
      exercises: selectedExercises.map(exercise => ({
        name: exercise,
        sets,
        reps,
        rest
      })),
      equipment: formData.equipment,
      intensity: formData.intensity,
      focusArea: formData.focusArea,
      goal: formData.goal
    };

    return workout;
  };

  const getRandomExercises = (exerciseList, count) => {
    const shuffled = [...exerciseList].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const toggleSaveWorkout = async (workout) => {
    try {
      const isAlreadySaved = savedWorkouts.includes(workout.id);
      
      if (isAlreadySaved) {
        // Remove workout from IndexedDB
        await db.savedWorkouts.delete(workout.id);
        setSavedWorkouts(savedWorkouts.filter(id => id !== workout.id));
      } else {
        // Add workout to IndexedDB
        await db.savedWorkouts.add({
          ...workout,
          savedAt: new Date()
        });
        
        setSavedWorkouts([...savedWorkouts, workout.id]);
      }
      
      // Show temporary message
      setShowSavedMessage(true);
      setTimeout(() => setShowSavedMessage(false), 2000);
    } catch (error) {
      console.error('Error saving/removing workout:', error);
    }
  };
  
  const startWorkout = (workout) => {
    setActiveWorkout(workout);
    setCurrentExerciseIndex(0);
    setIsPlaying(true);
  };

  const closeWorkout = () => {
    setActiveWorkout(null);
    setIsPlaying(false);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const nextExercise = () => {
    if (currentExerciseIndex < activeWorkout.exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
    }
  };

  const prevExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(currentExerciseIndex - 1);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const shareWorkout = () => {
    setShareModalOpen(true);
    // In a real app, this would generate a shareable link or open a share dialog
    setTimeout(() => {
      setShareModalOpen(false);
      alert('Workout shared successfully! (This would share the workout in a real app)');
    }, 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-8"
    >
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">Workout Generator</h1>
      
      {showSavedMessage && (
        <motion.div 
          className="fixed top-4 right-4 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-lg z-50"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          Workout {savedWorkouts.includes(generatedWorkout?.id) ? 'saved' : 'removed'} successfully!
        </motion.div>
      )}

      {shareModalOpen && (
        <motion.div 
          className="fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <div className="flex items-center">
            <motion.div 
              className="h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
            Sharing workout...
          </div>
        </motion.div>
      )}
      
      {/* Active Workout Overlay */}
      {activeWorkout && (
        <motion.div 
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="container mx-auto px-4 py-8 flex-1 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">{activeWorkout.name}</h2>
              <button 
                onClick={closeWorkout}
                className="text-white hover:text-gray-300"
              >
                <XMarkIcon className="h-8 w-8" />
              </button>
            </div>
            
            <div className="flex-1 flex flex-col items-center justify-center">
              <motion.div
                key={currentExerciseIndex}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-gray-800 rounded-xl p-8 max-w-2xl w-full text-center"
              >
                <h3 className="text-3xl font-bold text-white mb-4">
                  {activeWorkout.exercises[currentExerciseIndex].name}
                </h3>
                <p className="text-xl text-gray-300 mb-6">
                  {activeWorkout.exercises[currentExerciseIndex].sets} sets × {activeWorkout.exercises[currentExerciseIndex].reps}
                </p>
                <p className="text-lg text-gray-400 mb-8">
                  Rest: {activeWorkout.exercises[currentExerciseIndex].rest}
                </p>
                
                <div className="w-full bg-gray-700 rounded-full h-2 mb-8">
                  <motion.div 
                    className="bg-indigo-600 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ 
                      width: `${((currentExerciseIndex + 1) / activeWorkout.exercises.length) * 100}%` 
                    }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                
                <p className="text-gray-400 mb-4">
                  Exercise {currentExerciseIndex + 1} of {activeWorkout.exercises.length}
                </p>
              </motion.div>
            </div>
            
            <div className="flex justify-center items-center space-x-6 py-8">
              <button 
                onClick={prevExercise} 
                disabled={currentExerciseIndex === 0}
                className={`text-white p-3 rounded-full ${currentExerciseIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800'}`}
              >
                <FaStepBackward className="h-6 w-6" />
              </button>
              
              <button 
                onClick={togglePlayPause}
                className="bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full"
              >
                {isPlaying ? (
                  <FaPause className="h-8 w-8" />
                ) : (
                  <FaPlay className="h-8 w-8" />
                )}
              </button>
              
              <button 
                onClick={nextExercise} 
                disabled={currentExerciseIndex === activeWorkout.exercises.length - 1}
                className={`text-white p-3 rounded-full ${currentExerciseIndex === activeWorkout.exercises.length - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800'}`}
              >
                <FaStepForward className="h-6 w-6" />
              </button>
            </div>
            
            <div className="flex justify-between items-center">
              <button 
                onClick={toggleMute}
                className="text-white hover:text-gray-300 p-2"
              >
                {isMuted ? (
                  <FaVolumeMute className="h-6 w-6" />
                ) : (
                  <FaVolumeUp className="h-6 w-6" />
                )}
              </button>
              
              <div className="text-white">
                {Math.floor(currentExerciseIndex / activeWorkout.exercises.length * activeWorkout.duration)} min / {activeWorkout.duration} min
              </div>
            </div>
          </div>
        </motion.div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">Customize Your Workout</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Workout Goal</label>
              <select
                name="goal"
                value={formData.goal}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="strength">Strength & Muscle</option>
                <option value="cardio">Cardio & Endurance</option>
                <option value="flexibility">Flexibility & Mobility</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Duration (minutes)</label>
              <select
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={45}>45 minutes</option>
                <option value={60}>60 minutes</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Equipment</label>
              <select
                name="equipment"
                value={formData.equipment}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="none">No Equipment</option>
                <option value="minimal">Minimal (Dumbbells, Resistance Bands)</option>
                <option value="full">Full Gym</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Focus Area</label>
              <select
                name="focusArea"
                value={formData.focusArea}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="full_body">Full Body</option>
                <option value="upper">Upper Body</option>
                <option value="lower">Lower Body</option>
                <option value="core">Core</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Intensity</label>
              <select
                name="intensity"
                value={formData.intensity}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="low">Low</option>
                <option value="moderate">Moderate</option>
                <option value="high">High</option>
              </select>
            </div>
            
            <motion.button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <div className="flex items-center justify-center">
                  <motion.div 
                    className="h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  />
                  Generating...
                </div>
              ) : 'Generate Workout'}
            </motion.button>
          </form>
        </motion.div>
        
        {/* Results */}
        {isGenerating ? (
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 flex justify-center items-center h-64"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="text-center">
              <motion.div
                className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto mb-4"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
              <p className="text-gray-600 dark:text-gray-400">Creating your perfect workout...</p>
            </div>
          </motion.div>
        ) : generatedWorkout ? (
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Your Personalized Workout</h2>
              <div className="flex space-x-2">
                <motion.button
                  onClick={() => shareWorkout()}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ShareIcon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                </motion.button>
                <motion.button
                  onClick={() => toggleSaveWorkout(generatedWorkout)}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {savedWorkouts.includes(generatedWorkout.id) ? (
                    <BookmarkSolidIcon className="h-6 w-6 text-indigo-600" />
                  ) : (
                    <BookmarkIcon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                  )}
                </motion.button>
              </div>
            </div>
            
            <div className="bg-indigo-100 dark:bg-indigo-900 p-4 rounded-lg mb-4">
              <h3 className="text-lg font-semibold text-indigo-800 dark:text-indigo-200">{generatedWorkout.name}</h3>
              <p className="text-indigo-600 dark:text-indigo-300">
                {generatedWorkout.duration} minutes • {generatedWorkout.focusArea.replace('_', ' ')} focus
              </p>
            </div>
            
            <div className="space-y-3 mb-6">
              {generatedWorkout.exercises.map((exercise, index) => (
                <motion.div 
                  key={index}
                  className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-gray-800 dark:text-gray-200">{exercise.name}</h4>
                    <Link to={`/exercise-library?search=${exercise.name}`} className="text-indigo-600 dark:text-indigo-400 text-sm">
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        View Details
                      </motion.div>
                    </Link>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {exercise.sets} sets × {exercise.reps} • Rest: {exercise.rest}
                  </p>
                </motion.div>
              ))}
            </div>
            
            <div className="flex space-x-3 pt-4">
              <motion.button
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => startWorkout(generatedWorkout)}
              >
                <PlayIcon className="h-5 w-5 mr-2" />
                Start Workout
              </motion.button>
              <motion.button
                className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold py-2 px-4 rounded-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setGeneratedWorkout(null);
                  setRecommendedVideos([]);
                }}
              >
                Reset
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">Your Personalized Workout</h2>
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <img src="/images/workout-placeholder.svg" alt="Workout" className="w-24 h-24 mb-4 opacity-50" />
              <p className="text-gray-500 dark:text-gray-400">Fill out the form and generate your personalized workout plan</p>
            </div>
          </motion.div>
        )}
      </div>
      
      {/* Recommended Videos Section */}
      {recommendedVideos.length > 0 && !isGenerating && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mt-8"
        >
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">Recommended Videos</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommendedVideos.map((video, index) => (
              <motion.a
                key={video.id}
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                whileHover={{ y: -5 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + (index * 0.1) }}
              >
                <div className="relative">
                  <img 
                    src={video.thumbnail} 
                    alt={video.title} 
                    className="w-full h-40 object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <div className="bg-indigo-600 rounded-full p-3">
                      <PlayIcon className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                    {video.duration}
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-gray-800 dark:text-white mb-1 line-clamp-2">{video.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{video.channel}</p>
                </div>
              </motion.a>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default WorkoutGenerator;