/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: '#F7F7F4',
        pine: {
          950: '#0F1A13',
          900: '#15261E',
          850: '#1B2E24',
          800: '#23392D',
          700: '#2F4B3C',
          100: '#E4ECE6',
        },
        terracotta: {
          400: '#C85734',
          500: '#B64B29',
          600: '#9E3E1F',
          700: '#863217',
        },
        sage: {
          50: '#F4F7F4',
          100: '#E9EFEA',
          200: '#D6E2D8',
          300: '#BED0C2',
          700: '#325440',
          800: '#23412F',
        },
        status: {
          newBg: '#FFEFEA',
          newText: '#B64B29',
          respBg: '#E7F2EB',
          respText: '#276840',
          resBg: '#EEF0EE',
          resText: '#4A5E51',
          waitBg: '#FEF5E7',
          waitText: '#B46B18',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 10px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.02)',
        'card': '0 4px 16px rgba(15, 26, 19, 0.06)',
      }
    },
  },
  plugins: [],
}
