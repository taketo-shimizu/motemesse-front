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
        pinkCustom: '#f8bbd9',
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: ['light', 'dark', 'cupcake'],
  },
};

export default config;