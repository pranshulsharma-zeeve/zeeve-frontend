// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@zeeve-platform/ui/dist/**/*.js",
    "./node_modules/@zeeve-platform/ui-common-components/dist/**/*.js",
  ],
  plugins: [require("@tailwindcss/forms"), require("@zeeve-platform/ui/plugin")],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-dm-sans)"],
        poppins: ["var(--font-poppins)"],
      },
      backgroundImage: {
        "fade-white-down": "linear-gradient(180deg, #FFFFFF 0%, rgba(255,255,255,0) 76.17%)",
      },
      colors: {
        "clip-path": {
          blue: "rgba(98, 215, 231, 0.80)",
          green: "rgba(66, 215, 179, 0.80)",
          purple: "#361ECA",
        },
        "brand-full": "#8E4BEB",
        "brand-full-10": "#8E4BEB1A",

        "brand-validator": "#AF39AF",
        "brand-validator-10": "#AF39AF1A",

        "brand-archive": "#32B8B2",
        "brand-archive-10": "#32B8B21A",

        "brand-archive-blue": "#1D0CA4",
        "brand-light": "#f7f9fa",
      },
    },
  },
};

export default config;
