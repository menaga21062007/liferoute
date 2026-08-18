/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#0F4C81",
          darkBlue: "#093154",
          lightBlue: "#EBF3FA",
          red: "#E63946",
          lightRed: "#FDF0F0",
          green: "#2ECC71",
          lightGreen: "#EAFAF1",
          amber: "#F59E0B",
          slate: "#0F172A",
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      animation: {
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'radar-sweep': 'radar 3s linear infinite',
        'beacon': 'beacon 1.5s ease-out infinite',
      },
      keyframes: {
        beacon: {
          '0%': { transform: 'scale(0.95)', opacity: '1', boxShadow: '0 0 0 0 rgba(230, 57, 70, 0.7)' },
          '70%': { transform: 'scale(1.15)', opacity: '0.6', boxShadow: '0 0 0 15px rgba(230, 57, 70, 0)' },
          '100%': { transform: 'scale(0.95)', opacity: '1', boxShadow: '0 0 0 0 rgba(230, 57, 70, 0)' }
        }
      }
    },
  },
  plugins: [],
}
