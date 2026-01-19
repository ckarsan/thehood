import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [backendStatus, setBackendStatus] = useState('Checking...')
  const [count, setCount] = useState(0)

  useEffect(() => {
    fetch('http://localhost:5000/api/health')
      .then(res => res.json())
      .then(data => setBackendStatus(data.message))
      .catch(err => setBackendStatus('Backend offline'))
  }, [])

  return (
    <div className="container">
      <h1>thehood</h1>
      <p className="subtitle">
        A neighborhood connection platform built with React and Express.
        Experience seamless integration and real-time updates.
      </p>

      <div className="card">
        <button onClick={() => setCount(count => count + 1)}>
          Interactions: {count}
        </button>

        <div className="status-badge">
          <div className="status-dot"></div>
          {backendStatus}
        </div>

        <p>
          Edit <code>src/App.jsx</code> to start building your community.
        </p>
      </div>

      <p className="read-the-docs">Powered by Vite + React + Express</p>
    </div>
  )
}

export default App
