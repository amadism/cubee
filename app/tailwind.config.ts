import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'
import defaultTheme from 'tailwindcss/defaultTheme'
import animate from 'tailwindcss-animate'

const config: Partial<Config> = {
  darkMode: ['class'],

  content: [
    './pages/**/*.{ts,tsx,vue}',
    './components/**/*.{ts,tsx,vue}',
    './app/**/*.{ts,tsx,vue}',
    './src/**/*.{ts,tsx,vue}',
    './layouts/**/*',
    '../packages/*/src/**/*',
  ],

  prefix: '',
  theme: {
    borderWidth: {
      DEFAULT: '1px',
      '0': '0',
      '2': '2px',
      '3': '3px',
      '4': '4px',
      '6': '6px',
      '8': '8px',
      '32': '32px',
    },
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      fontFamily: {
        ...defaultTheme.fontFamily,
        poppins: ['"Poppins"', ...defaultTheme.fontFamily.sans],
      },
      fontSize: {
        ...defaultTheme.fontSize,
        '2.5xl': ['1.75rem', { lineHeight: '2.1rem' }],
      },
      colors: {
        'primary-100': '#F4FBFF',
        'primary-200': '#BDE1FB',
        'primary-300': '#87C4EF',
        'primary-400': '#5DA4D7',
        'primary-500': '#316C97',
        'primary-600': '#0A3752',
        'primary-700': '#072233',
        'primary-800': '#02131E',
        'secondary-100': '#FFEBE3',
        'secondary-200': '#FBCFBD',
        'secondary-300': '#F79872',
        'secondary-400': '#D85C2B',
        'secondary-500': '#BA491D',
        'secondary-600': '#7D2705',
        'secondary-700': '#531700',
        'secondary-800': '#2F0D00',
        'gray-100': '#F5F7F8',
        'gray-200': '#E4E8EA',
        'gray-300': '#C6CBCD',
        'gray-400': '#A0AAAE',
        'gray-500': '#697174',
        'gray-600': '#40484A',
        'gray-700': '#242B2C',
        'gray-800': '#15191A',
        'gray-950': '#070D15',
        'lightblue-300': '#d1d6e4',
        'lightblue-200': '#ecf1fa',
        'lightblue-100': '#F7FAFE',
        'lightblue-50': '#F7FAFF',
        critical: '#EB6666',
        positive: '#03AB5F',
        info: '#7574d6',
      },
    },
  },
  plugins: [animate, typography],
}

export default config
