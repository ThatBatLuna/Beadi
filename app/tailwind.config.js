/** @type {import('tailwindcss').Config} */
const purple = {
          100: "#fcacfa",
          200: "#f38bef",
          300: "#ea6de5",
          400: "#e251d9",
          500: "#d938cc",
          600: "#c217b4",
          700: "#a211a2",
          800: "#7b0e83",
          900: "#580d63",
          1000: "#390b43",
          1100: "#1d0724"
        };
const fuchsia = {
  100: "#fcacc4",
  200: "#fb90b1",
  300: "#f9749f",
  400: "#f8598e",
  500: "#f63f7e",
  600: "#e71b63",
  700: "#c0144f",
  800: "#99103e",
  900: "#720e2e",
  1000:"#4b0c1f",
  1100:"#240710"
};


module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@beadi/*/src/**/*.{js,jsx,ts,tsx}"
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
        purple: purple,
        accent: purple,
        fuchsia: fuchsia,
        secondary: fuchsia,
      },
      boxShadow: {
        "error": "0 0 10px 3px red",
        "glow": "0 0 30px 0 white"
      },
      dropShadow: {
        "primary": [
          "0 0 5px black",
          "0 0 10px white",
          `0 0 20px ${purple[300]}`,
          `0 0 50px ${purple[800]}`
        ]
      }
    },

  },
  plugins: [],
};
