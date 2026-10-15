/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        islamic: {
          bg:        '#050c1a',
          deep:      '#06102a',
          navy:      '#091432',
          card:      '#0b183d',
          cardHover: '#101f4e',
          border:    'rgba(212, 175, 55, 0.18)',
        },
        gold: {
          dim:    '#8a6d1a',
          base:   '#c9a227',
          bright: '#d4af37',
          light:  '#f0d060',
          glow:   '#fde68a',
        },
        teal: {
          dim:    '#0d4a4a',
          base:   '#0f9690',
          bright: '#14c4bb',
        },
        noor: {
          bg:          '#050c1a',
          dark:        '#06102a',
          card:        '#0b183d',
          cardHover:   '#101f4e',
          border:      'rgba(212, 175, 55, 0.18)',
          gold:        '#d4af37',
          goldLight:   '#f0d060',
          teal:        '#0f9690',
          tealLight:   '#14c4bb',
          textMuted:   '#8b9ec7',
          textLight:   '#f0e6d3',
        }
      },
      fontFamily: {
        arabic: ['"Amiri"', '"Scheherazade New"', 'Traditional Arabic', 'serif'],
        sans:   ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        title:  ['"Cinzel"', 'Georgia', 'serif'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #b8860b 0%, #d4af37 40%, #c9a227 100%)',
        'teal-gradient': 'linear-gradient(135deg, #0a7a74 0%, #0f9690 60%, #12b0aa 100%)',
        'islamic-card':  'linear-gradient(135deg, rgba(11,24,61,0.80), rgba(9,20,50,0.85))',
      },
      boxShadow: {
        'gold-sm': '0 4px 15px rgba(212, 175, 55, 0.20)',
        'gold-md': '0 6px 25px rgba(212, 175, 55, 0.25)',
        'teal-sm': '0 4px 15px rgba(15, 150, 144, 0.20)',
        'playing': '0 0 0 2px rgba(212,175,55,0.20), 0 16px 40px rgba(0,0,0,0.60)',
      },
      animation: {
        'star-spin':    'starSpin 8s linear infinite',
        'gold-pulse':   'goldPulse 2s ease-in-out infinite',
        'crescent':     'crescentSpin 1s linear infinite',
      },
    },
  },
  plugins: [],
};
