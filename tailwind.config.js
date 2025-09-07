import daisyui from 'daisyui';

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'tapple': {
          pink: '#FF647C',
          'pink-light': '#FF8A9B',
          'pink-dark': '#ff5168',
          'pink-pale': '#fce7f3',
          'pink-soft': '#f8bbd9',
        },
      },
      backgroundImage: {
        'pink-gradient': 'linear-gradient(135deg, #fce7f3 0%, #f8bbd9 100%)',
        'gray-gradient': 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);',
      },
      animation: {
        shimmer: 'shimmer 2s linear infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: ['light', 'dark', 'cupcake'],
  },
};

export default config;