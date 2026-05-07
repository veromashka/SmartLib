// vite.config.js
import { defineConfig } from "file:///sessions/gracious-wonderful-ptolemy/mnt/SmartLib/frontend/node_modules/vite/dist/node/index.js";
import react from "file:///sessions/gracious-wonderful-ptolemy/mnt/SmartLib/frontend/node_modules/@vitejs/plugin-react/dist/index.js";
import path from "node:path";
var __vite_injected_original_dirname = "/sessions/gracious-wonderful-ptolemy/mnt/SmartLib/frontend";
var _a;
var vite_config_default = defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  },
  server: {
    port: 5173,
    proxy: {
      // Forward /api to NestJS in dev so we don't deal with CORS during local work.
      "/api": {
        target: (_a = process.env.VITE_API_PROXY_TARGET) !== null && _a !== void 0 ? _a : "http://localhost:3000",
        changeOrigin: true
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvc2Vzc2lvbnMvZ3JhY2lvdXMtd29uZGVyZnVsLXB0b2xlbXkvbW50L1NtYXJ0TGliL2Zyb250ZW5kXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvc2Vzc2lvbnMvZ3JhY2lvdXMtd29uZGVyZnVsLXB0b2xlbXkvbW50L1NtYXJ0TGliL2Zyb250ZW5kL3ZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9zZXNzaW9ucy9ncmFjaW91cy13b25kZXJmdWwtcHRvbGVteS9tbnQvU21hcnRMaWIvZnJvbnRlbmQvdml0ZS5jb25maWcuanNcIjt2YXIgX2E7XG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XG5pbXBvcnQgcGF0aCBmcm9tICdub2RlOnBhdGgnO1xuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gICAgcGx1Z2luczogW3JlYWN0KCldLFxuICAgIHJlc29sdmU6IHtcbiAgICAgICAgYWxpYXM6IHtcbiAgICAgICAgICAgICdAJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjJyksXG4gICAgICAgIH0sXG4gICAgfSxcbiAgICBzZXJ2ZXI6IHtcbiAgICAgICAgcG9ydDogNTE3MyxcbiAgICAgICAgcHJveHk6IHtcbiAgICAgICAgICAgIC8vIEZvcndhcmQgL2FwaSB0byBOZXN0SlMgaW4gZGV2IHNvIHdlIGRvbid0IGRlYWwgd2l0aCBDT1JTIGR1cmluZyBsb2NhbCB3b3JrLlxuICAgICAgICAgICAgJy9hcGknOiB7XG4gICAgICAgICAgICAgICAgdGFyZ2V0OiAoX2EgPSBwcm9jZXNzLmVudi5WSVRFX0FQSV9QUk9YWV9UQVJHRVQpICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6ICdodHRwOi8vbG9jYWxob3N0OjMwMDAnLFxuICAgICAgICAgICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgfSxcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUNBLFNBQVMsb0JBQW9CO0FBQzdCLE9BQU8sV0FBVztBQUNsQixPQUFPLFVBQVU7QUFIakIsSUFBTSxtQ0FBbUM7QUFBdVQsSUFBSTtBQUtwVyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUN4QixTQUFTLENBQUMsTUFBTSxDQUFDO0FBQUEsRUFDakIsU0FBUztBQUFBLElBQ0wsT0FBTztBQUFBLE1BQ0gsS0FBSyxLQUFLLFFBQVEsa0NBQVcsT0FBTztBQUFBLElBQ3hDO0FBQUEsRUFDSjtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ0osTUFBTTtBQUFBLElBQ04sT0FBTztBQUFBO0FBQUEsTUFFSCxRQUFRO0FBQUEsUUFDSixTQUFTLEtBQUssUUFBUSxJQUFJLDJCQUEyQixRQUFRLE9BQU8sU0FBUyxLQUFLO0FBQUEsUUFDbEYsY0FBYztBQUFBLE1BQ2xCO0FBQUEsSUFDSjtBQUFBLEVBQ0o7QUFDSixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
