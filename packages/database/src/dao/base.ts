// Base DAO interface that all DAOs must implement
export interface IBaseDAO<T, TCreate, TUpdate> {
  findById(id: string): Promise<T | null>
  create(data: TCreate): Promise<T>
  update(id: string, data: TUpdate): Promise<T | null>
  delete(id: string): Promise<boolean>
  findMany(filters?: Record<string, any>): Promise<T[]>
}

// Common DAO result types
export interface DAOResult<T> {
  success: boolean
  data?: T
  error?: string
}

export interface PaginationOptions {
  limit?: number
  offset?: number
  orderBy?: string
  orderDirection?: 'asc' | 'desc'
}

export interface PaginatedResult<T> {
  items: T[]
  total: number
  limit: number
  offset: number
  hasMore: boolean
}