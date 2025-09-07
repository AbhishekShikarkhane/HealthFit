import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useUserData } from '../context/UserDataContext';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import { FaDownload, FaShareAlt, FaFilePdf, FaFileExcel } from 'react-icons/fa';

const Reports = () => {
  const { userData } = useUserData();
  const [activeTab, setActiveTab] = useState('workouts');
  const [timeRange, setTimeRange] = useState('week');
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState(null);
  const reportRef = useRef(null);

  // Sample data for reports
  const workoutData = [
    { name: 'Mon', minutes: 45, calories: 320 },
    { name: 'Tue', minutes: 30, calories: 250 },
    { name: 'Wed', minutes: 60, calories: 450 },
    { name: 'Thu', minutes: 0, calories: 0 },
    { name: 'Fri', minutes: 45, calories: 350 },
    { name: 'Sat', minutes: 90, calories: 650 },
    { name: 'Sun', minutes: 30, calories: 220 },
  ];

  const nutritionData = [
    { name: 'Mon', calories: 2100, protein: 120, carbs: 210, fat: 70 },
    { name: 'Tue', calories: 1950, protein: 115, carbs: 180, fat: 65 },
    { name: 'Wed', calories: 2200, protein: 130, carbs: 220, fat: 75 },
    { name: 'Thu', calories: 2050, protein: 125, carbs: 200, fat: 68 },
    { name: 'Fri', calories: 2300, protein: 140, carbs: 230, fat: 80 },
    { name: 'Sat', calories: 2500, protein: 150, carbs: 250, fat: 85 },
    { name: 'Sun', calories: 2150, protein: 130, carbs: 210, fat: 72 },
  ];

  const sleepData = [
    { name: 'Mon', hours: 7.5, quality: 85 },
    { name: 'Tue', hours: 6.8, quality: 75 },
    { name: 'Wed', hours: 8.2, quality: 90 },
    { name: 'Thu', hours: 7.0, quality: 80 },
    { name: 'Fri', hours: 6.5, quality: 70 },
    { name: 'Sat', hours: 8.5, quality: 95 },
    { name: 'Sun', hours: 7.8, quality: 85 },
  ];

  const weightData = [
    { name: 'Week 1', weight: 185 },
    { name: 'Week 2', weight: 183 },
    { name: 'Week 3', weight: 181 },
    { name: 'Week 4', weight: 180 },
    { name: 'Week 5', weight: 178 },
    { name: 'Week 6', weight: 177 },
    { name: 'Week 7', weight: 176 },
    { name: 'Week 8', weight: 175 },
  ];

  const workoutTypeData = [
    { name: 'Strength', value: 35 },
    { name: 'Cardio', value: 25 },
    { name: 'HIIT', value: 20 },
    { name: 'Yoga', value: 15 },
    { name: 'Other', value: 5 },
  ];

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE'];

  // Calculate weekly totals
  const calculateWorkoutTotals = () => {
    const totalMinutes = workoutData.reduce((sum, day) => sum + day.minutes, 0);
    const totalCalories = workoutData.reduce((sum, day) => sum + day.calories, 0);
    const workoutDays = workoutData.filter(day => day.minutes > 0).length;
    
    return {
      totalMinutes,
      totalCalories,
      workoutDays,
      avgMinutesPerWorkout: workoutDays > 0 ? Math.round(totalMinutes / workoutDays) : 0
    };
  };

  const calculateNutritionTotals = () => {
    const avgCalories = Math.round(nutritionData.reduce((sum, day) => sum + day.calories, 0) / nutritionData.length);
    const avgProtein = Math.round(nutritionData.reduce((sum, day) => sum + day.protein, 0) / nutritionData.length);
    const avgCarbs = Math.round(nutritionData.reduce((sum, day) => sum + day.carbs, 0) / nutritionData.length);
    const avgFat = Math.round(nutritionData.reduce((sum, day) => sum + day.fat, 0) / nutritionData.length);
    
    return {
      avgCalories,
      avgProtein,
      avgCarbs,
      avgFat
    };
  };

  const calculateSleepTotals = () => {
    const avgHours = (sleepData.reduce((sum, day) => sum + day.hours, 0) / sleepData.length).toFixed(1);
    const avgQuality = Math.round(sleepData.reduce((sum, day) => sum + day.quality, 0) / sleepData.length);
    
    return {
      avgHours,
      avgQuality
    };
  };

  const workoutTotals = calculateWorkoutTotals();
  const nutritionTotals = calculateNutritionTotals();
  const sleepTotals = calculateSleepTotals();

  // Export functions
  const exportToPDF = async () => {
    setIsExporting(true);
    setExportFormat('pdf');
    
    try {
      const element = reportRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`health_fitness_report_${activeTab}_${timeRange}.pdf`);
      
      setTimeout(() => {
        setIsExporting(false);
        setExportFormat(null);
      }, 1000);
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      setIsExporting(false);
      setExportFormat(null);
    }
  };

  const exportToExcel = () => {
    setIsExporting(true);
    setExportFormat('excel');
    
    try {
      let dataToExport;
      let fileName;
      
      switch (activeTab) {
        case 'workouts':
          dataToExport = workoutData;
          fileName = 'workout_report';
          break;
        case 'nutrition':
          dataToExport = nutritionData;
          fileName = 'nutrition_report';
          break;
        case 'sleep':
          dataToExport = sleepData;
          fileName = 'sleep_report';
          break;
        case 'weight':
          dataToExport = weightData;
          fileName = 'weight_report';
          break;
        default:
          dataToExport = workoutData;
          fileName = 'health_report';
      }
      
      const ws = XLSX.utils.json_to_sheet(dataToExport);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, activeTab);
      XLSX.writeFile(wb, `${fileName}_${timeRange}.xlsx`);
      
      setTimeout(() => {
        setIsExporting(false);
        setExportFormat(null);
      }, 1000);
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      setIsExporting(false);
      setExportFormat(null);
    }
  };

  const shareReport = () => {
    // Implement sharing functionality
    // This could be email sharing, social media, etc.
    alert('Sharing functionality would be implemented here. This could include email, social media, or generating a shareable link.');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-8"
      ref={reportRef}
    >
      <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">Reports & Analytics</h1>
      
      {/* Time Range Selector */}
      <div className="mb-8">
        <div className="inline-flex rounded-md shadow-sm">
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium rounded-l-lg ${timeRange === 'week' ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
            onClick={() => setTimeRange('week')}
          >
            Week
          </button>
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium ${timeRange === 'month' ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
            onClick={() => setTimeRange('month')}
          >
            Month
          </button>
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium rounded-r-lg ${timeRange === 'year' ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
            onClick={() => setTimeRange('year')}
          >
            Year
          </button>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="flex mb-8 border-b border-gray-200 dark:border-gray-700">
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'workouts' ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400' : 'text-gray-500 dark:text-gray-400'}`}
          onClick={() => setActiveTab('workouts')}
        >
          Workouts
        </button>
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'nutrition' ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400' : 'text-gray-500 dark:text-gray-400'}`}
          onClick={() => setActiveTab('nutrition')}
        >
          Nutrition
        </button>
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'sleep' ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400' : 'text-gray-500 dark:text-gray-400'}`}
          onClick={() => setActiveTab('sleep')}
        >
          Sleep
        </button>
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'weight' ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400' : 'text-gray-500 dark:text-gray-400'}`}
          onClick={() => setActiveTab('weight')}
        >
          Weight
        </button>
      </div>
      
      {/* Workout Reports */}
      {activeTab === 'workouts' && (
        <div>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total Workout Time</h3>
              <p className="text-3xl font-bold text-gray-800 dark:text-white">{workoutTotals.totalMinutes} min</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">This week</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Calories Burned</h3>
              <p className="text-3xl font-bold text-gray-800 dark:text-white">{workoutTotals.totalCalories}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">This week</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Workout Days</h3>
              <p className="text-3xl font-bold text-gray-800 dark:text-white">{workoutTotals.workoutDays}/7</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">This week</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Avg. Workout Duration</h3>
              <p className="text-3xl font-bold text-gray-800 dark:text-white">{workoutTotals.avgMinutesPerWorkout} min</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Per session</p>
            </div>
          </div>
          
          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Workout Duration</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={workoutData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#6B7280" />
                    <YAxis stroke="#6B7280" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '0.5rem' }} 
                      itemStyle={{ color: '#F3F4F6' }}
                      labelStyle={{ color: '#F3F4F6' }}
                    />
                    <Legend />
                    <Bar dataKey="minutes" name="Minutes" fill="#8884d8" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Workout Types</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={workoutTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {workoutTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '0.5rem' }} 
                      itemStyle={{ color: '#F3F4F6' }}
                      labelStyle={{ color: '#F3F4F6' }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 lg:col-span-2">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Calories Burned</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={workoutData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#6B7280" />
                    <YAxis stroke="#6B7280" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '0.5rem' }} 
                      itemStyle={{ color: '#F3F4F6' }}
                      labelStyle={{ color: '#F3F4F6' }}
                    />
                    <Legend />
                    <Area type="monotone" dataKey="calories" name="Calories" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Nutrition Reports */}
      {activeTab === 'nutrition' && (
        <div>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Avg. Daily Calories</h3>
              <p className="text-3xl font-bold text-gray-800 dark:text-white">{nutritionTotals.avgCalories}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">This week</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Avg. Protein</h3>
              <p className="text-3xl font-bold text-gray-800 dark:text-white">{nutritionTotals.avgProtein}g</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">This week</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Avg. Carbs</h3>
              <p className="text-3xl font-bold text-gray-800 dark:text-white">{nutritionTotals.avgCarbs}g</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">This week</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Avg. Fat</h3>
              <p className="text-3xl font-bold text-gray-800 dark:text-white">{nutritionTotals.avgFat}g</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">This week</p>
            </div>
          </div>
          
          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Daily Calories</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={nutritionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#6B7280" />
                    <YAxis stroke="#6B7280" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '0.5rem' }} 
                      itemStyle={{ color: '#F3F4F6' }}
                      labelStyle={{ color: '#F3F4F6' }}
                    />
                    <Legend />
                    <Bar dataKey="calories" name="Calories" fill="#8884d8" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Macronutrient Breakdown</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Protein', value: nutritionTotals.avgProtein },
                        { name: 'Carbs', value: nutritionTotals.avgCarbs },
                        { name: 'Fat', value: nutritionTotals.avgFat },
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      <Cell fill="#8884d8" />
                      <Cell fill="#82ca9d" />
                      <Cell fill="#ffc658" />
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '0.5rem' }} 
                      itemStyle={{ color: '#F3F4F6' }}
                      labelStyle={{ color: '#F3F4F6' }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 lg:col-span-2">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Macronutrients by Day</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={nutritionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#6B7280" />
                    <YAxis stroke="#6B7280" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '0.5rem' }} 
                      itemStyle={{ color: '#F3F4F6' }}
                      labelStyle={{ color: '#F3F4F6' }}
                    />
                    <Legend />
                    <Bar dataKey="protein" name="Protein (g)" stackId="a" fill="#8884d8" />
                    <Bar dataKey="carbs" name="Carbs (g)" stackId="a" fill="#82ca9d" />
                    <Bar dataKey="fat" name="Fat (g)" stackId="a" fill="#ffc658" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Sleep Reports */}
      {activeTab === 'sleep' && (
        <div>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Avg. Sleep Duration</h3>
              <p className="text-3xl font-bold text-gray-800 dark:text-white">{sleepTotals.avgHours} hrs</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">This week</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Avg. Sleep Quality</h3>
              <p className="text-3xl font-bold text-gray-800 dark:text-white">{sleepTotals.avgQuality}%</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">This week</p>
            </div>
          </div>
          
          {/* Charts */}
          <div className="grid grid-cols-1 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Sleep Duration</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sleepData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#6B7280" />
                    <YAxis stroke="#6B7280" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '0.5rem' }} 
                      itemStyle={{ color: '#F3F4F6' }}
                      labelStyle={{ color: '#F3F4F6' }}
                    />
                    <Legend />
                    <Bar dataKey="hours" name="Hours" fill="#8884d8" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Sleep Quality</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sleepData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#6B7280" />
                    <YAxis stroke="#6B7280" domain={[0, 100]} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '0.5rem' }} 
                      itemStyle={{ color: '#F3F4F6' }}
                      labelStyle={{ color: '#F3F4F6' }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="quality" name="Quality (%)" stroke="#82ca9d" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Weight Reports */}
      {activeTab === 'weight' && (
        <div>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Current Weight</h3>
              <p className="text-3xl font-bold text-gray-800 dark:text-white">{weightData[weightData.length - 1].weight} lbs</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Last recorded</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Starting Weight</h3>
              <p className="text-3xl font-bold text-gray-800 dark:text-white">{weightData[0].weight} lbs</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">First recorded</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Weight Change</h3>
              <p className="text-3xl font-bold text-green-500">
                {weightData[weightData.length - 1].weight - weightData[0].weight} lbs
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Since starting</p>
            </div>
          </div>
          
          {/* Charts */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Weight Progress</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weightData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" domain={['dataMin - 5', 'dataMax + 5']} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '0.5rem' }} 
                    itemStyle={{ color: '#F3F4F6' }}
                    labelStyle={{ color: '#F3F4F6' }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="weight" name="Weight (lbs)" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
      
      {/* Export Options */}
      <div className="mt-12">
        <div className="flex flex-wrap justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Export & Share</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Download or share your health data</p>
          </div>
          
          <div className="flex space-x-3 mt-4 sm:mt-0">
            <motion.button
              className="flex items-center px-4 py-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowExportOptions(!showExportOptions)}
              disabled={isExporting}
            >
              <FaDownload className="mr-2" />
              Export Options
            </motion.button>
            
            <motion.button
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={shareReport}
              disabled={isExporting}
            >
              <FaShareAlt className="mr-2" />
              Share Report
            </motion.button>
          </div>
        </div>
        
        {/* Export Options Dropdown */}
        {showExportOptions && (
          <motion.div 
            className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <motion.button
                className={`flex items-center justify-center p-4 rounded-lg border ${isExporting && exportFormat === 'pdf' ? 'bg-indigo-100 dark:bg-indigo-900 border-indigo-300 dark:border-indigo-700' : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600'} hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={exportToPDF}
                disabled={isExporting}
              >
                <div className="flex flex-col items-center">
                  <FaFilePdf className="text-3xl text-red-500 mb-2" />
                  <span className="font-medium text-gray-800 dark:text-white">Export as PDF</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">Complete report with charts</span>
                </div>
              </motion.button>
              
              <motion.button
                className={`flex items-center justify-center p-4 rounded-lg border ${isExporting && exportFormat === 'excel' ? 'bg-indigo-100 dark:bg-indigo-900 border-indigo-300 dark:border-indigo-700' : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600'} hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={exportToExcel}
                disabled={isExporting}
              >
                <div className="flex flex-col items-center">
                  <FaFileExcel className="text-3xl text-green-500 mb-2" />
                  <span className="font-medium text-gray-800 dark:text-white">Export as Excel</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">Raw data for analysis</span>
                </div>
              </motion.button>
            </div>
            
            {isExporting && (
              <div className="mt-4 flex justify-center">
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-500 mr-3"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {exportFormat === 'pdf' ? 'Generating PDF...' : 'Exporting to Excel...'}
                  </span>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Reports;