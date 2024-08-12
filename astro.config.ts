import { resolve } from 'node:path'
import { cwd } from 'node:process'
import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'
import solid from '@astrojs/solid-js'

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), solid({ devtools: true })],
  vite: {
    resolve: {
      alias: {
        '@': resolve(cwd(), './src'),
      },
    },
  },
})
