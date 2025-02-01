export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", 
    "./public/index.html",      
  ],
  theme: {
    extend: {
      keyframes: {
        'glitch-1': {
          '0%, 100%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(-2px)' },
          '75%': { transform: 'translateX(2px)' }
        },
        'glitch-2': {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(2px)' },
          '75%': { transform: 'translateX(-2px)' }
        },
        'glitch-3': {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-2px)' },
          '75%': { transform: 'translateX(2px)' }
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      },
      animation: {
        'glitch-1': 'glitch-1 0.3s infinite',
        'glitch-2': 'glitch-2 0.3s infinite',
        'glitch-3': 'glitch-3 0.3s infinite',
        'fade-in': 'fade-in 0.5s ease-out'
      }
    },
  },
  plugins: [],
};
