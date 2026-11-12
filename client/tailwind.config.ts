import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/Components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./Components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        caveat: ["Caveat", "cursive", "sans-serif"],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          50: "#f0f7f2",
          100: "#dcefe1",
          200: "#b8dfc4",
          300: "#8ec9a1",
          400: "#5aa878",
          500: "#3a8760",
          600: "#256b49",
          700: "#1c5439",
          800: "#173f2b",
          900: "#0f2e20",
        },
        clay: {
          100: "#f6e6d8",
          400: "#e2a06a",
          600: "#b8622e",
        },
      },
    },
  },
  plugins: [],
};

export default config;
