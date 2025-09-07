import React, { useState } from 'react';
import { motion } from 'framer-motion';

const ExerciseLibrary = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExercise, setSelectedExercise] = useState(null);

  // Sample exercise data
  const exercises = {
    strength: [
      {
        id: 1,
        name: 'Barbell Squat',
        category: 'strength',
        muscle: 'legs',
        equipment: 'barbell',
        difficulty: 'intermediate',
        description: 'A compound exercise that primarily targets the quadriceps, hamstrings, and glutes.',
        instructions: [
          'Stand with your feet shoulder-width apart, with a barbell resting on your upper back.',
          'Bend your knees and lower your hips as if sitting in a chair, keeping your back straight.',
          'Lower until your thighs are parallel to the ground or slightly below.',
          'Push through your heels to return to the starting position.'
        ],
        image: '/images/workout-placeholder.svg',
        video: 'https://example.com/squat-video'
      },
      {
        id: 2,
        name: 'Bench Press',
        category: 'strength',
        muscle: 'chest',
        equipment: 'barbell',
        difficulty: 'intermediate',
        description: 'A compound exercise that primarily targets the chest, shoulders, and triceps.',
        instructions: [
          'Lie on a flat bench with your feet on the ground.',
          'Grip the barbell with hands slightly wider than shoulder-width apart.',
          'Lower the barbell to your mid-chest, keeping your elbows at about a 45-degree angle.',
          'Press the barbell back up to the starting position, fully extending your arms.'
        ],
        image: '/images/workout-placeholder.svg',
        video: 'https://example.com/bench-press-video'
      },
      {
        id: 3,
        name: 'Deadlift',
        category: 'strength',
        muscle: 'back',
        equipment: 'barbell',
        difficulty: 'advanced',
        description: 'A compound exercise that targets the entire posterior chain, including the back, glutes, and hamstrings.',
        instructions: [
          'Stand with feet hip-width apart, with a barbell on the ground in front of you.',
          'Bend at the hips and knees to grip the barbell with hands shoulder-width apart.',
          'Keeping your back straight, lift the barbell by extending your hips and knees.',
          'Stand up straight with the barbell, then lower it back to the ground with control.'
        ],
        image: '/images/workout-placeholder.svg',
        video: 'https://example.com/deadlift-video'
      }
    ],
    cardio: [
      {
        id: 4,
        name: 'Running',
        category: 'cardio',
        muscle: 'full body',
        equipment: 'none',
        difficulty: 'beginner',
        description: 'A cardiovascular exercise that improves endurance and burns calories.',
        instructions: [
          'Start with a warm-up walk or light jog.',
          'Maintain good posture with a slight forward lean.',
          'Land midfoot and roll through to push off with your toes.',
          'Keep a comfortable pace that allows you to maintain the activity.'
        ],
        image: '/images/workout-placeholder.svg',
        video: 'https://example.com/running-video'
      },
      {
        id: 5,
        name: 'Jumping Rope',
        category: 'cardio',
        muscle: 'full body',
        equipment: 'jump rope',
        difficulty: 'beginner',
        description: 'A high-intensity cardiovascular exercise that improves coordination and burns calories.',
        instructions: [
          'Hold the handles of the jump rope with hands at hip level.',
          'Rotate the rope using your wrists, not your arms.',
          'Jump just high enough to clear the rope, landing on the balls of your feet.',
          'Keep a steady rhythm and start with short intervals if you\'re a beginner.'
        ],
        image: '/images/workout-placeholder.svg',
        video: 'https://example.com/jumping-rope-video'
      }
    ],
    flexibility: [
      {
        id: 6,
        name: 'Downward Dog',
        category: 'flexibility',
        muscle: 'full body',
        equipment: 'none',
        difficulty: 'beginner',
        description: 'A yoga pose that stretches the hamstrings, calves, and shoulders while strengthening the arms and legs.',
        instructions: [
          'Start on your hands and knees, with hands shoulder-width apart.',
          'Lift your knees off the floor and push your hips up and back.',
          'Straighten your legs as much as comfortable, pressing your heels toward the floor.',
          'Hold the position, focusing on creating a straight line from your hands to your hips.'
        ],
        image: '/images/workout-placeholder.svg',
        video: 'https://example.com/downward-dog-video'
      },
      {
        id: 7,
        name: 'Pigeon Pose',
        category: 'flexibility',
        muscle: 'hips',
        equipment: 'none',
        difficulty: 'intermediate',
        description: 'A yoga pose that opens the hips and stretches the glutes and piriformis.',
        instructions: [
          'Start in a downward dog position.',
          'Bring your right knee forward and place it behind your right wrist.',
          'Extend your left leg straight behind you.',
          'Lower your upper body over your right leg for a deeper stretch.'
        ],
        image: '/images/workout-placeholder.svg',
        video: 'https://example.com/pigeon-pose-video'
      }
    ],
    bodyweight: [
      {
        id: 8,
        name: 'Push-up',
        category: 'bodyweight',
        muscle: 'chest',
        equipment: 'none',
        difficulty: 'beginner',
        description: 'A compound exercise that targets the chest, shoulders, and triceps.',
        instructions: [
          'Start in a plank position with hands slightly wider than shoulder-width apart.',
          'Lower your body until your chest nearly touches the floor, keeping your elbows close to your body.',
          'Push yourself back up to the starting position.',
          'Keep your body in a straight line throughout the movement.'
        ],
        image: '/images/workout-placeholder.svg',
        video: 'https://example.com/push-up-video'
      },
      {
        id: 9,
        name: 'Pull-up',
        category: 'bodyweight',
        muscle: 'back',
        equipment: 'pull-up bar',
        difficulty: 'intermediate',
        description: 'A compound exercise that targets the back, biceps, and shoulders.',
        instructions: [
          'Hang from a pull-up bar with hands slightly wider than shoulder-width apart.',
          'Pull your body up until your chin is over the bar.',
          'Lower yourself back down with control.',
          'Repeat for the desired number of repetitions.'
        ],
        image: '/images/workout-placeholder.svg',
        video: 'https://example.com/pull-up-video'
      },
      {
        id: 10,
        name: 'Bodyweight Squat',
        category: 'bodyweight',
        muscle: 'legs',
        equipment: 'none',
        difficulty: 'beginner',
        description: 'A compound exercise that targets the quadriceps, hamstrings, and glutes.',
        instructions: [
          'Stand with feet shoulder-width apart.',
          'Bend your knees and lower your hips as if sitting in a chair, keeping your back straight.',
          'Lower until your thighs are parallel to the ground or slightly below.',
          'Push through your heels to return to the starting position.'
        ],
        image: '/images/workout-placeholder.svg',
        video: 'https://example.com/bodyweight-squat-video'
      }
    ]
  };

  // Flatten exercises for searching and filtering
  const allExercises = Object.values(exercises).flat();

  // Filter exercises based on active category and search query
  const filteredExercises = allExercises.filter(exercise => {
    const matchesCategory = activeCategory === 'all' || exercise.category === activeCategory;
    const matchesSearch = exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         exercise.muscle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleExerciseClick = (exercise) => {
    setSelectedExercise(exercise);
  };

  const categories = [
    { id: 'all', name: 'All Exercises' },
    { id: 'strength', name: 'Strength Training' },
    { id: 'cardio', name: 'Cardio' },
    { id: 'flexibility', name: 'Flexibility' },
    { id: 'bodyweight', name: 'Bodyweight' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-8"
    >
      <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">Exercise Library</h1>
      
      {/* Search and Filter */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-grow max-w-md">
            <input
              type="text"
              placeholder="Search exercises..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
          <div className="flex overflow-x-auto pb-2 md:pb-0 space-x-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap ${activeCategory === category.id ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white'}`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Exercise List */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredExercises.map(exercise => (
              <motion.div
                key={exercise.id}
                className={`bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden cursor-pointer ${selectedExercise?.id === exercise.id ? 'ring-2 ring-indigo-500' : ''}`}
                whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                onClick={() => handleExerciseClick(exercise)}
              >
                <div className="h-48 bg-gray-200 dark:bg-gray-700 relative">
                  <img 
                    src={exercise.image} 
                    alt={exercise.name} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 px-2 py-1 bg-indigo-600 text-white text-xs rounded-lg">
                    {exercise.difficulty}
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{exercise.name}</h3>
                    <span className="text-sm text-gray-500 dark:text-gray-400 capitalize">{exercise.muscle}</span>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{exercise.description}</p>
                  
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <span className="capitalize">{exercise.category}</span>
                    <span className="mx-2">•</span>
                    <span className="capitalize">{exercise.equipment}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          {filteredExercises.length === 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-center">
              <p className="text-gray-600 dark:text-gray-300">No exercises found matching your criteria. Try adjusting your search or filters.</p>
            </div>
          )}
        </div>
        
        {/* Exercise Details */}
        <div>
          {selectedExercise ? (
            <motion.div 
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden sticky top-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="h-48 bg-gray-200 dark:bg-gray-700 relative">
                <img 
                  src={selectedExercise.image} 
                  alt={selectedExercise.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="p-6">
                <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">{selectedExercise.name}</h3>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 text-xs rounded-lg capitalize">
                    {selectedExercise.category}
                  </span>
                  <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded-lg capitalize">
                    {selectedExercise.muscle}
                  </span>
                  <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-xs rounded-lg capitalize">
                    {selectedExercise.equipment}
                  </span>
                  <span className="px-2 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 text-xs rounded-lg capitalize">
                    {selectedExercise.difficulty}
                  </span>
                </div>
                
                <p className="text-gray-600 dark:text-gray-300 mb-6">{selectedExercise.description}</p>
                
                <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Instructions</h4>
                <ol className="list-decimal pl-5 space-y-2 text-gray-600 dark:text-gray-300 mb-6">
                  {selectedExercise.instructions.map((instruction, index) => (
                    <li key={index}>{instruction}</li>
                  ))}
                </ol>
                
                <div className="flex justify-between mt-6">
                  <motion.button
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Watch Video
                  </motion.button>
                  
                  <motion.button
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Add to Workout
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-center">
              <p className="text-gray-600 dark:text-gray-300">Select an exercise to view details.</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ExerciseLibrary;