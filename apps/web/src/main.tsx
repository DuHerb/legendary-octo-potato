// Frontend application entry point - placeholder for Phase 4
import React from 'react'
import ReactDOM from 'react-dom/client'

function App() {
  return (
    <div>
      <h1>Envelope Budget Application</h1>
      <p>Frontend implementation will be added in Phase 4</p>
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