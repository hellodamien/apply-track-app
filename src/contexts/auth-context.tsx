import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { login as apiLogin, register as apiRegister } from "@/lib/api"

interface User {
  username: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  login: (username: string, password: string) => Promise<void>
  register: (username: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    // Check for existing token on mount
    const storedToken = localStorage.getItem("applytrack_token")
    const storedUser = localStorage.getItem("applytrack_user")

    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    // Redirect to login if not authenticated and not on public routes
    if (!isLoading && !token && location.pathname !== "/login" && location.pathname !== "/register") {
      navigate("/login")
    }
  }, [isLoading, token, location.pathname, navigate])

  const login = async (username: string, password: string) => {
    const response = await apiLogin(username, password)
    const newToken = response.data.token

    localStorage.setItem("applytrack_token", newToken)
    localStorage.setItem("applytrack_user", JSON.stringify({ username }))

    setToken(newToken)
    setUser({ username })
    navigate("/dashboard")
  }

  const register = async (username: string, password: string) => {
    await apiRegister(username, password)
    // After registration, log in automatically
    await login(username, password)
  }

  const logout = () => {
    localStorage.removeItem("applytrack_token")
    localStorage.removeItem("applytrack_user")
    setToken(null)
    setUser(null)
    navigate("/login")
  }

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
