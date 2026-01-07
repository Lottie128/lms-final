/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Light mode colors
        light: {
          bg: '#F9FAFB',
          surface: '#FFFFFF',
          'surface-secondary': '#F3F4F6',
          primary: '#1F2937',
          'primary-light': '#374151',
          'text-primary': '#111827',
          'text-secondary': '#6B7280',
          border: '#E5E7EB',
        },
        // Dark mode colors
        dark: {
          bg: '#111827',
          surface: '#1F2937',
          'surface-secondary': '#374151',
          primary: '#E5E7EB',
          'primary-light': '#D1D5DB',
          'text-primary': '#F9FAFB',
          'text-secondary': '#D1D5DB',
          border: '#374151',
        },
        // Accent colors (same for both modes)
        accent: {
          DEFAULT: '#3B82F6',
          hover: '#2563EB',
          dark: '#60A5FA',
          'dark-hover': '#93C5FD',
        },
        success: {
          DEFAULT: '#10B981',
          dark: '#34D399',
        },
        warning: {
          DEFAULT: '#F59E0B',
          dark: '#FBBF24',
        },
        error: {
          DEFAULT: '#EF4444',
          dark: '#F87171',
        },
      },
      backgroundImage: {
        'glass-light': 'linear-gradient(135deg, rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.5))',
        'glass-dark': 'linear-gradient(135deg, rgba(31, 41, 55, 0.8), rgba(31, 41, 55, 0.6))',
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
        'glass-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
      },
      backdropBlur: {
        glass: '10px',
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.3s ease-in',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
