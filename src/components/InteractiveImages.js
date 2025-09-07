import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const InteractiveImages = ({ section }) => {
  const { theme, colorScheme } = useTheme();
  const [hoveredIndex, setHoveredIndex] = useState(null);
  
  // Define images for different sections
  const imagesBySection = {
    home: [
      {
        src: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
        alt: 'Person running on track',
        title: 'Cardio Training',
        description: 'Improve your endurance and heart health'
      },
      {
        src: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
        alt: 'Person lifting weights',
        title: 'Strength Training',
        description: 'Build muscle and increase your strength'
      },
      {
        src: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
        alt: 'Person doing yoga',
        title: 'Flexibility & Balance',
        description: 'Enhance your mobility and stability'
      }
    ],
    exercises: [
      {
        src: 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1474&q=80',
        alt: 'Leg workout',
        title: 'Leg Exercises',
        description: 'Build strong and powerful legs'
      },
      {
        src: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
        alt: 'Arm workout',
        title: 'Arm Exercises',
        description: 'Develop defined and strong arms'
      },
      {
        src: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
        alt: 'Core workout',
        title: 'Core Exercises',
        description: 'Strengthen your core for better stability'
      }
    ],
    nutrition: [
      {
        src: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
        alt: 'Healthy meal prep',
        title: 'Meal Planning',
        description: 'Prepare nutritious meals for the week'
      },
      {
        src: 'https://images.unsplash.com/photo-1494390248081-4e521a5940db?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
        alt: 'Fresh fruits and vegetables',
        title: 'Healthy Ingredients',
        description: 'Choose the right foods for your goals'
      },
      {
        src: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
        alt: 'Protein-rich foods',
        title: 'Protein Sources',
        description: 'Essential for muscle recovery and growth'
      }
    ],
    meditation: [
      {
        src: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
        alt: 'Person meditating',
        title: 'Meditation',
        description: 'Calm your mind and reduce stress'
      },
      {
        src: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1520&q=80',
        alt: 'Yoga pose',
        title: 'Yoga Practice',
        description: 'Improve flexibility and mental clarity'
      },
      {
        src: 'https://images.unsplash.com/photo-1518310383802-640c2de311b6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
        alt: 'Breathing exercise',
        title: 'Breathing Techniques',
        description: 'Master your breath for better focus'
      }
    ]
  };
  
  // Get images for the current section or default to home
  const images = imagesBySection[section] || imagesBySection.home;
  
  // Get color scheme variables
  const getGradientClass = () => {
    const colors = {
      indigo: 'from-indigo-600 to-indigo-400',
      teal: 'from-teal-500 to-teal-300',
      rose: 'from-rose-500 to-rose-300',
      amber: 'from-amber-500 to-amber-300',
      blue: 'from-blue-500 to-blue-300'
    };
    return colors[colorScheme] || colors.indigo;
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 12
      }
    },
    hover: {
      scale: 1.05,
      y: -5,
      boxShadow: '0px 10px 25px rgba(0, 0, 0, 0.3)',
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 15
      }
    }
  };
  
  const imageVariants = {
    hover: {
      scale: 1.15,
      transition: { duration: 0.4 }
    }
  };
  
  const overlayVariants = {
    hover: {
      opacity: 0.7,
      transition: { duration: 0.3 }
    }
  };
  
  const textVariants = {
    hover: {
      y: -5,
      transition: { duration: 0.3, ease: "easeOut" }
    }
  };
  
  return (
    <motion.div
      className="w-full py-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {images.map((image, index) => (
          <motion.div
            key={index}
            className={`relative overflow-hidden rounded-xl shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} transform-gpu`}
            variants={itemVariants}
            whileHover="hover"
            onHoverStart={() => setHoveredIndex(index)}
            onHoverEnd={() => setHoveredIndex(null)}
          >
            <div className="relative h-56 sm:h-64 overflow-hidden">
              <motion.img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover"
                variants={imageVariants}
                initial={{ scale: 1 }}
                whileHover="hover"
                transition={{ duration: 0.5 }}
                loading="lazy"
              />
              <motion.div
                className={`absolute inset-0 bg-gradient-to-t ${getGradientClass()}`}
                variants={overlayVariants}
                initial={{ opacity: 0 }}
                whileHover="hover"
              />
            </div>
            <motion.div 
              className="p-4"
              variants={textVariants}
              whileHover="hover"
            >
              <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                {image.title}
              </h3>
              <p className={`mt-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                {image.description}
              </p>
            </motion.div>
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: hoveredIndex === index ? '100%' : '0%' }}
              className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${getGradientClass()}`}
              transition={{ duration: 0.3 }}
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default InteractiveImages;