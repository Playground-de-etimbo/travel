import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  const isPreview = process.argv.includes('preview')
  const certDir = path.resolve(__dirname, '.cert')
  const certFile = path.join(certDir, 'localhost.pem')
  const keyFile = path.join(certDir, 'localhost-key.pem')

  return {
    plugins: [react()],
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom'],
            'map': ['react-simple-maps', 'd3-geo'],
            'ui': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-slot', '@radix-ui/react-accordion', '@radix-ui/react-alert-dialog', 'lucide-react'],
          },
        },
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      host: true,
      https:
        command === 'serve' && !isPreview
          ? {
              cert: fs.readFileSync(certFile),
              key: fs.readFileSync(keyFile),
            }
          : undefined,
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/test/setup.ts',
      include: ['src/**/*.{test,spec}.{ts,tsx}'],
      exclude: ['e2e/**', 'node_modules/**'],
      server: {
        deps: {
          inline: ['react-simple-maps'],
        },
      },
    },
  }
})
