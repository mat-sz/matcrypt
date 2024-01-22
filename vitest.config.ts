import { defineConfig } from 'vitest/config';

// https://vitejs.dev/config/
export default defineConfig(() => ({
  name: 'matcrypt',
  test: {
    globals: true,
  },
}));
