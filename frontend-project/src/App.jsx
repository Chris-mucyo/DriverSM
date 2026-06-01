import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import Warehouses from './pages/Warehouses'
import Transactions from './pages/Transactions'
import Reports from './pages/Reports'
import PrivateRoute from './components/PrivateRoute'
import Navbar from './components/Navbar'

function App() {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme')
    return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)
  })

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [isDark])

  const toggleTheme = () => setIsDark(!isDark)

  return (
      <div className="min-h-screen bg-background">
        <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: 'var(--background)',
                color: 'var(--foreground)',
                border: '1px solid var(--border)'
              }
            }}
        />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
              path="/*"
              element={
                <PrivateRoute>
                  <div>
                    <Navbar toggleTheme={toggleTheme} isDark={isDark} />
                    <main className="container mx-auto px-4 py-6 max-w-7xl">
                      <Routes>
                        <Route path="/" element={<Navigate to="/dashboard" />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/products" element={<Products />} />
                        <Route path="/warehouses" element={<Warehouses />} />
                        <Route path="/transactions" element={<Transactions />} />
                        <Route path="/reports" element={<Reports />} />
                      </Routes>
                    </main>
                  </div>
                </PrivateRoute>
              }
          />
        </Routes>
      </div>
  )
}

export default App