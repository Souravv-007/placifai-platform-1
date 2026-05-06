import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import { authAPI } from '../services/api'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const setUser = useAuthStore((s) => s.setUser)
  const setToken = useAuthStore((s) => s.setToken)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      setError('Email and password are required')
      return
    }

    setError('')
    setLoading(true)
    try {
      const res = await authAPI.login({ email, password })
      setToken(res.data.token)
      setUser(res.data.user)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#0a0b10', 
      display: 'flex', 
      fontFamily: "'DM Sans', sans-serif",
      color: '#e8e8f0'
    }}>
      {/* Left Side: Brand & Social Proof */}
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        padding: '0 80px',
        background: 'radial-gradient(circle at 100% 0%, rgba(99, 102, 241, 0.15) 0%, transparent 50%), radial-gradient(circle at 0% 100%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', bottom: '-100px', right: '-100px', width: '400px', height: '400px', background: 'rgba(99, 102, 241, 0.05)', borderRadius: '50%', filter: 'blur(80px)' }} />
        
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '48px' }}>
            <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '20px' }}>P</div>
            <span style={{ fontSize: '24px', fontWeight: '700', letterSpacing: '-0.5px' }}>PlacifAI</span>
          </div>

          <h2 style={{ fontSize: '48px', fontWeight: '700', lineHeight: '1.1', marginBottom: '24px', maxWidth: '500px' }}>
            Welcome back to the <span style={{ background: 'linear-gradient(135deg, #818cf8, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>future of hiring.</span>
          </h2>
          
          <p style={{ fontSize: '18px', color: 'rgba(232, 232, 240, 0.5)', marginBottom: '48px', maxWidth: '450px', lineHeight: '1.6' }}>
            Continue your journey towards your dream role. Our AI is ready to help you prep for your next big interview.
          </p>

          <div style={{ padding: '24px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.05)', maxWidth: '400px' }}>
            <p style={{ fontSize: '15px', fontStyle: 'italic', color: 'rgba(232, 232, 240, 0.7)', marginBottom: '16px' }}>
              "PlacifAI helped me land a Senior Dev role at Stripe. The mock interviews were spot on!"
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '16px', background: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>JD</div>
              <div>
                <p style={{ fontSize: '13px', fontWeight: '600' }}>James Dalton</p>
                <p style={{ fontSize: '12px', color: 'rgba(232, 232, 240, 0.4)' }}>Software Engineer @ Stripe</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div style={{ 
        width: '560px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '40px',
        borderLeft: '1px solid rgba(255, 255, 255, 0.05)'
      }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>
          <div style={{ marginBottom: '32px' }}>
            <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px' }}>Sign in</h1>
            <p style={{ color: 'rgba(232, 232, 240, 0.4)', fontSize: '15px' }}>Enter your credentials to access your workspace.</p>
          </div>

          {error && (
            <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '12px', padding: '14px', marginBottom: '24px', color: '#f87171', fontSize: '14px', display: 'flex', gap: '10px', alignItems: 'center' }}>
              <span style={{ fontSize: '18px' }}>⚠</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', color: 'rgba(232, 232, 240, 0.6)', fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@example.com"
                style={{ width: '100%', padding: '12px 16px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '10px', color: '#e8e8f0', fontSize: '14px', outline: 'none', transition: 'border-color 0.2s', fontFamily: 'inherit' }}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <label style={{ color: 'rgba(232, 232, 240, 0.6)', fontSize: '13px', fontWeight: '500' }}>Password</label>
                <span style={{ color: '#818cf8', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>Forgot password?</span>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{ width: '100%', padding: '12px 16px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '10px', color: '#e8e8f0', fontSize: '14px', outline: 'none', transition: 'border-color 0.2s', fontFamily: 'inherit' }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{ 
                width: '100%', 
                padding: '14px', 
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', 
                border: 'none', 
                borderRadius: '10px', 
                color: 'white', 
                fontSize: '15px', 
                fontWeight: '600', 
                cursor: loading ? 'not-allowed' : 'pointer', 
                marginBottom: '24px', 
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                opacity: loading ? 0.7 : 1,
                fontFamily: 'inherit'
              }}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.05)' }} />
            <span style={{ fontSize: '13px', color: 'rgba(232, 232, 240, 0.3)' }}>OR</span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.05)' }} />
          </div>

          <p style={{ textAlign: 'center', fontSize: '14px', color: 'rgba(232, 232, 240, 0.5)' }}>
            Don't have an account?{' '}
            <span 
              onClick={() => navigate('/register')} 
              style={{ color: '#818cf8', fontWeight: '600', cursor: 'pointer', marginLeft: '4px' }}
            >
              Create account
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}
