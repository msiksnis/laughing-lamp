const { fontFamily } = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["var(--main-font)", ...fontFamily.sans],
      },
      colors: {
        darkBg: "#151415",
      },
      backgroundImage: {
        gradientBg: "url('/gradientBackground.jpg')",
      },
      boxShadow: {
        "3xl": "rgba(0, 0, 0, 0.24) 0px 3px 8px;",
      },
    },
  },
  plugins: [],
};
