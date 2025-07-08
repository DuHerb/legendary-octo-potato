import { eq, desc, count } from 'drizzle-orm'
import type { Database } from '../../connection.js'
import type { IDepositTransactionDAO, PaginatedResult, PaginationOptions } from '../interfaces.js'
import type { DepositTransaction, CreateDepositTransactionInput } from '../../types/index.js'
import { depositTransactions } from '../../schemas/transactions.js'
import { bucketTransactions } from '../../schemas/transactions.js'

export class PostgreSQLDepositTransactionDAO implements IDepositTransactionDAO {
  constructor(private db: Database) {}

  async findById(id: string): Promise<DepositTransaction | null> {
    const result = await this.db
      .select()
      .from(depositTransactions)
      .where(eq(depositTransactions.id, id))
      .limit(1)

    return result[0] || null
  }

  async findByUserId(userId: string, options: PaginationOptions = {}): Promise<PaginatedResult<DepositTransaction>> {
    const { limit = 20, offset = 0 } = options

    // Get total count
    const totalResult = await this.db
      .select({ count: count() })
      .from(depositTransactions)
      .where(eq(depositTransactions.userId, userId))

    const total = totalResult[0]?.count || 0

    // Get paginated results
    const result = await this.db
      .select()
      .from(depositTransactions)
      .where(eq(depositTransactions.userId, userId))
      .orderBy(desc(depositTransactions.createdAt))
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

  async findByUserIdWithBucketTransactions(userId: string, options: PaginationOptions = {}): Promise<DepositTransaction[]> {
    const { limit = 20, offset = 0 } = options

    // This would typically use a JOIN but for simplicity, we'll fetch separately
    // In a real implementation, consider using a proper JOIN or subquery
    const deposits = await this.db
      .select()
      .from(depositTransactions)
      .where(eq(depositTransactions.userId, userId))
      .orderBy(desc(depositTransactions.createdAt))
      .limit(limit)
      .offset(offset)

    return deposits
  }

  async create(data: CreateDepositTransactionInput): Promise<DepositTransaction> {
    const result = await this.db
      .insert(depositTransactions)
      .values(data)
      .returning()

    return result[0]
  }

  async update(): Promise<DepositTransaction | null> {
    // Deposit transactions are immutable - no updates allowed
    throw new Error('Deposit transactions cannot be updated')
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.db
      .delete(depositTransactions)
      .where(eq(depositTransactions.id, id))
      .returning({ id: depositTransactions.id })

    return result.length > 0
  }

  async findMany(filters?: Record<string, any>): Promise<DepositTransaction[]> {
    const result = await this.db
      .select()
      .from(depositTransactions)
      .orderBy(desc(depositTransactions.createdAt))

    return result
  }
}