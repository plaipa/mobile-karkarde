import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

const { version } = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8')) as { version: string }

export default defineConfig({
  // The site shows its own version (package.json) so testers can say which build they saw.
  define: { __APP_VERSION__: JSON.stringify(version) },
  // Mirrors "paths" in tsconfig.app.json.
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  plugins: [
    react(),
    VitePWA({
      // Ask before switching versions: the app shows an «update» banner (features/app-update).
      registerType: 'prompt',
      injectRegister: false,
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'موبایل کارکرده',
        short_name: 'موبایل کارکرده',
        description: 'بازار ویژهٔ همکاران برای خرید و فروش موبایل، ساعت هوشمند و اسپیکر کارکرده',
        lang: 'fa',
        dir: 'rtl',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        theme_color: '#111214',
        background_color: '#FFFFFF',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      // clientsClaim: the first install controls the open page too, so «update» can swap it.
      workbox: { navigateFallback: '/index.html', clientsClaim: true },
    }),
  ],
})
