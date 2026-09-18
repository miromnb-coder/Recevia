import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: "#0B1F33",
        ink: "#071422",
        teal: "#0F6E73",
        mist: "#E8F4F4",
        sand: "#F4F1EA",
      },
      fontFamily: {
        sans: ["Arial", "ui-sans-serif", "system-ui", "sans-serif"],
        ui: ["Arial", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
