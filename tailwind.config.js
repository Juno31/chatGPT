/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        lightBlue: "#F8F7FC",
        LightGrey: "#CBC7C8",
        Ivory: "#FFFCF5",
        LightBrown: "#BF9B79",
        DarkBrown: "#4F3C42",
      },
      fontSize: {
        "2.5xl": ["1.6875rem", { lineHeight: "2.125rem" }], // 24px
      },
      screens: {
        pc: "600px",
      },
    },
  },
  plugins: [],
};
