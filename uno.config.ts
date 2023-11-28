import { defineConfig } from '@unocss/vite'
import presetUno from '@unocss/preset-uno'

// 先不使用 presetAttributify
export default defineConfig({
  exclude: ['node_modules', 'dist', '.git', 'public'],
  presets: [
    presetUno(),
  ],
  theme: {
    colors: {
      brand: {
        1: '#D4009B',
        2: '#57D2A9', // 綠
        3: '#8082FF', // 藍
        4: '#F4A76F', // 橘
      },
      gray: {
        1: '#E9ECEF',
        2: '#4f4f4f',
        3: '#6C757D',
        4: '#BDBDBD',
        5: '#e0e0e0',
      },
      line: '#C2D7EA',
      primary: '#334155',

    },
  },
})
