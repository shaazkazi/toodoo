import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, parseISO } from 'date-fns';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import useTodoStore from '../store/todoStore';
import { Link } from 'react-router-dom';
import Loader from '../components/ui/Loader';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState([]);
  
  const { todos, fetchTodos, loading } = useTodoStore();
  
  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);
  
  useEffect(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    
    const days = [];
    let day = startDate;
    
    while (day <= endDate) {
      days.push(day);
      day = addDays(day, 1);
    }
    
    setCalendarDays(days);
  }, [currentDate]);
  
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };
  
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };
  
  const getTodosForDay = (day) => {
    return todos.filter(todo => {
      if (!todo.due_date) return false;
      const dueDate = parseISO(todo.due_date);
      return isSameDay(dueDate, day);
    });
  };
  
  if (loading && todos.length === 0) {
    return <Loader />;
  }
  
  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Calendar</h1>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={prevMonth}
            className="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          
          <button
            onClick={nextMonth}
            className="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-700">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="py-2 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700">
          {calendarDays.map((day, i) => {
            const dayTodos = getTodosForDay(day);
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isToday = isSameDay(day, new Date());
            
            return (
              <div
                key={i}
                className={`min-h-[120px] p-2 ${
                  isCurrentMonth
                    ? 'bg-white dark:bg-gray-800'
                    : 'bg-gray-50 dark:bg-gray-900 text-gray-400 dark:text-gray-600'
                } ${
                  isToday
                    ? 'bg-blue-50 dark:bg-blue-900/20'
                    : ''
                }`}
              >
                <div className="text-right">
                  <span className={`inline-flex items-center justify-center ${
                    isToday
                      ? 'bg-blue-500 text-white dark:bg-blue-600 w-6 h-6 rounded-full'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}>
                    {format(day, 'd')}
                  </span>
                </div>
                
                <div className="mt-2 space-y-1 max-h-[80px] overflow-y-auto">
                  {dayTodos.map(todo => (
                    <Link
                      key={todo.id}
                      to={`/todo/${todo.id}`}
                      className={`block text-xs truncate p-1 rounded ${
                        todo.is_completed
                          ? 'line-through text-gray-400 dark:text-gray-500'
                          : 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300'
                      }`}
                    >
                      {todo.title}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
