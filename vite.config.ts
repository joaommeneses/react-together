import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import ViteYaml from '@modyfi/vite-plugin-yaml'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [
    ViteYaml(),
    react(),
    tsconfigPaths(),
  ]
})
