/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./Components/**/*.{js,jsx,ts,tsx}", // ✅ FIXED (capital C)
  ],
  theme: {
    extend: {
      animation: {
        loop: "loop 25s linear infinite",
      },
      keyframes: {
        loop: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};
