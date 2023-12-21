/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./src/**/*.{html,js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        white: "#fff",
        black: "#000",
        "gray-50": "#9E9E9E",
        "gray-100": "#F3F3F3",
        "gray-150": "#B8B8B8",
        "gray-200": "#D9D9D9",
        "gray-300": "#CFCFCF",
        "gray-400": "#616161",
        "primary-100": "#B61865",
        "primary-300": "",
        "primary-500": "",
        "secondary-400": "#FFCD5B",
        "secondary-500": "#FFC132",
      },
    },
  },
  plugins: [],
};
