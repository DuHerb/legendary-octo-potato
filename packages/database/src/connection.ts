import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { schema } from './schemas/index.js'

export interface DatabaseConfig {
  url: string
  max?: number
  idle_timeout?: number
  connect_timeout?: number
}

export function createDatabaseConnection(config: DatabaseConfig) {
  const client = postgres(config.url, {
    max: config.max ?? 10,
    idle_timeout: config.idle_timeout ?? 20,
    connect_timeout: config.connect_timeout ?? 10,
  })

  const db = drizzle(client, { schema })

  return {
    db,
    client,
    close: () => client.end(),
  }
}

export type Database = ReturnType<typeof createDatabaseConnection>['db']