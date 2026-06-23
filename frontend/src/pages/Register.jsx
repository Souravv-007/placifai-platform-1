import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import { authAPI } from '../services/api'

const styles = `
  @keyframes circuitFlow {
    0% { background-position: 0% 0%; }
    100% { background-position: 100% 100%; }
  }

  @keyframes construct3D {
    0% { transform: perspective(1000px) rotateX(0deg) rotateY(0deg); }
    100% { transform: perspective(1000px) rotateX(360deg) rotateY(360deg); }
  }

  @keyframes blueprintPulse {
    0%, 100% { opacity: 0.1; }
    50% { opacity: 0.3; }
  }

  @keyframes nodeConnect {
    0% { transform: scale(0); opacity: 0; }
    50% { transform: scale(1.5); opacity: 0.5; }
    100% { transform: scale(1); opacity: 1; }
  }

  .genesis-bg {
    background: #050608;
    position: relative;
    overflow: hidden;
  }

  .blueprint-grid {
    position: absolute;
    inset: 0;
    background-image: 
      linear-gradient(rgba(129, 140, 248, 0.1) 1px, transparent 1px),
      linear-gradient(90deg, rgba(129, 140, 248, 0.1) 1px, transparent 1px);
    background-size: 100px 100px;
    animation: blueprintPulse 8s infinite ease-in-out;
  }

  .circuit-overlay {
    position: absolute;
    inset: 0;
    background: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoOTksIDEwMiwgMjQxLCAwLjIpIi8+PC9zdmc+');
    opacity: 0.3;
    animation: circuitFlow 60s linear infinite;
  }

  .geometric-construct {
    position: absolute;
    width: 300px;
    height: 300px;
    border: 1px solid rgba(129, 140, 248, 0.1);
    animation: construct3D 20s linear infinite;
    transform-style: preserve-3d;
  }

  .genesis-card {
    background: linear-gradient(135deg, rgba(15, 17, 23, 0.8), rgba(5, 6, 8, 0.9));
    border: 1px solid rgba(129, 140, 248, 0.2);
    box-shadow: 0 40px 100px rgba(0,0,0,0.5);
    position: relative;
    overflow: hidden;
  }

  .genesis-card::after {
    content: '';
    position: absolute;
    top: 0; left: 0; width: 100%; height: 100%;
    background: linear-gradient(to bottom, transparent, rgba(99, 102, 241, 0.05));
    pointer-events: none;
  }

  .data-node {
    width: 8px;
    height: 8px;
    background: #818cf8;
    border-radius: 2px;
    position: absolute;
    animation: nodeConnect 1s cubic-bezier(0.175, 0.885, 0.32, 1.275) both;
  }

  .input-field-genesis {
    background: rgba(0,0,0,0.3) !important;
    border: 1px solid rgba(255,255,255,0.05) !important;
    color: #e8e8f0 !important;
    transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
  }

  .input-field-genesis:focus {
    border-color: #818cf8 !important;
    background: rgba(129, 140, 248, 0.05) !important;
    box-shadow: -10px 0 30px rgba(129, 140, 248, 0.1);
    transform: translateX(5px);
  }

  .register-btn-genesis {
    background: linear-gradient(90deg, #6366f1, #8b5cf6);
    border: none;
    color: white;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 3px;
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;
  }

  .register-btn-genesis:hover {
    letter-spacing: 5px;
    box-shadow: 0 0 50px rgba(99, 102, 241, 0.4);
  }

  .feature-tag {
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 2px;
    color: #818cf8;
    background: rgba(129, 140, 248, 0.1);
    padding: 4px 10px;
    border-radius: 4px;
    display: inline-block;
    margin-bottom: 12px;
  }
`

