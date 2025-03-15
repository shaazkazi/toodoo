module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}", "./index.html"],
    darkMode: 'class', // This is critical - ensure dark mode uses class strategy
    theme: {
      extend: {
        colors: {
          gray: {
            50: '#F9FAFB',
            100: '#F3F4F6',
            200: '#E5E7EB',
            300: '#D1D5DB',
            400: '#9CA3AF',
            500: '#6B7280',
            600: '#4B5563',
            700: '#374151',
            800: '#1F2937',
            900: '#111827',
          },
          primary: {
            50: '#EFF6FF',
            100: '#DBEAFE',
            200: '#BFDBFE',
            300: '#93C5FD',
            400: '#60A5FA',
            500: '#3B82F6', // blue-500
            600: '#2563EB', // blue-600
            700: '#1D4ED8',
            800: '#1E40AF',
            900: '#1E3A8A',
          },
          secondary: {
            50: '#F9FAFB',
            100: '#F3F4F6',
            200: '#E5E7EB',
            300: '#D1D5DB',
            400: '#9CA3AF',
            500: '#6B7280', // gray-500
            600: '#4B5563', // gray-600
            700: '#374151',
            800: '#1F2937',
            900: '#111827',
          },
          dark: {
            bg: '#111827', // bg-gray-900
            card: '#1F2937', // bg-gray-800
            border: '#374151', // border-gray-700
            input: '#374151',
          },
          red: {
            50: '#FEF2F2',
            100: '#FEE2E2',
            400: '#F87171',
            500: '#EF4444',
            600: '#DC2626',
            700: '#B91C1C',
            800: '#991B1B',
            900: '#7F1D1D',
          },
          blue: {
            50: '#EFF6FF',
            500: '#3B82F6',
            600: '#2563EB',
            900: '#1E3A8A',
          },
          white: '#FFFFFF',
          black: '#000000',
        },
      },
    },
    plugins: [],
  }
  