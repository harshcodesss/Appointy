/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#F0EFFF',
          100: '#E0DEFF',
          200: '#C4C1FF',
          300: '#A5A0FF',
          400: '#8B83FF',
          500: '#6C63FF',
          600: '#5A52E0',
          700: '#4840C4',
          800: '#3830A0',
          900: '#2A2480',
        },
        secondary: {
          50: '#E6FFF6',
          100: '#B3FFE6',
          400: '#33E0A8',
          500: '#06D6A0',
          600: '#05B587',
        },
        accent: {
          400: '#FF8A8A',
          500: '#FF6B6B',
          600: '#E05555',
        },
        dark: {
          DEFAULT: '#1A1B2E',
          800: '#252642',
          700: '#2D2E4A',
          600: '#3D3E5C',
        },
        surface: {
          DEFAULT: '#F8F9FE',
          100: '#F1F2FB',
          200: '#E8E9F5',
        },
        muted: '#6B7094',
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(108, 99, 255, 0.08)',
        'glass-lg': '0 16px 48px rgba(108, 99, 255, 0.12)',
        'card': '0 2px 16px rgba(26, 27, 46, 0.06)',
        'card-hover': '0 8px 30px rgba(26, 27, 46, 0.12)',
        'float': '0 20px 60px rgba(26, 27, 46, 0.15)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'shimmer': 'shimmer 2s infinite linear',
        'float': 'float 6s ease-in-out infinite',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}