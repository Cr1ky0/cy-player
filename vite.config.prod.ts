import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';
import dts from 'vite-plugin-dts';
import baseConfig from './vite.config';

const resolve = (dir: string) => {
  return path.resolve(__dirname, dir);
};
// https://vitejs.dev/config/
export default defineConfig({
  ...baseConfig,
  plugins: [
    vue(),
    cssInjectedByJsPlugin(),
    dts({ rollupTypes: true }),
    viteStaticCopy({
      targets: [
        {
          src: 'package.json',
          dest: '',
        },
        {
          src: 'README.md',
          dest: '',
        },
      ],
    }),
    createSvgIconsPlugin({
      // 指定需要缓存的图标文件夹
      iconDirs: [path.resolve(process.cwd(), 'src/assets/icons/svg')],
      // 指定symbolId格式
      symbolId: 'icon-[name]',
    }),
  ],
  build: {
    rollupOptions: {
      // 请确保外部化那些你的库中不需要的依赖
      external: ['vue'],
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          vue: 'Vue',
        },
      },
    },
    lib: {
      entry: resolve('src/index.ts'),
      name: 'cy-player',
      fileName: (format) => `index.${format}.js`,
    },
  },
});
