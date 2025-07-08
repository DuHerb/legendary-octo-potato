import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './src/schemas/*.ts',
  out: './src/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/envelope_budget_dev'
  },
  verbose: true,
  strict: true,
  migrations: {
    prefix: 'timestamp'
  }
})