import type { IDepositTransactionDAO, PaginatedResult, PaginationOptions } from '../interfaces.js'
import type { DepositTransaction, CreateDepositTransactionInput } from '../../types/index.js'

export class MockDepositTransactionDAO implements IDepositTransactionDAO {
  private depositTransactions: Map<string, DepositTransaction> = new Map()
  private nextId = 1

  async findById(id: string): Promise<DepositTransaction | null> {
    return this.depositTransactions.get(id) || null
  }

  async findByUserId(userId: string, options: PaginationOptions = {}): Promise<PaginatedResult<DepositTransaction>> {
    const { limit = 20, offset = 0 } = options
    
    const userTransactions = Array.from(this.depositTransactions.values())
      .filter(transaction => transaction.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    
    const total = userTransactions.length
    const items = userTransactions.slice(offset, offset + limit)

    return {
      items,
      total,
      limit,
      offset,
      hasMore: offset + limit < total,
    }
  }

  async findByUserIdWithBucketTransactions(userId: string, options: PaginationOptions = {}): Promise<DepositTransaction[]> {
    const { limit = 20, offset = 0 } = options
    
    const userTransactions = Array.from(this.depositTransactions.values())
      .filter(transaction => transaction.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(offset, offset + limit)

    return userTransactions
  }

  async create(data: CreateDepositTransactionInput): Promise<DepositTransaction> {
    const id = `deposit-${this.nextId++}`
    const now = new Date()
    
    const depositTransaction: DepositTransaction = {
      id,
      originalAmount: data.originalAmount,
      totalProcessed: data.totalProcessed,
      moneyBucketAmount: data.moneyBucketAmount,
      userId: data.userId,
      createdAt: now,
    }

    this.depositTransactions.set(id, depositTransaction)
    return depositTransaction
  }

  async update(): Promise<DepositTransaction | null> {
    throw new Error('Deposit transactions cannot be updated')
  }

  async delete(id: string): Promise<boolean> {
    return this.depositTransactions.delete(id)
  }

  async findMany(filters?: Record<string, any>): Promise<DepositTransaction[]> {
    return Array.from(this.depositTransactions.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  // Test utility methods
  clear(): void {
    this.depositTransactions.clear()
    this.nextId = 1
  }

  getAll(): DepositTransaction[] {
    return Array.from(this.depositTransactions.values())
  }
}