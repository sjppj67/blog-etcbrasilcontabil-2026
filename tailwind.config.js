/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./_includes/**/*.html",
    "./_layouts/**/*.html",
    "./_posts/**/*.md",
    "./*.html",
    "./*.md",
    "./assets/js/**/*.js",
    "./_data/**/*.yml"
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          950: "#000000",
          900: "#0A0A0A",
          800: "#1A1A1A",
          700: "#2A2A2A",
          600: "#3A3A3A",
        },
        neon: {
          blue: {
            DEFAULT: "#00F0FF",
            light: "#33FFFF",
            dark: "#00B0CC",
          },
          violet: {
            DEFAULT: "#7008DB",
            light: "#A753DB",
            dark: "#592E83",
          },
        },
        "tag-contabilidade": "#00F0FF",
        "tag-legislacao": "#22c55e",
        "tag-empreendedorismo": "#A753DB",
        "link-hover": "#00F0FF",
      },
      fontFamily: {
        playfair: ['"Playfair Display"', "serif"],
        lato: ['"Lato"', "sans-serif"],
      },
      boxShadow: {
        "neon-blue": "0 0 20px rgba(0, 240, 255, 0.35)",
        "neon-violet": "0 0 20px rgba(112, 8, 219, 0.45)",
      },
      animation: {
        "pulse-glow": "pulseGlow 2s ease-in-out infinite alternate",
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms")({ strategy: "class" }),
    require("@tailwindcss/typography"),
    require("tailwindcss-animate"),
  ],
};