export * from './users'
export * from './buckets'
export * from './money-buckets'
export * from './transactions'

// Re-export all schemas for database connections
import { users } from './users'
import { buckets } from './buckets'
import { moneyBuckets } from './money-buckets'
import { depositTransactions, bucketTransactions, moneyBucketTransactions } from './transactions'

export const schema = {
  users,
  buckets,
  moneyBuckets,
  depositTransactions,
  bucketTransactions,
  moneyBucketTransactions,
}