import { defineConfig, loadEnv } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vite.dev/config/
// Per-mode env (.env.<mode>) sets:
//   VITE_BASE_URL   — the app's own base path (Vite `base`)
//   VITE_IMAGE_BASE — where media (images/audio/video) is loaded from (see src/lib/assets.js)
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [svelte()],
    base: env.VITE_BASE_URL || '/',
  }
})
