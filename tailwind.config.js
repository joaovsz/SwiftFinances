/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        'alan-light': ['AlanSans-Light'],
        'alan-regular': ['AlanSans-Regular'],
        'alan-medium': ['AlanSans-Medium'],
        'alan-semibold': ['AlanSans-SemiBold'],
        'alan-bold': ['AlanSans-Bold'],
        'alan-extrabold': ['AlanSans-ExtraBold'],
      }
    },
  },
  plugins: [],
}