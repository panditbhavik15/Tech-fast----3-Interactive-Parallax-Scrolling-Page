/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        void: '#04060f',
        abyss: '#060b1c',
        ink: {
          DEFAULT: '#c3cde0',
          soft: '#93a1bd',
          faint: '#61708c',
        },
        cyan: '#35e0ff',
        violet: '#9b7bff',
      },
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
      },
      letterSpacing: {
        ultra: '0.32em',
      },
      maxWidth: {
        shell: '84rem',
      },
    },
  },
  plugins: [],
}
