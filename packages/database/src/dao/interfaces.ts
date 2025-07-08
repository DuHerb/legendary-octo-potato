import type { IBaseDAO } from './base.js'
import type { PaginatedResult, PaginationOptions } from './base.js'
import type {
  User, CreateUserInput, UpdateUserInput,
  Bucket, CreateBucketInput, UpdateBucketInput, BucketReorderInput,
  MoneyBucket, CreateMoneyBucketInput, UpdateMoneyBucketInput,
  DepositTransaction, CreateDepositTransactionInput,
  BucketTransaction, CreateBucketTransactionInput,
  MoneyBucketTransaction, CreateMoneyBucketTransactionInput
} from '../types/index.js'

// User DAO interface
export interface IUserDAO extends IBaseDAO<User, CreateUserInput, UpdateUserInput> {
  findByEmail(email: string): Promise<User | null>
  findByEmailWithPassword(email: string): Promise<User | null>
}

// Bucket DAO interface
export interface IBucketDAO extends IBaseDAO<Bucket, CreateBucketInput, UpdateBucketInput> {
  findByUserId(userId: string): Promise<Bucket[]>
  findByUserIdWithPagination(userId: string, options: PaginationOptions): Promise<PaginatedResult<Bucket>>
  updatePriorities(reorderData: BucketReorderInput[]): Promise<Bucket[]>
  findActiveByUserId(userId: string): Promise<Bucket[]> // Non-locked buckets
  updateBucketState(bucketId: string, currentValue: number): Promise<Bucket | null>
}

// Money Bucket DAO interface  
export interface IMoneyBucketDAO extends IBaseDAO<MoneyBucket, CreateMoneyBucketInput, UpdateMoneyBucketInput> {
  findByUserId(userId: string): Promise<MoneyBucket | null>
  updateBalance(userId: string, newBalance: number): Promise<MoneyBucket | null>
  incrementRedistributed(userId: string, amount: number): Promise<MoneyBucket | null>
}

// Deposit Transaction DAO interface
export interface IDepositTransactionDAO extends IBaseDAO<DepositTransaction, CreateDepositTransactionInput, never> {
  findByUserId(userId: string, options?: PaginationOptions): Promise<PaginatedResult<DepositTransaction>>
  findByUserIdWithBucketTransactions(userId: string, options?: PaginationOptions): Promise<DepositTransaction[]>
}

// Bucket Transaction DAO interface
export interface IBucketTransactionDAO extends IBaseDAO<BucketTransaction, CreateBucketTransactionInput, never> {
  findByBucketId(bucketId: string, options?: PaginationOptions): Promise<PaginatedResult<BucketTransaction>>
  findByUserId(userId: string, options?: PaginationOptions): Promise<PaginatedResult<BucketTransaction>>
  findByDepositTransactionId(depositTransactionId: string): Promise<BucketTransaction[]>
  createMany(transactions: CreateBucketTransactionInput[]): Promise<BucketTransaction[]>
}

// Money Bucket Transaction DAO interface
export interface IMoneyBucketTransactionDAO extends IBaseDAO<MoneyBucketTransaction, CreateMoneyBucketTransactionInput, never> {
  findByMoneyBucketId(moneyBucketId: string, options?: PaginationOptions): Promise<PaginatedResult<MoneyBucketTransaction>>
  findByUserId(userId: string, options?: PaginationOptions): Promise<PaginatedResult<MoneyBucketTransaction>>
  findByDepositTransactionId(depositTransactionId: string): Promise<MoneyBucketTransaction[]>
  createMany(transactions: CreateMoneyBucketTransactionInput[]): Promise<MoneyBucketTransaction[]>
}