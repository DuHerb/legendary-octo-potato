import type { IMoneyBucketDAO } from '../interfaces.js'
import type { MoneyBucket, CreateMoneyBucketInput, UpdateMoneyBucketInput } from '../../types/index.js'

export class MockMoneyBucketDAO implements IMoneyBucketDAO {
  private moneyBuckets: Map<string, MoneyBucket> = new Map()
  private nextId = 1

  async findById(id: string): Promise<MoneyBucket | null> {
    return this.moneyBuckets.get(id) || null
  }

  async findByUserId(userId: string): Promise<MoneyBucket | null> {
    for (const moneyBucket of this.moneyBuckets.values()) {
      if (moneyBucket.userId === userId) {
        return moneyBucket
      }
    }
    return null
  }

  async create(data: CreateMoneyBucketInput): Promise<MoneyBucket> {
    const id = `money-bucket-${this.nextId++}`
    const now = new Date()
    
    const moneyBucket: MoneyBucket = {
      id,
      currentValue: data.currentValue || '0',
      totalRedistributed: data.totalRedistributed || '0',
      lastRedistributionAt: data.lastRedistributionAt || null,
      userId: data.userId,
      createdAt: now,
      updatedAt: now,
    }

    this.moneyBuckets.set(id, moneyBucket)
    return moneyBucket
  }

  async update(id: string, data: UpdateMoneyBucketInput): Promise<MoneyBucket | null> {
    const existing = this.moneyBuckets.get(id)
    if (!existing) return null

    const updated: MoneyBucket = {
      ...existing,
      ...data,
      updatedAt: new Date(),
    }

    this.moneyBuckets.set(id, updated)
    return updated
  }

  async updateBalance(userId: string, newBalance: number): Promise<MoneyBucket | null> {
    const existing = await this.findByUserId(userId)
    if (!existing) return null

    const updated: MoneyBucket = {
      ...existing,
      currentValue: newBalance.toString(),
      updatedAt: new Date(),
    }

    this.moneyBuckets.set(existing.id, updated)
    return updated
  }

  async incrementRedistributed(userId: string, amount: number): Promise<MoneyBucket | null> {
    const existing = await this.findByUserId(userId)
    if (!existing) return null

    const currentRedistributed = parseFloat(existing.totalRedistributed)
    const newTotalRedistributed = currentRedistributed + amount

    const updated: MoneyBucket = {
      ...existing,
      totalRedistributed: newTotalRedistributed.toString(),
      lastRedistributionAt: new Date(),
      updatedAt: new Date(),
    }

    this.moneyBuckets.set(existing.id, updated)
    return updated
  }

  async delete(id: string): Promise<boolean> {
    return this.moneyBuckets.delete(id)
  }

  async findMany(filters?: Record<string, any>): Promise<MoneyBucket[]> {
    return Array.from(this.moneyBuckets.values())
  }

  // Test utility methods
  clear(): void {
    this.moneyBuckets.clear()
    this.nextId = 1
  }

  getAll(): MoneyBucket[] {
    return Array.from(this.moneyBuckets.values())
  }
}