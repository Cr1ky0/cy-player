import { defineConfig } from 'vite';
import path from 'path';

const resolve = (dir: string) => {
  return path.resolve(__dirname, dir);
};
// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': resolve('./src'),
      types: resolve('./types'),
      example: resolve('./examples'),
    },
  },
});
