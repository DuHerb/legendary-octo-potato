import type { IMoneyBucketTransactionDAO, PaginatedResult, PaginationOptions } from '../interfaces.js'
import type { MoneyBucketTransaction, CreateMoneyBucketTransactionInput } from '../../types/index.js'

export class MockMoneyBucketTransactionDAO implements IMoneyBucketTransactionDAO {
  private moneyBucketTransactions: Map<string, MoneyBucketTransaction> = new Map()
  private nextId = 1

  async findById(id: string): Promise<MoneyBucketTransaction | null> {
    return this.moneyBucketTransactions.get(id) || null
  }

  async findByMoneyBucketId(moneyBucketId: string, options: PaginationOptions = {}): Promise<PaginatedResult<MoneyBucketTransaction>> {
    const { limit = 20, offset = 0 } = options
    
    const mbTxns = Array.from(this.moneyBucketTransactions.values())
      .filter(transaction => transaction.moneyBucketId === moneyBucketId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    
    const total = mbTxns.length
    const items = mbTxns.slice(offset, offset + limit)

    return {
      items,
      total,
      limit,
      offset,
      hasMore: offset + limit < total,
    }
  }

  async findByUserId(userId: string, options: PaginationOptions = {}): Promise<PaginatedResult<MoneyBucketTransaction>> {
    const { limit = 20, offset = 0 } = options
    
    const userTxns = Array.from(this.moneyBucketTransactions.values())
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

  async findByDepositTransactionId(depositTransactionId: string): Promise<MoneyBucketTransaction[]> {
    return Array.from(this.moneyBucketTransactions.values())
      .filter(transaction => transaction.depositTransactionId === depositTransactionId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  async create(data: CreateMoneyBucketTransactionInput): Promise<MoneyBucketTransaction> {
    const id = `mb-txn-${this.nextId++}`
    const now = new Date()
    
    const mbTransaction: MoneyBucketTransaction = {
      id,
      amount: data.amount,
      balanceBefore: data.balanceBefore,
      balanceAfter: data.balanceAfter,
      transactionType: data.transactionType,
      moneyBucketId: data.moneyBucketId,
      depositTransactionId: data.depositTransactionId || null,
      targetBucketId: data.targetBucketId || null,
      userId: data.userId,
      createdAt: now,
    }

    this.moneyBucketTransactions.set(id, mbTransaction)
    return mbTransaction
  }

  async createMany(transactions: CreateMoneyBucketTransactionInput[]): Promise<MoneyBucketTransaction[]> {
    const results: MoneyBucketTransaction[] = []
    
    for (const txnData of transactions) {
      const created = await this.create(txnData)
      results.push(created)
    }
    
    return results
  }

  async update(): Promise<MoneyBucketTransaction | null> {
    throw new Error('Money bucket transactions cannot be updated')
  }

  async delete(id: string): Promise<boolean> {
    return this.moneyBucketTransactions.delete(id)
  }

  async findMany(filters?: Record<string, any>): Promise<MoneyBucketTransaction[]> {
    return Array.from(this.moneyBucketTransactions.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  // Test utility methods
  clear(): void {
    this.moneyBucketTransactions.clear()
    this.nextId = 1
  }

  getAll(): MoneyBucketTransaction[] {
    return Array.from(this.moneyBucketTransactions.values())
  }
}