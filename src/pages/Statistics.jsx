import React, { useEffect, useState } from 'react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, parseISO, subWeeks } from 'date-fns';
import useTodoStore from '../store/todoStore';
import Loader from '../components/ui/Loader';

const Statistics = () => {
  const { todos, fetchTodos, loading, categories } = useTodoStore();
  const [timeframe, setTimeframe] = useState('week'); // 'week', 'month', 'year'
  
  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);
  
  const getCompletionRate = () => {
    if (todos.length === 0) return 0;
    
    const completedCount = todos.filter(todo => todo.is_completed).length;
    return Math.round((completedCount / todos.length) * 100);
  };
  
  const getCategoryDistribution = () => {
    const distribution = {};
    
    categories.forEach(category => {
      distribution[category.id] = 0;
    });
    
    // Count todos by category
    todos.forEach(todo => {
      if (todo.category_id) {
        distribution[todo.category_id] = (distribution[todo.category_id] || 0) + 1;
      }
    });
    
    return distribution;
  };
  
  const getWeeklyCompletion = () => {
    const today = new Date();
    const startDate = startOfWeek(today, { weekStartsOn: 0 });
    const endDate = endOfWeek(today, { weekStartsOn: 0 });
    const lastWeekStart = subWeeks(startDate, 1);
    
    const daysOfWeek = eachDayOfInterval({ start: startDate, end: endDate });
    
    const weeklyData = daysOfWeek.map(day => {
      const dayTodos = todos.filter(todo => {
        if (!todo.completed_at) return false;
        const completedDate = parseISO(todo.completed_at);
        return isSameDay(completedDate, day);
      });
      
      return {
        day: format(day, 'EEE'),
        count: dayTodos.length
      };
    });
    
    // Calculate this week's vs last week's completion
    const thisWeekCompleted = todos.filter(todo => {
      if (!todo.completed_at) return false;
      const completedDate = parseISO(todo.completed_at);
      return completedDate >= startDate && completedDate <= endDate;
    }).length;
    
    const lastWeekCompleted = todos.filter(todo => {
      if (!todo.completed_at) return false;
      const completedDate = parseISO(todo.completed_at);
      return completedDate >= lastWeekStart && completedDate < startDate;
    }).length;
    
    const weekOverWeekChange = lastWeekCompleted === 0 
      ? thisWeekCompleted > 0 ? 100 : 0
      : Math.round(((thisWeekCompleted - lastWeekCompleted) / lastWeekCompleted) * 100);
    
    return {
      dailyData: weeklyData,
      thisWeekCompleted,
      lastWeekCompleted,
      weekOverWeekChange
    };
  };
  
  const completionRate = getCompletionRate();
  const categoryDistribution = getCategoryDistribution();
  const weeklyCompletion = getWeeklyCompletion();
  
  if (loading && todos.length === 0) {
    return <Loader />;
  }
  
  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Statistics</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Completion Rate */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Completion Rate</h2>
          <div className="flex items-center">
            <div className="relative w-24 h-24">
              <svg className="w-full h-full" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#E5E7EB"
                  strokeWidth="3"
                  className="dark:stroke-gray-700"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#4F46E5"
                  strokeWidth="3"
                  strokeDasharray={`${completionRate}, 100`}
                  className="dark:stroke-indigo-400"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-gray-900 dark:text-white">
                {completionRate}%
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {todos.filter(todo => todo.is_completed).length} of {todos.length} tasks completed
              </p>
            </div>
          </div>
        </div>
        
        {/* Weekly Progress */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Weekly Progress</h2>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">This week</span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">{weeklyCompletion.thisWeekCompleted} tasks</span>
          </div>
          <div className="flex items-center">
            <span className={`text-sm font-medium ${
              weeklyCompletion.weekOverWeekChange > 0
                ? 'text-green-600 dark:text-green-400'
                : weeklyCompletion.weekOverWeekChange < 0
                  ? 'text-red-600 dark:text-red-400'
                  : 'text-gray-500 dark:text-gray-400'
            }`}>
              {weeklyCompletion.weekOverWeekChange > 0 ? '+' : ''}
              {weeklyCompletion.weekOverWeekChange}% vs last week
            </span>
          </div>
          <div className="mt-4 flex items-end space-x-1">
            {weeklyCompletion.dailyData.map((day, i) => (
              <div key={i} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-primary-100 dark:bg-primary-900/30 rounded-t"
                  style={{ height: `${Math.max(day.count * 10, 4)}px` }}
                ></div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{day.day}</div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Category Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Categories</h2>
          <div className="space-y-3">
            {categories.map(category => {
              const count = categoryDistribution[category.id] || 0;
              const percentage = todos.length > 0 ? Math.round((count / todos.length) * 100) : 0;
              
              return (
                <div key={category.id}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-700 dark:text-gray-300">{category.name}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{count} tasks</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-primary-600 dark:bg-primary-500 h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Task Completion Timeline</h2>
          
          <div className="flex space-x-4 mb-4">
            <button
              onClick={() => setTimeframe('week')}
              className={`px-3 py-1 text-sm rounded-md ${
                timeframe === 'week'
                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setTimeframe('month')}
              className={`px-3 py-1 text-sm rounded-md ${
                timeframe === 'month'
                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setTimeframe('year')}
              className={`px-3 py-1 text-sm rounded-md ${
                timeframe === 'year'
                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Year
            </button>
          </div>
          
          <div className="h-64 flex items-end">
            <div className="text-center text-sm text-gray-500 dark:text-gray-400 w-full">
              {todos.length === 0 ? (
                <div className="h-full flex items-center justify-center">
                  <p>No task data available</p>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p>Timeline visualization would go here</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
