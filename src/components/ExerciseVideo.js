import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PlayIcon, PauseIcon } from '@heroicons/react/24/solid';

const ExerciseVideo = ({ videoUrl, thumbnailUrl, title }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // For demo purposes, we'll use the thumbnail as a placeholder
  // In a real app, you would use actual video embedding
  const handlePlayToggle = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <motion.div 
      className="relative rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-700 w-full aspect-video"
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {!isPlaying ? (
        <>
          <img 
            src={thumbnailUrl || '/images/workout-placeholder.svg'} 
            alt={title}
            className="w-full h-full object-cover"
            loading="lazy"
            onLoad={() => setIsLoaded(true)}
          />
          <motion.div 
            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-40 transition-all duration-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: isLoaded ? 1 : 0 }}
          >
            <motion.button
              onClick={handlePlayToggle}
              className="bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 rounded-full p-3 shadow-lg"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <PlayIcon className="h-8 w-8" />
            </motion.button>
          </motion.div>
        </>
      ) : (
        <div className="w-full h-full">
          <div className="relative pb-[56.25%] h-0 overflow-hidden">
            <iframe 
              src={videoUrl} 
              title={title}
              className="absolute top-0 left-0 w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <motion.button
            onClick={handlePlayToggle}
            className="absolute bottom-4 right-4 bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 rounded-full p-2 shadow-lg"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <PauseIcon className="h-6 w-6" />
          </motion.button>
        </div>
      )}
    </motion.div>
  );
};

export default ExerciseVideo;