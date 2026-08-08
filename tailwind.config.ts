import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "rgb(var(--yvann-black-950) / <alpha-value>)",
          900: "rgb(var(--yvann-black-900) / <alpha-value>)",
        },
        slate: {
          800: "rgb(var(--yvann-charcoal-800) / <alpha-value>)",
          700: "rgb(var(--yvann-charcoal-700) / <alpha-value>)",
          600: "rgb(var(--yvann-charcoal-600) / <alpha-value>)",
          500: "rgb(var(--yvann-charcoal-500) / <alpha-value>)",
          400: "rgb(var(--yvann-charcoal-400) / <alpha-value>)",
          300: "rgb(var(--yvann-charcoal-300) / <alpha-value>)",
          200: "rgb(var(--yvann-charcoal-200) / <alpha-value>)",
          100: "rgb(var(--yvann-charcoal-100) / <alpha-value>)",
        },
        yvann: {
          cream: "rgb(var(--yvann-cream) / <alpha-value>)",
          "white-pure": "rgb(var(--yvann-white-pure) / <alpha-value>)",
          black: {
            950: "rgb(var(--yvann-black-950) / <alpha-value>)",
            900: "rgb(var(--yvann-black-900) / <alpha-value>)",
          },
          gold: {
            700: "rgb(var(--yvann-gold-700) / <alpha-value>)",
            600: "rgb(var(--yvann-gold-600) / <alpha-value>)",
            500: "rgb(var(--yvann-gold-500) / <alpha-value>)",
            400: "rgb(var(--yvann-gold-400) / <alpha-value>)",
            text: "rgb(var(--yvann-gold-text) / <alpha-value>)",
          },
          bronze: {
            500: "rgb(var(--yvann-bronze-500) / <alpha-value>)",
            400: "rgb(var(--yvann-bronze-400) / <alpha-value>)",
          },
          success: "rgb(var(--yvann-success) / <alpha-value>)",
          warning: "rgb(var(--yvann-warning) / <alpha-value>)",
          danger: "rgb(var(--yvann-danger) / <alpha-value>)",
          warningText: "rgb(var(--yvann-warning-text) / <alpha-value>)",
          successText: "rgb(var(--yvann-success-text) / <alpha-value>)",
          bronzeText: "rgb(var(--yvann-bronze-text) / <alpha-value>)",
        },
        bg: "rgb(var(--yvann-bg) / <alpha-value>)",
        surface: "rgb(var(--yvann-surface) / <alpha-value>)",
        "surface-2": "rgb(var(--yvann-surface-2) / <alpha-value>)",
        text: {
          DEFAULT: "rgb(var(--yvann-text) / <alpha-value>)",
          muted: "rgb(var(--yvann-text-muted) / <alpha-value>)",
        },
      },
      fontFamily: {
        sans: [
          "Helvetica Now Text",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      letterSpacing: {
        tight: "-0.02em",
      },
      backdropBlur: {
        glass: "16px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
