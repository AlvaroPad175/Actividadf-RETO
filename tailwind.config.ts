import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'gray-750': '#2d3748',
        'gray-950': '#030712',
        pitch: '#0a1020',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        shake: 'shake 0.4s ease-in-out',
        'slot-appear': 'slot-appear 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'input-shake': 'input-shake 0.45s ease-in-out',
      },
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '15%': { transform: 'translateX(-6px)' },
          '30%': { transform: 'translateX(6px)' },
          '45%': { transform: 'translateX(-4px)' },
          '60%': { transform: 'translateX(4px)' },
          '75%': { transform: 'translateX(-2px)' },
          '90%': { transform: 'translateX(2px)' },
        },
        'slot-appear': {
          '0%':   { opacity: '0', transform: 'scale(0.5) translateY(-6px)' },
          '55%':  { transform: 'scale(1.1) translateY(0)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        'input-shake': {
          '0%, 100%': { transform: 'translateX(0)' },
          '15%': { transform: 'translateX(-8px)' },
          '30%': { transform: 'translateX(8px)' },
          '45%': { transform: 'translateX(-5px)' },
          '60%': { transform: 'translateX(5px)' },
          '75%': { transform: 'translateX(-2px)' },
          '90%': { transform: 'translateX(2px)' },
        },
      },
    },
  },
  plugins: [],
}
export default config
