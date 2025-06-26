// Core domain types - placeholder for Phase 2
export interface User {
  id: string
  email: string
  name: string
  createdAt: Date
  updatedAt: Date
}

export interface Bucket {
  id: string
  name: string
  targetValue: number
  currentValue: number
  index: number
  userId: string
  createdAt: Date
  updatedAt: Date
}

// More types will be added in Phase 2