import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../db/db';

const UserDataContext = createContext();

export const useUserData = () => useContext(UserDataContext);

export const UserDataProvider = ({ children }) => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    gender: '',
    age: 0,
    weight: 0,
    height: 0,
    bmi: 0,
    bodyFat: 0,
    goals: [],
    activityLevel: 'moderate',
    fitnessGoal: 'weight_loss',
    streaks: {
      workout: 0,
      nutrition: 0,
      hydration: 0,
      sleep: 0
    },
    dailyData: {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      water: 0,
      sleep: 0,
      workouts: []
    }
  });

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const data = await db.userData.toArray();
        if (data.length > 0) {
          setUserData(data[0]);
        } else {
          // Initialize with default data
          const defaultData = {
            name: 'User',
            email: 'user@example.com',
            gender: 'not specified',
            age: 30,
            weight: 70,
            height: 170,
            bmi: 24.2,
            bodyFat: 20,
            goals: ['Lose weight', 'Build muscle'],
            activityLevel: 'moderate',
            fitnessGoal: 'weight_loss',
            streaks: {
              workout: 0,
              nutrition: 0,
              hydration: 0,
              sleep: 0
            },
            dailyData: {
              calories: 0,
              protein: 0,
              carbs: 0,
              fat: 0,
              water: 0,
              sleep: 0,
              workouts: []
            }
          };
          await db.userData.add(defaultData);
          setUserData(defaultData);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };

    loadUserData();
  }, []);

  const updateUserData = async (newData) => {
    try {
      const updatedData = { ...userData, ...newData };
      setUserData(updatedData);
      
      const id = await db.userData.toArray().then(data => data[0]?.id);
      if (id) {
        await db.userData.update(id, updatedData);
      } else {
        await db.userData.add(updatedData);
      }
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  const updateDailyData = async (newDailyData) => {
    try {
      const updatedDailyData = { ...userData.dailyData, ...newDailyData };
      const updatedData = { ...userData, dailyData: updatedDailyData };
      setUserData(updatedData);
      
      const id = await db.userData.toArray().then(data => data[0]?.id);
      if (id) {
        await db.userData.update(id, updatedData);
      }
    } catch (error) {
      console.error('Error updating daily data:', error);
    }
  };

  return (
    <UserDataContext.Provider value={{ userData, updateUserData, updateDailyData }}>
      {children}
    </UserDataContext.Provider>
  );
};