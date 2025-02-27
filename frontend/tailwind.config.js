/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      // Custom utilities to hide scrollbar
      scrollbarHide: {
        'scrollbar-width': 'none', // Firefox
        '&::-webkit-scrollbar': {
          display: 'none', // Chrome and Safari
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('tailwind-scrollbar-hide'), // For easy scrollbar hiding
    function ({ addUtilities }) {
      addUtilities({
        '.scrollbar-hide': {
          'scrollbar-width': 'none', /* Firefox */
          '&::-webkit-scrollbar': {
            display: 'none', /* Chrome, Safari */
          },
        },
      });
    },
  ],
};
