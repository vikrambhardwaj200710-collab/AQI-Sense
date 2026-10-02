import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        aqi: {
          good: "#10b981",
          moderate: "#f59e0b",
          sensitive: "#f97316",
          unhealthy: "#ef4444",
          veryUnhealthy: "#8b5cf6",
          hazardous: "#881337",
        },
      },
    },
  },
  plugins: [],
};

export default config;
