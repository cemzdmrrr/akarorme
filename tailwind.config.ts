import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          black: '#0a0a0a',
          dark: '#111110',
          'dark-2': '#1a1a17',
          'dark-3': '#222220',
          'dark-4': '#2c2c28',
          grey: '#8e8e96',
          'grey-light': '#b5b5bd',
          white: '#f0f0f2',
          accent: '#C9A84C',
          'accent-light': '#D4BC6A',
          'accent-dark': '#A68B3C',
          'accent-glow': 'rgba(201, 168, 76, 0.25)',
          green: '#1C4332',
          'green-light': '#2D6B4F',
          cream: '#FAF8F4',
          'cream-dark': '#F3F0E8',
          sand: '#E8E3D8',
          'sand-dark': '#D4CFC3',
        },
      },
      fontFamily: {
        display: ['var(--font-space-grotesk)', 'system-ui', 'sans-serif'],
        body: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl: '16px',
        '2xl': '20px',
        '3xl': '28px',
      },
      boxShadow: {
        card: '0 8px 30px rgba(0,0,0,0.4)',
        'card-light': '0 4px 24px rgba(0,0,0,0.06)',
        'card-hover': '0 12px 40px rgba(0,0,0,0.10)',
        glow: '0 0 40px rgba(201,168,76,0.25)',
        'soft': '0 2px 12px rgba(0,0,0,0.04)',
      },
      maxWidth: {
        container: '1300px',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(1)', opacity: '0.6' },
          '100%': { transform: 'scale(1.5)', opacity: '0' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s ease-out forwards',
        'pulse-ring': 'pulse-ring 2s ease-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
