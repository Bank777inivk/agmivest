import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "ely-blue": "#003d82",
        "ely-mint": "#036b4e", // Darker green for AAA accessibility
      },
    },
  },
  plugins: [],
};

export default config;
