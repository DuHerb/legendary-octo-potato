import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    testTimeout: 30000, // Docker containers can be slow to start
    hookTimeout: 30000,
    teardownTimeout: 30000,
    globals: true,
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: true, // Avoid database conflicts
      },
    },
  },
})