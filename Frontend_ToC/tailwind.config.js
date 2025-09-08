// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"], // ปรับตามโปรเจกต์คุณ
  theme: {
    extend: {
      fontFamily: {
        prompt: ['Prompt', "sans-serif"],
        bebas: ["'Bebas Neue'", "sans-serif"],
        dmserif: ["'DM Serif Display'", "serif"],
      },
    },
  },
  plugins: [],
};
