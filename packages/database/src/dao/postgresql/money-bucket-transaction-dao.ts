import { eq, desc, count } from 'drizzle-orm'
import type { Database } from '../../connection.js'
import type { IMoneyBucketTransactionDAO, PaginatedResult, PaginationOptions } from '../interfaces.js'
import type { MoneyBucketTransaction, CreateMoneyBucketTransactionInput } from '../../types/index.js'
import { moneyBucketTransactions } from '../../schemas/transactions.js'

export class PostgreSQLMoneyBucketTransactionDAO implements IMoneyBucketTransactionDAO {
  constructor(private db: Database) {}

  async findById(id: string): Promise<MoneyBucketTransaction | null> {
    const result = await this.db
      .select()
      .from(moneyBucketTransactions)
      .where(eq(moneyBucketTransactions.id, id))
      .limit(1)

    return result[0] || null
  }

  async findByMoneyBucketId(moneyBucketId: string, options: PaginationOptions = {}): Promise<PaginatedResult<MoneyBucketTransaction>> {
    const { limit = 20, offset = 0 } = options

    // Get total count
    const totalResult = await this.db
      .select({ count: count() })
      .from(moneyBucketTransactions)
      .where(eq(moneyBucketTransactions.moneyBucketId, moneyBucketId))

    const total = totalResult[0]?.count || 0

    // Get paginated results
    const result = await this.db
      .select()
      .from(moneyBucketTransactions)
      .where(eq(moneyBucketTransactions.moneyBucketId, moneyBucketId))
      .orderBy(desc(moneyBucketTransactions.createdAt))
      .limit(limit)
      .offset(offset)

    return {
      items: result,
      total,
      limit,
      offset,
      hasMore: offset + limit < total,
    }
  }

  async findByUserId(userId: string, options: PaginationOptions = {}): Promise<PaginatedResult<MoneyBucketTransaction>> {
    const { limit = 20, offset = 0 } = options

    // Get total count
    const totalResult = await this.db
      .select({ count: count() })
      .from(moneyBucketTransactions)
      .where(eq(moneyBucketTransactions.userId, userId))

    const total = totalResult[0]?.count || 0

    // Get paginated results
    const result = await this.db
      .select()
      .from(moneyBucketTransactions)
      .where(eq(moneyBucketTransactions.userId, userId))
      .orderBy(desc(moneyBucketTransactions.createdAt))
      .limit(limit)
      .offset(offset)

    return {
      items: result,
      total,
      limit,
      offset,
      hasMore: offset + limit < total,
    }
  }

  async findByDepositTransactionId(depositTransactionId: string): Promise<MoneyBucketTransaction[]> {
    const result = await this.db
      .select()
      .from(moneyBucketTransactions)
      .where(eq(moneyBucketTransactions.depositTransactionId, depositTransactionId))
      .orderBy(desc(moneyBucketTransactions.createdAt))

    return result
  }

  async create(data: CreateMoneyBucketTransactionInput): Promise<MoneyBucketTransaction> {
    const result = await this.db
      .insert(moneyBucketTransactions)
      .values(data)
      .returning()

    return result[0]
  }

  async createMany(transactions: CreateMoneyBucketTransactionInput[]): Promise<MoneyBucketTransaction[]> {
    if (transactions.length === 0) return []

    const result = await this.db
      .insert(moneyBucketTransactions)
      .values(transactions)
      .returning()

    return result
  }

  async update(): Promise<MoneyBucketTransaction | null> {
    // Money bucket transactions are immutable - no updates allowed
    throw new Error('Money bucket transactions cannot be updated')
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.db
      .delete(moneyBucketTransactions)
      .where(eq(moneyBucketTransactions.id, id))
      .returning({ id: moneyBucketTransactions.id })

    return result.length > 0
  }

  async findMany(filters?: Record<string, any>): Promise<MoneyBucketTransaction[]> {
    const result = await this.db
      .select()
      .from(moneyBucketTransactions)
      .orderBy(desc(moneyBucketTransactions.createdAt))

    return result
  }
}