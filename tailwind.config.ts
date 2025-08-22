import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ["var(--font-heading)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      colors: {
        main: {
          DEFAULT: "#2563eb",
          hover: "#1d4ed8",
        },
        secondary: {
          DEFAULT: "#9333ea",
        },
        background: "#f9fafb",
        surface: "#ffffff",
        text: {
          DEFAULT: "#111827",
          muted: "#6b7280",
        },
        border: "#e5e7eb",
      },
    },
  },
  plugins: [],
}
export default config
