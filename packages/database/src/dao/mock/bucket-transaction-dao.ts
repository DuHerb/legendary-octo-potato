import type { IBucketTransactionDAO, PaginatedResult, PaginationOptions } from '../interfaces.js'
import type { BucketTransaction, CreateBucketTransactionInput } from '../../types/index.js'

export class MockBucketTransactionDAO implements IBucketTransactionDAO {
  private bucketTransactions: Map<string, BucketTransaction> = new Map()
  private nextId = 1

  async findById(id: string): Promise<BucketTransaction | null> {
    return this.bucketTransactions.get(id) || null
  }

  async findByBucketId(bucketId: string, options: PaginationOptions = {}): Promise<PaginatedResult<BucketTransaction>> {
    const { limit = 20, offset = 0 } = options
    
    const bucketTxns = Array.from(this.bucketTransactions.values())
      .filter(transaction => transaction.bucketId === bucketId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    
    const total = bucketTxns.length
    const items = bucketTxns.slice(offset, offset + limit)

    return {
      items,
      total,
      limit,
      offset,
      hasMore: offset + limit < total,
    }
  }

  async findByUserId(userId: string, options: PaginationOptions = {}): Promise<PaginatedResult<BucketTransaction>> {
    const { limit = 20, offset = 0 } = options
    
    const userTxns = Array.from(this.bucketTransactions.values())
      .filter(transaction => transaction.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    
    const total = userTxns.length
    const items = userTxns.slice(offset, offset + limit)

    return {
      items,
      total,
      limit,
      offset,
      hasMore: offset + limit < total,
    }
  }

  async findByDepositTransactionId(depositTransactionId: string): Promise<BucketTransaction[]> {
    return Array.from(this.bucketTransactions.values())
      .filter(transaction => transaction.depositTransactionId === depositTransactionId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  async create(data: CreateBucketTransactionInput): Promise<BucketTransaction> {
    const id = `bucket-txn-${this.nextId++}`
    const now = new Date()
    
    const bucketTransaction: BucketTransaction = {
      id,
      amount: data.amount,
      balanceBefore: data.balanceBefore,
      balanceAfter: data.balanceAfter,
      wasFilled: data.wasFilled || false,
      transactionType: data.transactionType,
      bucketId: data.bucketId,
      depositTransactionId: data.depositTransactionId || null,
      userId: data.userId,
      createdAt: now,
    }

    this.bucketTransactions.set(id, bucketTransaction)
    return bucketTransaction
  }

  async createMany(transactions: CreateBucketTransactionInput[]): Promise<BucketTransaction[]> {
    const results: BucketTransaction[] = []
    
    for (const txnData of transactions) {
      const created = await this.create(txnData)
      results.push(created)
    }
    
    return results
  }

  async update(): Promise<BucketTransaction | null> {
    throw new Error('Bucket transactions cannot be updated')
  }

  async delete(id: string): Promise<boolean> {
    return this.bucketTransactions.delete(id)
  }

  async findMany(filters?: Record<string, any>): Promise<BucketTransaction[]> {
    return Array.from(this.bucketTransactions.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  // Test utility methods
  clear(): void {
    this.bucketTransactions.clear()
    this.nextId = 1
  }

  getAll(): BucketTransaction[] {
    return Array.from(this.bucketTransactions.values())
  }
}