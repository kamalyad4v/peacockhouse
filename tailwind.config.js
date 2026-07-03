/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['var(--font-cormorant)', 'Cormorant Garamond', 'serif'],
        sans: ['var(--font-manrope)', 'Manrope', 'sans-serif'],
      },
      colors: {
        'pk-bg': '#05070A',
        'pk-bg-2': '#0A0D14',
        'pk-surface': '#0F141E',
        'pk-teal': '#008080',
        'pk-emerald': '#097969',
        'pk-sapphire': '#0F52BA',
        'pk-gold': '#D4AF37',
        'pk-gold-light': '#F3E5AB',
        'pk-text': '#F8F9FA',
      },
    },
  },
  plugins: [],
};
