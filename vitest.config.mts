import { defineConfig } from 'vitest/config';
import { resolve } from 'node:path';

export default defineConfig({
  resolve: {
    alias: { '@': resolve(__dirname, '.') },
  },
  test: {
    environment: 'node',
    include: ['tests/unit/**/*.test.ts'],
    reporters: 'verbose',
    coverage: {
      provider: 'v8',
      include: ['lib/**/*.ts', 'content/**/*.ts'],
      exclude: ['lib/i18n-request.ts', 'lib/prisma.ts', 'lib/auth.ts'],
    },
  },
});
