import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import useUIStore from '../store/uiStore'
import { dashboardAPI } from '../services/api'

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@300;400&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  .dash-root { display: block; min-height: 100vh; background: #0f1117; color: #e8e8f0; font-family: 'DM Sans', sans-serif; }
  .sidebar { width: 200px; min-height: 100vh; background: #0a0b0f; border-right: 1px solid rgba(255,255,255,0.07); display: flex; flex-direction: column; padding: 24px 0; position: fixed; left: 0; top: 0; bottom: 0; z-index: 50; }
  .sidebar-brand { padding: 0 20px 20px; border-bottom: 1px solid rgba(255,255,255,0.06); margin-bottom: 16px; }
  .brand-name { font-size: 16px; font-weight: 600; }
  .brand-sub { font-size: 11px; color: rgba(232,232,240,0.35); margin-top: 2px; }
  .sidebar-nav { flex: 1; padding: 0 10px; }
  .s-item { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 8px; font-size: 13px; color: rgba(232,232,240,0.45); cursor: pointer; transition: all 0.2s; background: none; border: none; width: 100%; text-align: left; margin-bottom: 2px; font-family: 'DM Sans', sans-serif; }
  .s-item:hover { background: rgba(255,255,255,0.05); color: rgba(232,232,240,0.8); }
  .s-item.active { background: rgba(99,102,241,0.15); color: #818cf8; }
  .s-item .ico { width: 18px; text-align: center; font-size: 14px; }
  .sidebar-bottom { padding: 14px 10px; border-top: 1px solid rgba(255,255,255,0.06); }
  .upgrade-btn { width: 100%; padding: 11px 14px; background: linear-gradient(135deg, #6366f1, #8b5cf6); border: none; border-radius: 8px; color: white; font-size: 13px; font-weight: 500; cursor: pointer; margin-bottom: 6px; font-family: 'DM Sans', sans-serif; transition: opacity 0.2s; text-align: left; }
  .upgrade-btn:hover { opacity: 0.85; }
  .topbar { position: fixed; top: 0; left: 200px; right: 0; height: 60px; background: rgba(15,17,23,0.97); border-bottom: 1px solid rgba(255,255,255,0.06); backdrop-filter: blur(20px); display: flex; align-items: center; justify-content: space-between; padding: 0 32px; z-index: 40; }
  .search { display: flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 8px 14px; width: 230px; }
  .search input { background: none; border: none; outline: none; color: rgba(232,232,240,0.6); font-size: 13px; width: 100%; font-family: 'DM Sans', sans-serif; }
  .search input::placeholder { color: rgba(232,232,240,0.25); }
  .t-right { display: flex; align-items: center; gap: 10px; }
  .t-icon { width: 36px; height: 36px; border-radius: 8px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); color: rgba(232,232,240,0.5); cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 15px; }
  .avatar { width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, #6366f1, #8b5cf6); display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 600; color: white; cursor: pointer; border: 2px solid rgba(99,102,241,0.4); }
  .main { margin-left: 200px; padding: 76px 32px 32px; min-height: 100vh; }
  .pg-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 28px; animation: fadeUp 0.4s ease both; }
  .w-title { font-size: 34px; font-weight: 600; margin-bottom: 6px; }
  .w-title span { color: #818cf8; }
  .w-sub { font-size: 13px; color: rgba(232,232,240,0.4); }
  .ai-badge { display: flex; align-items: center; gap: 8px; padding: 9px 16px; background: rgba(99,102,241,0.1); border: 1px solid rgba(99,102,241,0.2); border-radius: 20px; font-size: 12px; font-weight: 500; color: #818cf8; cursor: pointer; }
  .ai-dot { width: 7px; height: 7px; border-radius: 50%; background: #4ade80; animation: glow 2s infinite; }
  @keyframes glow { 0%,100%{box-shadow:0 0 0 0 rgba(74,222,128,0.5)} 50%{box-shadow:0 0 0 5px rgba(74,222,128,0)} }
  .j-grid { display: grid; grid-template-columns: 1fr 300px; gap: 20px; margin-bottom: 20px; animation: fadeUp 0.4s 0.05s ease both; }
  .j-card { background: #161821; border: 1px solid rgba(255,255,255,0.07); border-radius: 16px; padding: 32px; position: relative; overflow: hidden; }
  .j-glow { position: absolute; right: -50px; bottom: -50px; width: 300px; height: 250px; background: radial-gradient(ellipse, rgba(99,102,241,0.1) 0%, transparent 70%); pointer-events: none; }
  .j-label { font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase; color: #818cf8; margin-bottom: 12px; font-family: 'DM Mono', monospace; }
  .j-title { font-size: 26px; font-weight: 600; margin-bottom: 14px; }
  .j-desc { font-size: 13px; color: rgba(232,232,240,0.4); line-height: 1.7; margin-bottom: 24px; max-width: 380px; }
  .j-btn { display: inline-flex; align-items: center; gap: 8px; padding: 12px 22px; background: #6366f1; border: none; border-radius: 8px; color: white; font-size: 13px; font-weight: 500; font-family: 'DM Sans', sans-serif; cursor: pointer; transition: all 0.2s; }
  .j-btn:hover { background: #818cf8; transform: translateY(-1px); }
  .n-card { background: #161821; border: 1px solid rgba(255,255,255,0.07); border-radius: 16px; padding: 26px; display: flex; flex-direction: column; }
  .n-icon { width: 42px; height: 42px; border-radius: 10px; background: rgba(99,102,241,0.12); display: flex; align-items: center; justify-content: center; font-size: 20px; margin-bottom: 14px; }
  .n-title { font-size: 18px; font-weight: 600; margin-bottom: 8px; }
  .n-desc { font-size: 13px; color: rgba(232,232,240,0.4); line-height: 1.6; margin-bottom: 18px; flex: 1; }
  .n-meta { display: flex; gap: 20px; margin-bottom: 18px; padding-top: 14px; border-top: 1px solid rgba(255,255,255,0.06); }
  .m-item { font-size: 11px; color: rgba(232,232,240,0.35); }
  .m-item strong { display: block; color: rgba(232,232,240,0.65); font-size: 12px; margin-bottom: 2px; font-weight: 500; }
  .sch-btn { width: 100%; padding: 11px; background: transparent; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: rgba(232,232,240,0.6); font-size: 13px; font-weight: 500; font-family: 'DM Sans', sans-serif; cursor: pointer; transition: all 0.2s; }
  .sch-btn:hover { border-color: rgba(99,102,241,0.4); color: #818cf8; }
  .s-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 20px; margin-bottom: 20px; animation: fadeUp 0.4s 0.1s ease both; }
  .s-card { background: #161821; border: 1px solid rgba(255,255,255,0.07); border-radius: 16px; padding: 22px; }
  .s-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }
  .s-lbl { font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(232,232,240,0.3); font-family: 'DM Mono', monospace; }
  .s-ico { width: 30px; height: 30px; border-radius: 7px; background: rgba(255,255,255,0.05); display: flex; align-items: center; justify-content: center; font-size: 14px; }
  .s-num { font-size: 38px; font-weight: 700; line-height: 1; margin-bottom: 3px; }
  .s-unit { font-size: 18px; font-weight: 400; color: rgba(232,232,240,0.35); }
  .s-pct { color: #818cf8; }
  .s-bar { height: 3px; background: rgba(255,255,255,0.07); border-radius: 2px; margin: 10px 0 7px; overflow: hidden; }
  .s-fill-b { height: 100%; background: #6366f1; border-radius: 2px; }
  .s-fill-o { height: 100%; background: linear-gradient(90deg,#f97316,#ef4444); border-radius: 2px; }
  .s-fill-g { height: 100%; background: #4ade80; border-radius: 2px; }
  .s-desc { font-size: 11px; color: rgba(232,232,240,0.3); }
  .a-card { background: #161821; border: 1px solid rgba(255,255,255,0.07); border-radius: 16px; padding: 26px; animation: fadeUp 0.4s 0.15s ease both; }
  .a-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
  .a-title { font-size: 17px; font-weight: 600; }
  .view-all { font-size: 13px; color: #818cf8; background: none; border: none; cursor: pointer; font-family: 'DM Sans', sans-serif; }
  .a-item { display: flex; align-items: center; gap: 14px; padding: 14px 0; border-bottom: 1px solid rgba(255,255,255,0.05); cursor: pointer; transition: opacity 0.2s; }
  .a-item:last-child { border-bottom: none; padding-bottom: 0; }
  .a-item:hover { opacity: 0.75; }
  .a-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
  .dg { background: #4ade80; } .do { background: #f97316; } .db { background: #818cf8; }
  .a-info { flex: 1; }
  .a-name { font-size: 13px; font-weight: 500; margin-bottom: 3px; }
  .a-meta { font-size: 11px; color: rgba(232,232,240,0.35); }
  .a-arr { color: rgba(232,232,240,0.2); font-size: 18px; }
  .dash-footer { background: #0a0b0f; border-top: 1px solid rgba(255,255,255,0.06); padding: 22px 32px; display: flex; justify-content: space-between; align-items: center; margin-left: 200px; }
  .f-brand { font-size: 13px; font-weight: 600; margin-bottom: 2px; }
  .f-copy { font-size: 11px; color: rgba(232,232,240,0.25); }
  .f-links { display: flex; gap: 20px; }
  .f-link { font-size: 11px; color: rgba(232,232,240,0.3); background: none; border: none; cursor: pointer; transition: color 0.2s; font-family: 'DM Sans', sans-serif; }
  .f-link:hover { color: rgba(232,232,240,0.65); }
  .fab { position: fixed; bottom: 28px; right: 28px; width: 50px; height: 50px; border-radius: 50%; background: linear-gradient(135deg,#6366f1,#8b5cf6); border: none; color: white; font-size: 20px; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 24px rgba(99,102,241,0.4); transition: transform 0.2s; z-index: 99; }
  .fab:hover { transform: scale(1.1); }
  @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
`

const NAV = [
  { ico: '⊞', label: 'Dashboard', id: 'dashboard', path: '/dashboard' },
  { ico: '📍', label: 'Road Map', id: 'roadmap', path: '/roadmap' },
  { ico: '📊', label: 'Analytics', id: 'analytics', path: '/analytics' },
  { ico: '🎤', label: 'Mock Interview', id: 'interview', path: '/interview' },
  { ico: '⚡', label: 'Prep Hub', id: 'prep', path: '/prep' },
  { ico: '📈', label: 'Progress', id: 'progress', path: '/progress' },
]

export default function Dashboard() {
  // ✅ ALL HOOKS MUST BE CALLED AT THE TOP - BEFORE ANY CONDITIONAL RETURNS
  // This is a React Rules of Hooks requirement
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const token = useAuthStore((s) => s.token)
  const navigate = useNavigate()
  const openUpgrade = useUIStore((s) => s.openUpgradeModal)
  const openHelp = useUIStore((s) => s.openHelpModal)
  
  const [active, setActive] = useState('dashboard')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!user && !token) {
      navigate('/login')
      return
    }

    const loadData = async () => {
      try {
        const res = await dashboardAPI.getSummary()
        setData(res.data)
        setError(null)
      } catch (err) {
        console.error('Error fetching dashboard data:', err)
        setError(err.message)
        setData(null)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [user, token, navigate])

  // ✅ NOW we can do conditional returns - all hooks have been called
  if (!user && !token) return null
  
  if (loading) {
    return (
      <div className="dash-root" style={{display:'flex',alignItems:'center',justifyContent:'center'}}>
        <div style={{textAlign:'center'}}>
          <div style={{fontSize:'18px',marginBottom:'8px'}}>⏳ Loading dashboard...</div>
          <div style={{fontSize:'12px',color:'rgba(232,232,240,0.5)'}}>Fetching your latest progress</div>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="dash-root" style={{display:'flex',alignItems:'center',justifyContent:'center'}}>
        <div style={{textAlign:'center'}}>
          <div style={{fontSize:'18px',marginBottom:'8px'}}>⚠️ Unable to load dashboard</div>
          <div style={{fontSize:'12px',color:'rgba(232,232,240,0.5)',marginBottom:'16px'}}>
            {error || 'No data received from server'}
          </div>
          <button onClick={() => window.location.reload()} style={{
            padding:'8px 16px',
            background:'#6366f1',
            border:'none',
            borderRadius:'6px',
            color:'white',
            fontSize:'12px',
            cursor:'pointer',
            fontFamily:'DM Sans'
          }}>
            Retry
          </button>
        </div>
      </div>
    )
  }

  const firstName = data?.firstName || user?.firstName || 'User'
  const stats = data?.stats || {}
  const journey = data?.activeJourney || {}
  const step = data?.recommendedStep || {}
  const recentActivity = data?.recentActivity || []

  return (
    <div className="dash-root">
      <style>{styles}</style>

      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-name">Placifai AI</div>
          <div className="brand-sub">AI Career Coach</div>
        </div>
        <nav className="sidebar-nav">
          {NAV.map(n => (
            <button key={n.id} className={`s-item ${active === n.id ? 'active' : ''}`}
              onClick={() => { setActive(n.id); navigate(n.path) }}>
              <span className="ico">{n.ico}</span>{n.label}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <button className="upgrade-btn" onClick={openUpgrade}>✦ Upgrade to Pro</button>
          <button className="s-item" onClick={openHelp}><span className="ico">?</span>Help Center</button>
          <button className="s-item" onClick={() => { logout(); navigate('/login') }}>
            <span className="ico">→</span>Logout
          </button>
        </div>
      </aside>

      <header className="topbar">
        <div className="search">
          <span style={{color:'rgba(232,232,240,0.3)',fontSize:'13px'}}>🔍</span>
          <input placeholder="Search resources..." />
        </div>
        <div className="t-right">
          <button className="t-icon">🔔</button>
          <button className="t-icon">⚙</button>
          <div className="avatar">{firstName[0].toUpperCase()}</div>
        </div>
      </header>

      <main className="main">
        <div className="pg-header">
          <div>
            <div className="w-title">Hello <span>{firstName}</span></div>
            <div className="w-sub">{data?.subtitle || "You're making great progress towards your goal."}</div>
          </div>
          <div className="ai-badge"><div className="ai-dot" />✦ AI Coach Online</div>
        </div>

        <div className="j-grid">
          <div className="j-card">
            <div className="j-glow" />
            <div className="j-label">{journey.label}</div>
            <div className="j-title">{journey.title}</div>
            <div className="j-desc">{journey.description}</div>
            <button className="j-btn" onClick={() => navigate(journey.action?.route || '/roadmap')}>{journey.action?.label || 'Continue'} →</button>
          </div>
          <div className="n-card">
            <div className="n-icon">👥</div>
            <div className="n-title">{step.title}</div>
            <div className="n-desc">{step.description}</div>
            <div className="n-meta">
              <div className="m-item"><strong>Estimated Time</strong>{step.estimatedTime}</div>
              <div className="m-item"><strong>Focus</strong>{step.focus}</div>
            </div>
            <button className="sch-btn" onClick={() => navigate(step.route || '/interview')}>Schedule Mock</button>
          </div>
        </div>

        <div className="s-grid">
          <div className="s-card">
            <div className="s-head"><div className="s-lbl">ATS Resume Score</div><div className="s-ico">📄</div></div>
            <div className="s-num">{stats.resumeScore || 0} <span className="s-unit">/100</span></div>
            <div className="s-bar"><div className="s-fill-b" style={{width:`${stats.resumeScore || 0}%`}} /></div>
            <div className="s-desc">Good standing. Based on your latest upload.</div>
          </div>
          <div className="s-card">
            <div className="s-head"><div className="s-lbl">Roadmap Progress</div><div className="s-ico">✨</div></div>
            <div className="s-num"><span className="s-pct">{stats.roadmapProgress || 0}%</span> <span className="s-unit">Complete</span></div>
            <div className="s-bar"><div className="s-fill-o" style={{width:`${stats.roadmapProgress || 0}%`}} /></div>
            <div className="s-desc">Keep completing tasks to reach 100%.</div>
          </div>
          <div className="s-card">
            <div className="s-head"><div className="s-lbl">Readiness Level</div><div className="s-ico">✅</div></div>
            <div className="s-num" style={{fontSize:'32px'}}>{stats.readinessLevel || 'Growing'}</div>
            <div className="s-bar"><div className="s-fill-g" style={{width:`${stats.readinessPercent || 0}%`}} /></div>
            <div className="s-desc">Based on your score and progress.</div>
          </div>
        </div>

        <div className="a-card">
          <div className="a-head">
            <div className="a-title">Recent Activity</div>
            <button className="view-all">View All</button>
          </div>
          {recentActivity.length > 0 ? (
            recentActivity.map((a, i) => (
              <div className="a-item" key={i}>
                <div className={`a-dot ${a.type === 'practice' ? 'dg' : a.type === 'resume' ? 'do' : 'db'}`} />
                <div className="a-info">
                  <div className="a-name">{a.name}</div>
                  <div className="a-meta">{a.meta}</div>
                </div>
                <div className="a-arr">›</div>
              </div>
            ))
          ) : (
            <div style={{padding:'20px',textAlign:'center',color:'rgba(232,232,240,0.4)',fontSize:'13px'}}>
              No recent activity yet. Start your journey! 🚀
            </div>
          )}
        </div>
      </main>

      <footer className="dash-footer">
        <div><div className="f-brand">Placifai AI</div><div className="f-copy">© 2026 Placifai AI. Intellectual Career Guidance.</div></div>
        <div className="f-links">
          <button className="f-link">Privacy Policy</button>
          <button className="f-link">Terms of Service</button>
          <button className="f-link">Contact Support</button>
        </div>
      </footer>

      <button className="fab">🤖</button>
    </div>
  )
}