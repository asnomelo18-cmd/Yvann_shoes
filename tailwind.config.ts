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
          950: "var(--rho-ink-950)",
          900: "var(--rho-ink-900)",
        },
        slate: {
          800: "var(--rho-slate-800)",
          700: "var(--rho-slate-700)",
          600: "var(--rho-slate-600)",
          500: "var(--rho-slate-500)",
          400: "var(--rho-slate-400)",
          300: "var(--rho-slate-300)",
          200: "var(--rho-slate-200)",
          100: "var(--rho-slate-100)",
        },
        rho: {
          white: "var(--rho-white)",
          "white-pure": "var(--rho-white-pure)",
          blue: {
            700: "var(--rho-blue-700)",
            600: "var(--rho-blue-600)",
            500: "var(--rho-blue-500)",
            400: "var(--rho-blue-400)",
          },
          cyan: {
            500: "var(--rho-cyan-500)",
            400: "var(--rho-cyan-400)",
          },
          success: "var(--rho-success)",
          warning: "var(--rho-warning)",
          danger: "var(--rho-danger)",
        },
        bg: "var(--rho-bg)",
        surface: "var(--rho-surface)",
        "surface-2": "var(--rho-surface-2)",
        text: {
          DEFAULT: "var(--rho-text)",
          muted: "var(--rho-text-muted)",
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
