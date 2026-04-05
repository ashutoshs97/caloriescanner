/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
      },
      colors: {
        slate: {
          950: '#0a0f1c', // Deep rich space black
        },
        brand: {
          DEFAULT: '#7c3aed', // violet-600
          light: '#8b5cf6', // violet-500
          dark: '#5b21b6', // violet-800
        },
        neon: {
          green: '#10b981', // emerald-500
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}