export default function Register() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const setUser = useAuthStore((s) => s.setUser)
  const setToken = useAuthStore((s) => s.setToken)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.firstName || !form.lastName || !form.email || !form.password) {
      setError('All fields are required')
      return
    }
    
    setError('')
    setLoading(true)
    try {
      const res = await authAPI.register(form)
      setToken(res.data.token)
      setUser(res.data.user)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="genesis-bg" style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      fontFamily: "'DM Sans', sans-serif",
      color: '#e8e8f0',
      overflow: 'hidden'
    }}>
      <style>{styles}</style>
      
      {/* Structural Elements */}
      <div className="blueprint-grid" />
      <div className="circuit-overlay" />
      
      {/* 3D Geometric Construction */}
      <div className="geometric-construct" style={{ top: '10%', left: '5%' }} />
      <div className="geometric-construct" style={{ bottom: '10%', right: '5%', width: '200px', height: '200px', animationDuration: '15s' }} />

      {/* Main Content */}
      <div style={{ position: 'relative', zIndex: 10, display: 'flex', width: '100%' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 80px' }}>
          <div style={{ marginBottom: '60px' }}>
            <div style={{ width: '40px', height: '2px', background: '#818cf8', marginBottom: '20px' }} />
            <span style={{ fontSize: '12px', fontWeight: '900', letterSpacing: '4px', textTransform: 'uppercase', color: '#818cf8' }}>PlacifAI / Network Genesis</span>
          </div>

          <h2 style={{ fontSize: '64px', fontWeight: '800', lineHeight: '1.1', marginBottom: '32px', maxWidth: '540px' }}>
            Build the <span style={{ textDecoration: 'underline', textUnderlineOffset: '10px', textDecorationColor: '#818cf8' }}>Blueprint</span> of your success.
          </h2>
          
          <p style={{ fontSize: '18px', color: 'rgba(232, 232, 240, 0.4)', maxWidth: '460px', lineHeight: '1.8' }}>
            Initialize your profile to begin neural career pathing. Our systems are ready to synchronize with your experience data.
          </p>

          <div style={{ marginTop: '60px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
            {[
              { label: 'NODE_STATUS', val: 'INITIALIZING' },
              { label: 'DATA_ENCRYPTION', val: 'RSA-4096' },
              { label: 'SYNC_PROTOCOL', val: 'QUANTUM' },
              { label: 'AI_AGENT', val: 'CLAUDE-3.5' }
            ].map((stat, i) => (
              <div key={i}>
                <p style={{ fontSize: '10px', fontWeight: '900', color: 'rgba(255,255,255,0.2)', letterSpacing: '1px', marginBottom: '4px' }}>{stat.label}</p>
                <p style={{ fontSize: '13px', fontWeight: '700', color: '#818cf8' }}>{stat.val}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ width: '600px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
          <div className="genesis-card" style={{ width: '100%', maxWidth: '440px', padding: '50px', borderRadius: '4px' }}>
            <div style={{ marginBottom: '40px' }}>
              <div className="feature-tag">SYSTEM_ENROLLMENT</div>
              <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '8px' }}>Create account</h1>
              <p style={{ color: 'rgba(232, 232, 240, 0.3)', fontSize: '14px' }}>Start your 14-day free trial today.</p>
            </div>

            {error && (
              <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '14px', marginBottom: '24px', color: '#f87171', fontSize: '13px', textAlign: 'center' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                <input
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  placeholder="FIRST_NAME"
                  className="input-field-genesis"
                  style={{ flex: 1, padding: '16px', borderRadius: '4px', outline: 'none', fontSize: '13px', fontFamily: "'DM Mono', monospace" }}
                />
                <input
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  placeholder="LAST_NAME"
                  className="input-field-genesis"
                  style={{ flex: 1, padding: '16px', borderRadius: '4px', outline: 'none', fontSize: '13px', fontFamily: "'DM Mono', monospace" }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="USER_EMAIL_ADDRESS"
                  className="input-field-genesis"
                  style={{ width: '100%', padding: '16px', borderRadius: '4px', outline: 'none', fontSize: '13px', fontFamily: "'DM Mono', monospace" }}
                />
              </div>

              <div style={{ marginBottom: '32px' }}>
                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="SECURE_ACCESS_KEY"
                  className="input-field-genesis"
                  style={{ width: '100%', padding: '16px', borderRadius: '4px', outline: 'none', fontSize: '13px', fontFamily: "'DM Mono', monospace" }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="register-btn-genesis"
                style={{ 
                  width: '100%', 
                  padding: '18px', 
                  fontSize: '13px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  borderRadius: '4px'
                }}
              >
                {loading ? 'ENROLLING...' : 'INITIALIZE PROFILE'}
              </button>
            </form>

            <p style={{ textAlign: 'center', fontSize: '13px', color: 'rgba(232, 232, 240, 0.3)', marginTop: '32px' }}>
              Already have an account?{' '}
              <span 
                onClick={() => navigate('/login')} 
                style={{ color: '#818cf8', fontWeight: '800', cursor: 'pointer', marginLeft: '4px' }}
              >
                Log in
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
