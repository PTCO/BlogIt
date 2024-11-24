/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#284B63",
          alt: "#3c6e71"
        },
        secondary: "#D9D9D9",
        tertiary: {
          DEFAULT: "#353535",
          ALT: "#FFFFFF"
        },
        Heading: "#3C6E71",
        buttons: {
          liked: '#FF5498',
          saved: '#4189BA'
        },
        black: {
          DEFAULT: "#000",
          100: "#1E1E2D",
          200: "#232533",
        },
      },
      fontFamily: {
        lobster: ["Lobster-Regular", "sans-serif"],
        opensansItalic: ["OpenSans_Condensed-Italic", "sans-serif"],
        opensansRegular: ["OpenSans_Condensed-Regular", "sans-serif"]
      },
    },
  },
  plugins: [],
}

