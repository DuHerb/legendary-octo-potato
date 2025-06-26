# Frontend Architecture Specification

## TanStack Ecosystem Integration

### Complete TanStack Stack
- **TanStack Router**: Type-safe routing with automatic code splitting
- **TanStack Query**: Server state management with caching and synchronization
- **TanStack Form**: Form state management with validation
- **TanStack Store**: Client-side state management (alpha, but stable for this use case)

## Frontend Project Structure

```
apps/web/src/
├── routes/                    # TanStack Router routes
│   ├── __root.tsx            # Root route layout
│   ├── index.tsx             # Dashboard route
│   ├── auth/
│   │   ├── login.tsx
│   │   └── register.tsx
│   ├── buckets/
│   │   ├── index.tsx         # Bucket list
│   │   ├── create.tsx        # Create bucket form
│   │   └── $bucketId.tsx     # Bucket detail
│   ├── deposits/
│   │   ├── index.tsx         # Deposit form
│   │   └── history.tsx       # Transaction history
│   └── money-bucket/
│       ├── index.tsx         # Money bucket overview
│       └── redistribute.tsx  # Redistribution interface
├── components/                # React components
│   ├── ui/                   # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   └── DragDropList.tsx
│   ├── forms/                # TanStack Form components
│   │   ├── BucketForm.tsx
│   │   ├── DepositForm.tsx
│   │   └── LoginForm.tsx
│   └── features/             # Feature-specific components
│       ├── buckets/
│       │   ├── BucketCard.tsx
│       │   ├── BucketList.tsx
│       │   └── CascadeVisualizer.tsx
│       ├── deposits/
│       │   ├── DepositProcessor.tsx
│       │   └── TransactionHistory.tsx
│       └── money-bucket/
│           ├── MoneyBucketBalance.tsx
│           └── RedistributionControls.tsx
├── hooks/                     # Custom React hooks
│   ├── useBuckets.ts
│   ├── useDeposits.ts
│   ├── useMoneyBucket.ts
│   └── useAuth.ts
├── stores/                    # TanStack Store definitions
│   ├── authStore.ts
│   ├── uiStore.ts
│   └── bucketStore.ts
├── lib/                       # Configuration and utilities
│   ├── api.ts                # API client setup
│   ├── queryClient.ts        # TanStack Query config
│   ├── router.ts             # TanStack Router config
│   └── validation.ts         # Zod schemas
├── styles/                    # Tailwind and global styles
│   ├── globals.css
│   └── components.css
└── types/                     # Frontend-specific types
    ├── api.ts
    └── ui.ts
```

## TanStack Router Setup

### Root Route Configuration
```typescript
// apps/web/src/routes/__root.tsx
import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { queryClient } from '../lib/queryClient'

export const Route = createRootRoute({
  component: () => (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between items-center py-4">
              <Link to="/" className="text-xl font-bold">
                Envelope Budget
              </Link>
              <div className="flex gap-4">
                <Link to="/buckets" className="text-blue-600 hover:text-blue-800">
                  Buckets
                </Link>
                <Link to="/deposits" className="text-blue-600 hover:text-blue-800">
                  Deposits
                </Link>
                <Link to="/money-bucket" className="text-blue-600 hover:text-blue-800">
                  Money Bucket
                </Link>
              </div>
            </div>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto px-4 py-8">
          <Outlet />
        </main>
      </div>
      <ReactQueryDevtools initialIsOpen={false} />
      <TanStackRouterDevtools />
    </QueryClientProvider>
  ),
})
```

### Typed Route Definitions
```typescript
// apps/web/src/routes/buckets/$bucketId.tsx
import { createFileRoute, useParams } from '@tanstack/react-router'
import { useBucket } from '../../hooks/useBuckets'
import { BucketDetail } from '../../components/features/buckets/BucketDetail'

export const Route = createFileRoute('/buckets/$bucketId')({
  component: BucketDetailPage,
  loader: ({ params }) => {
    // Preload data for the bucket
    return queryClient.ensureQueryData({
      queryKey: ['bucket', params.bucketId],
      queryFn: () => api.buckets.getById(params.bucketId),
    })
  },
})

function BucketDetailPage() {
  const { bucketId } = useParams({ from: '/buckets/$bucketId' })
  const { data: bucket, isLoading, error } = useBucket(bucketId)

  if (isLoading) return <div>Loading bucket...</div>
  if (error) return <div>Error loading bucket: {error.message}</div>
  if (!bucket) return <div>Bucket not found</div>

  return <BucketDetail bucket={bucket} />
}
```

