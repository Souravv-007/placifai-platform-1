import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import { roadmapAPI } from '../services/api'
import useUIStore from '../store/uiStore'
import Topbar from '../components/Topbar'

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@300;400&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .r-root { 
    display: flex; 
    min-height: 100vh; 
    background: #0f1117; 
    color: #e8e8f0; 
    font-family: 'DM Sans', sans-serif;
    overflow-x: hidden;
  }

  /* Main Content Redesign */
  .main-wrapper {
    flex: 1;
    margin-left: 200px;
    background: #050608;
    position: relative;
    min-height: 100vh;
  }

  .content {
    position: relative;
    z-index: 1;
    padding: 84px 40px 60px;
    max-width: 1000px;
    margin: 0 auto;
  }

    background: radial-gradient(circle at 50% 0%, rgba(99, 102, 241, 0.1) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
  }

  .content { 
    position: relative;
    z-index: 1;
    padding: 80px 48px; 
    max-width: 1000px;
    margin: 0 auto;
  }
  
  .pg-header { margin-bottom: 64px; }
  
  .badge-row { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; }
  
  .badge {
    padding: 6px 12px;
    background: rgba(99, 102, 241, 0.1);
    border: 1px solid rgba(99, 102, 241, 0.2);
    border-radius: 100px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.05em;
    color: #818cf8;
    text-transform: uppercase;
  }
  
  .updated-text { font-size: 13px; color: rgba(232, 232, 240, 0.3); }
  
  .title { 
    font-size: 56px; 
    font-weight: 800; 
    letter-spacing: -0.02em; 
    line-height: 1; 
    margin-bottom: 24px; 
    background: linear-gradient(135deg, #fff 0%, rgba(255, 255, 255, 0.7) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  
  .subtitle { 
    font-size: 18px; 
    color: rgba(232, 232, 240, 0.5); 
    line-height: 1.6; 
    max-width: 600px; 
  }

  /* Stats Grid */
  .stats-grid { 
    display: grid; 
    grid-template-columns: repeat(4, 1fr); 
    gap: 16px; 
    margin-bottom: 80px; 
  }
  
  .stat-card {
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 20px;
    padding: 24px;
    transition: transform 0.2s, border-color 0.2s;
  }
  
  .stat-card:hover { 
    transform: translateY(-4px); 
    border-color: rgba(99, 102, 241, 0.2);
  }
  
  .stat-label { font-size: 11px; font-weight: 600; color: rgba(232, 232, 240, 0.3); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 8px; }
  .stat-value { font-size: 24px; font-weight: 700; color: #fff; }

  /* Timeline */
  .journey { position: relative; padding-left: 32px; }
  
  .journey::before {
    content: '';
    position: absolute;
    left: 7px;
    top: 0;
    bottom: 0;
    width: 2px;
    background: linear-gradient(to bottom, #6366f1 0%, rgba(255, 255, 255, 0.05) 100%);
    opacity: 0.3;
  }

  .phase { position: relative; margin-bottom: 64px; }
  
  .phase-marker {
    position: absolute;
    left: -32px;
    top: 0;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #050608;
    border: 3px solid #6366f1;
    z-index: 2;
    transition: all 0.3s;
  }
  
  .phase.done .phase-marker { background: #6366f1; border-color: #6366f1; }
  .phase.active .phase-marker { box-shadow: 0 0 0 6px rgba(99, 102, 241, 0.15); }
  .phase.locked .phase-marker { border-color: rgba(255, 255, 255, 0.1); }

  .phase-content {
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 24px;
    padding: 32px;
    transition: all 0.3s;
  }
  
  .phase.active .phase-content { 
    background: rgba(99, 102, 241, 0.03); 
    border-color: rgba(99, 102, 241, 0.2); 
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  }
  
  .phase.locked .phase-content { opacity: 0.4; }

  .phase-header { 
    display: flex; 
    justify-content: space-between; 
    align-items: flex-start; 
    margin-bottom: 32px; 
  }
  
  .phase-week { font-size: 14px; font-weight: 700; color: #818cf8; margin-bottom: 8px; }
  .phase-name { font-size: 28px; font-weight: 700; color: #fff; margin-bottom: 8px; }
  .phase-focus { font-size: 15px; color: rgba(232, 232, 240, 0.4); }
  
  .status-tag {
    padding: 6px 14px;
    border-radius: 100px;
    font-size: 11px;
    font-weight: 700;
  }
  
  .tag-done { background: rgba(34, 197, 94, 0.1); color: #4ade80; }
  .tag-active { background: rgba(99, 102, 241, 0.1); color: #818cf8; }

  .task-list { 
    display: grid; 
    grid-template-columns: 1fr 1fr; 
    gap: 16px; 
    margin-bottom: 32px;
  }
  
  .task-card {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 16px;
    padding: 20px;
    cursor: pointer;
    transition: all 0.2s;
    text-align: left;
    display: flex;
    gap: 16px;
    font-family: inherit;
    color: inherit;
  }
  
  .task-card:hover { background: rgba(255, 255, 255, 0.05); border-color: rgba(255, 255, 255, 0.1); }
  
  .check-box {
    width: 22px;
    height: 22px;
    border-radius: 6px;
    border: 2px solid rgba(255, 255, 255, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    flex-shrink: 0;
    transition: all 0.2s;
  }
  
  .checked { background: #6366f1; border-color: #6366f1; color: #fff; }

  .task-info { flex: 1; }
  .task-name { font-size: 15px; font-weight: 600; color: #e8e8f0; margin-bottom: 4px; }
  .task-desc { font-size: 12px; color: rgba(232, 232, 240, 0.4); line-height: 1.5; }

  .insight-box {
    background: rgba(255, 255, 255, 0.03);
    border-radius: 16px;
    padding: 20px;
    display: flex;
    gap: 16px;
    align-items: center;
  }
  
  .insight-icon { font-size: 24px; }
  .insight-text { font-size: 14px; color: rgba(232, 232, 240, 0.6); line-height: 1.6; }

  /* Animation */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  .animate { animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both; }
`

export default function Roadmap() {
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const navigate = useNavigate()
  const openUpgrade = useUIStore((s) => s.openUpgradeModal)
  const openHelp = useUIStore((s) => s.openHelpModal)
  
  const [roadmapId, setRoadmapId] = useState('')
  const [roadmap, setRoadmap] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updating, setUpdating] = useState(null)

  const loadRoadmap = async (force = false) => {
    try {
      setLoading(true)
      const res = await roadmapAPI.getAll()
      const latest = res.data?.[0]
      
      if (latest && !force) {
        setRoadmapId(latest.id)
        setRoadmap(latest.milestones || { phases: latest.roadmap || [], title: latest.targetRole })
      } else {
        const gen = await roadmapAPI.generate({
          targetRole: user?.targetRole || 'Senior Software Engineer',
          experience: user?.experience || 'mid'
        })
        setRoadmapId(gen.data.id)
        setRoadmap(gen.data.milestones || { phases: gen.data.roadmap || [], title: gen.data.targetRole })
      }
    } catch (err) {
      setError('Unable to load your road map. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) loadRoadmap()
  }, [user])

  const handleToggle = async (pIdx, tIdx, task, status) => {
    if (status === 'locked' || updating) return
    setUpdating(`${pIdx}-${tIdx}`)
    try {
      const res = await roadmapAPI.updateProgress(roadmapId, {
        phaseIndex: pIdx,
        taskIndex: tIdx,
        completed: !task.done
      })
      setRoadmap(res.data)
    } catch (err) {
      setError('Progress update failed.')
    } finally {
      setUpdating(null)
    }
  }

  if (!user) {
    navigate('/login')
    return null
  }

  const phases = roadmap?.phases || []
  const completedTasks = phases.flatMap(p => p.tasks).filter(t => t.done).length
  const totalTasks = phases.flatMap(p => p.tasks).length
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  return (
    <div className="r-root">
      <style>{styles}</style>

      <div className="main-wrapper">
        <Topbar placeholder="Search roadmap topics..." />
        <div className="top-glow" />
        
        <div className="content">
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
              <div style={{ width: '40px', height: '40px', border: '3px solid rgba(99, 102, 241, 0.2)', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
              <p style={{ marginTop: '20px', color: 'rgba(232, 232, 240, 0.4)', fontSize: '14px' }}>Building your career road map...</p>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          ) : (
            <>
              <div className="pg-header animate" style={{ animationDelay: '0.1s' }}>
                <div className="badge-row">
                  <div className="badge">AI-Generated Path</div>
                  <div className="updated-text">Tailored for your {user.targetRole} goals</div>
                </div>
                <h1 className="title">{roadmap?.title || 'Your Career Journey'}</h1>
                <p className="subtitle">{roadmap?.subtitle || 'An 8-week intensive roadmap designed to accelerate your growth into senior engineering leadership.'}</p>
              </div>

              <div className="stats-grid animate" style={{ animationDelay: '0.2s' }}>
                <div className="stat-card">
                  <div className="stat-label">Timeline</div>
                  <div className="stat-value">8 Weeks</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Completion</div>
                  <div className="stat-value">{progress}%</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Current Streak</div>
                  <div className="stat-value">{roadmap?.currentStreakDays || 0} Days</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Readiness</div>
                  <div className="stat-value">A-</div>
                </div>
              </div>

              {(roadmap?.skillGaps || []).length > 0 && (
                <div className="animate" style={{ animationDelay: '0.25s', marginBottom: '48px', padding: '24px', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '16px' }}>
                  <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#ef4444', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>Identified Skill Gaps</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {roadmap.skillGaps.map((gap, i) => (
                      <span key={i} style={{ padding: '6px 12px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: '8px', fontSize: '13px', fontWeight: 500 }}>
                        {gap}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="journey animate" style={{ animationDelay: '0.3s' }}>
                {phases.map((phase, pIdx) => (
                  <div key={pIdx} className={`phase ${phase.status}`}>
                    <div className="phase-marker" />
                    <div className="phase-content">
                      <div className="phase-header">
                        <div>
                          <div className="phase-week">{phase.week}</div>
                          <h2 className="phase-name">{phase.title}</h2>
                          <p className="phase-focus">{phase.focus}</p>
                        </div>
                        {phase.status !== 'locked' && (
                          <div className={`status-tag tag-${phase.status}`}>
                            {phase.status === 'done' ? 'Completed' : 'Current Stage'}
                          </div>
                        )}
                      </div>

                      <div className="task-list">
                        {(phase.tasks || []).map((task, tIdx) => {
                          const isUpdating = updating === `${pIdx}-${tIdx}`
                          return (
                            <button
                              key={tIdx}
                              className={`task-card ${task.active ? 'active' : ''}`}
                              onClick={() => handleToggle(pIdx, tIdx, task, phase.status)}
                              disabled={phase.status === 'locked' || isUpdating}
                            >
                              <div className={`check-box ${task.done ? 'checked' : ''}`}>
                                {task.done ? '✓' : isUpdating ? '...' : ''}
                              </div>
                              <div className="task-info">
                                <div className="task-name">{task.name}</div>
                                <div className="task-desc">{task.desc}</div>
                              </div>
                            </button>
                          )
                        })}
                      </div>

                      {phase.insight && (
                        <div className="insight-box">
                          <span className="insight-icon">💡</span>
                          <p className="insight-text">{phase.insight}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
