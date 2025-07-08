import { pgTable, uuid, decimal, timestamp } from 'drizzle-orm/pg-core'
import { users } from './users'

export const moneyBuckets = pgTable('money_buckets', {
  id: uuid('id').defaultRandom().primaryKey(),
  currentValue: decimal('current_value', { precision: 10, scale: 2 }).default('0').notNull(),
  totalRedistributed: decimal('total_redistributed', { precision: 10, scale: 2 }).default('0').notNull(),
  lastRedistributionAt: timestamp('last_redistribution_at'),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})