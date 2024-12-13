/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      scrollBehavior: ['responsive'],
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        sans: ['Helvetica', 'Arial', 'sans-serif'],
      },
      colors: {
        'theme-col-1': '#1a3ba2',
        'theme-col-2': '#6d8ce7',
        'gray-bg': '#E2E8F0',
        
      },
      keyframes: {
        popup: {
          "0%" : {transform: "scale(0.95)", opacity: "0"},
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        buzz: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%': { transform: 'translateX(-5px)' },
          '40%': { transform: 'translateX(5px)' },
          '60%': { transform: 'translateX(-5px)' },
          '80%': { transform: 'translateX(5px)' },
        },
        'slide-fade-in': {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      animation: {
        popup: "popup 0.5s ease-out forwards",
        buzz: 'buzz 0.3s',
        'slide-fade-in': 'slide-fade-in 800ms ease-out forwards',
      }
    },
  },
  plugins: [],
}