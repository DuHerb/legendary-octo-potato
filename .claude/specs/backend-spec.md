# Backend Architecture Specification

## Fastify Framework Choice

### Why Fastify over Alternatives

**Fastify vs Express:**
- **TypeScript-first design** with excellent type inference
- **High performance** (one of the fastest Node.js frameworks)
- **Plugin ecosystem** with type safety
- **JSON Schema validation** built-in (works with Zod)
- **Excellent documentation** and mature ecosystem

**Fastify vs Hono:**
- **More mature ecosystem** with extensive plugin support
- **Better TypeScript integration** for complex applications
- **Built-in validation and serialization**
- **Better error handling patterns**

**Fastify vs NestJS:**
- **Lighter weight** without unnecessary complexity
- **More flexible** architecture without decorator dependency
- **Faster startup time** and better performance
- **Simpler learning curve** for TypeScript developers

## DAO Pattern Implementation

### Abstract DAO Interface
```typescript
interface IBaseDAO<T, TCreate, TUpdate> {
  findById(id: string): Promise<T | null>
  create(data: TCreate): Promise<T>
  update(id: string, data: TUpdate): Promise<T | null>
  delete(id: string): Promise<boolean>
  findMany(filters?: Record<string, any>): Promise<T[]>
}

// Concrete implementations
class PostgreSQLEnvelopeDAO implements IEnvelopeDAO {
  // Drizzle implementation
}

class MockEnvelopeDAO implements IEnvelopeDAO {
  // In-memory implementation for testing
}

class SQLiteEnvelopeDAO implements IEnvelopeDAO {
  // SQLite implementation (future)
}
```

### DAO Pattern Benefits
- **Database Agnostic**: Easy to switch from PostgreSQL to MySQL/SQLite
- **Testable**: Mock implementations for unit testing
- **Separation of Concerns**: Business logic separate from data access
- **Type Safety**: Full TypeScript support across layers

## Backend Project Structure

```
apps/api/src/
├── routes/                    # Route handlers
│   ├── auth/
│   │   ├── login.ts
│   │   ├── register.ts
│   │   └── refresh.ts
│   ├── buckets/
│   │   ├── create.ts
│   │   ├── reorder.ts
│   │   ├── lock.ts
│   │   └── deposit.ts
│   ├── deposits/
│   │   ├── process.ts
│   │   └── history.ts
│   └── money-bucket/
│       ├── balance.ts
│       ├── redistribute.ts
│       └── history.ts
├── services/                  # Business logic layer
│   ├── AuthService.ts
│   ├── BucketService.ts
│   ├── DepositService.ts
│   └── MoneyBucketService.ts
├── middleware/                # Fastify middleware
│   ├── auth.ts
│   ├── validation.ts
│   ├── errorHandler.ts
│   └── cors.ts
├── plugins/                   # Fastify plugins
│   ├── database.ts
│   ├── cors.ts
│   ├── swagger.ts
│   └── auth.ts
├── types/                     # API-specific types
│   ├── auth.ts
│   ├── buckets.ts
│   └── deposits.ts
├── utils/                     # Utility functions
│   ├── jwt.ts
│   ├── password.ts
│   └── validation.ts
└── app.ts                     # Fastify app setup
```

## Fastify Application Setup

### Main Application File
```typescript
// apps/api/src/app.ts
import Fastify from 'fastify'
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import swagger from '@fastify/swagger'
import swaggerUI from '@fastify/swagger-ui'

// Plugins
import databasePlugin from './plugins/database'
import authPlugin from './plugins/auth'

// Routes
import authRoutes from './routes/auth'
import bucketRoutes from './routes/buckets'
import depositRoutes from './routes/deposits'
import moneyBucketRoutes from './routes/money-bucket'

export const createApp = (opts = {}) => {
  const app = Fastify({
    logger: true,
    ...opts
  }).withTypeProvider<TypeBoxTypeProvider>()

  // Register plugins
  app.register(cors, {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000'
  })
  
  app.register(jwt, {
    secret: process.env.JWT_SECRET!
  })
  
  app.register(swagger, {
    swagger: {
      info: {
        title: 'Envelope Budget API',
        description: 'API for envelope budgeting application',
        version: '1.0.0'
      }
    }
  })
  
  app.register(swaggerUI, {
    routePrefix: '/docs'
  })

  // Register custom plugins
  app.register(databasePlugin)
  app.register(authPlugin)

  // Register routes
  app.register(authRoutes, { prefix: '/auth' })
  app.register(bucketRoutes, { prefix: '/buckets' })
  app.register(depositRoutes, { prefix: '/deposits' })
  app.register(moneyBucketRoutes, { prefix: '/money-bucket' })

  return app
}
```

