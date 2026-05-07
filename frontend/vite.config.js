var _a;
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    server: {
        port: 5173,
        proxy: {
            // Forward /api to NestJS in dev so we don't deal with CORS during local work.
            '/api': {
                target: (_a = process.env.VITE_API_PROXY_TARGET) !== null && _a !== void 0 ? _a : 'http://localhost:3000',
                changeOrigin: true,
            },
        },
    },
});
