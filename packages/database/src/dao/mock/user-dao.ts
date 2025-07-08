import type { IUserDAO } from '../interfaces.js'
import type { User, CreateUserInput, UpdateUserInput } from '../../types/index.js'

export class MockUserDAO implements IUserDAO {
  private users: Map<string, User> = new Map()
  private nextId = 1

  async findById(id: string): Promise<User | null> {
    return this.users.get(id) || null
  }

  async findByEmail(email: string): Promise<User | null> {
    for (const user of this.users.values()) {
      if (user.email === email) {
        // Return user without password hash
        const { passwordHash, ...userWithoutPassword } = user
        return userWithoutPassword as User
      }
    }
    return null
  }

  async findByEmailWithPassword(email: string): Promise<User | null> {
    for (const user of this.users.values()) {
      if (user.email === email) {
        return user
      }
    }
    return null
  }

  async create(data: CreateUserInput): Promise<User> {
    const id = `user-${this.nextId++}`
    const now = new Date()
    
    const user: User = {
      id,
      email: data.email,
      passwordHash: data.passwordHash,
      name: data.name,
      createdAt: now,
      updatedAt: now,
    }

    this.users.set(id, user)
    return user
  }

  async update(id: string, data: UpdateUserInput): Promise<User | null> {
    const existing = this.users.get(id)
    if (!existing) return null

    const updated: User = {
      ...existing,
      ...data,
      updatedAt: new Date(),
    }

    this.users.set(id, updated)
    return updated
  }

  async delete(id: string): Promise<boolean> {
    return this.users.delete(id)
  }

  async findMany(filters?: Record<string, any>): Promise<User[]> {
    return Array.from(this.users.values()).map(({ passwordHash, ...user }) => user as User)
  }

  // Test utility methods
  clear(): void {
    this.users.clear()
    this.nextId = 1
  }

  getAll(): User[] {
    return Array.from(this.users.values())
  }
}