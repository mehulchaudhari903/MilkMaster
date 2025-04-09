/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e3f2fd',
          100: '#bbdefb',
          200: '#90caf9',
          300: '#64b5f6',
          400: '#42a5f5',
          500: '#1565c0', // Main primary color
          600: '#0d47a1',
          700: '#0a3880',
          800: '#072a60',
          900: '#041c40',
        },
        secondary: {
          50: '#e8f5e9',
          100: '#c8e6c9',
          200: '#a5d6a7',
          300: '#81c784',
          400: '#66bb6a',
          500: '#2e7d32', // Main secondary color
          600: '#2e7031',
          700: '#1b5e20',
          800: '#134a1e',
          900: '#0d3717',
        },
      },
      fontFamily: {
        'sans': ['Poppins', 'Roboto', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

