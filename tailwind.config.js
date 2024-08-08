/** @type {import('tailwindcss').Config} */
import daisyui from 'daisyui'
import themes from 'daisyui/src/theming/themes'

export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {},
  },
  daisyui: {
    prefix: 'ds-',
    themes: [
      {
        light: { ...themes.winter },
      },
    ],
  },
  plugins: [daisyui],
}
