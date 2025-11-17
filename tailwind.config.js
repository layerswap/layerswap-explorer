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
        tertiary: '#768093',
        buttonTextColor: '#E4E5F0',
        logo: '#FF0093',
        footerLogo: 'none',
        warning: {
          Foreground: '#FFC94A',
          Background: '#2F2B1D',
        },
        error: {
          Foreground: '#FF6161',
          Background: '#2E1B1B',
        },
        success: {
          Foreground: '#59E07D',
          Background: '#0E2B16',
        },
        primary: {
          DEFAULT: '#CC2D5D',
          '100': '#FF94B0',
          '200': '#F5678D',
          '300': '#EB5481',
          '400': '#E54072',
          '500': '#CC2D5D',
          '600': '#B21D4A',
          '700': '#8F173B',
          '800': '#590E25',
          '900': '#2E0713',
          'text': '#E1E3E6',
        },
        secondary: {
          DEFAULT: '#111D36',
          '100': '#3C4861',
          '200': '#343F57',
          '300': '#283247',
          '400': '#1F283D',
          '500': '#171F31',
          '600': '#121929',
          '700': '#0E1524',
          '800': '#0B111F',
          '900': '#070C17',
          'text': '#A3ADC2',
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