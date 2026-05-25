/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'VNM Sans Std'", "sans-serif"],
        display: ["'VNM Sans Display'", "sans-serif"],
        bradford: ["'Playfair Display'", "Georgia", "serif"],
        mono: ["'DM Mono'", "'Courier New'", "monospace"],
      },
      colors: {
        vnm: {
          cream:   "#F9F7F2",
          cream2:  "#F2EFE8",
          navy:    "#003087",
          navy60:  "#0057b8",
          text:    "#003087",
          sec:     "#4b6b9e",
          border:  "#E5E2DA",
          red:     "#D0021B",
        },
      },
    },
  },
  plugins: [],
}