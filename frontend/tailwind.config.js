/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#09090b",
        foreground: "#fafafa",
        card: "#18181b",
        border: "#27272a",
        primary: "#f97316",
        destructive: "#ef4444",
        success: "#22c55e",
        warning: "#eab308",
        muted: "#27272a",
        "muted-foreground": "#a1a1aa",
      },
    },
  },
  plugins: [],
};