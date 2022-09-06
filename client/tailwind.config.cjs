/** @type {import('tailwindcss').Config} */


module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gray: {
          "9": "#eeeeee"
        },
        "gray-dark": {
          "9": "#8c8c8c"
        },
        green: {
          '50': '#f0fdf4',
          '100': '#dcfce7',
          '200': '#bbf7d0',
          '300': '#86efac',
          '400': '#4ade80',
          '450': '#3ccc6f',
          '500': '#22c55e',
          '600': '#16a34a',
          '700': '#15803d',
          '800': '#166534',
          '900': '#14532d',
        }
      },
      maxWidth:{
        '8xl': "85rem"
      },
      minWidth: {
        100: "100px",
        150: "150px",
        200: "200px",
        300: "300px",
        900: "900px",
        1000: "1000px"
      },
      zIndex: {
        500: "500",
      }
    },
  },
  plugins: [],
}