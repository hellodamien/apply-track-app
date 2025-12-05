import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/auth-context'
import { FloatingApiSettings } from './components/ui/floating-api-settings'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Register from './pages/Register'
import CompanyDetail from './pages/CompanyDetail'
import Settings from './pages/Settings'

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/companies/:id" element={<CompanyDetail />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
      <FloatingApiSettings />
    </AuthProvider>
  )
}

export default App
