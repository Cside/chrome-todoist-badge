/** @type {import('tailwindcss').Config} */
export default {
  content: ["./entrypoints/**/*.html", "./src/**/*.tsx"],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
  daisyui: {
    themes: ["winter"],
  },
};
