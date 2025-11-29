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
        accent: {
          primary: '#F5B544',
          secondary: '#111111',
        },
        text: {
          primary: '#111111',
          secondary: '#4A4A4A',
        },
        background: {
          sections: '#F5F5F5',
        },
        moonlight: {
          DEFAULT: '#F5F5F5',
        },
      },
      fontFamily: {
        sans: ['Inter', 'SF Pro Display', 'Satoshi', 'system-ui', 'sans-serif'],
        system: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      spacing: {
        'vw-4': '4vw',
        'em-58/16': '3.625em',
      },
      fontSize: {
        'vw-8xl': '8vw',
      },
      height: {
        'em-58/16': '3.625em',
      },
      zIndex: {
        '10': '10',
        '50': '50',
      },
    },
  },
  plugins: [],
}

