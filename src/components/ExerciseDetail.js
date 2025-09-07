import React from 'react';
import { motion } from 'framer-motion';
import ExerciseVideo from './ExerciseVideo';

const ExerciseDetail = ({ exercise }) => {
  const getDifficultyColor = (difficulty) => {
    const colors = {
      'beginner': 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
      'intermediate': 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200',
      'advanced': 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
    };
    
    return colors[difficulty] || 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200';
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 24
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
    >
      <div className="md:flex">
        <motion.div 
          className="md:w-1/2 lg:w-2/5"
          variants={itemVariants}
        >
          <ExerciseVideo 
            videoUrl={exercise.video} 
            thumbnailUrl={exercise.image} 
            title={exercise.name} 
          />
        </motion.div>

        <div className="p-6 md:w-1/2 lg:w-3/5">
          <motion.div variants={itemVariants} className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{exercise.name}</h2>
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${getDifficultyColor(exercise.difficulty)}`}>
              {exercise.difficulty.charAt(0).toUpperCase() + exercise.difficulty.slice(1)}
            </span>
          </motion.div>
          
          <motion.p 
            variants={itemVariants} 
            className="text-gray-600 dark:text-gray-300 mb-6"
          >
            {exercise.description}
          </motion.p>
          
          <motion.div variants={itemVariants} className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Equipment</h3>
            <p className="text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg">
              {exercise.equipment}
            </p>
          </motion.div>
          
          <motion.div variants={itemVariants} className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Muscles Worked</h3>
            <div className="flex flex-wrap gap-2">
              {exercise.muscles.map((muscle, index) => (
                <motion.span 
                  key={index} 
                  className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 text-sm font-medium rounded-full"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {muscle}
                </motion.span>
              ))}
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants} className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Instructions</h3>
            <ol className="space-y-3">
              {exercise.instructions.map((instruction, index) => (
                <motion.li 
                  key={index}
                  className="flex items-start"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 + 0.5 }}
                >
                  <span className="flex items-center justify-center bg-indigo-600 text-white rounded-full w-6 h-6 text-sm font-medium mr-3 flex-shrink-0 mt-0.5">
                    {index + 1}
                  </span>
                  <span className="text-gray-600 dark:text-gray-300">{instruction}</span>
                </motion.li>
              ))}
            </ol>
          </motion.div>
          
          <motion.div 
            variants={itemVariants}
            className="flex justify-end space-x-4"
          >
            <motion.button
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
              </svg>
              <span>Add to Workout</span>
            </motion.button>
            
            <motion.button
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
              </svg>
              <span>Share</span>
            </motion.button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default ExerciseDetail;