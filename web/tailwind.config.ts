import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef4ff",
          100: "#dce6fd",
          200: "#c0d3fc",
          300: "#95b6f9",
          400: "#638ef4",
          500: "#3f66ee",
          600: "#2946e2",
          700: "#2135cf",
          800: "#212da8",
          900: "#202c85",
          950: "#181d51",
        },
      },
    },
  },
  plugins: [],
};

export default config;
