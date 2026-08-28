import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        indigo: {
          DEFAULT: '#3D4DB8',
          dark: '#1A1F5E',
          deep: '#2E3E9E',
          50: '#EEF0FA',
          100: '#DDE1F5',
        },
        copper: {
          DEFAULT: '#A85520',
          dark: '#9E4E1E',
          50: '#F5E8DF',
        },
        wa: {
          DEFAULT: '#118348',
          dark: '#0B6634',
        },
        ink: '#1A1F5E',
        slate: '#4A5070',
        mute: '#6B7190',
        bg: '#F7F8FD',
        surface: '#ffffff',
        line: '#D0D5EE',
        gold: '#FFD88A',
      },
      fontFamily: {
        sans: ['var(--font-jakarta)', 'system-ui', 'sans-serif'],
        display: ['var(--font-outfit)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
