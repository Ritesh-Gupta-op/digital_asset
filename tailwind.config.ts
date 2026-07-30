import type { Config } from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        manrope: ['Manrope', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        brand: {
          red: '#ef233c',
          'red-dark': '#c81e32',
          'red-glow': 'rgba(239,35,60,0.4)',
        },
      },
      boxShadow: {
        glow: '0 0 45px rgba(239, 35, 60, 0.25)',
        'glow-sm': '0 0 20px rgba(239, 35, 60, 0.15)',
        'card': '0 4px 40px rgba(0,0,0,0.6)',
      },
      animation: {
        'fade-up': 'fadeUp 0.8s ease-out forwards',
        'border-spin': 'borderSpin 2.5s linear infinite',
        'star-slow': 'animStar 50s linear infinite',
        'star-fast': 'animStar 80s linear infinite',
        'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        borderSpin: {
          from: { '--gradient-angle': '0deg' },
          to: { '--gradient-angle': '360deg' },
        },
        animStar: {
          from: { transform: 'translateY(0px)' },
          to: { transform: 'translateY(-2000px)' },
        },
      },
      backgroundImage: {
        'grid-noir':
          'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
      },
    },
  },
  plugins: [],
} satisfies Config;
