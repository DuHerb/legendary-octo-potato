import type { IBucketDAO, PaginatedResult, PaginationOptions } from '../interfaces.js'
import type { Bucket, CreateBucketInput, UpdateBucketInput, BucketReorderInput } from '../../types/index.js'

export class MockBucketDAO implements IBucketDAO {
  private buckets: Map<string, Bucket> = new Map()
  private nextId = 1

  async findById(id: string): Promise<Bucket | null> {
    return this.buckets.get(id) || null
  }

  async findByUserId(userId: string): Promise<Bucket[]> {
    return Array.from(this.buckets.values())
      .filter(bucket => bucket.userId === userId)
      .sort((a, b) => a.index - b.index)
  }

  async findByUserIdWithPagination(userId: string, options: PaginationOptions): Promise<PaginatedResult<Bucket>> {
    const { limit = 20, offset = 0 } = options
    const userBuckets = await this.findByUserId(userId)
    
    const total = userBuckets.length
    const items = userBuckets.slice(offset, offset + limit)

    return {
      items,
      total,
      limit,
      offset,
      hasMore: offset + limit < total,
    }
  }

  async findActiveByUserId(userId: string): Promise<Bucket[]> {
    return Array.from(this.buckets.values())
      .filter(bucket => bucket.userId === userId && !bucket.isLocked)
      .sort((a, b) => a.index - b.index)
  }

  async create(data: CreateBucketInput): Promise<Bucket> {
    const id = `bucket-${this.nextId++}`
    const now = new Date()
    
    const bucket: Bucket = {
      id,
      name: data.name,
      targetValue: data.targetValue,
      currentValue: data.currentValue || '0',
      index: data.index,
      filterMethod: data.filterMethod,
      filterValue: data.filterValue,
      hasMinimumHold: data.hasMinimumHold || false,
      holdType: data.holdType || null,
      holdValue: data.holdValue || null,
      isLocked: data.isLocked || false,
      isFull: data.isFull || false,
      userId: data.userId,
      createdAt: now,
      updatedAt: now,
    }

    this.buckets.set(id, bucket)
    return bucket
  }

  async update(id: string, data: UpdateBucketInput): Promise<Bucket | null> {
    const existing = this.buckets.get(id)
    if (!existing) return null

    const updated: Bucket = {
      ...existing,
      ...data,
      updatedAt: new Date(),
    }

    this.buckets.set(id, updated)
    return updated
  }

  async updateBucketState(bucketId: string, currentValue: number): Promise<Bucket | null> {
    const bucket = this.buckets.get(bucketId)
    if (!bucket) return null

    const targetValue = parseFloat(bucket.targetValue)
    const isFull = currentValue >= targetValue

    const updated: Bucket = {
      ...bucket,
      currentValue: currentValue.toString(),
      isFull,
      updatedAt: new Date(),
    }

    this.buckets.set(bucketId, updated)
    return updated
  }

  async updatePriorities(reorderData: BucketReorderInput[]): Promise<Bucket[]> {
    const updatedBuckets: Bucket[] = []

    for (const { bucketId, newIndex } of reorderData) {
      const bucket = this.buckets.get(bucketId)
      if (bucket) {
        const updated: Bucket = {
          ...bucket,
          index: newIndex,
          updatedAt: new Date(),
        }
        this.buckets.set(bucketId, updated)
        updatedBuckets.push(updated)
      }
    }

    return updatedBuckets
  }

  async delete(id: string): Promise<boolean> {
    return this.buckets.delete(id)
  }

  async findMany(filters?: Record<string, any>): Promise<Bucket[]> {
    return Array.from(this.buckets.values()).sort((a, b) => a.index - b.index)
  }

  // Test utility methods
  clear(): void {
    this.buckets.clear()
    this.nextId = 1
  }

  getAll(): Bucket[] {
    return Array.from(this.buckets.values())
  }
}