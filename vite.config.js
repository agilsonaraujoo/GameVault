import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // publicDir: 'public', // Mantém para outros assets estáticos, se houver
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Separa o firebase em seu próprio chunk, pois é uma grande dependência.
          if (id.includes('firebase')) {
            return 'firebase';
          }
          // Agrupa outras dependências do node_modules em um chunk 'vendor'.
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
  },
  base: './',
});
