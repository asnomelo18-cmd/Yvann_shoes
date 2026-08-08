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
          950: "var(--yvann-black-950)",
          900: "var(--yvann-black-900)",
        },
        slate: {
          800: "var(--yvann-charcoal-800)",
          700: "var(--yvann-charcoal-700)",
          600: "var(--yvann-charcoal-600)",
          500: "var(--yvann-charcoal-500)",
          400: "var(--yvann-charcoal-400)",
          300: "var(--yvann-charcoal-300)",
          200: "var(--yvann-charcoal-200)",
          100: "var(--yvann-charcoal-100)",
        },
        yvann: {
          cream: "var(--yvann-cream)",
          "white-pure": "var(--yvann-white-pure)",
          gold: {
            700: "var(--yvann-gold-700)",
            600: "var(--yvann-gold-600)",
            500: "var(--yvann-gold-500)",
            400: "var(--yvann-gold-400)",
          },
          bronze: {
            500: "var(--yvann-bronze-500)",
            400: "var(--yvann-bronze-400)",
          },
          success: "var(--yvann-success)",
          warning: "var(--yvann-warning)",
          danger: "var(--yvann-danger)",
          warningText: "var(--yvann-warning-text)",
          successText: "var(--yvann-success-text)",
          bronzeText: "var(--yvann-bronze-text)",
        },
        bg: "var(--yvann-bg)",
        surface: "var(--yvann-surface)",
        "surface-2": "var(--yvann-surface-2)",
        text: {
          DEFAULT: "var(--yvann-text)",
          muted: "var(--yvann-text-muted)",
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
