const { colors, radius, spacing } = require("./src/theme/tailwind-tokens");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors,
      borderRadius: radius,
      spacing,
      fontFamily: {
        base: ["Figtree_400Regular"],
        thai: ["BaiJamjuree_400Regular"],
      },
    },
  },
};
