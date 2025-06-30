// Frontend application entry point - now with UI components!
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Button } from '@envelope-budget/ui'
import '@envelope-budget/ui/styles'

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center space-y-6 p-8">
        <h1 className="text-4xl font-bold text-gray-900">
          Envelope Budget Application
        </h1>
        <p className="text-lg text-gray-600">
          UI component library now available with Storybook!
        </p>
        <div className="space-x-4">
          <Button variant="primary" size="md">
            Get Started
          </Button>
          <Button variant="outline" size="md">
            View Components
          </Button>
        </div>
        <div className="text-sm text-gray-500 space-y-2">
          <p>✅ Storybook installed and configured</p>
          <p>✅ Button component with full variants</p>
          <p>✅ TypeScript strict mode compliance</p>
          <p>🚀 Run `pnpm --filter @envelope-budget/ui storybook` to view components</p>
        </div>
      </div>
    </div>
  )
}

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)