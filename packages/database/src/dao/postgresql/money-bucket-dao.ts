import { eq } from 'drizzle-orm'
import type { Database } from '../../connection.js'
import type { IMoneyBucketDAO } from '../interfaces.js'
import type { MoneyBucket, CreateMoneyBucketInput, UpdateMoneyBucketInput } from '../../types/index.js'
import { moneyBuckets } from '../../schemas/money-buckets.js'

export class PostgreSQLMoneyBucketDAO implements IMoneyBucketDAO {
  constructor(private db: Database) {}

  async findById(id: string): Promise<MoneyBucket | null> {
    const result = await this.db
      .select()
      .from(moneyBuckets)
      .where(eq(moneyBuckets.id, id))
      .limit(1)

    return result[0] || null
  }

  async findByUserId(userId: string): Promise<MoneyBucket | null> {
    const result = await this.db
      .select()
      .from(moneyBuckets)
      .where(eq(moneyBuckets.userId, userId))
      .limit(1)

    return result[0] || null
  }

  async create(data: CreateMoneyBucketInput): Promise<MoneyBucket> {
    const result = await this.db
      .insert(moneyBuckets)
      .values({
        ...data,
        updatedAt: new Date(),
      })
      .returning()

    return result[0]
  }

  async update(id: string, data: UpdateMoneyBucketInput): Promise<MoneyBucket | null> {
    const result = await this.db
      .update(moneyBuckets)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(moneyBuckets.id, id))
      .returning()

    return result[0] || null
  }

  async updateBalance(userId: string, newBalance: number): Promise<MoneyBucket | null> {
    const result = await this.db
      .update(moneyBuckets)
      .set({
        currentValue: newBalance.toString(),
        updatedAt: new Date(),
      })
      .where(eq(moneyBuckets.userId, userId))
      .returning()

    return result[0] || null
  }

  async incrementRedistributed(userId: string, amount: number): Promise<MoneyBucket | null> {
    // Get current money bucket
    const current = await this.findByUserId(userId)
    if (!current) return null

    const currentRedistributed = parseFloat(current.totalRedistributed)
    const newTotalRedistributed = currentRedistributed + amount

    const result = await this.db
      .update(moneyBuckets)
      .set({
        totalRedistributed: newTotalRedistributed.toString(),
        lastRedistributionAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(moneyBuckets.userId, userId))
      .returning()

    return result[0] || null
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.db
      .delete(moneyBuckets)
      .where(eq(moneyBuckets.id, id))
      .returning({ id: moneyBuckets.id })

    return result.length > 0
  }

  async findMany(filters?: Record<string, any>): Promise<MoneyBucket[]> {
    const result = await this.db
      .select()
      .from(moneyBuckets)

    return result
  }
}