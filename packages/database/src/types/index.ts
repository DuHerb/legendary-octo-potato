import type { InferSelectModel, InferInsertModel } from 'drizzle-orm'
import { users, buckets, moneyBuckets, depositTransactions, bucketTransactions, moneyBucketTransactions } from '../schemas/index.js'

// Domain entity types from database schema
export type User = InferSelectModel<typeof users>
export type CreateUserInput = InferInsertModel<typeof users>
export type UpdateUserInput = Partial<Omit<CreateUserInput, 'id' | 'createdAt'>>

export type Bucket = InferSelectModel<typeof buckets>
export type CreateBucketInput = InferInsertModel<typeof buckets>
export type UpdateBucketInput = Partial<Omit<CreateBucketInput, 'id' | 'createdAt' | 'userId'>>

export type MoneyBucket = InferSelectModel<typeof moneyBuckets>
export type CreateMoneyBucketInput = InferInsertModel<typeof moneyBuckets>
export type UpdateMoneyBucketInput = Partial<Omit<CreateMoneyBucketInput, 'id' | 'createdAt' | 'userId'>>

export type DepositTransaction = InferSelectModel<typeof depositTransactions>
export type CreateDepositTransactionInput = InferInsertModel<typeof depositTransactions>

export type BucketTransaction = InferSelectModel<typeof bucketTransactions>
export type CreateBucketTransactionInput = InferInsertModel<typeof bucketTransactions>

export type MoneyBucketTransaction = InferSelectModel<typeof moneyBucketTransactions>
export type CreateMoneyBucketTransactionInput = InferInsertModel<typeof moneyBucketTransactions>

// Filter and hold configuration types
export type FilterMethod = 'flat_value' | 'percentage'
export type HoldType = 'flat_value' | 'percentage'
export type TransactionType = 'deposit' | 'withdrawal' | 'transfer' | 'redistribution'
export type MoneyBucketTransactionType = 'deposit' | 'redistribution_out'

// Reorder operation type
export interface BucketReorderInput {
  bucketId: string
  newIndex: number
}