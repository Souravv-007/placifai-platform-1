import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import { authAPI } from '../services/api'

const styles = `
  @keyframes portalRotate {
    0% { transform: rotate(0deg) scale(1); }
    50% { transform: rotate(180deg) scale(1.1); }
    100% { transform: rotate(360deg) scale(1); }
  }

  @keyframes energyPulse {
    0%, 100% { opacity: 0.3; filter: blur(40px); }
    50% { opacity: 0.8; filter: blur(60px); }
  }

  @keyframes streakFlow {
    0% { transform: translateY(0) translateX(0); opacity: 0; }
    50% { opacity: 1; }
    100% { transform: translateY(-100vh) translateX(-50vw); opacity: 0; }
  }

  @keyframes glitchPulse {
    0% { clip-path: inset(40% 0 61% 0); }
    20% { clip-path: inset(92% 0 1% 0); }
    40% { clip-path: inset(43% 0 1% 0); }
    60% { clip-path: inset(25% 0 58% 0); }
    80% { clip-path: inset(54% 0 7% 0); }
    100% { clip-path: inset(58% 0 43% 0); }
  }

  .portal-bg {
    background: radial-gradient(circle at center, #161821 0%, #050608 100%);
    position: relative;
    overflow: hidden;
  }

  .energy-ring {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border: 1px solid rgba(99, 102, 241, 0.2);
    border-radius: 50%;
    animation: portalRotate 20s linear infinite;
  }

  .particle-streak {
    position: absolute;
    width: 2px;
    height: 100px;
    background: linear-gradient(to top, transparent, #6366f1);
    animation: streakFlow 3s linear infinite;
    pointer-events: none;
  }

  .hologram-card {
    background: rgba(255, 255, 255, 0.01);
    backdrop-filter: blur(40px);
    border: 1px solid rgba(255, 255, 255, 0.05);
    position: relative;
    transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
  }

  .hologram-card::before {
    content: '';
    position: absolute;
    inset: -1px;
    background: linear-gradient(45deg, transparent, rgba(99, 102, 241, 0.3), transparent);
    z-index: -1;
    border-radius: inherit;
    animation: energyPulse 4s ease-in-out infinite;
  }

  .brand-glitch {
    position: relative;
    color: white;
  }

  .brand-glitch::after {
    content: 'PlacifAI';
    position: absolute;
    left: 2px;
    text-shadow: -1px 0 #ff00c1;
    top: 0;
    overflow: hidden;
    animation: glitchPulse 2s infinite linear alternate-reverse;
    background: #0a0b10;
  }

  .core-glow {
    position: absolute;
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 0;
    pointer-events: none;
  }

  .login-btn-advanced {
    background: #e8e8f0;
    color: #0a0b10;
    border: none;
    border-radius: 8px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 2px;
    transition: all 0.4s cubic-bezier(0.19, 1, 0.22, 1);
    position: relative;
    overflow: hidden;
  }

  .login-btn-advanced:hover {
    background: #6366f1;
    color: white;
    box-shadow: 0 0 40px rgba(99, 102, 241, 0.6);
    transform: translateY(-2px);
  }

  .login-btn-advanced::after {
    content: '';
    position: absolute;
    top: 0; left: -100%;
    width: 100%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
    transition: 0.6s;
  }

  .login-btn-advanced:hover::after {
    left: 100%;
  }
`

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
    <div className="portal-bg" style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      fontFamily: "'DM Sans', sans-serif",
      color: '#e8e8f0',
      overflow: 'hidden'
    }}>
      <style>{styles}</style>
      
      {/* Neural Portal Rings */}
      <div className="energy-ring" style={{ width: '400px', height: '400px' }} />
      <div className="energy-ring" style={{ width: '700px', height: '700px', animationDirection: 'reverse', animationDuration: '30s' }} />
      <div className="energy-ring" style={{ width: '1000px', height: '1000px', animationDuration: '40s' }} />
      
      {/* Particle Streaks */}
      {[...Array(20)].map((_, i) => (
        <div 
          key={i} 
          className="particle_streak" 
          style={{ 
            left: `${Math.random() * 100}%`, 
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${2 + Math.random() * 3}s`
          }} 
        />
      ))}

      <div className="core-glow" />

      {/* Main Content */}
      <div style={{ position: 'relative', zIndex: 10, display: 'flex', width: '100%' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 100px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '80px' }}>
            <div style={{ width: '48px', height: '48px', border: '2px solid #6366f1', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px #6366f1' }}>
              <div style={{ width: '12px', height: '12px', background: '#6366f1', borderRadius: '50%' }} />
            </div>
            <span className="brand-glitch" style={{ fontSize: '32px', fontWeight: '900', letterSpacing: '-1.5px' }}>PlacifAI</span>
          </div>

          <h2 style={{ fontSize: '72px', fontWeight: '900', lineHeight: '0.9', marginBottom: '40px', letterSpacing: '-4px' }}>
            Welcome back to the <span style={{ color: '#6366f1' }}>FUTURE.</span>
          </h2>
          
          <p style={{ fontSize: '22px', color: 'rgba(232, 232, 240, 0.4)', maxWidth: '500px', lineHeight: '1.4', fontWeight: '500' }}>
            Continue your journey towards your dream role. Our AI is ready to help you prep for your next big interview.
          </p>

          <div style={{ marginTop: '80px', display: 'flex', gap: '40px', alignItems: 'center' }}>
            <div style={{ opacity: 0.5 }}>
              <p style={{ fontSize: '12px', fontWeight: '800', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px' }}>Security Protocol</p>
              <p style={{ fontSize: '14px', color: '#6366f1' }}>AES-256 ACTIVE</p>
            </div>
            <div style={{ width: '1px', height: '40px', background: 'rgba(255,255,255,0.1)' }} />
            <div style={{ opacity: 0.5 }}>
              <p style={{ fontSize: '12px', fontWeight: '800', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px' }}>Neural Link</p>
              <p style={{ fontSize: '14px', color: '#6366f1' }}>SYNC STABLE</p>
            </div>
          </div>
        </div>

        <div style={{ width: '650px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px' }}>
          <div className="hologram-card" style={{ width: '100%', maxWidth: '440px', padding: '56px', borderRadius: '40px' }}>
            <div style={{ marginBottom: '48px' }}>
              <h1 style={{ fontSize: '40px', fontWeight: '900', marginBottom: '12px', letterSpacing: '-1px' }}>Sign in</h1>
              <p style={{ color: 'rgba(232, 232, 240, 0.3)', fontSize: '16px', fontWeight: '600' }}>Enter your credentials to access your workspace.</p>
            </div>

            {error && (
              <div style={{ background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '12px', padding: '16px', marginBottom: '32px', color: '#f87171', fontSize: '14px', textAlign: 'center' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '24px' }}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="USER_IDENTIFIER"
                  className="tech-input"
                  style={{ width: '100%', padding: '20px 24px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', color: 'white', fontSize: '14px', outline: 'none', fontFamily: "'DM Mono', monospace" }}
                />
              </div>

              <div style={{ marginBottom: '40px' }}>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="ACCESS_KEY"
                  className="tech-input"
                  style={{ width: '100%', padding: '20px 24px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', color: 'white', fontSize: '14px', outline: 'none', fontFamily: "'DM Mono', monospace" }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="login-btn-advanced"
                style={{ 
                  width: '100%', 
                  padding: '20px', 
                  fontSize: '14px',
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? 'SYNCING...' : 'INITIATE ACCESS'}
              </button>
            </form>

            <p style={{ textAlign: 'center', fontSize: '14px', color: 'rgba(232, 232, 240, 0.3)', marginTop: '40px', fontWeight: '600' }}>
              Don't have an account?{' '}
              <span 
                onClick={() => navigate('/register')} 
                style={{ color: '#6366f1', cursor: 'pointer', marginLeft: '6px', textDecoration: 'underline' }}
              >
                Create account
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
