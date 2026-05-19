import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#191717",
        paper: "#faf7ef",
        mint: "#dceee5",
        coral: "#efb7a5",
        signal: "#2d7f75",
        brass: "#b7822f",
        plum: "#6d4b72"
      },
      boxShadow: {
        soft: "0 18px 45px rgba(25, 23, 23, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
