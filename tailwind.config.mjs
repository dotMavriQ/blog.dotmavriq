/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./src/**/*.{astro,html,js,jsx,tsx,md,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'monospace']
      },
      colors: {
        gruv: {
          bg: '#1d2021',
          surface: '#282828',
          surface2: '#32302f',
          fg: '#ebdbb2',
          muted: '#a89984',
          yellow: '#fabd2f',
          orange: '#fe8019',
          red: '#fb4934',
          aqua: '#8ec07c',
          blue: '#83a598',
          green: '#b8bb26',
          purple: '#d3869b'
        }
      }
    }
  }
};
