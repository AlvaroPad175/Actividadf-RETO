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
        'gray-925': '#060a12',
        pitch: '#0a1020',
        accent: '#FFD700',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        shake: 'shake 0.4s ease-in-out',
        'slot-appear': 'slot-appear 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'input-shake': 'input-shake 0.45s ease-in-out',
        'fade-up': 'fade-up 0.45s ease-out forwards',
        'glow-pulse': 'glow-pulse 1.8s ease-in-out infinite',
        'bar-fill': 'bar-fill 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards',
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
          '0%':   { opacity: '0', transform: 'scale(0.55) translateY(-8px)' },
          '60%':  { transform: 'scale(1.08) translateY(0)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        'input-shake': {
          '0%, 100%': { transform: 'translateX(0)' },
          '15%': { transform: 'translateX(-9px)' },
          '30%': { transform: 'translateX(9px)' },
          '45%': { transform: 'translateX(-5px)' },
          '60%': { transform: 'translateX(5px)' },
          '75%': { transform: 'translateX(-2px)' },
          '90%': { transform: 'translateX(2px)' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 8px currentColor' },
          '50%':      { boxShadow: '0 0 20px currentColor, 0 0 40px currentColor' },
        },
        'bar-fill': {
          from: { width: '0%' },
        },
      },
    },
  },
  plugins: [],
}
export default config
