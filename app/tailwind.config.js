/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@beadi/engine/src/**/*.{js,jsx,ts,tsx}"
],
  theme: {
    extend: {
      colors: {
        primary: {
          400: "#4E4A5B",
          500: "#443F50",
          600: "#393546",
          700: "#2F2A3B",
          800: "#252030",
          900: "#1B1726",
          1000: "#120F1B",
          1100: "#0A0810",
        },
      },
      boxShadow: {
        "error": "0 0 10px 3px red"
      }
    },

  },
  plugins: [],
};
