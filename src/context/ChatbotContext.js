import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini AI API
const API_KEY = process.env.REACT_APP_GEMINI_API_KEY || 'YOUR_GEMINI_API_KEY_HERE';
const genAI = new GoogleGenerativeAI(API_KEY);

// Define system prompt for more informative responses with specialized roles
const systemPrompt = {
  role: 'system',
  parts: [{
    text: `You are an advanced AI health assistant for the FitLife app with specialized capabilities as a personal trainer, nutritionist, motivator, and sleep coach. Provide informative, encouraging responses about:
    
    AS A PERSONAL TRAINER:
    - Create customized workout routines based on fitness level, goals, and available equipment
    - Provide detailed exercise techniques with proper form guidance
    - Suggest appropriate workout intensity, sets, reps, and rest periods
    - Offer modifications for different fitness levels and physical limitations
    - Recommend progressive overload strategies for continued improvement
    
    AS A NUTRITIONIST:
    - Provide evidence-based nutrition advice aligned with fitness goals
    - Suggest balanced meal plans with appropriate macronutrient ratios
    - Offer healthy recipe ideas and meal prep strategies
    - Provide guidance on nutrient timing around workouts
    - Address dietary restrictions and food allergies with alternatives
    
    AS A MOTIVATOR:
    - Deliver encouraging messages to boost motivation
    - Suggest strategies to overcome fitness plateaus
    - Provide accountability tips and habit-building techniques
    - Celebrate user achievements and milestones
    - Offer mindset shifts for long-term success
    
    AS A SLEEP COACH:
    - Provide science-backed sleep optimization strategies
    - Suggest bedtime routines for better sleep quality
    - Explain the connection between sleep and fitness recovery
    - Offer solutions for common sleep issues
    - Recommend appropriate sleep duration based on activity level
    
    Keep responses concise (under 150 words), friendly, and motivational. Include specific, actionable advice when possible. Adapt your tone and expertise based on which role is most relevant to the user's query.
    `
  }]
};

// Create a context for the chatbot
const ChatbotContext = createContext();

export const useChatbot = () => useContext(ChatbotContext);

