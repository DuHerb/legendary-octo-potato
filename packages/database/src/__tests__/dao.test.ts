import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import { TestDatabase, setupTestDatabase, teardownTestDatabase } from '../utils/test-database.js'
import { PostgreSQLUserDAO } from '../dao/postgresql/user-dao.js'
import { PostgreSQLBucketDAO } from '../dao/postgresql/bucket-dao.js'
import { MockUserDAO, MockBucketDAO } from '../dao/mock/index.js'
import type { CreateUserInput, CreateBucketInput } from '../types/index.js'

describe('DAO Integration Tests', () => {
  let testDb: TestDatabase
  let userDAO: PostgreSQLUserDAO
  let bucketDAO: PostgreSQLBucketDAO

  beforeAll(async () => {
    testDb = await setupTestDatabase()
    const db = testDb.getDatabase()
    userDAO = new PostgreSQLUserDAO(db)
    bucketDAO = new PostgreSQLBucketDAO(db)
  })

  afterAll(async () => {
    await teardownTestDatabase(testDb)
  })

  describe('UserDAO', () => {
    const testUser: CreateUserInput = {
      email: 'test@example.com',
      passwordHash: 'hashedpassword123',
      name: 'Test User',
    }

    it('should create and find user by id', async () => {
      const created = await userDAO.create(testUser)
      expect(created.id).toBeDefined()
      expect(created.email).toBe(testUser.email)
      expect(created.name).toBe(testUser.name)

      const found = await userDAO.findById(created.id)
      expect(found).toEqual(created)
    })

    it('should find user by email without password', async () => {
      const created = await userDAO.create({
        ...testUser,
        email: 'nopw@example.com'
      })

      const found = await userDAO.findByEmail('nopw@example.com')
      expect(found?.email).toBe('nopw@example.com')
      expect(found?.passwordHash).toBeUndefined() // Should not include password hash
    })

    it('should find user by email with password', async () => {
      const created = await userDAO.create({
        ...testUser,
        email: 'withpw@example.com'
      })

      const found = await userDAO.findByEmailWithPassword('withpw@example.com')
      expect(found?.email).toBe('withpw@example.com')
      expect(found?.passwordHash).toBe(testUser.passwordHash)
    })
  })

  describe('BucketDAO', () => {
    let userId: string

    beforeEach(async () => {
      const user = await userDAO.create({
        email: `bucket-test-${Date.now()}@example.com`,
        passwordHash: 'hashedpassword123',
        name: 'Bucket Test User',
      })
      userId = user.id
    })

    const testBucket: Omit<CreateBucketInput, 'userId' | 'index'> = {
      name: 'Emergency Fund',
      targetValue: '1000.00',
      currentValue: '0.00',
      filterMethod: 'flat_value',
      filterValue: '100.00',
      hasMinimumHold: false,
    }

    it('should create and find bucket by id', async () => {
      const created = await bucketDAO.create({
        ...testBucket,
        userId,
        index: 0,
      })

      expect(created.id).toBeDefined()
      expect(created.name).toBe(testBucket.name)
      expect(created.userId).toBe(userId)

      const found = await bucketDAO.findById(created.id)
      expect(found).toEqual(created)
    })

    it('should find buckets by user id in correct order', async () => {
      const bucket1 = await bucketDAO.create({
        ...testBucket,
        name: 'First Bucket',
        userId,
        index: 0,
      })

      const bucket2 = await bucketDAO.create({
        ...testBucket,
        name: 'Second Bucket',
        userId,
        index: 1,
      })

      const userBuckets = await bucketDAO.findByUserId(userId)
      expect(userBuckets).toHaveLength(2)
      expect(userBuckets[0].name).toBe('First Bucket')
      expect(userBuckets[1].name).toBe('Second Bucket')
    })

    it('should update bucket state correctly', async () => {
      const created = await bucketDAO.create({
        ...testBucket,
        targetValue: '100.00',
        userId,
        index: 0,
      })

      // Update to full
      const updated = await bucketDAO.updateBucketState(created.id, 100)
      expect(updated?.isFull).toBe(true)
      expect(updated?.currentValue).toBe('100')

      // Update to partial
      const partialUpdate = await bucketDAO.updateBucketState(created.id, 50)
      expect(partialUpdate?.isFull).toBe(false)
      expect(partialUpdate?.currentValue).toBe('50')
    })
  })
})

describe('Mock DAO Tests', () => {
  let userDAO: MockUserDAO
  let bucketDAO: MockBucketDAO

  beforeEach(() => {
    userDAO = new MockUserDAO()
    bucketDAO = new MockBucketDAO()
  })

  it('should work with mock implementations', async () => {
    const user = await userDAO.create({
      email: 'mock@example.com',
      passwordHash: 'hashedpassword123',
      name: 'Mock User',
    })

    const bucket = await bucketDAO.create({
      name: 'Mock Bucket',
      targetValue: '500.00',
      currentValue: '0.00',
      filterMethod: 'percentage',
      filterValue: '10.00',
      hasMinimumHold: false,
      userId: user.id,
      index: 0,
    })

    expect(user.id).toBeDefined()
    expect(bucket.id).toBeDefined()
    expect(bucket.userId).toBe(user.id)

    const foundUser = await userDAO.findById(user.id)
    const foundBucket = await bucketDAO.findById(bucket.id)

    expect(foundUser).toEqual(user)
    expect(foundBucket).toEqual(bucket)
  })
}