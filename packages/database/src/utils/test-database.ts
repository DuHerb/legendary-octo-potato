import { PostgreSqlContainer, StartedPostgreSqlContainer } from 'testcontainers'
import { createDatabaseConnection, Database } from '../connection.js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import path from 'path'

export interface TestDatabaseConfig {
  postgresVersion?: string
  runMigrations?: boolean
  seedData?: boolean
}

export class TestDatabase {
  private container: StartedPostgreSqlContainer | null = null
  private connection: { db: Database; client: any; close: () => Promise<void> } | null = null

  async start(config: TestDatabaseConfig = {}): Promise<Database> {
    const { postgresVersion = '16-alpine', runMigrations = true } = config

    // Start PostgreSQL container
    this.container = await new PostgreSqlContainer(`postgres:${postgresVersion}`)
      .withDatabase('test_envelope_budget')
      .withUsername('test_user')
      .withPassword('test_password')
      .withExposedPorts(5432)
      .start()

    // Create database connection
    const connectionString = this.container.getConnectionUri()
    this.connection = createDatabaseConnection({ url: connectionString })

    // Run migrations if requested
    if (runMigrations) {
      const migrationsPath = path.join(__dirname, '../migrations')
      await migrate(this.connection.db, { migrationsFolder: migrationsPath })
    }

    return this.connection.db
  }

  async stop(): Promise<void> {
    if (this.connection) {
      await this.connection.close()
      this.connection = null
    }

    if (this.container) {
      await this.container.stop()
      this.container = null
    }
  }

  getDatabase(): Database {
    if (!this.connection) {
      throw new Error('Test database not started. Call start() first.')
    }
    return this.connection.db
  }

  getConnectionString(): string {
    if (!this.container) {
      throw new Error('Test database not started. Call start() first.')
    }
    return this.container.getConnectionUri()
  }
}

// Utility function for test setup
export async function setupTestDatabase(config?: TestDatabaseConfig): Promise<TestDatabase> {
  const testDb = new TestDatabase()
  await testDb.start(config)
  return testDb
}

// Utility function for test cleanup
export async function teardownTestDatabase(testDb: TestDatabase): Promise<void> {
  await testDb.stop()
}