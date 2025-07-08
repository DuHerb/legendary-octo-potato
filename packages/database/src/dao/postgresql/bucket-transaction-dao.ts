import { eq, desc, count } from 'drizzle-orm'
import type { Database } from '../../connection.js'
import type { IBucketTransactionDAO, PaginatedResult, PaginationOptions } from '../interfaces.js'
import type { BucketTransaction, CreateBucketTransactionInput } from '../../types/index.js'
import { bucketTransactions } from '../../schemas/transactions.js'

export class PostgreSQLBucketTransactionDAO implements IBucketTransactionDAO {
  constructor(private db: Database) {}

  async findById(id: string): Promise<BucketTransaction | null> {
    const result = await this.db
      .select()
      .from(bucketTransactions)
      .where(eq(bucketTransactions.id, id))
      .limit(1)

    return result[0] || null
  }

  async findByBucketId(bucketId: string, options: PaginationOptions = {}): Promise<PaginatedResult<BucketTransaction>> {
    const { limit = 20, offset = 0 } = options

    // Get total count
    const totalResult = await this.db
      .select({ count: count() })
      .from(bucketTransactions)
      .where(eq(bucketTransactions.bucketId, bucketId))

    const total = totalResult[0]?.count || 0

    // Get paginated results
    const result = await this.db
      .select()
      .from(bucketTransactions)
      .where(eq(bucketTransactions.bucketId, bucketId))
      .orderBy(desc(bucketTransactions.createdAt))
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

  async findByUserId(userId: string, options: PaginationOptions = {}): Promise<PaginatedResult<BucketTransaction>> {
    const { limit = 20, offset = 0 } = options

    // Get total count
    const totalResult = await this.db
      .select({ count: count() })
      .from(bucketTransactions)
      .where(eq(bucketTransactions.userId, userId))

    const total = totalResult[0]?.count || 0

    // Get paginated results
    const result = await this.db
      .select()
      .from(bucketTransactions)
      .where(eq(bucketTransactions.userId, userId))
      .orderBy(desc(bucketTransactions.createdAt))
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

  async findByDepositTransactionId(depositTransactionId: string): Promise<BucketTransaction[]> {
    const result = await this.db
      .select()
      .from(bucketTransactions)
      .where(eq(bucketTransactions.depositTransactionId, depositTransactionId))
      .orderBy(desc(bucketTransactions.createdAt))

    return result
  }

  async create(data: CreateBucketTransactionInput): Promise<BucketTransaction> {
    const result = await this.db
      .insert(bucketTransactions)
      .values(data)
      .returning()

    return result[0]
  }

  async createMany(transactions: CreateBucketTransactionInput[]): Promise<BucketTransaction[]> {
    if (transactions.length === 0) return []

    const result = await this.db
      .insert(bucketTransactions)
      .values(transactions)
      .returning()

    return result
  }

  async update(): Promise<BucketTransaction | null> {
    // Bucket transactions are immutable - no updates allowed
    throw new Error('Bucket transactions cannot be updated')
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.db
      .delete(bucketTransactions)
      .where(eq(bucketTransactions.id, id))
      .returning({ id: bucketTransactions.id })

    return result.length > 0
  }

  async findMany(filters?: Record<string, any>): Promise<BucketTransaction[]> {
    const result = await this.db
      .select()
      .from(bucketTransactions)
      .orderBy(desc(bucketTransactions.createdAt))

    return result
  }
}