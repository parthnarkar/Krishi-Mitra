/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
      },
      colors: {
        'earth-green': {
          50: '#f0f9f0',
          100: '#d9f2d9',
          200: '#b3e6b3',
          300: '#8cd98c',
          400: '#66cc66',
          500: '#40bf40',
          600: '#339933',
          700: '#267326',
          800: '#1a4d1a',
          900: '#0d260d',
        },
        'earth-brown': {
          50: '#f9f5f0',
          100: '#f2e6d9',
          200: '#e6ccb3',
          300: '#d9b38c',
          400: '#cc9966',
          500: '#bf8040',
          600: '#996633',
          700: '#734d26',
          800: '#4d331a',
          900: '#261a0d',
        },
      },
    },
  },
  plugins: [],
} 