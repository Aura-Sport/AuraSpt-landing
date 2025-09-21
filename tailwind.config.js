/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        light: {
          border: "hsl(0, 0%, 80%)",
          input: "hsl(0, 0%, 96%)", 
          ring: "hsl(0, 0%, 70%)",
          background: "hsl(0, 0%, 98%)",
          foreground: "hsl(0, 0%, 10%)",
          primary: "hsl(0, 0%, 20%)",
          primaryForeground: "hsl(0, 0%, 100%)",
          secondary: "hsl(0, 0%, 95%)",
          secondaryForeground: "hsl(0, 0%, 20%)",
          muted: "hsl(0, 0%, 95%)",
          mutedForeground: "hsl(0, 0%, 40%)",
          accent: "hsl(0, 0%, 20%)",
          accentForeground: "hsl(0, 0%, 100%)",
          card: "hsl(0, 0%, 100%)",
          cardForeground: "hsl(0, 0%, 10%)",
        },
        dark: {
          border: "hsl(0, 0%, 20%)",
          input: "hsl(0, 0%, 15%)", 
          ring: "hsl(0, 0%, 40%)",
          background: "hsl(0, 0%, 7%)",
          foreground: "hsl(0, 0%, 90%)",
          primary: "hsl(0, 0%, 30%)",
          primaryForeground: "hsl(0, 0%, 100%)",
          secondary: "hsl(0, 0%, 12%)",
          secondaryForeground: "hsl(0, 0%, 90%)",
          muted: "hsl(0, 0%, 12%)",
          mutedForeground: "hsl(0, 0%, 60%)",
          accent: "hsl(0, 0%, 25%)",
          accentForeground: "hsl(0, 0%, 100%)",
          card: "hsl(0, 0%, 10%)",
          cardForeground: "hsl(0, 0%, 90%)",
        },
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
      },
      borderRadius: {
        lg: "12px",
        md: "8px",
        sm: "6px",
      },
      boxShadow: {
        subtle: "0 4px 12px rgba(0, 0, 0, 0.25)",
      },
    },
  },
  plugins: [],
}