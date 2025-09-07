import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { 
  HomeIcon, ChartBarIcon, UserIcon, CakeIcon, 
  FireIcon, DocumentChartBarIcon, HeartIcon, BookOpenIcon,
  SparklesIcon, ChevronDownIcon
} from '@heroicons/react/24/outline';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedItem, setExpandedItem] = useState(null);
  const { colors } = useTheme();
  
  const toggleExpand = (index) => {
    setExpandedItem(expandedItem === index ? null : index);
  };

  const sidebarVariants = {
    expanded: { width: '250px' },
    collapsed: { width: '80px' }
  };

  const menuItems = [
    { path: '/', name: 'Home', icon: <HomeIcon className="h-6 w-6" /> },
    { path: '/dashboard', name: 'Dashboard', icon: <ChartBarIcon className="h-6 w-6" /> },
    { path: '/profile', name: 'Profile', icon: <UserIcon className="h-6 w-6" /> },
    { path: '/exercise-library', name: 'Exercises', icon: <FireIcon className="h-6 w-6" />, subItems: [
      { path: '/exercise-library/legs', name: 'Legs' },
      { path: '/exercise-library/arms', name: 'Arms' },
      { path: '/exercise-library/chest', name: 'Chest' },
      { path: '/exercise-library/back', name: 'Back' },
      { path: '/exercise-library/core', name: 'Core' },
    ]},
    { path: '/meal-planner', name: 'Meal Planner', icon: <CakeIcon className="h-6 w-6" /> },
    { path: '/workout-generator', name: 'Workout Generator', icon: <SparklesIcon className="h-6 w-6" /> },
    { path: '/meditation-yoga', name: 'Meditation & Yoga', icon: <BookOpenIcon className="h-6 w-6" /> },
    { path: '/reports', name: 'Reports', icon: <DocumentChartBarIcon className="h-6 w-6" /> },
    { path: '/challenges', name: 'Challenges', icon: <HeartIcon className="h-6 w-6" /> },
  ];

  return (
    <motion.div
      className={`bg-gradient-to-b ${colors.gradient} text-white h-full overflow-hidden`}
      variants={sidebarVariants}
      animate={isCollapsed ? 'collapsed' : 'expanded'}
      transition={{ duration: 0.3 }}
    >
      <div className="p-4 flex justify-between items-center">
        {!isCollapsed && (
          <motion.h2 
            className="text-xl font-bold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            HealthFit
          </motion.h2>
        )}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`p-2 rounded-full hover:bg-${colors.hover}`}
        >
          {isCollapsed ? '→' : '←'}
        </button>
      </div>
      
      <nav className="mt-8">
        <ul className="space-y-2 px-2">
          {menuItems.map((item, index) => (
            <li key={item.path}>
              {item.subItems ? (
                <div>
                  <button
                    onClick={() => toggleExpand(index)}
                    className={`flex items-center p-3 rounded-lg transition-colors w-full hover:bg-${colors.hover}`}
                  >
                    <span className="flex-shrink-0">{item.icon}</span>
                    {!isCollapsed && (
                      <motion.span 
                        className="ml-3 flex-grow text-left"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        {item.name}
                      </motion.span>
                    )}
                    {!isCollapsed && (
                      <ChevronDownIcon 
                        className={`h-4 w-4 transition-transform ${expandedItem === index ? 'transform rotate-180' : ''}`} 
                      />
                    )}
                  </button>
                  
                  {/* Submenu */}
                  {!isCollapsed && expandedItem === index && (
                    <motion.ul
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-1 ml-6 space-y-1"
                    >
                      {item.subItems.map((subItem, subIndex) => (
                        <li key={subIndex}>
                          <NavLink
                            to={subItem.path}
                            className={({ isActive }) =>
                              `flex items-center p-2 rounded-lg transition-colors ${isActive ? `bg-${colors.hover}` : `hover:bg-${colors.hover}`}`
                            }
                          >
                            <div className="w-2 h-2 rounded-full bg-current"></div>
                            <span className="ml-3">{subItem.name}</span>
                          </NavLink>
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </div>
              ) : (
                <NavLink 
                  to={item.path}
                  className={({ isActive }) => 
                    `flex items-center p-3 rounded-lg transition-colors ${isActive ? `bg-${colors.hover}` : `hover:bg-${colors.hover}`}`
                  }
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  {!isCollapsed && (
                    <motion.span 
                      className="ml-3"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      {item.name}
                    </motion.span>
                  )}
                </NavLink>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </motion.div>
  );
};

export default Sidebar;