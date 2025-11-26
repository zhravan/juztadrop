'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  name: string
  email: string
  [key: string]: any
}

interface AuthContextType {
  user: User | null
  userType: 'volunteer' | 'organization' | 'admin' | null
  token: string | null
  isLoading: boolean
  login: (token: string, user: User, userType: 'volunteer' | 'organization' | 'admin', remember?: boolean) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userType, setUserType] = useState<'volunteer' | 'organization' | 'admin' | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Load auth state from storage on mount
  useEffect(() => {
    const loadAuthState = () => {
      try {
        // Check localStorage first (remember me)
        let storedToken = localStorage.getItem('authToken')
        let storedUserType = localStorage.getItem('userType')
        let storedUser = localStorage.getItem('user')

        // If not in localStorage, check sessionStorage
        if (!storedToken) {
          storedToken = sessionStorage.getItem('authToken')
          storedUserType = sessionStorage.getItem('userType')
          storedUser = sessionStorage.getItem('user')
        }

        if (storedToken && storedUserType && storedUser) {
          setToken(storedToken)
          setUserType(storedUserType as 'volunteer' | 'organization' | 'admin')
          setUser(JSON.parse(storedUser))
        }
      } catch (error) {
        console.error('Error loading auth state:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadAuthState()
  }, [])

  const login = (
    newToken: string,
    newUser: User,
    newUserType: 'volunteer' | 'organization' | 'admin',
    remember: boolean = false
  ) => {
    setToken(newToken)
    setUser(newUser)
    setUserType(newUserType)

    // Store in appropriate storage
    const storage = remember ? localStorage : sessionStorage
    storage.setItem('authToken', newToken)
    storage.setItem('userType', newUserType)
    storage.setItem('user', JSON.stringify(newUser))
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    setUserType(null)

    // Clear from both storages
    localStorage.removeItem('authToken')
    localStorage.removeItem('userType')
    localStorage.removeItem('user')
    sessionStorage.removeItem('authToken')
    sessionStorage.removeItem('userType')
    sessionStorage.removeItem('user')

    // Redirect to home
    router.push('/')
  }

  return (
    <AuthContext.Provider value={{ user, userType, token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
