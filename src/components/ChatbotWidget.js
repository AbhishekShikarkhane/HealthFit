import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChatbot } from '../context/ChatbotContext';
import { useTheme } from '../context/ThemeContext';
import { ChatBubbleLeftRightIcon, XMarkIcon, PaperAirplaneIcon, MicrophoneIcon, StopIcon, VideoCameraIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';

const ChatbotWidget = () => {
  const { isOpen, toggleChatbot, messages, handleUserMessage, isLoading, videoSuggestions } = useChatbot();
  const { theme, colorScheme } = useTheme();
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const messagesEndRef = useRef(null);
  const [isBouncing, setIsBouncing] = useState(false);
  const [typingIndicator, setTypingIndicator] = useState(false);
  const [showVideos, setShowVideos] = useState(false);
  
  // Get color scheme variables
  const getColorClass = () => {
    const colors = {
      indigo: 'from-indigo-600 to-indigo-400',
      teal: 'from-teal-500 to-teal-300',
      rose: 'from-rose-500 to-rose-300',
      amber: 'from-amber-500 to-amber-300',
      blue: 'from-blue-500 to-blue-300'
    };
    return colors[colorScheme] || colors.indigo;
  };
  
  const getTextColorClass = () => {
    const colors = {
      indigo: 'text-indigo-600',
      teal: 'text-teal-500',
      rose: 'text-rose-500',
      amber: 'text-amber-500',
      blue: 'text-blue-500'
    };
    return colors[colorScheme] || colors.indigo;
  };
  
  const getBgColorClass = () => {
    const colors = {
      indigo: 'bg-indigo-600',
      teal: 'bg-teal-500',
      rose: 'bg-rose-500',
      amber: 'bg-amber-500',
      blue: 'bg-blue-500'
    };
    return colors[colorScheme] || colors.indigo;
  };

  // Initialize speech recognition
  useEffect(() => {
    if (window.SpeechRecognition || window.webkitSpeechRecognition) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      
      recognitionInstance.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
        
        setInput(transcript);
      };
      
      recognitionInstance.onend = () => {
        setIsListening(false);
      };
      
      setRecognition(recognitionInstance);
    }
    
    // Start bounce animation for the chat button
    const bounceInterval = setInterval(() => {
      setIsBouncing(true);
      setTimeout(() => setIsBouncing(false), 1000);
    }, 10000);
    
    return () => clearInterval(bounceInterval);
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      setTypingIndicator(true);
      handleUserMessage(input);
      setInput('');
      if (isListening) {
        recognition.stop();
        setIsListening(false);
      }
      
      // Hide typing indicator after response is received
      setTimeout(() => {
        setTypingIndicator(false);
      }, 1500);
    }
  };

  // Scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  // Reset video suggestions when chat is closed
  useEffect(() => {
    if (!isOpen) {
      setShowVideos(false);
    }
  }, [isOpen]);

  // Toggle video suggestions panel
  const toggleVideoSuggestions = () => {
    setShowVideos(!showVideos);
  };
  
  // Open video in new tab
  const openVideo = (url) => {
    window.open(url, '_blank');
  };

  return (
    <>
      {/* Floating button with bounce animation */}
      <motion.button
        className={`fixed bottom-6 right-6 p-4 rounded-full ${getBgColorClass()} text-white shadow-lg z-50`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={isBouncing ? { y: [-5, 0, -5] } : {}}
        transition={isBouncing ? { duration: 1, repeat: 0 } : {}}
        onClick={toggleChatbot}
      >
        <ChatBubbleLeftRightIcon className="h-6 w-6" />
      </motion.button>

      {/* Chatbot window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={`fixed bottom-20 right-6 w-80 sm:w-96 h-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden z-50 flex flex-col border-2 ${theme === 'dark' ? 'border-gray-700' : `border-${colorScheme}-200`}`}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            whileHover={{ boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
          >
            {/* Header */}
            <motion.div 
              className={`bg-gradient-to-r ${getColorClass()} text-white p-4 flex justify-between items-center`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <motion.h3 
                className="font-medium flex items-center"
                initial={{ x: -20 }}
                animate={{ x: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2" />
                AI Health Assistant
              </motion.h3>
              <div className="flex items-center space-x-2">
                {videoSuggestions.length > 0 && (
                  <motion.button 
                    onClick={toggleVideoSuggestions}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="relative"
                    title="Video suggestions"
                  >
                    <VideoCameraIcon className="h-5 w-5" />
                    <span className="absolute -top-1 -right-1 bg-red-500 rounded-full w-2 h-2"></span>
                  </motion.button>
                )}
                <motion.button 
                  onClick={toggleChatbot}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <XMarkIcon className="h-5 w-5" />
                </motion.button>
              </div>
            </motion.div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div
                    className={`max-w-3/4 p-3 rounded-lg ${msg.role === 'user' ? `${getBgColorClass()} text-white` : 'bg-gray-200 dark:bg-gray-700 dark:text-white'}`}
                  >
                    {msg.content}
                  </div>
                </motion.div>
              ))}
              {(isLoading || typingIndicator) && (
                <motion.div 
                  className="flex justify-start"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <div className="bg-gray-200 dark:bg-gray-700 p-3 rounded-lg flex space-x-2">
                    <div className={`w-2 h-2 rounded-full ${getTextColorClass()} animate-bounce`} style={{ animationDelay: '0ms' }}></div>
                    <div className={`w-2 h-2 rounded-full ${getTextColorClass()} animate-bounce`} style={{ animationDelay: '150ms' }}></div>
                    <div className={`w-2 h-2 rounded-full ${getTextColorClass()} animate-bounce`} style={{ animationDelay: '300ms' }}></div>
                  </div>
                </motion.div>
              )}
              
              {/* Video suggestions panel */}
              {showVideos && videoSuggestions.length > 0 && (
                <motion.div 
                  className={`mt-3 p-3 rounded-lg border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <h4 className={`text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                    Video Demonstrations
                  </h4>
                  <div className="space-y-2">
                    {videoSuggestions.map((video, idx) => (
                      <div 
                        key={idx} 
                        className={`p-2 rounded flex items-center justify-between cursor-pointer hover:${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} transition-colors`}
                        onClick={() => openVideo(video.url)}
                      >
                        <div className="flex items-center">
                          <VideoCameraIcon className={`h-4 w-4 mr-2 ${getTextColorClass()}`} />
                          <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{video.title}</span>
                        </div>
                        <ArrowTopRightOnSquareIcon className="h-4 w-4 text-gray-400" />
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <motion.form 
              onSubmit={handleSubmit} 
              className="p-4 border-t dark:border-gray-700 flex space-x-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <motion.input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
                className={`flex-1 p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-${colorScheme}-500 focus:border-transparent transition-all duration-300`}
                whileFocus={{ scale: 1.01 }}
              />
              <motion.button
                type="button"
                onClick={recognition ? toggleListening : undefined}
                className={`p-2 rounded-lg transition-colors ${isListening 
                  ? 'bg-red-500 text-white ring-2 ring-red-300' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                disabled={!recognition}
                title={isListening ? "Stop listening" : "Start voice input"}
              >
                {isListening ? (
                  <motion.div
                    initial={{ scale: 1 }}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    <StopIcon className="h-5 w-5" />
                  </motion.div>
                ) : (
                  <MicrophoneIcon className="h-5 w-5" />
                )}
              </motion.button>
              <motion.button
                type="submit"
                className={`p-2 ${getBgColorClass()} text-white rounded-lg hover:opacity-90 transition-colors duration-300 ${!input.trim() && 'opacity-70'}`}
                whileHover={{ scale: input.trim() ? 1.1 : 1 }}
                whileTap={{ scale: input.trim() ? 0.9 : 1 }}
                disabled={!input.trim() || isLoading}
                title="Send message"
              >
                <PaperAirplaneIcon className="h-5 w-5" />
              </motion.button>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatbotWidget;