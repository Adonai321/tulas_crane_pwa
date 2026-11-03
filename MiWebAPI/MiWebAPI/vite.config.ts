import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

const __dirname = import.meta.dirname;

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@app': path.resolve(__dirname, './src/app'),
            '@pwa': path.resolve(__dirname, './src/pwa'),
            '@features': path.resolve(__dirname, './src/features'),
            '@shared': path.resolve(__dirname, './src/shared'),
        },
    },
});