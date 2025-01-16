/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
    colors: {
      'color0': '#FC4747',
      'color1': '#10141E',
      'color2': '#5A698F',
      'color3': '#161D2F',
      'color4': '#FFFFFF'
    },
    screens: {
      'sm': '300px',
      'md': '720px',
      'lg':'1280px',
    },
  },
  plugins: [],
}

