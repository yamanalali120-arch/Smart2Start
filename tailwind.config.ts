// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // brillen.de brand colors
        brand: {
          green: {
            50: "#f0fdf4",
            100: "#dcfce7",
            200: "#bbf7d0",
            300: "#86efac",
            400: "#4ade80",
            500: "#2D8C3C",    // Primary green
            600: "#247032",
            700: "#1b5427",
            800: "#14401d",
            900: "#0d2c14",
            950: "#061a0b",
          },
          plum: {
            50: "#fdf2f8",
            100: "#fce7f3",
            200: "#f5d0e0",
            300: "#e8a5c4",
            400: "#d4709e",
            500: "#8B2252",    // Secondary plum/bordeaux
            600: "#6e1a41",
            700: "#571434",
            800: "#420f27",
            900: "#2d0a1b",
            950: "#1a0610",
          },
        },
        // shadcn/ui semantic tokens
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Quiz-specific colors
        correct: {
          DEFAULT: "#22c55e",
          light: "#f0fdf4",
        },
        incorrect: {
          DEFAULT: "#ef4444",
          light: "#fef2f2",
        },
        warning: {
          DEFAULT: "#f59e0b",
          light: "#fffbeb",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "slide-up-fade": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-scale": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.05)" },
        },
        "xp-pop": {
          "0%": { opacity: "0", transform: "scale(0.5) translateY(0)" },
          "50%": { opacity: "1", transform: "scale(1.2) translateY(-20px)" },
          "100%": { opacity: "0", transform: "scale(1) translateY(-40px)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "slide-up-fade": "slide-up-fade 0.4s ease-out",
        "pulse-scale": "pulse-scale 2s ease-in-out infinite",
        "xp-pop": "xp-pop 1s ease-out forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;