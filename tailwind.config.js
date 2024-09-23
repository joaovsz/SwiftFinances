/** @type {import('tailwindcss').Config} */

import fontFamily from "./src/types/fontFamily"
module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        'outfit-light': ['Outfit_300Light'],
        'outfit-regular': ['Outfit_400Regular'],
        'outfit-medium': ['Outfit_500Medium'],
        'outfit-semibold': ['Outfit_600SemiBold'],
        'outfit-bold': ['Outfit_700Bold'],
        'outfit-extrabold': ['Outfit_800ExtraBold'],}
    },
  },
  plugins: [],
}