import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: "#111111",
        ink: "#111111",
        teal: "#111111",
        mist: "#FAFAFA",
        sand: "#FFFFFF",
        paper: "#FFFFFF",
        line: "#E5E7EB",
        mute: "#6B7280",
        ok: "#16A34A",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        ui: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 20px 50px -24px rgba(17,17,17,0.18)",
      },
    },
  },
  plugins: [],
};

export default config;
