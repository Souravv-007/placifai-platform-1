import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import { analyticsAPI } from '../services/api'
import useUIStore from '../store/uiStore'

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@300;400&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  .an-root { display: block; min-height: 100vh; background: #0f1117; color: #e8e8f0; font-family: 'DM Sans', sans-serif; }

  .sb { width: 188px; min-height: 100vh; background: #0a0b0f; border-right: 1px solid rgba(255,255,255,0.07); display: flex; flex-direction: column; padding: 22px 0; position: fixed; left: 0; top: 0; bottom: 0; z-index: 50; }
  .sb-logo { padding: 0 18px 18px; border-bottom: 1px solid rgba(255,255,255,0.06); margin-bottom: 14px; font-size: 16px; font-weight: 700; }
  .sb-nav { flex: 1; padding: 0 10px; }
  .sb-i { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 8px; font-size: 13px; color: rgba(232,232,240,0.45); cursor: pointer; transition: all 0.2s; background: none; border: none; width: 100%; text-align: left; margin-bottom: 2px; font-family: 'DM Sans', sans-serif; }
  .sb-i:hover { background: rgba(255,255,255,0.05); color: rgba(232,232,240,0.8); }
  .sb-i.active { background: rgba(99,102,241,0.15); color: #818cf8; }
  .sb-i .ico { width: 26px; text-align: center; font-size: 11px; font-family: 'DM Mono', monospace; }
  .sb-promo { margin: 0 10px 10px; background: rgba(99,102,241,0.08); border: 1px solid rgba(99,102,241,0.15); border-radius: 10px; padding: 14px; }
  .sb-promo-title { font-size: 13px; font-weight: 600; margin-bottom: 4px; }
  .sb-promo-sub { font-size: 11px; color: rgba(232,232,240,0.4); margin-bottom: 12px; line-height: 1.5; }
  .sb-promo-btn { width: 100%; padding: 9px; background: linear-gradient(135deg,#6366f1,#8b5cf6); border: none; border-radius: 7px; color: white; font-size: 12px; font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif; }
  .sb-bottom { padding: 10px; border-top: 1px solid rgba(255,255,255,0.06); }

  .tb { position: fixed; top: 0; left: 188px; right: 0; height: 54px; background: rgba(15,17,23,0.97); border-bottom: 1px solid rgba(255,255,255,0.06); backdrop-filter: blur(20px); display: flex; align-items: center; justify-content: space-between; padding: 0 28px; z-index: 40; }
  .tb-logo { font-size: 15px; font-weight: 700; margin-right: 28px; }
  .tb-nav { display: flex; gap: 24px; align-items: center; flex: 1; }
  .tb-link { font-size: 13px; color: rgba(232,232,240,0.4); background: none; border: none; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: color 0.2s; padding: 0; }
  .tb-link:hover { color: #e8e8f0; }
  .tb-link.active { color: #818cf8; font-weight: 600; }
  .tb-right { display: flex; align-items: center; gap: 10px; }
  .tb-icon { width: 34px; height: 34px; border-radius: 8px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); color: rgba(232,232,240,0.5); cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 11px; font-family: 'DM Mono', monospace; }
  .tb-av { width: 34px; height: 34px; border-radius: 50%; background: linear-gradient(135deg,#6366f1,#8b5cf6); display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; color: white; cursor: pointer; border: 2px solid rgba(99,102,241,0.4); }

  .main { margin-left: 188px; padding: 70px 28px 48px; min-height: 100vh; }
  .pg-lbl { font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; color: #818cf8; font-family: 'DM Mono', monospace; margin-bottom: 8px; animation: fadeUp 0.4s ease both; }
  .pg-title { font-size: 34px; font-weight: 700; margin-bottom: 10px; animation: fadeUp 0.4s 0.03s ease both; }
  .pg-sub { font-size: 13px; color: rgba(232,232,240,0.4); line-height: 1.7; max-width: 560px; margin-bottom: 28px; animation: fadeUp 0.4s 0.06s ease both; }

  .top-grid { display: grid; grid-template-columns: 1fr 260px; gap: 20px; margin-bottom: 32px; animation: fadeUp 0.4s 0.08s ease both; }
  .radar-card { background: #161821; border: 1px solid rgba(255,255,255,0.07); border-radius: 14px; padding: 24px; }
  .radar-head { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; gap: 16px; }
  .radar-title { font-size: 18px; font-weight: 700; margin-bottom: 4px; }
  .radar-sub { font-size: 12px; color: rgba(232,232,240,0.4); }
  .radar-legend { display: flex; gap: 16px; align-items: center; }
  .leg-item { display: flex; align-items: center; gap: 6px; font-size: 12px; color: rgba(232,232,240,0.5); }
  .leg-dot { width: 8px; height: 8px; border-radius: 50%; }
  .leg-you { background: #6366f1; }
  .leg-bench { background: rgba(232,232,240,0.25); }
  .radar-wrap { display: flex; justify-content: center; align-items: center; min-height: 400px; }

  .right-col { display: flex; flex-direction: column; gap: 16px; }
  .score-mini { background: #161821; border: 1px solid rgba(255,255,255,0.07); border-radius: 14px; padding: 20px; }
  .sc-lbl { font-size: 11px; color: rgba(232,232,240,0.35); margin-bottom: 8px; }
  .sc-row { display: flex; justify-content: space-between; align-items: center; }
  .sc-num { font-size: 38px; font-weight: 700; }
  .sc-num span { font-size: 16px; color: rgba(232,232,240,0.35); font-weight: 400; }
  .sc-icon { width: 38px; height: 38px; border-radius: 9px; background: rgba(99,102,241,0.12); display: flex; align-items: center; justify-content: center; font-size: 11px; font-family: 'DM Mono', monospace; }

  .market-card { background: #161821; border: 1px solid rgba(255,255,255,0.07); border-radius: 14px; padding: 20px; }
  .mk-lbl { font-size: 11px; color: rgba(232,232,240,0.35); margin-bottom: 12px; }
  .mk-bar-wrap { height: 6px; background: rgba(255,255,255,0.07); border-radius: 3px; margin-bottom: 10px; overflow: hidden; }
  .mk-bar { height: 100%; width: 0; background: linear-gradient(90deg,#6366f1,#818cf8); border-radius: 3px; transition: width 0.3s ease; }
  .mk-row { display: flex; justify-content: space-between; align-items: center; gap: 16px; }
  .mk-role { font-size: 12px; color: rgba(232,232,240,0.4); }
  .mk-match { font-size: 18px; font-weight: 700; color: #e8e8f0; }

  .insight-mini { background: #161821; border: 1px solid rgba(255,255,255,0.07); border-radius: 14px; padding: 20px; flex: 1; }
  .ins-head { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
  .ins-icon { width: 28px; height: 28px; border-radius: 7px; background: rgba(245,158,11,0.12); display: flex; align-items: center; justify-content: center; font-size: 11px; font-family: 'DM Mono', monospace; }
  .ins-title { font-size: 14px; font-weight: 600; }
  .ins-text { font-size: 12px; color: rgba(232,232,240,0.5); line-height: 1.7; }

  .section-title { font-size: 22px; font-weight: 700; margin-bottom: 16px; animation: fadeUp 0.4s 0.1s ease both; }
  .comp-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 32px; animation: fadeUp 0.4s 0.12s ease both; }
  .comp-card { background: #161821; border: 1px solid rgba(255,255,255,0.07); border-radius: 14px; padding: 22px; }
  .comp-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; gap: 14px; }
  .comp-name { font-size: 16px; font-weight: 600; }
  .comp-badge { padding: 4px 10px; border-radius: 5px; font-size: 10px; font-weight: 600; font-family: 'DM Mono', monospace; }
  .badge-adv { background: rgba(99,102,241,0.15); color: #818cf8; border: 1px solid rgba(99,102,241,0.25); }
  .badge-int { background: rgba(245,158,11,0.12); color: #fbbf24; border: 1px solid rgba(245,158,11,0.2); }
  .skill-row { margin-bottom: 14px; }
  .skill-row:last-child { margin-bottom: 0; }
  .skill-info { display: flex; justify-content: space-between; font-size: 12px; color: rgba(232,232,240,0.55); margin-bottom: 6px; gap: 16px; }
  .skill-pct { font-weight: 600; color: #e8e8f0; }
  .skill-bar { height: 4px; background: rgba(255,255,255,0.07); border-radius: 2px; overflow: hidden; }
  .skill-fill { height: 100%; border-radius: 2px; background: linear-gradient(90deg,#6366f1,#818cf8); }
  .skill-fill.orange { background: linear-gradient(90deg,#f97316,#fb923c); }
  .skill-fill.yellow { background: linear-gradient(90deg,#eab308,#fbbf24); }

  .gaps-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; animation: fadeUp 0.4s 0.14s ease both; gap: 16px; }
  .gaps-title { font-size: 22px; font-weight: 700; }
  .gen-btn { display: flex; align-items: center; gap: 6px; font-size: 13px; color: #818cf8; background: none; border: none; cursor: pointer; font-family: 'DM Sans', sans-serif; font-weight: 600; }
  .gaps-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; animation: fadeUp 0.4s 0.16s ease both; }
  .gap-card { background: #161821; border: 1px solid rgba(255,255,255,0.07); border-radius: 14px; overflow: hidden; }
  .gap-img { height: 140px; position: relative; overflow: hidden; background: linear-gradient(135deg,#151827,#0d0f17); display: flex; align-items: center; justify-content: center; }
  .gap-img-overlay { position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(15,17,23,0.1), rgba(15,17,23,0.7)); }
  .gap-img-placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 22px; font-weight: 700; letter-spacing: 0.08em; font-family: 'DM Mono', monospace; color: rgba(232,232,240,0.8); }
  .gap-badge-wrap { position: absolute; top: 12px; left: 12px; z-index: 1; }
  .gap-badge { padding: 3px 8px; border-radius: 4px; font-size: 9px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; font-family: 'DM Mono', monospace; }
  .gb-critical { background: #ef4444; color: white; }
  .gb-priority { background: #f97316; color: white; }
  .gb-secondary { background: #8b5cf6; color: white; }
  .gap-body { padding: 18px; }
  .gap-title { font-size: 15px; font-weight: 700; margin-bottom: 6px; }
  .gap-desc { font-size: 12px; color: rgba(232,232,240,0.4); line-height: 1.6; margin-bottom: 14px; }
  .gap-res-lbl { font-size: 9px; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(232,232,240,0.3); font-family: 'DM Mono', monospace; margin-bottom: 8px; }
  .gap-res { display: flex; align-items: center; justify-content: space-between; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07); border-radius: 8px; padding: 10px 12px; gap: 14px; }
  .gap-res-left { display: flex; align-items: center; gap: 10px; }
  .gap-res-icon { width: 28px; height: 28px; border-radius: 6px; background: rgba(99,102,241,0.15); display: flex; align-items: center; justify-content: center; font-size: 11px; font-family: 'DM Mono', monospace; }
  .gap-res-name { font-size: 12px; font-weight: 500; }
  .gap-res-ext { font-size: 11px; color: rgba(232,232,240,0.3); font-family: 'DM Mono', monospace; }

  .state-card { background: #161821; border: 1px solid rgba(255,255,255,0.07); border-radius: 14px; padding: 24px; color: rgba(232,232,240,0.65); }
  .state-card.error { border-color: rgba(239,68,68,0.22); color: #fca5a5; margin-bottom: 20px; }

  .footer { background: #0a0b0f; border-top: 1px solid rgba(255,255,255,0.06); padding: 20px 28px; display: flex; justify-content: space-between; align-items: center; margin-left: 188px; }
  .f-brand { font-size: 13px; font-weight: 600; margin-bottom: 2px; }
  .f-copy { font-size: 11px; color: rgba(232,232,240,0.25); }
  .f-links { display: flex; gap: 20px; }
  .f-link { font-size: 11px; color: rgba(232,232,240,0.3); background: none; border: none; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: color 0.2s; }
  .f-link:hover { color: rgba(232,232,240,0.6); }

  @keyframes fadeUp { from { opacity: 0; transform: translateY(14px) } to { opacity: 1; transform: translateY(0) } }
`

const NAV = [
  { ico: 'DB', label: 'Dashboard', id: 'dashboard', path: '/dashboard' },
  { ico: 'RM', label: 'Roadmap', id: 'roadmap', path: '/roadmap' },
  { ico: 'AN', label: 'Analytics', id: 'analytics', path: '/analytics' },
  { ico: 'MI', label: 'Mock Interview', id: 'interview', path: '/interview' },
  { ico: 'PH', label: 'Prep Hub', id: 'prep', path: '/prep' },
  { ico: 'PR', label: 'Progress', id: 'progress', path: '/progress' },
]

const DEFAULT_ANALYTICS = {
  radar: {
    labels: ['Algorithms', 'System Design', 'Backend', 'Frontend', 'Database', 'Concurrency', 'Security', 'Leadership'],
    you: [0.82, 0.75, 0.72, 0.65, 0.68, 0.45, 0.58, 0.6],
    benchmark: [0.9, 0.9, 0.9, 0.82, 0.88, 0.78, 0.8, 0.75],
  },
  competencyScore: 74,
  marketReadiness: {
    role: 'L5 Software Engineer',
    matchPercent: 65,
  },
  insight: 'Your systems thinking is trending upward, but concurrency and leadership storytelling still need focused reps.',
  competencies: [],
  gaps: [],
}

function getResourceIcon(label) {
  if (label === 'play') {
    return 'GO'
  }

  if (label === 'book') {
    return 'RD'
  }

  if (label === 'mic') {
    return 'AI'
  }

  return 'RS'
}

function getGapMonogram(title) {
  return title
    .split(' ')
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase()
}

function RadarChart({ radar }) {
  const cx = 200
  const cy = 200
  const r = 150
  const skills = radar?.labels?.length ? radar.labels : DEFAULT_ANALYTICS.radar.labels
  const you = radar?.you?.length ? radar.you : DEFAULT_ANALYTICS.radar.you
  const benchmark = radar?.benchmark?.length ? radar.benchmark : DEFAULT_ANALYTICS.radar.benchmark
  const n = skills.length

  const getPoint = (index, value) => {
    const angle = (index / n) * 2 * Math.PI - Math.PI / 2
    return {
      x: cx + r * value * Math.cos(angle),
      y: cy + r * value * Math.sin(angle),
    }
  }

  const getLabelPoint = (index) => {
    const angle = (index / n) * 2 * Math.PI - Math.PI / 2
    const distance = r + 24
    return {
      x: cx + distance * Math.cos(angle),
      y: cy + distance * Math.sin(angle),
    }
  }

  const polygonPath = (values) => values.map((value, index) => {
    const point = getPoint(index, value)
    return `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
  }).join(' ') + ' Z'

  return (
    <svg width="400" height="400" viewBox="0 0 400 400">
      {[0.25, 0.5, 0.75, 1].map((level) => (
        <polygon
          key={level}
          points={Array.from({ length: n }, (_, index) => {
            const point = getPoint(index, level)
            return `${point.x},${point.y}`
          }).join(' ')}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="1"
        />
      ))}

      {skills.map((_, index) => {
        const point = getPoint(index, 1)
        return (
          <line
            key={`line-${index}`}
            x1={cx}
            y1={cy}
            x2={point.x}
            y2={point.y}
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="1"
          />
        )
      })}

      <path d={polygonPath(benchmark)} fill="rgba(232,232,240,0.06)" stroke="rgba(232,232,240,0.2)" strokeWidth="1.5" />
      <path d={polygonPath(you)} fill="rgba(99,102,241,0.15)" stroke="#6366f1" strokeWidth="2" />

      {you.map((value, index) => {
        const point = getPoint(index, value)
        return (
          <circle
            key={`dot-${index}`}
            cx={point.x}
            cy={point.y}
            r="4"
            fill="#6366f1"
            stroke="#0f1117"
            strokeWidth="2"
          />
        )
      })}

      {skills.map((skill, index) => {
        const point = getLabelPoint(index)
        return (
          <text
            key={`label-${index}`}
            x={point.x}
            y={point.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="rgba(232,232,240,0.6)"
            fontSize="12"
            fontFamily="DM Sans, sans-serif"
          >
            {skill}
          </text>
        )
      })}
    </svg>
  )
}

export default function Analytics() {
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const navigate = useNavigate()
  const [analytics, setAnalytics] = useState(DEFAULT_ANALYTICS)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) {
      navigate('/login')
    }
  }, [user, navigate])

  useEffect(() => {
    const loadAnalytics = async () => {
      if (!user) {
        return
      }

      setLoading(true)
      setError('')

      try {
        const response = await analyticsAPI.getSummary()
        setAnalytics({
          ...DEFAULT_ANALYTICS,
          ...response.data,
          marketReadiness: {
            ...DEFAULT_ANALYTICS.marketReadiness,
            ...response.data.marketReadiness,
          },
        })
      } catch (requestError) {
        setError(
          requestError.response?.data?.error ||
          requestError.response?.data?.message ||
          'Unable to load analytics right now.'
        )
      } finally {
        setLoading(false)
      }
    }

    loadAnalytics()
  }, [user])

  if (!user) {
    return null
  }

  const firstName = user.firstName || 'U'
  const competencyScore = analytics.competencyScore || DEFAULT_ANALYTICS.competencyScore
  const marketReadiness = analytics.marketReadiness || DEFAULT_ANALYTICS.marketReadiness
  const competencies = analytics.competencies?.length ? analytics.competencies : DEFAULT_ANALYTICS.competencies
  const gaps = analytics.gaps?.length ? analytics.gaps : DEFAULT_ANALYTICS.gaps
  const openUpgrade = useUIStore((s) => s.openUpgradeModal)
  const openHelp = useUIStore((s) => s.openHelpModal)

  return (
    <div className="an-root">
      <style>{styles}</style>

      <aside className="sb">
        <div className="sb-logo">Placifai AI</div>
        <nav className="sb-nav">
          {NAV.map((item) => (
            <button
              key={item.id}
              className={`sb-i ${item.id === 'analytics' ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              <span className="ico">{item.ico}</span>
              {item.label}
            </button>
          ))}
        </nav>
        <div className="sb-promo">
          <div className="sb-promo-title">Upgrade to Pro</div>
          <div className="sb-promo-sub">Get advanced AI analysis and sharper prep pathways.</div>
          <button className="sb-promo-btn" onClick={openUpgrade}>Go Premium</button>
        </div>
        <div className="sb-bottom">
          <button className="sb-i" onClick={openHelp}>
            <span className="ico">HC</span>
            Help Center
          </button>
          <button
            className="sb-i"
            onClick={() => {
              logout()
              navigate('/login')
            }}
          >
            <span className="ico">OUT</span>
            Logout
          </button>
        </div>
      </aside>

      <header className="tb">
        <div className="tb-logo">Placifai AI</div>
        <nav className="tb-nav">
          <button className="tb-link" onClick={() => navigate('/dashboard')}>Dashboard</button>
          <button className="tb-link active">Analytics</button>
          <button className="tb-link" onClick={() => navigate('/prep')}>Prep Hub</button>
        </nav>
        <div className="tb-right">
          <button className="tb-icon">NTF</button>
          <button className="tb-icon">CFG</button>
          <div className="tb-av">{firstName[0].toUpperCase()}</div>
        </div>
      </header>

      <main className="main">
        <div className="pg-lbl">Career Analytics</div>
        <div className="pg-title">Skill Gap Analysis</div>
        <div className="pg-sub">
          Compare your current technical proficiencies against senior software engineering benchmarks and identify the fastest next lift.
        </div>

        {error && <div className="state-card error">{error}</div>}

        {loading ? (
          <div className="state-card">Loading analytics from your latest resume and roadmap data...</div>
        ) : (
          <>
            <div className="top-grid">
              <div className="radar-card">
                <div className="radar-head">
                  <div>
                    <div className="radar-title">Technical Proficiency Overview</div>
                    <div className="radar-sub">Current vs. target benchmark</div>
                  </div>
                  <div className="radar-legend">
                    <div className="leg-item"><div className="leg-dot leg-you" />You</div>
                    <div className="leg-item"><div className="leg-dot leg-bench" />Benchmark</div>
                  </div>
                </div>
                <div className="radar-wrap">
                  <RadarChart radar={analytics.radar} />
                </div>
              </div>

              <div className="right-col">
                <div className="score-mini">
                  <div className="sc-lbl">Competency Score</div>
                  <div className="sc-row">
                    <div className="sc-num">{competencyScore}<span>/100</span></div>
                    <div className="sc-icon">SCORE</div>
                  </div>
                </div>

                <div className="market-card">
                  <div className="mk-lbl">Market Readiness</div>
                  <div className="mk-bar-wrap">
                    <div className="mk-bar" style={{ width: `${marketReadiness.matchPercent || 0}%` }} />
                  </div>
                  <div className="mk-row">
                    <div className="mk-role">{marketReadiness.role || 'Target role'}</div>
                    <div className="mk-match">{marketReadiness.matchPercent || 0}% Match</div>
                  </div>
                </div>

                <div className="insight-mini">
                  <div className="ins-head">
                    <div className="ins-icon">AI</div>
                    <div className="ins-title">AI Insights</div>
                  </div>
                  <div className="ins-text">{analytics.insight}</div>
                </div>
              </div>
            </div>

            <div className="section-title">Competency Breakdown</div>
            <div className="comp-grid">
              {competencies.map((group) => (
                <div className="comp-card" key={group.name}>
                  <div className="comp-head">
                    <div className="comp-name">{group.name}</div>
                    <span className={`comp-badge ${group.badgeClass}`}>{group.badge}</span>
                  </div>
                  {(group.skills || []).map((skill) => (
                    <div className="skill-row" key={skill.name}>
                      <div className="skill-info">
                        <span>{skill.name}</span>
                        <span className="skill-pct">{skill.pct}%</span>
                      </div>
                      <div className="skill-bar">
                        <div className={`skill-fill ${skill.cls || ''}`} style={{ width: `${skill.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div className="gaps-head">
              <div className="gaps-title">Critical Gaps and Resources</div>
              <button className="gen-btn" onClick={() => navigate('/roadmap')}>Generate Full Roadmap</button>
            </div>
            <div className="gaps-grid">
              {gaps.map((gap) => (
                <div className="gap-card" key={gap.title}>
                  <div className="gap-img">
                    <div className="gap-img-placeholder">{getGapMonogram(gap.title)}</div>
                    <div className="gap-img-overlay" />
                    <div className="gap-badge-wrap">
                      <span className={`gap-badge ${gap.badgeClass}`}>{gap.badge}</span>
                    </div>
                  </div>
                  <div className="gap-body">
                    <div className="gap-title">{gap.title}</div>
                    <div className="gap-desc">{gap.desc}</div>
                    <div className="gap-res-lbl">Recommended Resource</div>
                    <div className="gap-res">
                      <div className="gap-res-left">
                        <div className="gap-res-icon">{getResourceIcon(gap.resource?.icon)}</div>
                        <div className="gap-res-name">{gap.resource?.name || 'Learning Resource'}</div>
                      </div>
                      <div className="gap-res-ext">OPEN</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      <footer className="footer">
        <div>
          <div className="f-brand">Placifai AI</div>
          <div className="f-copy">(c) 2026 Placifai AI. Intellectual Career Guidance.</div>
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
