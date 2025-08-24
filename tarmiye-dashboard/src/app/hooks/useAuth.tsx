'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

interface User {
  email: string
  name?: string
}

interface AuthContextType {
  user: User | null
  login: (data: { email: string; password: string; rememberMe?: boolean }) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)

  const login = (data: { email: string; password: string }) => {
    // Placeholder logic
    setUser({ email: data.email, name: 'Demo User' })
  }

  const logout = () => setUser(null)

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
