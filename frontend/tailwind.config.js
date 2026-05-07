/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Soft pink design system. `brand` is the canonical accent;
        // `surface` / `ink` keep components decoupled from raw color names.
        brand: {
          50:  '#fff5f8',
          100: '#ffe7ef',
          200: '#ffcedd',
          300: '#ffadc4',
          400: '#ff85a8',
          500: '#f76391',
          600: '#e34879',
          700: '#bf3461',
          800: '#922a4d',
          900: '#6b1f3a',
        },
        surface: {
          DEFAULT: '#ffffff',
          subtle: '#fffafc',
          muted: '#fdf2f6',
        },
        ink: {
          DEFAULT: '#1c1220',
          muted: '#6b5c66',
          soft: '#9b8d96',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Avenir', 'Helvetica', 'Arial', 'sans-serif'],
        display: ['"DM Serif Display"', 'Georgia', 'serif'],
      },
      borderRadius: {
        xl: '0.875rem',
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
      boxShadow: {
        soft: '0 6px 24px -10px rgba(247,99,145,0.18), 0 2px 8px -4px rgba(28,18,32,0.06)',
        card: '0 12px 40px -16px rgba(247,99,145,0.22), 0 4px 12px -8px rgba(28,18,32,0.08)',
      },
      keyframes: {
        shimmer: {
          '0%':   { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
        'fade-in': {
          '0%':   { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.4s linear infinite',
        'fade-in': 'fade-in .25s ease-out both',
      },
    },
  },
  plugins: [],
};
