/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter'],
      },
      // Instead of importing the whole colors object, let's properly map Discord colors
      colors: {
        // Keep standard Tailwind colors and add our Discord theme as proper color scales
        
        // Primary brand color (Discord blurple)
        primary: {
          50: '#EEF2FF',
          100: '#E0E7FF', 
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#5965F2', // Discord blurple
          600: '#4F46E5',
          700: '#4338CA',
          800: '#3730A3',
          900: '#312E81',
        },

        // Background system using gray scale for Discord dark theme
        gray: {
          50: '#F8FAFC',
          100: '#F5F5F5',   // Discord textPrimary
          200: '#E2E8F0',
          300: '#CBCCD1',   // Discord text (main content)
          400: '#94A3B8',
          500: '#818491',   // Discord textSecondary
          600: '#6B7280',
          700: '#404248',   // Discord hover
          800: '#24272D',   // Discord input
          850: '#1C1D23',   // Discord surface
          900: '#131317',   // Discord background (main)
          950: '#131317',
        },

        // Success (Discord green)
        emerald: {
          50: '#ECFDF5',
          100: '#D1FAE5', 
          200: '#A7F3D0',
          300: '#6EE7B7',
          400: '#34D399',
          500: '#23A55A', // Discord green
          600: '#059669',
          700: '#047857',
          800: '#065F46',
          900: '#064E3B',
        },

        // Destructive (Discord red)  
        red: {
          50: '#FEF2F2',
          100: '#FEE2E2',
          200: '#FECACA', 
          300: '#FCA5A5',
          400: '#F87171',
          500: '#ED4245', // Discord red
          600: '#DC2626',
          700: '#B91C1C',
          800: '#991B1B', 
          900: '#7F1D1D',
        },

        // Warning (Discord yellow)
        amber: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D', 
          400: '#FBBF24',
          500: '#FEE75C', // Discord yellow
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
        },

        // Discord accent blue  
        blue: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#7A8EF9', // Discord accent
          500: '#3B82F6',
          600: '#2563EB', 
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
        },
      },
      
      // Add semantic color mappings for easier usage
      backgroundColor: {
        'surface': '#1C1D23',      // Discord surface
        'elevated': '#383A43',     // Discord elevated  
        'input': '#24272D',        // Discord input
      },
      
      textColor: {
        'muted': '#818491',        // Discord textSecondary
      },
      
      borderColor: {
        'subtle': '#2E2F35',       // Discord border
        'interactive': '#383A43',   // Discord borderLight
      },
    },
  },
  plugins: [],
};
