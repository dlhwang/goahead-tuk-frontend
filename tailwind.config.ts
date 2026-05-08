import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        midnight: '#1A1A2E',
        lavender: '#D4B7E7',
        amber: '#FFD166',
        charcoal: '#2A2D34',
        mist: '#F8F5F1',
      },
      fontFamily: {
        sans: ['Inter', 'Pretendard', 'system-ui', 'sans-serif'],
        display: ['Georgia', 'serif'],
      },
      boxShadow: {
        glow: '0 24px 80px rgba(212, 183, 231, 0.28)',
      },
    },
  },
  plugins: [],
} satisfies Config;
