/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        gmail: {
          bg: '#f6f8fc',
          surface: '#ffffff',
          text: '#1f1f1f',
          secondary: '#5f6368',
          border: '#e0e0e0',
          accent: '#1a73e8',
          activeBg: '#d3e3fd'
        },
        aira: {
          bg: '#fff9e6',
          border: '#fde68a',
          text: '#78350f',
          accent: '#d97706',
          accentHover: '#b45309',
          chipBg: '#ffffff',
          chipBorder: '#fed7aa',
          successBg: '#e6f4ea',
          successText: '#137333',
          successBorder: '#ceead6'
        }
      }
    },
  },
  plugins: [],
}
