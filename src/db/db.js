import Dexie from 'dexie';

export const db = new Dexie('healthFitnessApp');

db.version(1).stores({
  userData: '++id',
  meals: '++id,date,type',
  workouts: '++id,date,type',
  savedWorkouts: 'id,savedAt',
  sleepData: '++id,date',
  hydrationData: '++id,date',
  challenges: '++id,name,startDate,endDate,completed',
  meditationSessions: '++id,date,duration',
});

// Initialize database with sample data
export const initializeDatabase = async () => {
  // Check if we already have data
  const userCount = await db.userData.count();
  
  if (userCount === 0) {
    // Add sample user data
    await db.userData.add({
      name: 'User',
      gender: 'not specified',
      age: 30,
      weight: 70,
      height: 170,
      bmi: 24.2,
      bodyFat: 20,
      goals: ['Lose weight', 'Build muscle'],
      dietPreference: 'balanced',
      fitnessLevel: 'beginner',
      streaks: {
        workout: 3,
        nutrition: 5,
        hydration: 7,
        sleep: 4
      },
      dailyData: {
        calories: 1800,
        protein: 90,
        carbs: 200,
        fat: 60,
        water: 5,
        sleep: 7,
        workouts: ['Morning Cardio']
      }
    });

    // Add sample meals
    const today = new Date();
    await db.meals.bulkAdd([
      { 
        date: today.toISOString().split('T')[0], 
        type: 'breakfast', 
        name: 'Oatmeal with Berries', 
        calories: 350, 
        protein: 15, 
        carbs: 45, 
        fat: 10 
      },
      { 
        date: today.toISOString().split('T')[0], 
        type: 'lunch', 
        name: 'Chicken Salad', 
        calories: 450, 
        protein: 35, 
        carbs: 25, 
        fat: 20 
      },
      { 
        date: today.toISOString().split('T')[0], 
        type: 'dinner', 
        name: 'Salmon with Vegetables', 
        calories: 550, 
        protein: 40, 
        carbs: 30, 
        fat: 25 
      },
    ]);

    // Add sample workouts
    await db.workouts.bulkAdd([
      {
        date: today.toISOString().split('T')[0],
        type: 'cardio',
        name: 'Morning Run',
        duration: 30,
        caloriesBurned: 300,
        completed: true
      },
      {
        date: new Date(today.setDate(today.getDate() - 1)).toISOString().split('T')[0],
        type: 'strength',
        name: 'Upper Body Workout',
        duration: 45,
        caloriesBurned: 400,
        exercises: [
          { name: 'Push-ups', sets: 3, reps: 15 },
          { name: 'Pull-ups', sets: 3, reps: 10 },
          { name: 'Shoulder Press', sets: 3, reps: 12 }
        ],
        completed: true
      }
    ]);

    // Add sample sleep data
    await db.sleepData.bulkAdd([
      {
        date: today.toISOString().split('T')[0],
        duration: 7.5,
        quality: 'good'
      },
      {
        date: new Date(today.setDate(today.getDate() - 1)).toISOString().split('T')[0],
        duration: 6.5,
        quality: 'fair'
      }
    ]);

    // Add sample hydration data
    await db.hydrationData.bulkAdd([
      {
        date: today.toISOString().split('T')[0],
        amount: 2000, // ml
        goal: 2500
      },
      {
        date: new Date(today.setDate(today.getDate() - 1)).toISOString().split('T')[0],
        amount: 2200,
        goal: 2500
      }
    ]);

    // Add sample challenges
    await db.challenges.bulkAdd([
      {
        name: '30-Day Fitness Challenge',
        description: 'Complete daily workouts for 30 days',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0],
        progress: 10,
        total: 30,
        completed: false
      },
      {
        name: 'Hydration Challenge',
        description: 'Drink 3L of water daily for 14 days',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(new Date().setDate(new Date().getDate() + 14)).toISOString().split('T')[0],
        progress: 5,
        total: 14,
        completed: false
      }
    ]);
  }
};