## TanStack Query Integration

### API Client Setup
```typescript
// apps/web/src/lib/api.ts
import { hc } from 'hono/client'
import type { AppType } from '@envelope-budget/api' // Import API types

const client = hc<AppType>(import.meta.env.VITE_API_URL || 'http://localhost:3001')

export const api = {
  auth: {
    login: (credentials: LoginInput) => client.auth.login.$post({ json: credentials }),
    register: (userData: RegisterInput) => client.auth.register.$post({ json: userData }),
    refresh: () => client.auth.refresh.$post(),
  },
  buckets: {
    getAll: () => client.buckets.$get().then(res => res.json()),
    getById: (id: string) => client.buckets[':id'].$get({ param: { id } }).then(res => res.json()),
    create: (bucket: CreateBucketInput) => client.buckets.$post({ json: bucket }).then(res => res.json()),
    update: (id: string, updates: UpdateBucketInput) => 
      client.buckets[':id'].$patch({ param: { id }, json: updates }).then(res => res.json()),
    reorder: (newOrder: string[]) => 
      client.buckets.reorder.$post({ json: { order: newOrder } }).then(res => res.json()),
    lock: (id: string) => client.buckets[':id'].lock.$post({ param: { id } }).then(res => res.json()),
    unlock: (id: string) => client.buckets[':id'].unlock.$post({ param: { id } }).then(res => res.json()),
  },
  deposits: {
    process: (amount: number) => client.deposits.process.$post({ json: { amount } }).then(res => res.json()),
    getHistory: () => client.deposits.history.$get().then(res => res.json()),
  },
  moneyBucket: {
    getBalance: () => client['money-bucket'].balance.$get().then(res => res.json()),
    redistribute: (amount: number, targetBucketId?: string) => 
      client['money-bucket'].redistribute.$post({ 
        json: { amount, targetBucketId } 
      }).then(res => res.json()),
    getHistory: () => client['money-bucket'].history.$get().then(res => res.json()),
  }
}
```

### Custom Query Hooks
```typescript
// apps/web/src/hooks/useBuckets.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/api'
import type { Bucket, CreateBucketInput, UpdateBucketInput } from '@envelope-budget/shared/types'

export const useBuckets = () => {
  return useQuery({
    queryKey: ['buckets'],
    queryFn: api.buckets.getAll,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useBucket = (bucketId: string) => {
  return useQuery({
    queryKey: ['bucket', bucketId],
    queryFn: () => api.buckets.getById(bucketId),
    enabled: !!bucketId,
  })
}

export const useCreateBucket = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: api.buckets.create,
    onSuccess: (newBucket) => {
      // Update the buckets list cache
      queryClient.setQueryData(['buckets'], (old: Bucket[] | undefined) => {
        return old ? [...old, newBucket] : [newBucket]
      })
      
      // Cache the individual bucket
      queryClient.setQueryData(['bucket', newBucket.id], newBucket)
    },
  })
}

export const useReorderBuckets = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: api.buckets.reorder,
    onSuccess: (reorderedBuckets) => {
      // Update the cache with new order
      queryClient.setQueryData(['buckets'], reorderedBuckets)
      
      // Update individual bucket caches
      reorderedBuckets.forEach(bucket => {
        queryClient.setQueryData(['bucket', bucket.id], bucket)
      })
    },
  })
}
```

## TanStack Form Integration