### Database Plugin
```typescript
// apps/api/src/plugins/database.ts
import { FastifyPluginAsync } from 'fastify'
import fp from 'fastify-plugin'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from '@envelope-budget/database/schemas'

declare module 'fastify' {
  interface FastifyInstance {
    db: ReturnType<typeof drizzle>
  }
}

const databasePlugin: FastifyPluginAsync = async (fastify) => {
  const connectionString = process.env.DATABASE_URL!
  
  const client = postgres(connectionString)
  const db = drizzle(client, { schema })
  
  fastify.decorate('db', db)
  
  fastify.addHook('onClose', async () => {
    await client.end()
  })
}

export default fp(databasePlugin)
```

## Service Layer Architecture

### Bucket Service
```typescript
// apps/api/src/services/BucketService.ts
import { BucketDAO } from '@envelope-budget/database/dao'
import { Bucket, CreateBucketInput, UpdateBucketInput } from '@envelope-budget/shared/types'

export class BucketService {
  constructor(private bucketDAO: BucketDAO) {}

  async createBucket(input: CreateBucketInput, userId: string): Promise<Bucket> {
    // Validate input
    const validatedInput = createBucketSchema.parse(input)
    
    // Get current max index for user
    const userBuckets = await this.bucketDAO.findByUserId(userId)
    const maxIndex = Math.max(...userBuckets.map(b => b.index), -1)
    
    // Create bucket with next index
    const bucket = await this.bucketDAO.create({
      ...validatedInput,
      userId,
      index: maxIndex + 1,
      currentValue: 0,
      isLocked: false,
      isFull: false
    })
    
    return bucket
  }

  async reorderBuckets(userId: string, newOrder: string[]): Promise<Bucket[]> {
    // Validate all bucket IDs belong to user
    const userBuckets = await this.bucketDAO.findByUserId(userId)
    const userBucketIds = new Set(userBuckets.map(b => b.id))
    
    if (!newOrder.every(id => userBucketIds.has(id))) {
      throw new Error('Invalid bucket IDs in reorder request')
    }
    
    // Update priorities
    const reorderData = newOrder.map((bucketId, index) => ({
      bucketId,
      newIndex: index
    }))
    
    return await this.bucketDAO.updatePriorities(reorderData)
  }

  async lockBucket(bucketId: string): Promise<Bucket> {
    const bucket = await this.bucketDAO.update(bucketId, { isLocked: true })
    if (!bucket) {
      throw new Error('Bucket not found')
    }
    return bucket
  }

  async unlockBucket(bucketId: string): Promise<Bucket> {
    const bucket = await this.bucketDAO.update(bucketId, { isLocked: false })
    if (!bucket) {
      throw new Error('Bucket not found')
    }
    return bucket
  }
}
```

### Deposit Processing Service
```typescript
// apps/api/src/services/DepositService.ts
import { DepositProcessor } from './DepositProcessor'
import { BucketDAO, DepositTransactionDAO } from '@envelope-budget/database/dao'

export class DepositService {
  constructor(
    private depositProcessor: DepositProcessor,
    private bucketDAO: BucketDAO,
    private depositTransactionDAO: DepositTransactionDAO
  ) {}

  async processDeposit(amount: number, userId: string): Promise<DepositResult> {
    // Get user's buckets in priority order
    const buckets = await this.bucketDAO.findByUserId(userId)
    
    // Process the cascade
    const result = await this.depositProcessor.processDeposit(amount, buckets)
    
    // Log the deposit transaction
    await this.depositTransactionDAO.create({
      originalAmount: amount,
      totalProcessed: result.totalProcessed,
      moneyBucketAmount: result.remainder,
      userId
    })
    
    return result
  }
}
```

