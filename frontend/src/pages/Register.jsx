import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import { authAPI } from '../services/api'

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
        background: 'radial-gradient(circle at 0% 0%, rgba(99, 102, 241, 0.15) 0%, transparent 50%), radial-gradient(circle at 100% 100%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Abstract background shapes */}
        <div style={{ position: 'absolute', top: '-100px', left: '-100px', width: '400px', height: '400px', background: 'rgba(99, 102, 241, 0.05)', borderRadius: '50%', filter: 'blur(80px)' }} />
        
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '48px' }}>
            <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '20px' }}>P</div>
            <span style={{ fontSize: '24px', fontWeight: '700', letterSpacing: '-0.5px' }}>PlacifAI</span>
          </div>

          <h2 style={{ fontSize: '48px', fontWeight: '700', lineHeight: '1.1', marginBottom: '24px', maxWidth: '500px' }}>
            Accelerate your <span style={{ background: 'linear-gradient(135deg, #818cf8, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>career journey</span> with AI.
          </h2>
          
          <p style={{ fontSize: '18px', color: 'rgba(232, 232, 240, 0.5)', marginBottom: '48px', maxWidth: '450px', lineHeight: '1.6' }}>
            Join over 10,000+ candidates who use PlacifAI to land roles at top tech companies through personalized roadmaps and AI mock interviews.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {[
              { title: 'Personalized Roadmaps', desc: 'AI-generated paths tailored to your target role.' },
              { title: 'Mock Interviews', desc: 'Real-time feedback from our advanced AI interviewer.' },
              { title: 'ATS Analysis', desc: 'Optimize your resume for modern hiring systems.' }
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: '16px' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#818cf8', fontSize: '14px' }}>✓</div>
                <div>
                  <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>{item.title}</h4>
                  <p style={{ fontSize: '14px', color: 'rgba(232, 232, 240, 0.4)' }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side: Registration Form */}
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
            <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px' }}>Create account</h1>
            <p style={{ color: 'rgba(232, 232, 240, 0.4)', fontSize: '15px' }}>Start your 14-day free trial today.</p>
          </div>

          {error && (
            <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '12px', padding: '14px', marginBottom: '24px', color: '#f87171', fontSize: '14px', display: 'flex', gap: '10px', alignItems: 'center' }}>
              <span style={{ fontSize: '18px' }}>⚠</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', color: 'rgba(232, 232, 240, 0.6)', fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>First Name</label>
                <input
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  placeholder="Jane"
                  style={{ width: '100%', padding: '12px 16px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '10px', color: '#e8e8f0', fontSize: '14px', outline: 'none', transition: 'border-color 0.2s', fontFamily: 'inherit' }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', color: 'rgba(232, 232, 240, 0.6)', fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>Last Name</label>
                <input
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  placeholder="Doe"
                  style={{ width: '100%', padding: '12px 16px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '10px', color: '#e8e8f0', fontSize: '14px', outline: 'none', transition: 'border-color 0.2s', fontFamily: 'inherit' }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', color: 'rgba(232, 232, 240, 0.6)', fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>Email Address</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="jane@example.com"
                style={{ width: '100%', padding: '12px 16px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '10px', color: '#e8e8f0', fontSize: '14px', outline: 'none', transition: 'border-color 0.2s', fontFamily: 'inherit' }}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', color: 'rgba(232, 232, 240, 0.6)', fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>Password</label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                style={{ width: '100%', padding: '12px 16px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '10px', color: '#e8e8f0', fontSize: '14px', outline: 'none', transition: 'border-color 0.2s', fontFamily: 'inherit' }}
              />
              <p style={{ fontSize: '12px', color: 'rgba(232, 232, 240, 0.3)', marginTop: '8px' }}>Must be at least 8 characters.</p>
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
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.05)' }} />
            <span style={{ fontSize: '13px', color: 'rgba(232, 232, 240, 0.3)' }}>OR</span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.05)' }} />
          </div>

          <p style={{ textAlign: 'center', fontSize: '14px', color: 'rgba(232, 232, 240, 0.5)' }}>
            Already have an account?{' '}
            <span 
              onClick={() => navigate('/login')} 
              style={{ color: '#818cf8', fontWeight: '600', cursor: 'pointer', marginLeft: '4px' }}
            >
              Log in
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}
