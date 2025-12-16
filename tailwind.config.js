/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./Components/**/*.{js,jsx,ts,tsx}", // ✅ FIXED (capital C)
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
