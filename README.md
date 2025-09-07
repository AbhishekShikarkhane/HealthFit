# FitLife - Fitness Tracking Application

## Overview
FitLife is a comprehensive fitness tracking application that helps users monitor their workouts, nutrition, and overall wellness. The application includes features like workout tracking, meal planning, meditation guides, and an AI-powered chatbot assistant.

## Features
- **User Profile Management**: Track personal fitness metrics and goals
- **Workout Tracking**: Log and monitor exercise routines
- **Meal Planning**: Plan and track nutritional intake
- **AI Chatbot Assistant**: Get personalized fitness advice and navigate the app through natural language
- **Video Demonstrations**: Access workout demonstration videos for proper form and technique
- **Progress Reports**: Visualize fitness progress over time

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation
1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the root directory and add your Gemini AI API key:
   ```
   REACT_APP_GEMINI_API_KEY=your_gemini_api_key_here
   ```
4. Start the development server:
   ```
   npm start
   ```

### Getting a Gemini AI API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the API key and paste it in your `.env` file

## Usage
- Use the navigation menu to access different features
- Interact with the chatbot for assistance and quick navigation
- Update your profile to get personalized recommendations
- Track your workouts and nutrition to monitor progress

## Technologies Used
- React.js
- Framer Motion for animations
- Google's Generative AI (Gemini) for the chatbot
- IndexedDB for local data storage
- Tailwind CSS for styling