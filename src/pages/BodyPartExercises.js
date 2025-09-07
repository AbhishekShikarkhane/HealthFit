import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeftIcon, FilterIcon, BookmarkIcon } from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid';
import ExerciseDetail from '../components/ExerciseDetail';

const BodyPartExercises = () => {
  const { bodyPart } = useParams();
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [filter, setFilter] = useState('all');
  const [savedExercises, setSavedExercises] = useState([]);
  
  // Sample exercise data for different body parts
  const exerciseData = {
    chest: [
      {
        id: 1,
        name: 'Bench Press',
        description: 'A compound exercise that targets the chest, shoulders, and triceps.',
        difficulty: 'intermediate',
        equipment: 'Barbell, Bench',
        muscles: ['Pectoralis Major', 'Anterior Deltoids', 'Triceps'],
        instructions: [
          'Lie on a flat bench with your feet flat on the floor.',
          'Grip the barbell slightly wider than shoulder-width apart.',
          'Lower the bar to your mid-chest, keeping your elbows at about a 45-degree angle.',
          'Press the bar back up to the starting position, fully extending your arms.'
        ],
        image: '/images/chest-bench-press.svg',
        video: 'https://example.com/bench-press-video'
      },
      {
        id: 2,
        name: 'Push-Up',
        description: 'A bodyweight exercise that works the chest, shoulders, triceps, and core.',
        difficulty: 'beginner',
        equipment: 'None',
        muscles: ['Pectoralis Major', 'Anterior Deltoids', 'Triceps', 'Core'],
        instructions: [
          'Start in a plank position with hands slightly wider than shoulder-width apart.',
          'Keep your body in a straight line from head to heels.',
          'Lower your body until your chest nearly touches the floor.',
          'Push yourself back up to the starting position.'
        ],
        image: '/images/chest-push-up.svg',
        video: 'https://example.com/push-up-video'
      },
      {
        id: 3,
        name: 'Dumbbell Fly',
        description: 'An isolation exercise that targets the chest muscles.',
        difficulty: 'intermediate',
        equipment: 'Dumbbells, Bench',
        muscles: ['Pectoralis Major', 'Pectoralis Minor'],
        instructions: [
          'Lie on a flat bench holding a dumbbell in each hand above your chest.',
          'With a slight bend in your elbows, lower the weights out to the sides.',
          'Feel the stretch in your chest, then bring the weights back together above your chest.',
          'Maintain the same elbow bend throughout the movement.'
        ],
        image: '/images/workout-placeholder.svg',
        video: 'https://example.com/dumbbell-fly-video'
      }
    ],
    back: [
      {
        id: 1,
        name: 'Pull-Up',
        description: 'A compound bodyweight exercise that targets the back, biceps, and shoulders.',
        difficulty: 'intermediate',
        equipment: 'Pull-up bar',
        muscles: ['Latissimus Dorsi', 'Rhomboids', 'Biceps', 'Rear Deltoids'],
        instructions: [
          'Hang from a pull-up bar with hands slightly wider than shoulder-width apart.',
          'Pull your body up until your chin is above the bar.',
          'Lower yourself back down with control.',
          'Repeat for the desired number of repetitions.'
        ],
        image: '/images/back-pull-up.svg',
        video: 'https://example.com/pull-up-video'
      },
      {
        id: 2,
        name: 'Bent-Over Row',
        description: 'A compound exercise that targets the back, biceps, and rear shoulders.',
        difficulty: 'intermediate',
        equipment: 'Barbell or Dumbbells',
        muscles: ['Latissimus Dorsi', 'Rhomboids', 'Trapezius', 'Biceps'],
        instructions: [
          'Stand with feet shoulder-width apart, knees slightly bent.',
          'Bend at the hips until your torso is almost parallel to the floor.',
          'Pull the weight toward your lower ribcage, keeping elbows close to your body.',
          'Lower the weight back down with control.'
        ],
        image: '/images/workout-placeholder.svg',
        video: 'https://example.com/bent-over-row-video'
      },
      {
        id: 3,
        name: 'Lat Pulldown',
        description: 'A machine exercise that targets the latissimus dorsi and biceps.',
        difficulty: 'beginner',
        equipment: 'Cable machine with lat pulldown attachment',
        muscles: ['Latissimus Dorsi', 'Biceps', 'Rear Deltoids'],
        instructions: [
          'Sit at a lat pulldown machine with your thighs secured under the pads.',
          'Grasp the bar with a wide grip, palms facing forward.',
          'Pull the bar down to your upper chest, keeping your back slightly arched.',
          'Slowly return the bar to the starting position, fully extending your arms.'
        ],
        image: '/images/workout-placeholder.svg',
        video: 'https://example.com/lat-pulldown-video'
      }
    ],
    legs: [
      {
        id: 1,
        name: 'Squat',
        description: 'A compound exercise that primarily targets the quadriceps, hamstrings, and glutes.',
        difficulty: 'intermediate',
        equipment: 'Barbell (optional)',
        muscles: ['Quadriceps', 'Hamstrings', 'Glutes', 'Core'],
        instructions: [
          'Stand with feet shoulder-width apart, toes slightly turned out.',
          'Lower your body by bending your knees and pushing your hips back.',
          'Keep your chest up and back straight.',
          'Lower until thighs are parallel to the ground, then push back up to the starting position.'
        ],
        image: '/images/legs-squat.svg',
        video: 'https://example.com/squat-video'
      },
      {
        id: 2,
        name: 'Deadlift',
        description: 'A compound exercise that works the entire posterior chain.',
        difficulty: 'advanced',
        equipment: 'Barbell',
        muscles: ['Hamstrings', 'Glutes', 'Lower Back', 'Trapezius'],
        instructions: [
          'Stand with feet hip-width apart, barbell over mid-foot.',
          'Bend at the hips and knees to grip the bar, keeping your back flat.',
          'Lift the bar by extending your hips and knees, keeping the bar close to your body.',
          'Return the weight to the ground with control.'
        ],
        image: '/images/workout-placeholder.svg',
        video: 'https://example.com/deadlift-video'
      },
      {
        id: 3,
        name: 'Leg Press',
        description: 'A machine exercise that targets the quadriceps, hamstrings, and glutes.',
        difficulty: 'beginner',
        equipment: 'Leg press machine',
        muscles: ['Quadriceps', 'Hamstrings', 'Glutes'],
        instructions: [
          'Sit on the leg press machine with your back against the pad.',
          'Place your feet on the platform, hip-width apart.',
          'Release the safety bars and lower the platform by bending your knees.',
          'Push through your heels to extend your legs, without locking your knees.'
        ],
        image: '/images/workout-placeholder.svg',
        video: 'https://example.com/leg-press-video'
      }
    ],
    arms: [
      {
        id: 1,
        name: 'Bicep Curl',
        description: 'An isolation exercise that targets the biceps.',
        difficulty: 'beginner',
        equipment: 'Dumbbells or Barbell',
        muscles: ['Biceps Brachii', 'Brachialis'],
        instructions: [
          'Stand with feet shoulder-width apart, holding weights with arms extended.',
          'Keep your elbows close to your sides and your upper arms stationary.',
          'Curl the weights up toward your shoulders by bending at the elbow.',
          'Lower the weights back down with control.'
        ],
        image: '/images/arms-bicep-curl.svg',
        video: 'https://example.com/bicep-curl-video'
      },
      {
        id: 2,
        name: 'Tricep Dip',
        description: 'A bodyweight exercise that targets the triceps, chest, and shoulders.',
        difficulty: 'intermediate',
        equipment: 'Parallel bars or bench',
        muscles: ['Triceps Brachii', 'Anterior Deltoids', 'Pectoralis Major'],
        instructions: [
          'Position your hands on parallel bars or a bench, with arms fully extended.',
          'Lower your body by bending your elbows until they reach about 90 degrees.',
          'Push yourself back up to the starting position by extending your elbows.',
          'Keep your elbows pointing backward throughout the movement.'
        ],
        image: '/images/workout-placeholder.svg',
        video: 'https://example.com/tricep-dip-video'
      },
      {
        id: 3,
        name: 'Hammer Curl',
        description: 'A variation of the bicep curl that also targets the brachialis and forearms.',
        difficulty: 'beginner',
        equipment: 'Dumbbells',
        muscles: ['Biceps Brachii', 'Brachialis', 'Brachioradialis'],
        instructions: [
          'Stand with feet shoulder-width apart, holding dumbbells with a neutral grip (palms facing each other).',
          'Keep your elbows close to your sides and your upper arms stationary.',
          'Curl the weights up toward your shoulders by bending at the elbow.',
          'Lower the weights back down with control.'
        ],
        image: '/images/arms-bicep-curl.svg',
        video: 'https://example.com/hammer-curl-video'
      }
    ],
    shoulders: [
      {
        id: 1,
        name: 'Overhead Press',
        description: 'A compound exercise that targets the shoulders, triceps, and upper chest.',
        difficulty: 'intermediate',
        equipment: 'Barbell or Dumbbells',
        muscles: ['Deltoids', 'Triceps', 'Upper Pectoralis'],
        instructions: [
          'Stand with feet shoulder-width apart, holding weights at shoulder level.',
          'Press the weights overhead, fully extending your arms.',
          'Lower the weights back to shoulder level with control.',
          'Keep your core engaged and avoid arching your back.'
        ],
        image: '/images/workout-placeholder.svg',
        video: 'https://example.com/overhead-press-video'
      },
      {
        id: 2,
        name: 'Lateral Raise',
        description: 'An isolation exercise that targets the lateral deltoids.',
        difficulty: 'beginner',
        equipment: 'Dumbbells',
        muscles: ['Lateral Deltoids'],
        instructions: [
          'Stand with feet shoulder-width apart, holding dumbbells at your sides.',
          'Raise the dumbbells out to the sides until they reach shoulder level.',
          'Keep a slight bend in your elbows and maintain proper posture.',
          'Lower the weights back down with control.'
        ],
        image: '/images/workout-placeholder.svg',
        video: 'https://example.com/lateral-raise-video'
      },
      {
        id: 3,
        name: 'Face Pull',
        description: 'An exercise that targets the rear deltoids, upper back, and rotator cuff muscles.',
        difficulty: 'intermediate',
        equipment: 'Cable machine with rope attachment',
        muscles: ['Rear Deltoids', 'Trapezius', 'Rhomboids', 'Rotator Cuff'],
        instructions: [
          'Set a cable pulley to slightly above head height and attach a rope.',
          'Grasp the rope with both hands and step back to create tension.',
          'Pull the rope toward your face, separating your hands as you pull.',
          'Squeeze your shoulder blades together at the end of the movement.'
        ],
        image: '/images/workout-placeholder.svg',
        video: 'https://example.com/face-pull-video'
      }
    ],
    core: [
      {
        id: 1,
        name: 'Plank',
        description: 'A static exercise that engages the entire core, as well as the shoulders and glutes.',
        difficulty: 'beginner',
        equipment: 'None',
        muscles: ['Rectus Abdominis', 'Transverse Abdominis', 'Obliques', 'Lower Back'],
        instructions: [
          'Start in a push-up position, then lower onto your forearms.',
          'Keep your body in a straight line from head to heels.',
          'Engage your core and hold the position.',
          'Breathe normally and maintain proper form throughout.'
        ],
        image: '/images/core-plank.svg',
        video: 'https://example.com/plank-video'
      },
      {
        id: 2,
        name: 'Russian Twist',
        description: 'A dynamic exercise that targets the obliques and rectus abdominis.',
        difficulty: 'intermediate',
        equipment: 'Weight (optional)',
        muscles: ['Obliques', 'Rectus Abdominis', 'Hip Flexors'],
        instructions: [
          'Sit on the floor with knees bent and feet elevated slightly.',
          'Lean back slightly to engage your core, keeping your back straight.',
          'Hold your hands together or hold a weight, and twist your torso from side to side.',
          'Touch the ground on each side with each twist.'
        ],
        image: '/images/workout-placeholder.svg',
        video: 'https://example.com/russian-twist-video'
      },
      {
        id: 3,
        name: 'Hanging Leg Raise',
        description: 'A challenging exercise that targets the lower abs and hip flexors.',
        difficulty: 'advanced',
        equipment: 'Pull-up bar',
        muscles: ['Lower Rectus Abdominis', 'Hip Flexors', 'Obliques'],
        instructions: [
          'Hang from a pull-up bar with arms fully extended.',
          'Keep your legs straight and raise them until they are parallel to the ground or higher.',
          'Lower your legs back down with control.',
          'Avoid swinging and use your core to control the movement.'
        ],
        image: '/images/workout-placeholder.svg',
        video: 'https://example.com/hanging-leg-raise-video'
      }
    ]
  };

  useEffect(() => {
    // Simulate loading data
    setLoading(true);
    setSelectedExercise(null);
    setTimeout(() => {
      const data = exerciseData[bodyPart] || [];
      setExercises(data);
      setLoading(false);
    }, 500);
  }, [bodyPart]);
  
  const handleExerciseClick = (exercise) => {
    setSelectedExercise(exercise);
    // Scroll to top on mobile
    if (window.innerWidth < 768) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  const toggleSaveExercise = (exerciseId) => {
    if (savedExercises.includes(exerciseId)) {
      setSavedExercises(savedExercises.filter(id => id !== exerciseId));
    } else {
      setSavedExercises([...savedExercises, exerciseId]);
    }
  };
  
  const filteredExercises = filter === 'all' 
    ? exercises 
    : filter === 'saved' 
      ? exercises.filter(ex => savedExercises.includes(ex.id))
      : exercises.filter(ex => ex.difficulty === filter);

  const formatBodyPart = (part) => {
    return part.charAt(0).toUpperCase() + part.slice(1);
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      'beginner': 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
      'intermediate': 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200',
      'advanced': 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
    };
    
    return colors[difficulty] || 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200';
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-8"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div className="flex items-center">
          <Link to="/exercise-library" className="mr-4">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ArrowLeftIcon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
            </motion.div>
          </Link>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            {formatBodyPart(bodyPart)} Exercises
          </h1>
        </div>
        
        <div className="flex space-x-2 overflow-x-auto pb-2 md:pb-0">
          <motion.button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap ${filter === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white'}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            All
          </motion.button>
          <motion.button
            onClick={() => setFilter('beginner')}
            className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap ${filter === 'beginner' ? 'bg-green-600 text-white' : 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Beginner
          </motion.button>
          <motion.button
            onClick={() => setFilter('intermediate')}
            className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap ${filter === 'intermediate' ? 'bg-yellow-600 text-white' : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Intermediate
          </motion.button>
          <motion.button
            onClick={() => setFilter('advanced')}
            className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap ${filter === 'advanced' ? 'bg-red-600 text-white' : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Advanced
          </motion.button>
          <motion.button
            onClick={() => setFilter('saved')}
            className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap flex items-center ${filter === 'saved' ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white'}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <BookmarkSolidIcon className="h-4 w-4 mr-1" />
            Saved
          </motion.button>
        </div>
      </div>
      
      {selectedExercise && (
        <div className="mb-8">
          <ExerciseDetail exercise={selectedExercise} />
          <div className="mt-4 flex justify-end">
            <motion.button
              onClick={() => setSelectedExercise(null)}
              className="px-4 py-2 text-indigo-600 dark:text-indigo-400 font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Back to List
            </motion.button>
          </div>
        </div>
      )}
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <motion.div 
            className="h-16 w-16 border-4 border-indigo-500 border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        </div>
      ) : filteredExercises.length > 0 && !selectedExercise ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExercises.map((exercise, index) => (
            <motion.div
              key={exercise.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden cursor-pointer relative"
              whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
              onClick={() => handleExerciseClick(exercise)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="relative h-48 bg-gray-200 dark:bg-gray-700">
                <img 
                  src={exercise.image} 
                  alt={exercise.name} 
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute top-2 right-2 flex space-x-2">
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSaveExercise(exercise.id);
                    }}
                    className="p-1.5 bg-white dark:bg-gray-800 rounded-full shadow-md"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {savedExercises.includes(exercise.id) ? (
                      <BookmarkSolidIcon className="h-5 w-5 text-indigo-600" />
                    ) : (
                      <BookmarkIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                    )}
                  </motion.button>
                </div>
                <div className="absolute bottom-2 left-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-lg ${getDifficultyColor(exercise.difficulty)}`}>
                    {exercise.difficulty.charAt(0).toUpperCase() + exercise.difficulty.slice(1)}
                  </span>
                </div>
              </div>
              
              <div className="p-4">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{exercise.name}</h2>
                <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mb-3">{exercise.description}</p>
                
                <div className="flex flex-wrap gap-1 mb-3">
                  {exercise.muscles.slice(0, 3).map((muscle, index) => (
                    <span key={index} className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 text-xs rounded-full">
                      {muscle}
                    </span>
                  ))}
                  {exercise.muscles.length > 3 && (
                    <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs rounded-full">
                      +{exercise.muscles.length - 3} more
                    </span>
                  )}
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400">{exercise.equipment}</span>
                  <motion.button
                    className="text-indigo-600 dark:text-indigo-400 text-sm font-medium"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    View Details
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            No exercises found for {formatBodyPart(bodyPart)}.
          </p>
          <Link 
            to="/exercise-library"
            className="mt-4 inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Back to Exercise Library
          </Link>
        </div>
      )}
    </motion.div>
  );
};

export default BodyPartExercises;