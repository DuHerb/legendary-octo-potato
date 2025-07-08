import { eq, and, asc, desc, count } from 'drizzle-orm'
import type { Database } from '../../connection.js'
import type { IBucketDAO, PaginatedResult, PaginationOptions } from '../interfaces.js'
import type { Bucket, CreateBucketInput, UpdateBucketInput, BucketReorderInput } from '../../types/index.js'
import { buckets } from '../../schemas/buckets.js'

export class PostgreSQLBucketDAO implements IBucketDAO {
  constructor(private db: Database) {}

  async findById(id: string): Promise<Bucket | null> {
    const result = await this.db
      .select()
      .from(buckets)
      .where(eq(buckets.id, id))
      .limit(1)

    return result[0] || null
  }

  async findByUserId(userId: string): Promise<Bucket[]> {
    const result = await this.db
      .select()
      .from(buckets)
      .where(eq(buckets.userId, userId))
      .orderBy(asc(buckets.index))

    return result
  }

  async findByUserIdWithPagination(userId: string, options: PaginationOptions): Promise<PaginatedResult<Bucket>> {
    const { limit = 20, offset = 0, orderBy = 'index', orderDirection = 'asc' } = options

    // Get total count
    const totalResult = await this.db
      .select({ count: count() })
      .from(buckets)
      .where(eq(buckets.userId, userId))

    const total = totalResult[0]?.count || 0

    // Get paginated results
    const orderColumn = buckets[orderBy as keyof typeof buckets] || buckets.index
    const orderFn = orderDirection === 'desc' ? desc : asc

    const result = await this.db
      .select()
      .from(buckets)
      .where(eq(buckets.userId, userId))
      .orderBy(orderFn(orderColumn))
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

  async findActiveByUserId(userId: string): Promise<Bucket[]> {
    const result = await this.db
      .select()
      .from(buckets)
      .where(and(
        eq(buckets.userId, userId),
        eq(buckets.isLocked, false)
      ))
      .orderBy(asc(buckets.index))

    return result
  }

  async create(data: CreateBucketInput): Promise<Bucket> {
    const result = await this.db
      .insert(buckets)
      .values({
        ...data,
        updatedAt: new Date(),
      })
      .returning()

    return result[0]
  }

  async update(id: string, data: UpdateBucketInput): Promise<Bucket | null> {
    const result = await this.db
      .update(buckets)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(buckets.id, id))
      .returning()

    return result[0] || null
  }

  async updateBucketState(bucketId: string, currentValue: number): Promise<Bucket | null> {
    // Get current bucket to check target value
    const bucket = await this.findById(bucketId)
    if (!bucket) return null

    const targetValue = parseFloat(bucket.targetValue)
    const isFull = currentValue >= targetValue

    const result = await this.db
      .update(buckets)
      .set({
        currentValue: currentValue.toString(),
        isFull,
        updatedAt: new Date(),
      })
      .where(eq(buckets.id, bucketId))
      .returning()

    return result[0] || null
  }

  async updatePriorities(reorderData: BucketReorderInput[]): Promise<Bucket[]> {
    // Use transaction to ensure atomic updates
    return await this.db.transaction(async (tx) => {
      const updatedBuckets: Bucket[] = []

      for (const { bucketId, newIndex } of reorderData) {
        const result = await tx
          .update(buckets)
          .set({
            index: newIndex,
            updatedAt: new Date(),
          })
          .where(eq(buckets.id, bucketId))
          .returning()

        if (result[0]) {
          updatedBuckets.push(result[0])
        }
      }

      return updatedBuckets
    })
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.db
      .delete(buckets)
      .where(eq(buckets.id, id))
      .returning({ id: buckets.id })

    return result.length > 0
  }

  async findMany(filters?: Record<string, any>): Promise<Bucket[]> {
    // Basic implementation - can be enhanced with proper filtering
    const result = await this.db
      .select()
      .from(buckets)
      .orderBy(asc(buckets.index))

    return result
  }
}