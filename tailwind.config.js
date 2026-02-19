/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#E6F0F0',
          100: '#CCE0E1',
          200: '#99C2C3',
          300: '#66A3A5',
          400: '#338587',
          500: '#0F7377',
          600: '#0C5C5F',
          700: '#094547',
          800: '#062E2F',
          900: '#031718',
        },
        secondary: {
          50: '#FEF5E7',
          100: '#FDEBD0',
          200: '#FBD7A1',
          300: '#F9C472',
          400: '#F7B043',
          500: '#F59E0B',
          600: '#C47E09',
          700: '#935F07',
          800: '#623F04',
          900: '#312002',
        },
        growthlab: {
          teal: '#0F7377',
          slate: '#1E293B',
          amber: '#F59E0B',
          light: '#F8FAFC',
          gray: '#334155',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 1s ease-out',
        'slide-up': 'slideUp 1s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

