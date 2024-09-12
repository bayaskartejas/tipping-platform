/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        sans: ['Helvetica', 'Arial', 'sans-serif'],
      },
      keyframes: {
        popup: {
          "0%" : {transform: "scale(0.95)", opacity: "0"},
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
      },
      animation: {
        popup: "popup 0.5s ease-out forwards",
      }
    },
  },
  plugins: [],
}