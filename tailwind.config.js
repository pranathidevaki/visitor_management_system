/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // content tells Tailwind which files to scan
  // for class names. It only includes CSS for
  // classes it actually finds in these files.
  // This keeps your final CSS file tiny.
  theme: {
    extend: {},
  },
  plugins: [],
}