/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        'alan-light': ['AlanSans-Light', 'System'],
        'alan': ['AlanSans-Regular', 'System'],
        'alan-medium': ['AlanSans-Medium', 'System'],
        'alan-semibold': ['AlanSans-SemiBold', 'System'],
        'alan-bold': ['AlanSans-Bold', 'System'],
        'alan-extrabold': ['AlanSans-ExtraBold', 'System'],
        'alan-black': ['AlanSans-Black', 'System'],
      }
    },
  },
  plugins: [],
}