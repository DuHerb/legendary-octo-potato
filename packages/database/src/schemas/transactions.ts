import { pgTable, uuid, decimal, boolean, varchar, timestamp } from 'drizzle-orm/pg-core'
import { users } from './users'
import { buckets } from './buckets'
import { moneyBuckets } from './money-buckets'

export const depositTransactions = pgTable('deposit_transactions', {
  id: uuid('id').defaultRandom().primaryKey(),
  originalAmount: decimal('original_amount', { precision: 10, scale: 2 }).notNull(),
  totalProcessed: decimal('total_processed', { precision: 10, scale: 2 }).notNull(),
  moneyBucketAmount: decimal('money_bucket_amount', { precision: 10, scale: 2 }).notNull(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const bucketTransactions = pgTable('bucket_transactions', {
  id: uuid('id').defaultRandom().primaryKey(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  balanceBefore: decimal('balance_before', { precision: 10, scale: 2 }).notNull(),
  balanceAfter: decimal('balance_after', { precision: 10, scale: 2 }).notNull(),
  wasFilled: boolean('was_filled').default(false).notNull(),
  transactionType: varchar('transaction_type', { length: 50 }).notNull(), // 'deposit', 'withdrawal', 'transfer', 'redistribution'
  
  bucketId: uuid('bucket_id').references(() => buckets.id, { onDelete: 'cascade' }).notNull(),
  depositTransactionId: uuid('deposit_transaction_id').references(() => depositTransactions.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const moneyBucketTransactions = pgTable('money_bucket_transactions', {
  id: uuid('id').defaultRandom().primaryKey(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  balanceBefore: decimal('balance_before', { precision: 10, scale: 2 }).notNull(),
  balanceAfter: decimal('balance_after', { precision: 10, scale: 2 }).notNull(),
  transactionType: varchar('transaction_type', { length: 50 }).notNull(), // 'deposit', 'redistribution_out'
  
  moneyBucketId: uuid('money_bucket_id').references(() => moneyBuckets.id, { onDelete: 'cascade' }).notNull(),
  depositTransactionId: uuid('deposit_transaction_id').references(() => depositTransactions.id, { onDelete: 'cascade' }),
  targetBucketId: uuid('target_bucket_id').references(() => buckets.id, { onDelete: 'set null' }), // For redistributions
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})