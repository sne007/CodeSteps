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
          100: '#E0E7FF',
          600: '#4F46E5',
          700: '#4338CA',
          900: '#312E81',
        },
        purple: {
          50: '#F5F3FF',
        },
        pink: {
          100: '#FCE7F3',
        },
      },
    },
  },
  plugins: [],
}