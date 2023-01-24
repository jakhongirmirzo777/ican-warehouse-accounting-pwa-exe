import { fileURLToPath, URL } from 'url'
import { VitePWA } from 'vite-plugin-pwa'
import svgLoader from 'vite-svg-loader'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import ElementPlus from 'unplugin-element-plus/vite'
const path = require('path')

// https://vitejs.dev/config/
export default defineConfig({
  base: path.resolve(__dirname, './dist'),
  build: {
    target: 'es2020',
  },
  server: {
    port: 4000,
  },
  plugins: [
    vue(),
    svgLoader(),
    ElementPlus(),
    VitePWA({
      workbox: {
        cleanupOutdatedCaches: true,
        sourcemap: true,
      },
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'iCAN учет склада',
        short_name: 'iCAN учет склада',
        description: 'Веб-приложение iCAN для учета склада',
        start_url: '/',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  define: {
    __VUE_I18N_FULL_INSTALL__: true,
    __VUE_I18N_LEGACY_API__: false,
    __INTLIFY_PROD_DEVTOOLS__: false,
  },
})
