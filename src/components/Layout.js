import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { initializeDatabase } from '../db/db';
import { motion } from 'framer-motion';

const Layout = () => {
  useEffect(() => {
    // Initialize the database with sample data
    initializeDatabase();
  }, []);

  // Animation variants for main content
  const mainContentVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        delay: 0.3,
        duration: 0.5
      }
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />
        <motion.main 
          className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6 pt-16 md:pt-20"
          variants={mainContentVariants}
          initial="hidden"
          animate="visible"
        >
          <Outlet />
        </motion.main>
      </div>
    </div>
  );
};

export default Layout;