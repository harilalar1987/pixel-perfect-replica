import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    include: ['src/**/*.test.{ts,tsx,js,jsx}', 'src/**/__tests__/**/*.test.{ts,js}', 'test/**/*.test.{js,ts}'],
    environment: 'node',
    passWithNoTests: false,
  },
});
