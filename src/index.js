import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { ThemeProvider } from './context/ThemeContext';
import { UserDataProvider } from './context/UserDataContext';
import { ChatbotProvider } from './context/ChatbotContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <UserDataProvider>
          <ChatbotProvider>
            <App />
          </ChatbotProvider>
        </UserDataProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);