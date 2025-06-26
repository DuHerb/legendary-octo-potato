// Zod validation schemas - placeholder for Phase 2
import { z } from 'zod'

export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().min(1).max(255),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const bucketSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(255),
  targetValue: z.number().positive(),
  currentValue: z.number().min(0),
  index: z.number().int().min(0),
  userId: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

// More schemas will be added in Phase 2