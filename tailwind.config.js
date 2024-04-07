/** @type {import('tailwindcss').Config} */
export default {
  content: ["./entrypoints/**/*.html", "./src/components/**/*.tsx"],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
  daisyui: {
    themes: ["winter"],
    // themes: ["nord"],
    // themes: ["lemonade"],
  },
};
