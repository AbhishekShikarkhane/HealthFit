import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { SunIcon, MoonIcon, BellIcon, UserCircleIcon, SwatchIcon, Bars3Icon } from '@heroicons/react/24/outline';

const Navbar = () => {
  const { theme, toggleTheme, colorScheme, changeColorScheme, colors, availableColorSchemes } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Animation variants
  const navVariants = {
    hidden: { y: -50, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: 'spring', 
        stiffness: 100, 
        damping: 15 
      }
    }
  };

  const buttonVariants = {
    hover: { 
      scale: 1.1, 
      boxShadow: '0px 5px 10px rgba(0, 0, 0, 0.1)',
      transition: { type: 'spring', stiffness: 400, damping: 10 }
    },
    tap: { scale: 0.9 }
  };

  const mobileMenuVariants = {
    closed: { 
      opacity: 0,
      y: -20,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    },
    open: { 
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const menuItemVariants = {
    closed: { opacity: 0, y: -10 },
    open: { opacity: 1, y: 0 }
  };

  return (
    <motion.nav 
      className={`fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 shadow-md py-3 px-4 md:px-6 border-b-2 border-${colors.light} dark:border-${colors.secondary} ${scrolled ? 'backdrop-blur-md bg-white/90 dark:bg-gray-800/90' : ''}`}
      variants={navVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <motion.h1 
            className={`text-xl md:text-2xl font-bold text-${colors.primary} dark:text-${colors.secondary} bg-gradient-to-r ${colors.gradient} bg-clip-text text-transparent`}
            whileHover={{ scale: 1.05 }}
            onClick={() => navigate('/')}
            style={{ cursor: 'pointer' }}
          >
            HealthFit
          </motion.h1>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-4">
          <motion.button
            className={`p-2 rounded-full bg-gray-200 dark:bg-gray-700 border border-${colors.light} dark:border-${colors.secondary}`}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={toggleTheme}
          >
            {theme === 'dark' ? (
              <SunIcon className="h-5 w-5 text-yellow-500" />
            ) : (
              <MoonIcon className="h-5 w-5 text-gray-700" />
            )}
          </motion.button>
          
          <div className="relative">
            <motion.button
              className={`p-2 rounded-full bg-gray-200 dark:bg-gray-700 border border-${colors.light} dark:border-${colors.secondary}`}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={() => setShowColorPicker(!showColorPicker)}
              title="Change color theme"
            >
              <SwatchIcon className={`h-5 w-5 text-${colors.primary} dark:text-${colors.secondary}`} />
            </motion.button>
            
            <AnimatePresence>
              {showColorPicker && (
                <motion.div 
                  className="absolute right-0 mt-2 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl z-10 border border-gray-200 dark:border-gray-700"
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="grid grid-cols-5 gap-2">
                    {availableColorSchemes.map(scheme => (
                      <motion.button
                        key={scheme}
                        className={`w-6 h-6 rounded-full ${scheme === colorScheme ? 'ring-2 ring-offset-2 ring-gray-400' : ''}`}
                        style={{ 
                          background: `linear-gradient(to right, var(--tw-gradient-stops))`,
                          '--tw-gradient-from': `rgb(var(--${scheme}-500))`, 
                          '--tw-gradient-to': `rgb(var(--${scheme}-600))`,
                          '--tw-gradient-stops': `var(--tw-gradient-from), var(--tw-gradient-to)` 
                        }}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {
                          changeColorScheme(scheme);
                          setShowColorPicker(false);
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <motion.button
            className={`p-2 rounded-full bg-gray-200 dark:bg-gray-700 relative border border-${colors.light} dark:border-${colors.secondary}`}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <BellIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            <span className={`absolute top-0 right-0 h-3 w-3 rounded-full bg-${colors.accent}`}></span>
          </motion.button>
          
          <motion.div
            className="cursor-pointer"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => navigate('/profile')}
          >
            <UserCircleIcon className={`h-7 w-7 text-${colors.primary} dark:text-${colors.secondary}`} />
          </motion.div>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center space-x-3">
          <motion.button
            className={`p-2 rounded-full bg-gray-200 dark:bg-gray-700 relative border border-${colors.light} dark:border-${colors.secondary}`}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={toggleTheme}
          >
            {theme === 'dark' ? (
              <SunIcon className="h-5 w-5 text-yellow-500" />
            ) : (
              <MoonIcon className="h-5 w-5 text-gray-700" />
            )}
          </motion.button>

          <motion.button
            className={`p-2 rounded-full bg-gray-200 dark:bg-gray-700 border border-${colors.light} dark:border-${colors.secondary}`}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Bars3Icon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="md:hidden absolute top-full left-0 right-0 bg-white dark:bg-gray-800 shadow-lg rounded-b-lg overflow-hidden z-50"
            initial="closed"
            animate="open"
            exit="closed"
            variants={mobileMenuVariants}
          >
            <div className="p-4 space-y-3">
              <motion.div variants={menuItemVariants} className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300">Color Theme</span>
                <div className="flex space-x-2">
                  {availableColorSchemes.map(scheme => (
                    <motion.button
                      key={scheme}
                      className={`w-6 h-6 rounded-full ${scheme === colorScheme ? 'ring-2 ring-offset-1 ring-gray-400' : ''}`}
                      style={{ 
                        background: `linear-gradient(to right, var(--tw-gradient-stops))`,
                        '--tw-gradient-from': `rgb(var(--${scheme}-500))`, 
                        '--tw-gradient-to': `rgb(var(--${scheme}-600))`,
                        '--tw-gradient-stops': `var(--tw-gradient-from), var(--tw-gradient-to)` 
                      }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => changeColorScheme(scheme)}
                    />
                  ))}
                </div>
              </motion.div>

              <motion.div variants={menuItemVariants}>
                <motion.button
                  className={`w-full p-3 rounded-lg flex items-center space-x-3 bg-gray-100 dark:bg-gray-700`}
                  whileHover={{ backgroundColor: theme === 'dark' ? '#374151' : '#f3f4f6' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/profile')}
                >
                  <UserCircleIcon className={`h-5 w-5 text-${colors.primary} dark:text-${colors.secondary}`} />
                  <span className="text-gray-700 dark:text-gray-300">Profile</span>
                </motion.button>
              </motion.div>

              <motion.div variants={menuItemVariants}>
                <motion.button
                  className={`w-full p-3 rounded-lg flex items-center space-x-3 bg-gray-100 dark:bg-gray-700`}
                  whileHover={{ backgroundColor: theme === 'dark' ? '#374151' : '#f3f4f6' }}
                  whileTap={{ scale: 0.98 }}
                >
                  <BellIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                  <span className="text-gray-700 dark:text-gray-300">Notifications</span>
                  <span className={`ml-auto h-2 w-2 rounded-full bg-${colors.accent}`}></span>
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;