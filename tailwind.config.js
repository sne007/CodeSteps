module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      gradientColorStops: theme => ({
        ...theme('colors'),
      }),
      colors: {
        indigo: {
          100: '#F0F4F8',
          600: '#334E68',
          700: '#243B53',
          900: '#102A43',
        },
        purple: {
          50: '#E6E6FA',
        },
        pink: {
          100: '#FFF0F5',
        },
      },
    },
  },
  plugins: [],
}