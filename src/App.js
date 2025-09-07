import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useTheme } from './context/ThemeContext';
import { AnimatePresence } from 'framer-motion';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import MealPlanner from './pages/MealPlanner';
import Challenges from './pages/Challenges';
import Reports from './pages/Reports';
import MeditationYoga from './pages/MeditationYoga';
import ExerciseLibrary from './pages/ExerciseLibrary';
import BodyPartExercises from './pages/BodyPartExercises';
import WorkoutGenerator from './pages/WorkoutGenerator';

// Components
import Layout from './components/Layout';
import ChatbotWidget from './components/ChatbotWidget';

function App() {
  const { theme } = useTheme();

  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);

  return (
    <div className={`app ${theme}`}>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="meal-planner" element={<MealPlanner />} />
            <Route path="challenges" element={<Challenges />} />
            <Route path="reports" element={<Reports />} />
            <Route path="meditation-yoga" element={<MeditationYoga />} />
            <Route path="exercise-library" element={<ExerciseLibrary />} />
            <Route path="exercise-library/:bodyPart" element={<BodyPartExercises />} />
            <Route path="workout-generator" element={<WorkoutGenerator />} />
          </Route>
        </Routes>
      </AnimatePresence>
      <ChatbotWidget />
    </div>
  );
}

export default App;