export const ChatbotProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi there! I\'m your AI health assistant powered by Gemini. How can I help you today?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [model, setModel] = useState(null);
  const [videoSuggestions, setVideoSuggestions] = useState([]);
  const navigate = useNavigate();

  // Initialize the Gemini model when component mounts
  useEffect(() => {
    const initModel = async () => {
      try {
        const geminiModel = genAI.getGenerativeModel({ model: 'gemini-pro' });
        setModel(geminiModel);
      } catch (error) {
        console.error('Error initializing Gemini model:', error);
      }
    };
    
    initModel();
  }, []);

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  const addMessage = (role, content) => {
    setMessages([...messages, { role, content }]);
  };

  const handleUserMessage = async (message) => {
    addMessage('user', message);
    setIsLoading(true);
    
    // Process with Gemini AI if available, otherwise fall back to rule-based responses
    if (model) {
      try {
        // Create a chat session with system prompt
        const chat = model.startChat({
          history: [
            systemPrompt
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
        });

        // Generate response with context awareness
        const result = await chat.sendMessage(message);
        const text = result.response.text();
        
        // Process the response and determine if navigation is needed
        processAIResponse(text, message);
        return;
      } catch (error) {
        console.error('Error generating response with Gemini:', error);
        // Fall back to rule-based responses if Gemini fails
      }
    }
    
    // Fallback to rule-based responses if Gemini is not available
    setTimeout(() => {
      let response = 'I\'m processing your request...';
      const msgLower = message.toLowerCase();
      
      // Function to check if message contains any of the keywords
      const containsAny = (keywords) => keywords.some(keyword => msgLower.includes(keyword));
      
      // Function to find the closest match for misspelled words
      const findClosestMatch = (word, dictionary) => {
        if (word.length < 3) return null; // Skip very short words
        
        let closestMatch = null;
        let minDistance = Infinity;
        
        for (const dictWord of dictionary) {
          // Simple Levenshtein distance calculation
          const distance = levenshteinDistance(word, dictWord);
          if (distance < minDistance && distance <= Math.floor(dictWord.length / 3)) { // Allow errors up to 1/3 of word length
            minDistance = distance;
            closestMatch = dictWord;
          }
        }
        
        return closestMatch;
      };
      
      // Simple Levenshtein distance implementation
      const levenshteinDistance = (a, b) => {
        if (a.length === 0) return b.length;
        if (b.length === 0) return a.length;
        
        const matrix = [];
        
        // Initialize matrix
        for (let i = 0; i <= b.length; i++) {
          matrix[i] = [i];
        }
        
        for (let j = 0; j <= a.length; j++) {
          matrix[0][j] = j;
        }
        
        // Fill matrix
        for (let i = 1; i <= b.length; i++) {
          for (let j = 1; j <= a.length; j++) {
            const cost = a[j - 1] === b[i - 1] ? 0 : 1;
            matrix[i][j] = Math.min(
              matrix[i - 1][j] + 1,      // deletion
              matrix[i][j - 1] + 1,      // insertion
              matrix[i - 1][j - 1] + cost // substitution
            );
          }
        }
        
        return matrix[b.length][a.length];
      };
      
      // Extract words from message
      const words = msgLower.split(/\s+/);
      
      // Dictionaries for common fitness terms
      const workoutTerms = ['workout', 'exercise', 'training', 'fitness', 'gym', 'routine', 'lift', 'cardio', 'strength'];
      const bodyPartTerms = {
        legs: ['leg', 'legs', 'thigh', 'thighs', 'calf', 'calves', 'quad', 'quads', 'hamstring'],
        arms: ['arm', 'arms', 'bicep', 'biceps', 'tricep', 'triceps', 'forearm'],
        chest: ['chest', 'pec', 'pecs', 'pectoral', 'bench'],
        back: ['back', 'spine', 'lat', 'lats', 'trapezius', 'traps'],
        core: ['core', 'abs', 'abdominal', 'stomach', 'sixpack', 'plank']
      };
      const nutritionTerms = ['meal', 'diet', 'food', 'nutrition', 'eat', 'eating', 'calorie', 'protein', 'carb', 'fat'];
      const meditationTerms = ['meditation', 'yoga', 'stress', 'relax', 'mindfulness', 'breathing', 'calm'];
      
      // Check for misspelled words and correct them
      let detectedWorkout = false;
      let detectedBodyPart = null;
      let detectedNutrition = false;
      let detectedMeditation = false;
      
      for (const word of words) {
        // Check for workout terms
        if (!detectedWorkout) {
          const match = findClosestMatch(word, workoutTerms);
          if (match) detectedWorkout = true;
        }
        
        // Check for body parts
        if (!detectedBodyPart) {
          for (const [part, terms] of Object.entries(bodyPartTerms)) {
            const match = findClosestMatch(word, terms);
            if (match) {
              detectedBodyPart = part;
              break;
            }
          }
        }
        
        // Check for nutrition terms
        if (!detectedNutrition) {
          const match = findClosestMatch(word, nutritionTerms);
          if (match) detectedNutrition = true;
        }
        
        // Check for meditation terms
        if (!detectedMeditation) {
          const match = findClosestMatch(word, meditationTerms);
          if (match) detectedMeditation = true;
        }
      }
      
      // Direct keyword matching (for higher confidence)
      if (!detectedWorkout) {
        detectedWorkout = containsAny(workoutTerms);
      }
      
      if (!detectedBodyPart && detectedWorkout) {
        for (const [part, terms] of Object.entries(bodyPartTerms)) {
          if (containsAny(terms)) {
            detectedBodyPart = part;
            break;
          }
        }
      }
      
      if (!detectedNutrition) {
        detectedNutrition = containsAny(nutritionTerms);
      }
      
      if (!detectedMeditation) {
        detectedMeditation = containsAny(meditationTerms);
      }
      
      // Detect which specialized role is needed based on the query
      const isPersonalTrainerQuery = detectedWorkout || msgLower.includes('exercise') || msgLower.includes('workout') || msgLower.includes('training') || msgLower.includes('routine');
      const isNutritionistQuery = detectedNutrition || msgLower.includes('diet') || msgLower.includes('food') || msgLower.includes('meal') || msgLower.includes('eat');
      const isMotivatorQuery = msgLower.includes('motivation') || msgLower.includes('goal') || msgLower.includes('challenge') || msgLower.includes('stuck') || msgLower.includes('progress');
      const isSleepCoachQuery = msgLower.includes('sleep') || msgLower.includes('rest') || msgLower.includes('tired') || msgLower.includes('insomnia') || msgLower.includes('nap');
      
      // Enhanced keyword-based responses with specialized roles
      if (isPersonalTrainerQuery) {
        // Personal Trainer responses
        if (detectedBodyPart === 'legs') {
          response = '[Personal Trainer] I have some great leg workouts for you! For optimal leg development, focus on compound movements like squats, lunges, and deadlifts. Aim for 3-4 sets of 8-12 reps with proper form. Let me show you our leg exercise collection with video demonstrations.';
          setVideoSuggestions([
            { title: 'Complete Leg Workout', url: 'https://www.youtube.com/watch?v=RjexvOAsVtI' },
            { title: 'Bodyweight Leg Exercises', url: 'https://www.youtube.com/watch?v=xqVBoyKXbsA' }
          ]);
          setTimeout(() => navigate('/exercise-library/legs'), 2000);
        } else if (detectedBodyPart === 'arms') {
          response = '[Personal Trainer] Looking to build stronger arms? For balanced arm development, include exercises for both biceps (curls, chin-ups) and triceps (dips, extensions). Aim for 3 sets of 10-15 reps, focusing on controlled movements and full range of motion. Here are some excellent arm exercises with video demonstrations!';
          setVideoSuggestions([
            { title: 'Complete Arms Workout', url: 'https://www.youtube.com/watch?v=dhGnHk_d6vc' },
            { title: 'Biceps & Triceps Exercises', url: 'https://www.youtube.com/watch?v=SuajkDYlIRw' }
          ]);
          setTimeout(() => navigate('/exercise-library/arms'), 2000);
        } else if (detectedBodyPart === 'chest') {
          response = '[Personal Trainer] Want to develop your chest muscles? Include a mix of flat, incline, and decline movements to target all parts of the pectoral muscles. Focus on proper form with shoulder blades retracted and controlled movements. Here are some effective chest exercises with video tutorials!';
          setVideoSuggestions([
            { title: 'Complete Chest Workout', url: 'https://www.youtube.com/watch?v=89e518dl4I8' },
            { title: 'Home Chest Exercises', url: 'https://www.youtube.com/watch?v=BkS1-El_WlE' }
          ]);
          setTimeout(() => navigate('/exercise-library/chest'), 2000);
        } else if (detectedBodyPart === 'back') {
          response = '[Personal Trainer] A strong back is essential for good posture and overall strength. Include both vertical pulls (pull-ups, lat pulldowns) and horizontal pulls (rows) in your routine. Focus on engaging your lats and maintaining a neutral spine. Here are some effective back exercises with video demonstrations!';
          setVideoSuggestions([
            { title: 'Complete Back Workout', url: 'https://www.youtube.com/watch?v=eE7dzM0iexc' },
            { title: 'Home Back Exercises', url: 'https://www.youtube.com/watch?v=arTEns9KE00' }
          ]);
          setTimeout(() => navigate('/exercise-library/back'), 2000);
        } else if (detectedBodyPart === 'core') {
          response = '[Personal Trainer] Core strength is crucial for overall fitness and injury prevention. Focus on exercises that target all core muscles: rectus abdominis, obliques, and transverse abdominis. Include both dynamic movements and static holds like planks. Here are some effective core exercises with video tutorials!';
          setVideoSuggestions([
            { title: 'Complete Ab Workout', url: 'https://www.youtube.com/watch?v=3p8EBPVZ2Iw' },
            { title: 'Home Core Exercises', url: 'https://www.youtube.com/watch?v=yOl8BgLAXJ8' }
          ]);
          setTimeout(() => navigate('/exercise-library/core'), 2000);
        } else if (msgLower.includes('generate') || msgLower.includes('plan') || msgLower.includes('routine') || msgLower.includes('schedule')) {
          response = '[Personal Trainer] I can create a personalized workout plan based on your goals, fitness level, and available equipment. For optimal results, I recommend 3-5 training sessions per week with a mix of strength training, cardio, and flexibility work. Let me take you to our workout generator!';
          setTimeout(() => navigate('/workout-generator'), 2000);
        } else if (msgLower.includes('form') || msgLower.includes('technique')) {
          response = '[Personal Trainer] Proper form is crucial for effective workouts and injury prevention. Key principles include: maintain neutral spine alignment, control the movement throughout the full range of motion, breathe properly (exhale during exertion), and start with lighter weights to master technique before increasing intensity.';
        } else if (msgLower.includes('beginner') || msgLower.includes('start')) {
          response = '[Personal Trainer] For beginners, I recommend starting with 2-3 full-body workouts per week, focusing on compound movements (squats, push-ups, rows) with proper form. Begin with bodyweight or light resistance, and gradually increase as you build strength and confidence. Rest 1-2 days between sessions to allow for recovery.';
        } else {
          response = '[Personal Trainer] I recommend checking out our exercise library for workout ideas! For a balanced routine, include exercises for all major muscle groups, with appropriate intensity for your fitness level. What body part would you like to focus on?';
          setTimeout(() => navigate('/exercise-library'), 2000);
        }
      } else if (isNutritionistQuery) {
        // Nutritionist responses
        if (msgLower.includes('plan') || msgLower.includes('schedule')) {
          response = '[Nutritionist] I can help create a balanced meal plan tailored to your goals. A good approach includes: 1) Determine your daily calorie needs based on activity level and goals, 2) Balance macronutrients (40-50% carbs, 25-35% protein, 20-30% fats), 3) Include a variety of whole foods, and 4) Plan regular meals and snacks. Let me take you to our meal planner!';
          setTimeout(() => navigate('/meal-planner'), 2000);
        } else if (msgLower.includes('protein') || msgLower.includes('muscle')) {
          response = '[Nutritionist] Protein is essential for muscle growth and recovery. Aim for 1.6-2.2g per kg of bodyweight daily if you\'re strength training. Quality sources include lean meats, eggs, dairy, legumes, and plant-based options like tofu and tempeh. For optimal muscle synthesis, distribute protein intake throughout the day (20-40g per meal).';
          setTimeout(() => navigate('/meal-planner'), 2000);
        } else if (msgLower.includes('carb') || msgLower.includes('energy')) {
          response = '[Nutritionist] Carbohydrates are your body\'s primary energy source, especially for high-intensity exercise. Focus on complex carbs like whole grains, fruits, vegetables, and legumes for sustained energy and fiber. Time larger carb portions around workouts: 1-3 hours before for energy and within 30-60 minutes after for recovery.';
          setTimeout(() => navigate('/meal-planner'), 2000);
        } else if (msgLower.includes('fat') || msgLower.includes('healthy fat')) {
          response = '[Nutritionist] Healthy fats are essential for hormone production and nutrient absorption. Include sources like avocados, nuts, seeds, olive oil, and fatty fish. Aim for 20-30% of daily calories from mostly unsaturated fats, while limiting saturated and avoiding trans fats. Don\'t fear dietary fat—it\'s crucial for overall health!';
          setTimeout(() => navigate('/meal-planner'), 2000);
        } else if (msgLower.includes('recipe') || msgLower.includes('cook')) {
          response = '[Nutritionist] Healthy cooking doesn\'t have to be complicated! Try meal prepping basics like sheet pan dinners with lean protein + vegetables, grain bowls with a variety of colors and textures, or overnight oats with fruit and nuts. Use herbs and spices instead of excess salt for flavor, and cooking methods like grilling, steaming, or air frying.';
          setTimeout(() => navigate('/meal-planner'), 2000);
        } else {
          response = '[Nutritionist] Proper nutrition is key to achieving your fitness goals. Focus on whole foods, adequate protein, balanced macronutrients, proper hydration, and consistency. Our meal planner can help you create a personalized nutrition strategy aligned with your specific goals!';
          setTimeout(() => navigate('/meal-planner'), 2000);
        }
      } else if (isSleepCoachQuery) {
        // Sleep Coach responses
        if (msgLower.includes('insomnia') || msgLower.includes('can\'t sleep')) {
          response = '[Sleep Coach] For better sleep quality, establish a consistent sleep schedule (even on weekends), create a relaxing bedtime routine, limit screen time 1-2 hours before bed, keep your bedroom cool (65-68°F/18-20°C), dark, and quiet, and avoid caffeine after midday and alcohol close to bedtime.';
        } else if (msgLower.includes('nap') || msgLower.includes('daytime')) {
          response = '[Sleep Coach] Strategic napping can boost performance and alertness. Aim for 10-20 minutes for a quick refresh without grogginess, or 90 minutes for a complete sleep cycle. Schedule naps before 3pm to avoid disrupting nighttime sleep. A pre-nap coffee can help you wake up alert (caffeine takes ~20 minutes to kick in).';
        } else if (msgLower.includes('recovery') || msgLower.includes('muscle')) {
          response = '[Sleep Coach] Quality sleep is crucial for muscle recovery and growth. During deep sleep, your body releases growth hormone and repairs muscle tissue damaged during exercise. Aim for 7-9 hours of quality sleep, especially after intense training days. Consider sleep as important as your workouts for achieving fitness goals!';
        } else if (msgLower.includes('track') || msgLower.includes('monitor')) {
          response = '[Sleep Coach] Tracking your sleep can provide valuable insights. Focus on both quantity (7-9 hours for most adults) and quality (minimal disruptions, feeling rested upon waking). Our app can help you log sleep patterns and identify areas for improvement. Consider factors like caffeine intake, evening activities, and stress levels.';
        } else {
          response = '[Sleep Coach] Getting enough quality sleep is crucial for recovery, performance, and overall health. I recommend 7-9 hours per night for optimal fitness results. Quality sleep improves muscle repair, hormone regulation, cognitive function, and even helps with appetite control and weight management.';
        }
      } else if (isMotivatorQuery) {
        // Motivator responses
        if (msgLower.includes('stuck') || msgLower.includes('plateau')) {
          response = '[Motivator] Hitting a plateau is normal and actually a sign you\'ve made progress! To break through: 1) Change your routine every 4-6 weeks, 2) Gradually increase intensity or volume, 3) Try new exercise modalities, 4) Reassess your nutrition, and 5) Ensure adequate recovery. Remember, persistence through plateaus leads to the greatest gains!';
          setTimeout(() => navigate('/challenges'), 2000);
        } else if (msgLower.includes('goal') || msgLower.includes('target')) {
          response = '[Motivator] Setting SMART goals is key to success: Specific (exactly what you want to achieve), Measurable (trackable metrics), Achievable (challenging but possible), Relevant (meaningful to you), and Time-bound (with a deadline). Break larger goals into smaller milestones to maintain motivation and celebrate progress along the way!';
          setTimeout(() => navigate('/challenges'), 2000);
        } else if (msgLower.includes('habit') || msgLower.includes('consistent')) {
          response = '[Motivator] Building lasting fitness habits takes time! Start small with manageable changes, link new habits to existing routines (workout after brushing teeth), remove friction (prepare gym clothes the night before), use visual cues and reminders, and track your consistency. Remember, it\'s better to do something small consistently than something ambitious sporadically!';
        } else if (msgLower.includes('track') || msgLower.includes('progress')) {
          response = '[Motivator] Tracking your progress is crucial for staying motivated! Monitor various metrics beyond just weight: measurements, fitness tests, workout performance, energy levels, sleep quality, and progress photos. Our reporting tools can help you visualize improvements and identify patterns. Remember to celebrate all wins, no matter how small!';
          setTimeout(() => navigate('/reports'), 2000);
        } else {
          response = '[Motivator] Remember that consistency beats perfection every time! Focus on progress, not perfection. Every workout, healthy meal, and good night\'s sleep is a victory. On tough days, showing up is success. Your fitness journey is a marathon, not a sprint—embrace the process and celebrate each step forward!';
          setTimeout(() => navigate('/challenges'), 2000);
        }
      } else if (msgLower.includes('water') || msgLower.includes('hydration') || msgLower.includes('drink')) {
        response = '[Nutritionist] Staying hydrated is essential for optimal performance! Aim for at least 8 glasses (2-3 liters) of water daily, and more during intense workouts or hot weather. Proper hydration improves energy levels, recovery, nutrient transport, and even cognitive function. Try adding a water tracking feature to your daily routine!';
      } else if (detectedMeditation) {
        response = '[Sleep Coach] Meditation and yoga are powerful tools for mental wellbeing and recovery. Regular practice can reduce stress hormones, improve sleep quality, enhance focus, and increase flexibility. Even 5-10 minutes daily can provide benefits. Let me show you our guided sessions to get started.';
        setTimeout(() => navigate('/meditation-yoga'), 2000);
      } else if (msgLower.includes('hello') || msgLower.includes('hi') || msgLower.includes('hey')) {
        response = 'Hello! I\'m your AI health assistant with expertise as a personal trainer, nutritionist, motivator, and sleep coach. How can I help with your fitness journey today?';
      } else if (msgLower.includes('thank')) {
        response = 'You\'re welcome! I\'m here to support your health and fitness goals with specialized guidance. Is there anything else I can help with as your personal trainer, nutritionist, motivator, or sleep coach?';
      } else {
        response = 'I\'m your comprehensive health assistant with expertise as a personal trainer, nutritionist, motivator, and sleep coach. Ask me about customized workouts, nutrition plans, motivation strategies, sleep optimization, or anything else related to your wellness journey!';
      }
      
      addMessage('assistant', response);
      setIsLoading(false);
    }, 1500);
  };

  // Process AI response and determine if navigation is needed
  const processAIResponse = (text, userMessage) => {
    const msgLower = userMessage.toLowerCase();
    let shouldNavigate = false;
    let navigationPath = '';
    let videoLinks = [];
    
    // Define keyword categories for better matching
    const bodyParts = ['arms', 'legs', 'chest', 'back', 'shoulders', 'abs', 'core', 'full body'];
    const workoutKeywords = ['workout', 'exercise', 'training', 'routine', 'fitness', 'strength', 'cardio'];
    const nutritionKeywords = ['diet', 'nutrition', 'meal', 'food', 'eating', 'protein', 'carbs', 'fat'];
    const yogaKeywords = ['yoga', 'stretch', 'flexibility', 'meditation', 'mindfulness'];
    
    const hasWorkoutKeyword = workoutKeywords.some(keyword => msgLower.includes(keyword));
    const hasNutritionKeyword = nutritionKeywords.some(keyword => msgLower.includes(keyword));
    const hasYogaKeyword = yogaKeywords.some(keyword => msgLower.includes(keyword));
    
    // Check for workout related queries
    if (hasWorkoutKeyword) {
      // Check for body parts
      if (msgLower.includes('leg') || msgLower.includes('thigh') || msgLower.includes('calf')) {
        navigationPath = '/exercise-library/legs';
        videoLinks = [
          { title: 'Complete Leg Workout', url: 'https://www.youtube.com/watch?v=RjexvOAsVtI' },
          { title: 'Bodyweight Leg Exercises', url: 'https://www.youtube.com/watch?v=xqVBoyKXbsA' }
        ];
        shouldNavigate = true;
      } else if (msgLower.includes('arm') || msgLower.includes('bicep') || msgLower.includes('tricep')) {
        navigationPath = '/exercise-library/arms';
        videoLinks = [
          { title: 'Complete Arms Workout', url: 'https://www.youtube.com/watch?v=dhGnHk_d6vc' },
          { title: 'Biceps & Triceps Exercises', url: 'https://www.youtube.com/watch?v=SuajkDYlIRw' }
        ];
        shouldNavigate = true;
      } else if (msgLower.includes('chest') || msgLower.includes('pec')) {
        navigationPath = '/exercise-library/chest';
        videoLinks = [
          { title: 'Complete Chest Workout', url: 'https://www.youtube.com/watch?v=89e518dl4I8' },
          { title: 'Home Chest Exercises', url: 'https://www.youtube.com/watch?v=BkS1-El_WlE' }
        ];
        shouldNavigate = true;
      } else if (msgLower.includes('back') || msgLower.includes('lat')) {
        navigationPath = '/exercise-library/back';
        videoLinks = [
          { title: 'Complete Back Workout', url: 'https://www.youtube.com/watch?v=eE7dzM0iexc' },
          { title: 'Home Back Exercises', url: 'https://www.youtube.com/watch?v=arTEns9KE00' }
        ];
        shouldNavigate = true;
      } else if (msgLower.includes('core') || msgLower.includes('ab') || msgLower.includes('stomach')) {
        navigationPath = '/exercise-library/core';
        videoLinks = [
          { title: 'Complete Ab Workout', url: 'https://www.youtube.com/watch?v=3p8EBPVZ2Iw' },
          { title: 'Home Core Exercises', url: 'https://www.youtube.com/watch?v=yOl8BgLAXJ8' }
        ];
        shouldNavigate = true;
      } else if (msgLower.includes('generate') || msgLower.includes('plan') || msgLower.includes('routine')) {
        navigationPath = '/workout-generator';
        shouldNavigate = true;
      } else {
        navigationPath = '/exercise-library';
        videoLinks = [
          { title: 'Beginner Workout Routine', url: 'https://www.youtube.com/results?search_query=beginner+workout+routine' },
          { title: 'HIIT Workout', url: 'https://www.youtube.com/results?search_query=hiit+workout+routine' }
        ];
        shouldNavigate = true;
      }
    } else if (hasNutritionKeyword) {
      navigationPath = '/meal-planner';
      videoLinks = [
        { title: 'Healthy Meal Prep Ideas', url: 'https://www.youtube.com/results?search_query=healthy+meal+prep+ideas' },
        { title: 'Nutrition Tips for Fitness', url: 'https://www.youtube.com/results?search_query=nutrition+tips+for+fitness' }
      ];
      shouldNavigate = true;
    } else if (hasYogaKeyword) {
      navigationPath = '/meditation-yoga';
      videoLinks = [
        { title: 'Beginner Yoga Routine', url: 'https://www.youtube.com/results?search_query=beginner+yoga+routine' },
        { title: 'Meditation for Beginners', url: 'https://www.youtube.com/results?search_query=meditation+for+beginners' }
      ];
      shouldNavigate = true;
    } else if (msgLower.includes('challenge') || msgLower.includes('goal')) {
      navigationPath = '/challenges';
      shouldNavigate = true;
    } else if (msgLower.includes('progress') || msgLower.includes('track') || msgLower.includes('report')) {
      navigationPath = '/reports';
      shouldNavigate = true;
    }
    
    // Set video suggestions if available
    if (videoLinks.length > 0) {
      setVideoSuggestions(videoLinks);
    }
    
    // Add AI response to chat
    addMessage('assistant', text);
    
    // Navigate if needed
    if (shouldNavigate) {
      setTimeout(() => navigate(navigationPath), 2000);
    }
    
    setIsLoading(false);
  };

  return (
    <ChatbotContext.Provider value={{ 
      isOpen, 
      toggleChatbot, 
      messages, 
      addMessage, 
      handleUserMessage,
      isLoading,
      videoSuggestions
    }}>
      {children}
    </ChatbotContext.Provider>
  );
};