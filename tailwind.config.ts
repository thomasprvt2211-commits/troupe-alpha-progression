import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        scout: {
          green: "#2d6a4f",
          "green-light": "#40916c",
          forest: "#1b4332",
          sand: "#f7f5f0",
          cream: "#faf9f6",
          gold: "#c9a227",
          "gold-light": "#e8c547",
          charcoal: "#2c2c2c",
          bark: "#5c4033",
        },
        patrol: {
          loup: { DEFAULT: "#374151", light: "#6b7280", dark: "#111827" },
          hyene: { DEFAULT: "#ca8a04", light: "#facc15", dark: "#854d0e" },
          serpent: { DEFAULT: "#dc2626", light: "#f87171", dark: "#991b1b" },
          requin: { DEFAULT: "#2563eb", light: "#60a5fa", dark: "#1e40af" },
          aigle: { DEFAULT: "#16a34a", light: "#4ade80", dark: "#15803d" },
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-outfit)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(44, 44, 44, 0.04), 0 4px 16px rgba(44, 44, 44, 0.06)",
        "card-hover":
          "0 4px 8px rgba(44, 44, 44, 0.06), 0 12px 32px rgba(44, 44, 44, 0.1)",
        premium: "0 8px 30px rgba(27, 67, 50, 0.12)",
        nav: "0 1px 3px rgba(44, 44, 44, 0.06)",
      },
      backgroundImage: {
        "hero-pattern":
          "radial-gradient(circle at 20% 50%, rgba(201, 162, 39, 0.08) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(45, 106, 79, 0.12) 0%, transparent 40%)",
        "grid-subtle":
          "linear-gradient(rgba(44,44,44,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(44,44,44,0.03) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "32px 32px",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out forwards",
        "slide-up": "slideUp 0.5s ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