### Bucket Creation Form
```typescript
// apps/web/src/components/forms/BucketForm.tsx
import { useForm } from '@tanstack/react-form'
import { zodValidator } from '@tanstack/zod-form-adapter'
import { z } from 'zod'
import { useCreateBucket } from '../../hooks/useBuckets'

const bucketSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name too long'),
  targetValue: z.number().min(0.01, 'Target value must be positive'),
  filter: z.object({
    method: z.enum(['flat_value', 'percentage']),
    value: z.number().min(0, 'Filter value must be non-negative'),
  }),
  hold: z.object({
    hasMinimumHold: z.boolean(),
    holdType: z.enum(['flat_value', 'percentage']).optional(),
    holdValue: z.number().min(0).optional(),
  }),
})

type BucketFormData = z.infer<typeof bucketSchema>

export const BucketForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const createBucket = useCreateBucket()

  const form = useForm({
    defaultValues: {
      name: '',
      targetValue: 0,
      filter: {
        method: 'flat_value' as const,
        value: 0,
      },
      hold: {
        hasMinimumHold: false,
        holdType: 'flat_value' as const,
        holdValue: 0,
      },
    } satisfies BucketFormData,
    onSubmit: async ({ value }) => {
      try {
        await createBucket.mutateAsync(value)
        onSuccess?.()
      } catch (error) {
        // Handle error
        console.error('Failed to create bucket:', error)
      }
    },
    validatorAdapter: zodValidator,
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
      className="space-y-6"
    >
      <form.Field
        name="name"
        validators={{
          onChange: bucketSchema.shape.name,
        }}
        children={(field) => (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Bucket Name
            </label>
            <input
              type="text"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              placeholder="e.g., Emergency Fund"
            />
            {field.state.meta.errors.length > 0 && (
              <p className="mt-1 text-sm text-red-600">
                {field.state.meta.errors[0]}
              </p>
            )}
          </div>
        )}
      />

      <form.Field
        name="targetValue"
        validators={{
          onChange: bucketSchema.shape.targetValue,
        }}
        children={(field) => (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Target Amount ($)
            </label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(parseFloat(e.target.value) || 0)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              placeholder="1000.00"
            />
            {field.state.meta.errors.length > 0 && (
              <p className="mt-1 text-sm text-red-600">
                {field.state.meta.errors[0]}
              </p>
            )}
          </div>
        )}
      />

      {/* Filter configuration */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Filter Configuration</h3>
        
        <form.Field
          name="filter.method"
          children={(field) => (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Filter Method
              </label>
              <select
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value as 'flat_value' | 'percentage')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              >
                <option value="flat_value">Flat Dollar Amount</option>
                <option value="percentage">Percentage</option>
              </select>
            </div>
          )}
        />

        <form.Field
          name="filter.value"
          validators={{
            onChange: bucketSchema.shape.filter.shape.value,
          }}
          children={(field) => (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Filter Value
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(parseFloat(e.target.value) || 0)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                placeholder={form.getFieldValue('filter.method') === 'percentage' ? '10' : '50.00'}
              />
              {field.state.meta.errors.length > 0 && (
                <p className="mt-1 text-sm text-red-600">
                  {field.state.meta.errors[0]}
                </p>
              )}
            </div>
          )}
        />
      </div>

      <button
        type="submit"
        disabled={!form.state.canSubmit || createBucket.isPending}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
      >
        {createBucket.isPending ? 'Creating...' : 'Create Bucket'}
      </button>
    </form>
  )
}
```

## TanStack Store Integration

### UI State Store
```typescript
// apps/web/src/stores/uiStore.ts
import { Store } from '@tanstack/react-store'

interface UIState {
  theme: 'light' | 'dark'
  sidebarOpen: boolean
  modals: {
    createBucket: boolean
    depositProcessor: boolean
    redistribute: boolean
  }
}

export const uiStore = new Store<UIState>({
  theme: 'light',
  sidebarOpen: true,
  modals: {
    createBucket: false,
    depositProcessor: false,
    redistribute: false,
  },
})

// Actions
export const uiActions = {
  toggleTheme: () => {
    uiStore.setState((state) => ({
      ...state,
      theme: state.theme === 'light' ? 'dark' : 'light',
    }))
  },
  
  toggleSidebar: () => {
    uiStore.setState((state) => ({
      ...state,
      sidebarOpen: !state.sidebarOpen,
    }))
  },
  
  openModal: (modal: keyof UIState['modals']) => {
    uiStore.setState((state) => ({
      ...state,
      modals: {
        ...state.modals,
        [modal]: true,
      },
    }))
  },
  
  closeModal: (modal: keyof UIState['modals']) => {
    uiStore.setState((state) => ({
      ...state,
      modals: {
        ...state.modals,
        [modal]: false,
      },
    }))
  },
}

// Hook for using the store
export const useUIStore = () => {
  return uiStore.useStore()
}
```

## Advanced UI Components

