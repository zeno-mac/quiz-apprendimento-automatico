import { useState } from 'react'
import Dashboard from './components/Dashboard'
import './App.css'

function App() {
  return (
    <div className="container">
      <header className="app-header">
        <h1 className="app-title">Quiz Apprendimento Automatico</h1>
        <p className="app-subtitle">Scegli un esame per iniziare o ripassa gli errori.</p>
      </header>

      <main>
        <Dashboard />
      </main>
    </div>
  )
}

export default App
