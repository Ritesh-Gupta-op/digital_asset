import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff8ef',
          100: '#ffe5c7',
          500: '#ff8a1f',
          600: '#f27000',
          700: '#c75700',
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