## Route Handlers

### Bucket Routes
```typescript
// apps/api/src/routes/buckets/create.ts
import { FastifyPluginAsync } from 'fastify'
import { Type } from '@sinclair/typebox'

const createBucketSchema = Type.Object({
  name: Type.String({ minLength: 1, maxLength: 255 }),
  targetValue: Type.Number({ minimum: 0.01 }),
  filter: Type.Object({
    method: Type.Union([Type.Literal('flat_value'), Type.Literal('percentage')]),
    value: Type.Number({ minimum: 0 })
  }),
  hold: Type.Optional(Type.Object({
    hasMinimumHold: Type.Boolean(),
    holdType: Type.Union([Type.Literal('flat_value'), Type.Literal('percentage')]),
    holdValue: Type.Number({ minimum: 0 })
  }))
})

const createBucketRoute: FastifyPluginAsync = async (fastify) => {
  fastify.post('/', {
    schema: {
      body: createBucketSchema,
      response: {
        201: bucketResponseSchema
      }
    },
    preHandler: [fastify.authenticate]
  }, async (request, reply) => {
    const bucket = await fastify.bucketService.createBucket(
      request.body,
      request.user.id
    )
    
    reply.code(201).send(bucket)
  })
}

export default createBucketRoute
```

## Error Handling

### Global Error Handler
```typescript
// apps/api/src/middleware/errorHandler.ts
import { FastifyError, FastifyReply, FastifyRequest } from 'fastify'

export const errorHandler = (
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply
) => {
  request.log.error(error)

  // Validation errors
  if (error.validation) {
    return reply.code(400).send({
      error: 'Validation Error',
      message: error.message,
      details: error.validation
    })
  }

  // JWT errors
  if (error.code === 'FST_JWT_AUTHORIZATION_TOKEN_EXPIRED') {
    return reply.code(401).send({
      error: 'Token Expired',
      message: 'JWT token has expired'
    })
  }

  // Database errors
  if (error.code?.startsWith('23')) { // PostgreSQL constraint violations
    return reply.code(400).send({
      error: 'Database Constraint Error',
      message: 'Data violates database constraints'
    })
  }

  // Default error
  reply.code(500).send({
    error: 'Internal Server Error',
    message: 'An unexpected error occurred'
  })
}
```

## Authentication & Authorization

### JWT Authentication
```typescript
// apps/api/src/plugins/auth.ts
import { FastifyPluginAsync } from 'fastify'
import fp from 'fastify-plugin'

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>
  }
}

const authPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify()
    } catch (err) {
      reply.send(err)
    }
  })
}

export default fp(authPlugin)
```

## Testing Strategy

### Unit Tests for Services
```typescript
// apps/api/src/services/__tests__/BucketService.test.ts
import { BucketService } from '../BucketService'
import { MockBucketDAO } from '@envelope-budget/database/dao/mocks'

describe('BucketService', () => {
  let bucketService: BucketService
  let mockBucketDAO: MockBucketDAO

  beforeEach(() => {
    mockBucketDAO = new MockBucketDAO()
    bucketService = new BucketService(mockBucketDAO)
  })

  describe('createBucket', () => {
    it('should create a bucket with correct index', async () => {
      // Test implementation
    })
  })
})
```

### Integration Tests for Routes
```typescript
// apps/api/src/routes/__tests__/buckets.test.ts
import { createApp } from '../../app'

describe('Bucket Routes', () => {
  let app: any

  beforeEach(async () => {
    app = createApp({ logger: false })
    await app.ready()
  })

  afterEach(async () => {
    await app.close()
  })

  describe('POST /buckets', () => {
    it('should create a new bucket', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/buckets',
        headers: {
          authorization: 'Bearer valid-jwt-token'
        },
        payload: {
          name: 'Test Bucket',
          targetValue: 100,
          filter: {
            method: 'flat_value',
            value: 10
          }
        }
      })

      expect(response.statusCode).toBe(201)
      expect(response.json()).toMatchObject({
        name: 'Test Bucket',
        targetValue: 100
      })
    })
  })
})