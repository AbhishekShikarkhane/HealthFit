import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('dark');
  const [colorScheme, setColorScheme] = useState('indigo');

  const colorSchemes = {
    indigo: {
      primary: 'indigo-600',
      secondary: 'indigo-400',
      accent: 'purple-500',
      hover: 'indigo-700',
      light: 'indigo-100',
      gradient: 'from-indigo-600 to-purple-600'
    },
    teal: {
      primary: 'teal-500',
      secondary: 'teal-400',
      accent: 'emerald-500',
      hover: 'teal-600',
      light: 'teal-100',
      gradient: 'from-teal-500 to-emerald-500'
    },
    rose: {
      primary: 'rose-500',
      secondary: 'rose-400',
      accent: 'pink-500',
      hover: 'rose-600',
      light: 'rose-100',
      gradient: 'from-rose-500 to-pink-500'
    },
    amber: {
      primary: 'amber-500',
      secondary: 'amber-400',
      accent: 'orange-500',
      hover: 'amber-600',
      light: 'amber-100',
      gradient: 'from-amber-500 to-orange-500'
    },
    blue: {
      primary: 'blue-500',
      secondary: 'blue-400',
      accent: 'sky-500',
      hover: 'blue-600',
      light: 'blue-100',
      gradient: 'from-blue-500 to-sky-500'
    }
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    const savedColorScheme = localStorage.getItem('colorScheme') || 'indigo';
    setTheme(savedTheme);
    setColorScheme(savedColorScheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const changeColorScheme = (scheme) => {
    if (colorSchemes[scheme]) {
      setColorScheme(scheme);
      localStorage.setItem('colorScheme', scheme);
    }
  };

  const colors = colorSchemes[colorScheme] || colorSchemes.indigo;

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      toggleTheme, 
      colorScheme, 
      changeColorScheme, 
      colors,
      availableColorSchemes: Object.keys(colorSchemes)
    }}>
      {children}
    </ThemeContext.Provider>
  );
};