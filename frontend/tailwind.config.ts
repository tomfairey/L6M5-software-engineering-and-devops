import konstaConfig from 'konsta/config';
import type { Config } from "tailwindcss";

export default konstaConfig({
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  darkMode: 'media',
  variants: {
    extend: {},
  },
  plugins: [],
}) satisfies Config;
