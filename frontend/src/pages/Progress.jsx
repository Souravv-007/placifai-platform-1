import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import { progressAPI } from '../services/api'
import useUIStore from '../store/uiStore'

const styles = `

  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@300;400&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  .prog-root { display: block; min-height: 100vh; background: #0f1117; color: #e8e8f0; font-family: 'DM Sans', sans-serif; }
 
  /* SIDEBAR */
  .sb { width: 200px; min-height: 100vh; background: #0a0b0f; border-right: 1px solid rgba(255,255,255,0.07); display: flex; flex-direction: column; padding: 22px 0; position: fixed; left: 0; top: 0; bottom: 0; z-index: 50; }
  .sb-logo { padding: 0 18px 18px; border-bottom: 1px solid rgba(255,255,255,0.06); margin-bottom: 14px; font-size: 16px; font-weight: 700; color: #818cf8; }
  .sb-nav { flex: 1; padding: 0 10px; }
  .sb-i { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 8px; font-size: 13px; color: rgba(232,232,240,0.45); cursor: pointer; transition: all 0.2s; background: none; border: none; width: 100%; text-align: left; margin-bottom: 2px; font-family: 'DM Sans', sans-serif; }
  .sb-i:hover { background: rgba(255,255,255,0.05); color: rgba(232,232,240,0.8); }
  .sb-i.active { background: rgba(99,102,241,0.15); color: #818cf8; }
  .sb-i .ico { width: 20px; text-align: center; font-size: 14px; }
  .sb-promo { margin: 0 10px 10px; background: linear-gradient(135deg,rgba(99,102,241,0.1),rgba(139,92,246,0.05)); border: 1px solid rgba(99,102,241,0.15); border-radius: 10px; padding: 14px; }
  .promo-title { font-size: 12px; font-weight: 700; margin-bottom: 4px; color: #e8e8f0; }
  .promo-sub { font-size: 10px; color: rgba(232,232,240,0.4); margin-bottom: 12px; line-height: 1.5; }
  .promo-btn { width: 100%; padding: 10px; background: linear-gradient(135deg,#6366f1,#8b5cf6); border: none; border-radius: 7px; color: white; font-size: 12px; font-weight: 600; cursor: pointer; margin-bottom: 8px; font-family: 'DM Sans', sans-serif; transition: opacity 0.2s; }
  .promo-btn:hover { opacity: 0.85; }
  .promo-btn-sec { background: transparent; border: 1px solid rgba(99,102,241,0.3); color: #818cf8; }
  .promo-btn-sec:hover { background: rgba(99,102,241,0.08); }
  .sb-bottom { padding: 10px; border-top: 1px solid rgba(255,255,255,0.06); }
 
  /* TOPBAR */
  .tb { position: fixed; top: 0; left: 200px; right: 0; height: 56px; background: rgba(15,17,23,0.97); border-bottom: 1px solid rgba(255,255,255,0.06); backdrop-filter: blur(20px); display: flex; align-items: center; justify-content: space-between; padding: 0 28px; z-index: 40; }
  .tb-search { display: flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 8px 14px; width: 200px; }
  .tb-search input { background: none; border: none; outline: none; color: rgba(232,232,240,0.6); font-size: 13px; width: 100%; font-family: 'DM Sans', sans-serif; }
  .tb-search input::placeholder { color: rgba(232,232,240,0.25); }
  .tb-right { display: flex; align-items: center; gap: 10px; }
  .tb-icon { width: 34px; height: 34px; border-radius: 8px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); color: rgba(232,232,240,0.5); cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 14px; }
  .tb-av { width: 34px; height: 34px; border-radius: 50%; background: linear-gradient(135deg,#6366f1,#8b5cf6); display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; color: white; cursor: pointer; border: 2px solid rgba(99,102,241,0.4); }
 
  /* MAIN */
  .main { margin-left: 200px; padding: 72px 28px 48px; min-height: 100vh; }
 
  /* PAGE HEADER */
  .pg-title { font-size: 36px; font-weight: 700; margin-bottom: 10px; animation: fadeUp 0.4s ease both; }
  .pg-sub { font-size: 14px; color: rgba(232,232,240,0.4); margin-bottom: 28px; animation: fadeUp 0.4s 0.05s ease both; }
 
  /* STATS GRID */
  .stats-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 14px; margin-bottom: 28px; animation: fadeUp 0.4s 0.08s ease both; }
  .stat-card { background: #161821; border: 1px solid rgba(255,255,255,0.07); border-radius: 12px; padding: 20px; }
  .stat-lbl { font-size: 9px; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(232,232,240,0.3); font-family: 'DM Mono', monospace; margin-bottom: 10px; }
  .stat-num { font-size: 40px; font-weight: 700; line-height: 1; margin-bottom: 8px; }
  .stat-num span { font-size: 16px; font-weight: 400; color: rgba(232,232,240,0.35); }
  .stat-desc { font-size: 11px; color: rgba(232,232,240,0.4); }
  .stat-change { color: #4ade80; }
  .stat-bar { height: 3px; background: rgba(255,255,255,0.07); border-radius: 2px; overflow: hidden; margin-top: 10px; }
  .stat-fill { height: 100%; background: linear-gradient(90deg,#6366f1,#818cf8); border-radius: 2px; }
 
  /* CHART GRID */
  .chart-grid { display: grid; grid-template-columns: 1fr 280px; gap: 20px; margin-bottom: 24px; }
 
  .chart-card { background: #161821; border: 1px solid rgba(255,255,255,0.07); border-radius: 14px; padding: 24px; animation: fadeUp 0.4s 0.1s ease both; }
  .chart-title { font-size: 18px; font-weight: 700; margin-bottom: 6px; }
  .chart-sub { font-size: 12px; color: rgba(232,232,240,0.4); margin-bottom: 20px; }
 
  .chart-tabs { display: flex; gap: 12px; margin-bottom: 20px; }
  .chart-tab { padding: 6px 12px; border-radius: 5px; font-size: 11px; font-weight: 600; border: none; background: transparent; color: rgba(232,232,240,0.4); cursor: pointer; transition: all 0.2s; font-family: 'DM Sans', sans-serif; }
  .chart-tab.active { background: rgba(99,102,241,0.15); color: #818cf8; }
 
  .chart-viz { height: 200px; display: flex; align-items: flex-end; justify-content: space-around; gap: 8px; position: relative; }
  .chart-line { width: 100%; height: 100%; position: relative; }
  .line-svg { width: 100%; height: 100%; }
 
  .peak-label { position: absolute; top: -24px; right: 0; font-size: 12px; font-weight: 700; color: #a78bfa; }
  .week-labels { display: flex; justify-content: space-between; margin-top: 16px; padding: 0 8px; }
  .week-label { font-size: 10px; color: rgba(232,232,240,0.35); font-family: 'DM Mono', monospace; }
 
  .streak-card { background: #161821; border: 1px solid rgba(255,255,255,0.07); border-radius: 14px; padding: 24px; display: flex; flex-direction: column; align-items: center; text-align: center; animation: fadeUp 0.4s 0.12s ease both; }
  .streak-icon { width: 56px; height: 56px; border-radius: 12px; background: rgba(139,92,246,0.15); display: flex; align-items: center; justify-content: center; font-size: 28px; margin-bottom: 14px; }
  .streak-val { font-size: 32px; font-weight: 700; margin-bottom: 4px; }
  .streak-lbl { font-size: 12px; color: rgba(232,232,240,0.4); }
 
  /* ACHIEVEMENTS & INSIGHTS */
  .section-grid { display: grid; grid-template-columns: 1fr 280px; gap: 20px; }
 
  .achievements { background: #161821; border: 1px solid rgba(255,255,255,0.07); border-radius: 14px; padding: 24px; animation: fadeUp 0.4s 0.14s ease both; }
  .ach-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
  .ach-title { font-size: 18px; font-weight: 700; }
  .ach-view { font-size: 12px; color: #818cf8; cursor: pointer; background: none; border: none; font-family: 'DM Sans', sans-serif; }
 
  .ach-item { display: flex; gap: 14px; margin-bottom: 14px; padding-bottom: 14px; border-bottom: 1px solid rgba(255,255,255,0.05); }
  .ach-item:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
  .ach-icon { width: 44px; height: 44px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0; }
  .icon-dp { background: rgba(245,158,11,0.15); }
  .icon-amazon { background: rgba(99,102,241,0.15); }
  .icon-resolver { background: rgba(76,175,80,0.15); }
 
  .ach-info { flex: 1; }
  .ach-name { font-size: 14px; font-weight: 600; margin-bottom: 2px; }
  .ach-desc { font-size: 11px; color: rgba(232,232,240,0.4); line-height: 1.5; }
  .ach-time { font-size: 10px; color: rgba(232,232,240,0.3); margin-top: 4px; }
 
  .insight { background: linear-gradient(135deg,rgba(99,102,241,0.1),rgba(139,92,246,0.05)); border: 1px solid rgba(99,102,241,0.15); border-radius: 14px; padding: 20px; animation: fadeUp 0.4s 0.16s ease both; }
  .insight-title { font-size: 15px; font-weight: 700; margin-bottom: 12px; display: flex; align-items: center; gap: 8px; }
  .insight-icon { font-size: 16px; }
  .insight-text { font-size: 12px; color: rgba(232,232,240,0.6); line-height: 1.7; font-style: italic; }
 
  .skill-insights { margin-top: 20px; }
  .skill-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
  .skill-name { font-size: 11px; font-weight: 600; text-transform: uppercase; color: rgba(232,232,240,0.5); font-family: 'DM Mono', monospace; }
  .skill-level { font-size: 11px; font-weight: 700; background: rgba(99,102,241,0.15); color: #a78bfa; padding: 2px 8px; border-radius: 4px; }
 
  /* FOOTER */
  .footer { background: #0a0b0f; border-top: 1px solid rgba(255,255,255,0.06); padding: 20px 28px; display: flex; justify-content: space-between; align-items: center; margin-left: 200px; }
  .f-brand { font-size: 13px; font-weight: 600; margin-bottom: 2px; }
  .f-copy { font-size: 11px; color: rgba(232,232,240,0.25); }
  .f-links { display: flex; gap: 20px; }
  .f-link { font-size: 11px; color: rgba(232,232,240,0.3); background: none; border: none; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: color 0.2s; }
  .f-link:hover { color: rgba(232,232,240,0.6); }
 
  @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
`
 
