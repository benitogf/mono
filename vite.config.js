import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      include: '**/*.{jsx,js}',
    })
  ],
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.js$/,
    exclude: []
  },
  optimizeDeps: {
    include: [
      '@emotion/react',
      '@emotion/styled',
      '@emotion/cache',
      '@emotion/serialize',
      '@emotion/utils',
      'react',
      'react-dom'
    ],
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    }
  },
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'build',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor code into separate chunks
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'mui-core': ['@mui/material', '@mui/icons-material'],
          'mui-x': ['@mui/x-data-grid', '@mui/x-date-pickers'],
          'mui-lab': ['@mui/lab'],
          'emotion': [
            '@emotion/react',
            '@emotion/styled',
            '@emotion/cache',
            '@emotion/serialize',
            '@emotion/utils',
            '@emotion/sheet',
            '@emotion/use-insertion-effect-with-fallbacks'
          ],
          'utils': ['lodash', 'moment', 'ky']
        }
      }
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        // Silence deprecation warnings from sass
        silenceDeprecations: ['legacy-js-api']
      }
    }
  }
})
