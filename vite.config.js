import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // publicDir: 'public', // Mantém para outros assets estáticos, se houver
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    // Vite procurará por index.html na raiz do projeto por padrão
  },
  base: './',
});
