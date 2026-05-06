import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'
import node from '@astrojs/node'
import process from 'node:process'
import 'dotenv/config'

export default defineConfig({
  output: 'server',

  adapter: node({
    mode: 'standalone',
  }),

  vite: {
    plugins: [tailwindcss()],
  },

  server: {
    host: true,
    port: Number(process.env.PORT || 3000),
  },
})