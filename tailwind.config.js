/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html","./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors:{primary:"#166534",surface:"#f8f9ff","on-surface":"#0b1c30","surface-container-low":"#eff4ff","surface-container":"#e5eeff","surface-container-high":"#dce9ff","surface-container-lowest":"#ffffff"},
      fontFamily:{jakarta:["Plus Jakarta Sans","sans-serif"],inter:["Inter","sans-serif"]}
    },
  },
  plugins: [],
}

