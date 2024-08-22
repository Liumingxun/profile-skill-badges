import { resolve } from 'node:path'
import { cwd } from 'node:process'
import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'
import solid from '@astrojs/solid-js'

// https://astro.build/config
export default defineConfig({
  output: 'hybrid',
  site: 'https://badge.limx.fun',
  integrations: [tailwind(), solid({ devtools: !!import.meta.env.DEV })],
  vite: {
    resolve: {
      alias: {
        '@': resolve(cwd(), './src'),
      },
    },
  },
})
