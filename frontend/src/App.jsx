import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Landing from './pages/Landing'
import Register from './pages/Register'
import PrepHub from './pages/PrepHub'
import Roadmap from './pages/Roadmap'
import Analytics from './pages/Analytics'
import CompanyPrep from './pages/CompanyPrep'
import MockInterview from './pages/MockInterview'
import Progress from './pages/Progress'
import useAuthStore from './store/authStore'
import { authAPI } from './services/api'
import UpgradeModal from './components/UpgradeModal'
import HelpModal from './components/HelpModal'


function App() {

  const token = useAuthStore((s) => s.token)
  const user = useAuthStore((s) => s.user)
  const setUser = useAuthStore((s) => s.setUser)
  const logout = useAuthStore((s) => s.logout)
  const [bootstrapping, setBootstrapping] = useState(Boolean(token) && !user)

  useEffect(() => {
    let cancelled = false

    const bootstrapUser = async () => {
      if (!token || user) {
        setBootstrapping(false)
        return
      }

      setBootstrapping(true)

      try {
        const response = await authAPI.me()
        if (!cancelled) {
          setUser(response.data.user)
        }
      } catch (error) {
        if (!cancelled) {
          logout()
        }
      } finally {
        if (!cancelled) {
          setBootstrapping(false)
        }
      }
    }

    bootstrapUser()

    return () => {
      cancelled = true
    }
  }, [token, user, setUser, logout])

  if (bootstrapping) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0f1117',
        color: '#e8e8f0',
        fontFamily: 'DM Sans, sans-serif',
      }}>
        Loading your workspace...
      </div>
    )
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/prep" element={<PrepHub />} />
        <Route path="/roadmap" element={<Roadmap />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/company-prep" element={<CompanyPrep />} />
        <Route path="/interview" element={<MockInterview />} />
        <Route path="/progress" element={<Progress />} />
      </Routes>
      <UpgradeModal />
      <HelpModal />
    </BrowserRouter>
  )
}

export default App