const NAV = [
  { ico: '⊞', label: 'Dashboard', id: 'dashboard', path: '/dashboard' },
  { ico: '📍', label: 'Roadmap', id: 'roadmap', path: '/roadmap' },
  { ico: '📊', label: 'Analytics', id: 'analytics', path: '/analytics' },
  { ico: '🎤', label: 'Mock Interview', id: 'interview', path: '/interview' },
  { ico: '⚡', label: 'Prep Hub', id: 'prep', path: '/prep' },
  { ico: '📈', label: 'Progress', id: 'progress', path: '/progress' },
]
 
export default function Progress() {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()
  const [active, setActive] = useState('progress')
  const [chartTab, setChartTab] = useState('technical')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const openUpgrade = useUIStore((s) => s.openUpgradeModal)
  const openHelp = useUIStore((s) => s.openHelpModal)
 
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const res = await progressAPI.getSummary()
        setData(res.data)
        setError(null)
      } catch (err) {
        console.error('Error fetching progress data:', err)
        setError('Failed to load progress data. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])
 
  if (!user) { navigate('/login'); return null }
  
  if (loading) return (
    <div className="prog-root" style={{display:'flex',alignItems:'center',justifyContent:'center', flexDirection: 'column'}}>
      <div style={{ width: '40px', height: '40px', border: '3px solid rgba(99, 102, 241, 0.2)', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      <p style={{ marginTop: '20px', color: 'rgba(232, 232, 240, 0.4)', fontSize: '14px' }}>Analyzing your performance...</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )

  if (error) return (
    <div className="prog-root" style={{display:'flex',alignItems:'center',justifyContent:'center', flexDirection: 'column'}}>
      <p style={{ color: '#ef4444', marginBottom: '16px' }}>{error}</p>
      <button onClick={() => window.location.reload()} style={{ padding: '8px 16px', background: '#6366f1', border: 'none', borderRadius: '6px', color: 'white', cursor: 'pointer' }}>Retry</button>
    </div>
  )
 
  const firstName = user?.firstName || 'User'
  const stats = data?.stats || {}
  const improvement = data?.weeklyImprovement || {}
  const achievements = data?.achievements || []
  const insight = data?.insight || {}
  const heatmap = data?.activityHeatmap || []

  const generatePath = (vals) => {
    if (!vals || vals.length === 0) return ""
    const width = 700
    const height = 200
    const step = width / (vals.length - 1)
    return vals.map((v, i) => {
      const x = i * step
      const y = height - (v / 100) * height * 0.7 - 20
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
    }).join(' ')
  }

  const chartVals = chartTab === 'technical' ? improvement.technical : improvement.behavioral
  const chartPath = generatePath(chartVals)
  const fillPath = chartPath ? `${chartPath} L 700 200 L 0 200 Z` : ""
 
  return (
    <div className="prog-root">
      <style>{styles}</style>
 
      {/* SIDEBAR */}
      <aside className="sb">
        <div className="sb-logo">Placifai AI</div>
        <nav className="sb-nav">
          {NAV.map(n => (
            <button key={n.id} className={`sb-i ${active === n.id ? 'active' : ''}`}
              onClick={() => { setActive(n.id); navigate(n.path) }}>
              <span className="ico">{n.ico}</span>{n.label}
            </button>
          ))}
        </nav>
        <div className="sb-promo">
          <div className="promo-title">Upgrade to Pro</div>
          <div className="promo-sub">Get unlimited mock sessions and FAANG resume review</div>
          <button className="promo-btn" onClick={openUpgrade}>Upgrade to Pro</button>
          <button className="promo-btn promo-btn-sec" onClick={openUpgrade}>Learn More</button>
        </div>
        <div className="sb-bottom">
          <button className="sb-i" onClick={openHelp}><span className="ico">?</span>Help Center</button>
          <button className="sb-i" onClick={() => { logout(); navigate('/login') }}>
            <span className="ico">→</span>Logout
          </button>
        </div>
      </aside>
 
      {/* TOPBAR */}
      <header className="tb">
        <div className="tb-search">
          <span style={{color:'rgba(232,232,240,0.3)',fontSize:'13px'}}>🔍</span>
          <input placeholder="Search insights..." />
        </div>
        <div className="tb-right">
          <button className="tb-icon">🔔</button>
          <button className="tb-icon">⚙</button>
          <div className="tb-av">{firstName[0].toUpperCase()}</div>
        </div>
      </header>
 
      {/* MAIN */}
      <main className="main">
        <div className="pg-title">Performance Analytics</div>
        <div className="pg-sub">Real-time tracking of your interview readiness and skill growth.</div>
 
        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-lbl">Interview Readiness</div>
            <div className="stat-num">{stats.readiness || 0}<span>%</span></div>
            <div className="stat-desc"><span className="stat-change">+12% this week</span></div>
            <div className="stat-bar"><div className="stat-fill" style={{ width: `${stats.readiness || 0}%` }} /></div>
          </div>
          <div className="stat-card">
            <div className="stat-lbl">Total Practice</div>
            <div className="stat-num">{stats.totalPracticeHours || 0}<span>h</span></div>
            <div className="stat-desc">↗ Top 6% of candidates</div>
            <div className="stat-bar"><div className="stat-fill" style={{ width: `${Math.min(100, (stats.totalPracticeHours / 200) * 100)}%` }} /></div>
          </div>
          <div className="stat-card">
            <div className="stat-lbl">Concepts Mastered</div>
            <div className="stat-num">{stats.conceptsMastered || 0}</div>
            <div className="stat-desc">Target: 100 concepts</div>
            <div className="stat-bar"><div className="stat-fill" style={{ width: `${Math.min(100, stats.conceptsMastered)}%` }} /></div>
          </div>
          <div className="stat-card">
            <div className="stat-lbl">Current Streak</div>
            <div className="stat-num">{stats.currentStreakDays || 0}<span>d</span></div>
            <div className="stat-desc">Keep it going!</div>
            <div className="stat-bar"><div className="stat-fill" style={{ width: `${Math.min(100, (stats.currentStreakDays / 14) * 100)}%` }} /></div>
          </div>
        </div>

        {/* Skill Breakdown & Benchmarks */}
        <div className="chart-grid" style={{ marginBottom: '28px' }}>
          <div className="chart-card">
            <div className="chart-title">Skill Breakdown</div>
            <div className="chart-sub">Performance across key competency areas</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginTop: '16px' }}>
              {(data?.skillsBreakdown || []).map((skill, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
                    <span style={{ fontWeight: 600 }}>{skill.name}</span>
                    <span style={{ color: '#818cf8' }}>{skill.score}%</span>
                  </div>
                  <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${skill.score}%`, background: 'linear-gradient(90deg, #6366f1, #818cf8)' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="chart-card">
            <div className="chart-title">Benchmarks</div>
            <div className="chart-sub">Vs. {data?.benchmarks?.targetRole || 'Industry Standard'}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px', color: 'rgba(232,232,240,0.4)' }}>
                  <span>YOU</span>
                  <span>{data?.benchmarks?.you}%</span>
                </div>
                <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${data?.benchmarks?.you}%`, background: '#818cf8' }} />
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px', color: 'rgba(232,232,240,0.4)' }}>
                  <span>AVERAGE</span>
                  <span>{data?.benchmarks?.average}%</span>
                </div>
                <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${data?.benchmarks?.average}%`, background: 'rgba(255,255,255,0.2)' }} />
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px', color: 'rgba(232,232,240,0.4)' }}>
                  <span>TOP 10%</span>
                  <span>{data?.benchmarks?.top10}%</span>
                </div>
                <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${data?.benchmarks?.top10}%`, background: '#4ade80' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
 
        {/* Charts & Next Steps */}
        <div className="chart-grid">
          <div className="chart-card">
            <div className="chart-title">Weekly Improvement</div>
            <div className="chart-sub">Confidence score over last 8 weeks</div>
            <div className="chart-tabs">
              <button className={`chart-tab ${chartTab === 'technical' ? 'active' : ''}`}
                onClick={() => setChartTab('technical')}>Technical</button>
              <button className={`chart-tab ${chartTab === 'behavioral' ? 'active' : ''}`}
                onClick={() => setChartTab('behavioral')}>Behavioral</button>
            </div>
            <div style={{ marginBottom: '12px', color: '#a78bfa', fontSize: '12px', fontWeight: '700' }}>
              Peak Readiness<br/>{improvement.peakReadiness || 0}%
            </div>
            <div className="chart-viz">
              <svg className="line-svg" viewBox="0 0 700 200" preserveAspectRatio="xMidYMid meet">
                <defs>
                  <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#6366f1', stopOpacity: 0.2 }} />
                    <stop offset="100%" style={{ stopColor: '#6366f1', stopOpacity: 0 }} />
                  </linearGradient>
                </defs>
                <path d={chartPath} stroke="#6366f1" strokeWidth="3" fill="none" style={{ transition: 'all 0.4s' }} />
                <path d={fillPath} fill="url(#grad)" style={{ transition: 'all 0.4s' }} />
              </svg>
            </div>
            <div className="week-labels">
              <span className="week-label">WK 1</span>
              <span className="week-label">WK 2</span>
              <span className="week-label">WK 3</span>
              <span className="week-label">WK 4</span>
              <span className="week-label">WK 5</span>
              <span className="week-label">WK 6</span>
              <span className="week-label">WK 7</span>
              <span className="week-label">WK 8</span>
            </div>
          </div>
 
          <div className="chart-card">
            <div className="chart-title">Next Steps</div>
            <div className="chart-sub">Personalized recommendations</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
              {(data?.nextSteps || []).map((step, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '12px', display: 'flex', gap: '12px', alignItems: 'center', cursor: 'pointer' }} onClick={() => navigate(step.title.includes('Design') || step.title.includes('Algorithm') ? '/roadmap' : '/interview')}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>{step.icon}</div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600 }}>{step.title}</div>
                    <div style={{ fontSize: '11px', color: 'rgba(232,232,240,0.4)' }}>{step.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Interview History & Activity */}
        <div className="section-grid" style={{ marginTop: '24px' }}>
          <div className="chart-card">
            <div className="chart-title">Interview History</div>
            <div className="chart-sub">Your latest performance data</div>
            <div style={{ marginTop: '16px' }}>
              {data?.interviewHistory?.length > 0 ? (
                data.interviewHistory.map((session, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: i < (data.interviewHistory.length - 1) ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 600 }}>{session.role} @ {session.company}</div>
                      <div style={{ fontSize: '11px', color: 'rgba(232,232,240,0.4)' }}>{new Date(session.date).toLocaleDateString()}</div>
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: 700, color: session.score > 75 ? '#4ade80' : '#818cf8' }}>{session.score}%</div>
                  </div>
                ))
              ) : (
                <div style={{ padding: '20px', textAlign: 'center', color: 'rgba(232,232,240,0.3)', fontSize: '13px' }}>
                  No interview sessions yet.
                </div>
              )}
            </div>
          </div>

          <div className="chart-card" style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="chart-title">Prep Activity</div>
            <div className="chart-sub">Intensity of daily sessions</div>
            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: '6px', marginTop: '8px' }}>
              {heatmap.map((intensity, i) => {
                const opacity = 0.2 + intensity * 0.8
                return (
                  <div key={i} style={{
                    background: `rgba(99,102,241,${opacity})`,
                    borderRadius: '5px',
                    minHeight: '20px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }} title={`Intensity: ${Math.round(intensity * 100)}%`} />
                )
              })}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '14px', fontSize: '10px', color: 'rgba(232,232,240,0.4)' }}>
              <span>LESS</span>
              <div style={{ display: 'flex', gap: '4px' }}>
                <span style={{ color: 'rgba(99,102,241,0.4)' }}>●</span>
                <span style={{ color: 'rgba(99,102,241,0.6)' }}>●</span>
                <span style={{ color: 'rgba(99,102,241,0.85)' }}>●</span>
              </div>
              <span>MORE</span>
            </div>
          </div>
        </div>
 
        {/* Achievements & Insights */}
        <div className="section-grid" style={{ marginTop: '24px' }}>
          <div className="achievements">
            <div className="ach-head">
              <div className="ach-title">Recent Achievements</div>
              <button className="ach-view">View All</button>
            </div>
 
            {achievements.length > 0 ? achievements.map((ach, idx) => (
              <div className="ach-item" key={idx}>
                <div className={`ach-icon ${idx === 0 ? 'icon-dp' : idx === 1 ? 'icon-amazon' : 'icon-resolver'}`}>
                  {idx === 0 ? '🏆' : idx === 1 ? '⭐' : '⚡'}
                </div>
                <div className="ach-info">
                  <div className="ach-name">{ach.name}</div>
                  <div className="ach-desc">{ach.desc}</div>
                  <div className="ach-time">{ach.time}</div>
                </div>
              </div>
            )) : (
              <div style={{ padding: '20px', textAlign: 'center', color: 'rgba(232,232,240,0.3)', fontSize: '13px' }}>
                No achievements yet. Keep practicing!
              </div>
            )}
          </div>
 
          <div className="insight">
            <div className="insight-title">
              <span className="insight-icon">✦</span>
              AI Skill Insight
            </div>
            <div className="insight-text">
              "{insight.text || 'Keep practicing to unlock AI-driven skill insights.'}"
            </div>
            <div className="skill-insights">
              {(insight.skills || []).map((s, idx) => (
                <div className="skill-row" key={idx}>
                  <span className="skill-name">{s.name}</span>
                  <span className="skill-level">{s.level}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
 
      {/* FOOTER */}
      <footer className="footer">
        <div>
          <div className="f-brand">Placifai AI</div>
          <div className="f-copy">© 2026 Placifai AI. Intellectual Career Guidance.</div>
        </div>
        <div className="f-links">
          <button className="f-link">Privacy Policy</button>
          <button className="f-link">Terms of Service</button>
          <button className="f-link">Contact Support</button>
        </div>
      </footer>
    </div>
  )
}