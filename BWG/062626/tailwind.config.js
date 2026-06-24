/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        blush: {
          50: '#FFF0F6',
          100: '#FFE8F0',
          200: '#FFD6E7',
          300: '#FFB6D5',
          400: '#F8A8CC',
          500: '#F491BE',
        },
        lilac: {
          200: '#F8D7FF',
          300: '#EFC0FA',
        },
        ink: {
          // warm near-black for text, never pure black (keeps the soft mood)
          700: '#5B4452',
          800: '#473340',
          900: '#352532',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['Quicksand', 'sans-serif'],
        hand: ['"Caveat"', 'cursive'],
        handAlt: ['"Patrick Hand"', 'cursive'],
      },
      keyframes: {
        floatY: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-22px) rotate(6deg)' },
        },
        sparkle: {
          '0%, 100%': { opacity: 0.2, transform: 'scale(0.8)' },
          '50%': { opacity: 1, transform: 'scale(1.15)' },
        },
        bounceArrow: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(10px)' },
        },
        marqueeUp: {
          '0%': { transform: 'translateY(0%)' },
          '100%': { transform: 'translateY(-50%)' },
        },
      },
      animation: {
        floatY: 'floatY 4s ease-in-out infinite',
        floatSlow: 'floatSlow 7s ease-in-out infinite',
        sparkle: 'sparkle 2.4s ease-in-out infinite',
        bounceArrow: 'bounceArrow 1.6s ease-in-out infinite',
        marqueeUp: 'marqueeUp 30s linear infinite',
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(245, 170, 200, 0.25)',
        polaroid: '0 6px 16px rgba(91, 68, 82, 0.18)',
      },
      backgroundImage: {
        'blush-gradient':
          'radial-gradient(circle at 20% 20%, #FFF0F6 0%, #FFE8F0 35%, #FFD6E7 70%, #F8D7FF 100%)',
      },
    },
  },
  plugins: [],
};
