import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import AutoImport from 'unplugin-auto-import/vite' // 自動導入 hook
import Components from 'unplugin-vue-components/vite' // 自動引入 components
import Unocss from 'unocss/vite';
import { createRequire } from 'node:module';
const require = createRequire( import.meta.url );
// https://vitejs.dev/config/
export default defineConfig({
  // base: '/2023F2E-Week2/',
  plugins: [
    vue(),
    AutoImport({
      include: [
        /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
        /\.vue$/, /\.vue\?vue/, // .vue
        /\.md$/, // .md
      ],
      imports: ['vue','vue-router'],
      eslintrc: {
        enabled: false,
      },
      dts: './auto-imports.d.ts',
    }),
    Components({
      dts: './components.d.ts',
    }),
    Unocss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
})