### Drag & Drop Bucket Reordering
```typescript
// apps/web/src/components/features/buckets/BucketList.tsx
import React from 'react'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { useBuckets, useReorderBuckets } from '../../../hooks/useBuckets'
import { BucketCard } from './BucketCard'

export const BucketList = () => {
  const { data: buckets, isLoading } = useBuckets()
  const reorderBuckets = useReorderBuckets()

  if (isLoading) return <div>Loading buckets...</div>

  const handleDragEnd = (result: any) => {
    if (!result.destination || !buckets) return

    const reorderedBuckets = Array.from(buckets)
    const [reorderedItem] = reorderedBuckets.splice(result.source.index, 1)
    reorderedBuckets.splice(result.destination.index, 0, reorderedItem)

    // Extract just the IDs in the new order
    const newOrder = reorderedBuckets.map(bucket => bucket.id)
    reorderBuckets.mutate(newOrder)
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="buckets">
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={`space-y-4 p-4 rounded-lg transition-colors ${
              snapshot.isDraggingOver ? 'bg-blue-50' : 'bg-gray-50'
            }`}
          >
            {buckets?.map((bucket, index) => (
              <Draggable key={bucket.id} draggableId={bucket.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`transform transition-transform ${
                      snapshot.isDragging ? 'rotate-2 scale-105' : ''
                    }`}
                  >
                    <BucketCard bucket={bucket} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}
```

### Cascade Visualization Component
```typescript
// apps/web/src/components/features/buckets/CascadeVisualizer.tsx
import React from 'react'
import { useBuckets } from '../../../hooks/useBuckets'

interface CascadeVisualizerProps {
  depositAmount: number
  onProcessDeposit?: (amount: number) => void
}

export const CascadeVisualizer = ({ depositAmount, onProcessDeposit }: CascadeVisualizerProps) => {
  const { data: buckets } = useBuckets()
  
  // Calculate cascade preview (client-side simulation)
  const cascadePreview = useMemo(() => {
    if (!buckets || depositAmount <= 0) return []
    
    let remainingAmount = depositAmount
    const results = []
    
    const activeBuckets = buckets
      .filter(b => !b.isLocked)
      .sort((a, b) => a.index - b.index)
    
    for (const bucket of activeBuckets) {
      if (remainingAmount <= 0) break
      
      const filterAmount = bucket.filter.method === 'flat_value'
        ? Math.min(bucket.filter.value, remainingAmount)
        : remainingAmount * (bucket.filter.value / 100)
      
      const holdAmount = bucket.hold.hasMinimumHold
        ? bucket.hold.holdType === 'flat_value'
          ? bucket.hold.holdValue
          : remainingAmount * (bucket.hold.holdValue / 100)
        : 0
      
      const requestedAmount = Math.max(filterAmount, holdAmount)
      const spaceAvailable = bucket.targetValue - bucket.currentValue
      const actualAmount = Math.min(requestedAmount, spaceAvailable, remainingAmount)
      
      results.push({
        bucket,
        filterAmount,
        holdAmount,
        actualAmount,
        willBeFull: (bucket.currentValue + actualAmount) >= bucket.targetValue
      })
      
      remainingAmount -= actualAmount
    }
    
    return { results, remainder: remainingAmount }
  }, [buckets, depositAmount])

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium mb-2">Deposit Preview: ${depositAmount.toFixed(2)}</h3>
        
        {cascadePreview.results.map(({ bucket, filterAmount, holdAmount, actualAmount, willBeFull }) => (
          <div key={bucket.id} className="flex items-center justify-between py-2 border-b border-blue-200 last:border-b-0">
            <div className="flex-1">
              <p className="font-medium">{bucket.name}</p>
              <p className="text-sm text-gray-600">
                Filter: ${filterAmount.toFixed(2)} | Hold: ${holdAmount.toFixed(2)}
              </p>
            </div>
            <div className="text-right">
              <p className="font-medium text-green-600">+${actualAmount.toFixed(2)}</p>
              {willBeFull && <p className="text-xs text-orange-600">Will be full</p>}
            </div>
          </div>
        ))}
        
        {cascadePreview.remainder > 0 && (
          <div className="mt-4 p-3 bg-yellow-50 rounded border-l-4 border-yellow-400">
            <p className="text-sm">
              <strong>${cascadePreview.remainder.toFixed(2)}</strong> will go to Money Bucket
            </p>
          </div>
        )}
      </div>
      
      {onProcessDeposit && (
        <button
          onClick={() => onProcessDeposit(depositAmount)}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Process Deposit
        </button>
      )}
    </div>
  )
}
```

## Performance Optimizations

### Query Optimization
- Implement query keys consistently across the app
- Use stale-time appropriately for different data types
- Implement optimistic updates for better UX
- Use React.memo and useMemo for expensive components

### Bundle Optimization
- Lazy load routes with TanStack Router
- Code split large components and libraries
- Optimize Tailwind CSS with purging
- Use Vite's build optimization features