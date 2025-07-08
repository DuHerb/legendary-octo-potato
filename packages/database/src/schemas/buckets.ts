import { pgTable, uuid, varchar, decimal, integer, boolean, timestamp } from 'drizzle-orm/pg-core'
import { users } from './users'

export const buckets = pgTable('buckets', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  targetValue: decimal('target_value', { precision: 10, scale: 2 }).notNull(),
  currentValue: decimal('current_value', { precision: 10, scale: 2 }).default('0').notNull(),
  index: integer('index').notNull(), // Priority order
  
  // Filter configuration
  filterMethod: varchar('filter_method', { length: 20 }).notNull(), // 'flat_value' | 'percentage'
  filterValue: decimal('filter_value', { precision: 10, scale: 2 }).notNull(),
  
  // Hold configuration
  hasMinimumHold: boolean('has_minimum_hold').default(false).notNull(),
  holdType: varchar('hold_type', { length: 20 }), // 'flat_value' | 'percentage'
  holdValue: decimal('hold_value', { precision: 10, scale: 2 }),
  
  // State flags
  isLocked: boolean('is_locked').default(false).notNull(),
  isFull: boolean('is_full').default(false).notNull(),
  
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})