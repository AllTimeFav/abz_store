module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx}', // Include Next.js app directory
    './src/(frontend)/**/*.{js,ts,jsx,tsx}', // Include frontend components
    './src/(payload)/**/*.{js,ts,jsx,tsx}', // Include Payload CMS components
    './src/my-route/**/*.{js,ts,jsx,tsx}', // Include custom routes
  ],
  theme: {
    extend: {},
  },
  plugins: [require('tailwindcss-animate')],
}
