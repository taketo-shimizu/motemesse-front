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
      backgroundImage: {
        'pink-gradient': 'linear-gradient(135deg, #fce7f3 0%, #f8bbd9 100%)',
        'gray-gradient': 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);',
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: ['light', 'dark', 'cupcake'],
  },
};

export default config;