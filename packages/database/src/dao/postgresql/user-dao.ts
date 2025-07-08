import { eq } from 'drizzle-orm'
import type { Database } from '../../connection.js'
import type { IUserDAO } from '../interfaces.js'
import type { User, CreateUserInput, UpdateUserInput } from '../../types/index.js'
import { users } from '../../schemas/users.js'

export class PostgreSQLUserDAO implements IUserDAO {
  constructor(private db: Database) {}

  async findById(id: string): Promise<User | null> {
    const result = await this.db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1)

    return result[0] || null
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await this.db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .where(eq(users.email, email))
      .limit(1)

    return result[0] || null
  }

  async findByEmailWithPassword(email: string): Promise<User | null> {
    const result = await this.db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1)

    return result[0] || null
  }

  async create(data: CreateUserInput): Promise<User> {
    const result = await this.db
      .insert(users)
      .values({
        ...data,
        updatedAt: new Date(),
      })
      .returning()

    return result[0]
  }

  async update(id: string, data: UpdateUserInput): Promise<User | null> {
    const result = await this.db
      .update(users)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning()

    return result[0] || null
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.db
      .delete(users)
      .where(eq(users.id, id))
      .returning({ id: users.id })

    return result.length > 0
  }

  async findMany(filters?: Record<string, any>): Promise<User[]> {
    // Basic implementation - can be enhanced with proper filtering
    const result = await this.db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)

    return result
  }
}