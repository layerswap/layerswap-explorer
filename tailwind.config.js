/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
	],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: '#E42575',
          '50': '#F8C8DC',
          '100': '#F6B6D1',
          '200': '#F192BA',
          '300': '#ED6EA3',
          '400': '#E8498C',
          '500': '#E42575',
          '600': '#A6335E',
          '700': '#881143',
          '800': '#930863',
          '900': '#6e0040',
          'background': '#3e1240',
          'text': '#abb5d1',
          'text-muted': '#56617B',
          'text-placeholder': '#8C98C0',
          'buttonTextColor': '#ffffff',
          'logoColor': '#FF0093'
        },
        secondary: {
          DEFAULT: '#111D36',
          '50': '#313C9B',
          '100': '#2E3B93',
          '200': '#232A70',
          '300': '#202965',
          '400': '#1C2759',
          '500': '#162546',
          '600': '#14213E',
          '700': '#111D36',
          '800': '#0F192F',
          '900': '#0C1527',
          '950': '#0B1123',
        },
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}