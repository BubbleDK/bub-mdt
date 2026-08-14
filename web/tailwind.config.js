/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "brand-dark": "#1F2020",
        "brand-gray": "#3C3C3C",
        "brand-light": "#FFFBFC",
        "brand-blue": "#245494",
      },
    },
  },
  plugins: [],
};
