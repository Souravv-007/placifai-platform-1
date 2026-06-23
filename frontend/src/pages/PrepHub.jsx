import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import useResumeStore from '../store/resumeStore'
import { resumeAPI, roadmapAPI } from '../services/api'
import useUIStore from '../store/uiStore'
import Topbar from '../components/Topbar'

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@300;400&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  .ph-root { display: block; min-height: 100vh; background: #0f1117; color: #e8e8f0; font-family: 'DM Sans', sans-serif; }

  .tb-nav { display: flex; gap: 28px; }
  .tb-link { font-size: 13px; color: rgba(232, 232, 240, 0.4); background: none; border: none; cursor: pointer; font-family: 'DM Sans', sans-serif; padding: 4px 0; border-bottom: 2px solid transparent; transition: all 0.2s; }
  .tb-link:hover { color: #e8e8f0; }
  .tb-link.active { color: #e8e8f0; border-bottom-color: #6366f1; }

  .main { margin-left: 200px; padding: 84px 32px 48px; min-height: 100vh; }
  .pg-top { margin-bottom: 32px; animation: fadeUp 0.4s ease both; }
  .pg-title { font-size: 38px; font-weight: 700; margin-bottom: 10px; }
  .pg-sub { font-size: 14px; color: rgba(232,232,240,0.4); line-height: 1.7; max-width: 560px; }
  .content-grid { display: grid; grid-template-columns: 1fr 300px; gap: 24px; animation: fadeUp 0.4s 0.05s ease both; }

  .upload-zone { border: 1.5px dashed rgba(99,102,241,0.4); border-radius: 16px; padding: 48px 32px; text-align: center; cursor: pointer; transition: all 0.3s; background: rgba(99,102,241,0.03); position: relative; overflow: hidden; margin-bottom: 20px; display: block; }
  .upload-zone:hover, .upload-zone.dragging { border-color: rgba(99,102,241,0.7); background: rgba(99,102,241,0.06); }
  .upload-zone.analyzing { border-color: #6366f1; background: rgba(99,102,241,0.08); }
  .circle-wrap { width: 110px; height: 110px; margin: 0 auto 20px; position: relative; }
  .circle-wrap svg { transform: rotate(-90deg); }
  .c-bg { fill: none; stroke: rgba(99,102,241,0.15); stroke-width: 5; }
  .c-fill { fill: none; stroke: #6366f1; stroke-width: 5; stroke-linecap: round; stroke-dasharray: 314; stroke-dashoffset: 314; transition: stroke-dashoffset 0.4s ease; }
  .c-text { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-size: 22px; font-weight: 700; color: #818cf8; }
  .uz-title { font-size: 22px; font-weight: 600; margin-bottom: 8px; color: rgba(232,232,240,0.7); }
  .uz-sub { font-size: 12px; color: rgba(232,232,240,0.3); letter-spacing: 0.03em; }
  .uz-analyzing { font-size: 24px; font-weight: 600; color: #818cf8; margin-bottom: 8px; }
  .uz-analyzing-sub { font-size: 12px; color: rgba(232,232,240,0.4); }
  .upload-input { display: none; }

  .analysis-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .an-card { background: #161821; border: 1px solid rgba(255,255,255,0.07); border-radius: 12px; padding: 20px; }
  .an-title { display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 600; margin-bottom: 14px; }
  .an-icon { font-size: 12px; font-family: 'DM Mono', monospace; color: #a78bfa; }
  .an-item { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; padding: 12px 14px; margin-bottom: 10px; }
  .an-item:last-child { margin-bottom: 0; }
  .an-item-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; gap: 10px; }
  .an-item-name { font-size: 13px; font-weight: 500; }
  .badge { font-size: 9px; letter-spacing: 0.08em; text-transform: uppercase; padding: 3px 8px; border-radius: 4px; font-weight: 600; }
  .b-expert { background: rgba(99,102,241,0.2); color: #a78bfa; }
  .b-advanced { background: rgba(59,130,246,0.15); color: #60a5fa; }
  .b-missing { background: rgba(239,68,68,0.15); color: #f87171; }
  .b-issue { background: rgba(245,158,11,0.15); color: #fbbf24; }
  .an-item-desc { font-size: 11px; color: rgba(232,232,240,0.4); line-height: 1.6; }

  .right-col { display: flex; flex-direction: column; gap: 16px; }
  .score-card { background: #161821; border: 1px solid rgba(255,255,255,0.07); border-radius: 12px; padding: 22px; text-align: center; }
  .ats-badge { display: inline-block; background: rgba(99,102,241,0.12); border: 1px solid rgba(99,102,241,0.25); color: #a78bfa; font-size: 9px; letter-spacing: 0.14em; text-transform: uppercase; padding: 4px 10px; border-radius: 4px; margin-bottom: 14px; font-family: 'DM Mono', monospace; }
  .sc-label { font-size: 9px; letter-spacing: 0.14em; text-transform: uppercase; color: rgba(232,232,240,0.3); margin-bottom: 6px; font-family: 'DM Mono', monospace; }
  .sc-number { font-size: 68px; font-weight: 700; line-height: 1; color: #e8e8f0; margin-bottom: 3px; }
  .sc-number span { font-size: 22px; font-weight: 400; color: rgba(232,232,240,0.35); }
  .sc-desc { font-size: 12px; color: rgba(232,232,240,0.4); line-height: 1.6; margin-bottom: 14px; }
  .sc-bar { height: 4px; background: rgba(255,255,255,0.07); border-radius: 2px; overflow: hidden; }
  .sc-fill { height: 100%; width: 0; background: linear-gradient(90deg,#6366f1,#818cf8); border-radius: 2px; transition: width 0.4s ease; }

  .skills-card { background: #161821; border: 1px solid rgba(255,255,255,0.07); border-radius: 12px; padding: 22px; }
  .sk-title { font-size: 18px; font-weight: 600; margin-bottom: 6px; }
  .sk-sub { font-size: 11px; color: rgba(232,232,240,0.35); margin-bottom: 14px; }
  .sk-sub button { color: #818cf8; text-decoration: none; background: none; border: none; padding: 0; cursor: pointer; font: inherit; }
  .sk-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 14px; }
  .sk-tag { display: flex; align-items: center; gap: 5px; padding: 5px 10px; border-radius: 5px; font-size: 11px; border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.03); }
  .sk-dot { width: 6px; height: 6px; border-radius: 50%; }
  .roadmap-btn { width: 100%; padding: 11px; background: transparent; border: 1px solid rgba(99,102,241,0.3); border-radius: 8px; color: #818cf8; font-family: 'DM Sans', sans-serif; font-size: 12px; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: space-between; }
  .roadmap-btn:hover { background: rgba(99,102,241,0.08); }

  .insight-card { background: linear-gradient(135deg,rgba(99,102,241,0.1),rgba(139,92,246,0.05)); border: 1px solid rgba(99,102,241,0.2); border-radius: 12px; padding: 18px; }
  .ins-title { display: flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 600; color: #a78bfa; margin-bottom: 10px; }
  .ins-text { font-size: 12px; color: rgba(232,232,240,0.55); line-height: 1.7; font-style: italic; }

  .message { margin-bottom: 18px; padding: 14px 16px; border-radius: 10px; font-size: 12px; }
  .message.error { border: 1px solid rgba(239,68,68,0.22); background: rgba(239,68,68,0.08); color: #fca5a5; }
  .message.info { border: 1px solid rgba(99,102,241,0.2); background: rgba(99,102,241,0.08); color: rgba(232,232,240,0.72); }

  .footer { background: #0a0b0f; border-top: 1px solid rgba(255,255,255,0.06); padding: 22px 32px; display: flex; justify-content: space-between; align-items: center; margin-left: 200px; }
  .f-brand { font-size: 13px; font-weight: 600; margin-bottom: 2px; }
  .f-copy { font-size: 11px; color: rgba(232,232,240,0.25); }
  .f-links { display: flex; gap: 20px; }
  .f-link { font-size: 11px; color: rgba(232,232,240,0.3); background: none; border: none; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: color 0.2s; }
  .f-link:hover { color: rgba(232,232,240,0.6); }

  @keyframes fadeUp { from { opacity: 0; transform: translateY(14px) } to { opacity: 1; transform: translateY(0) } }
  `

const FALLBACK_STRENGTHS = [
  'Your strongest recruiter signals will appear here after analysis.',
]

const FALLBACK_WEAKNESSES = [
  'Upload a file to uncover missing keywords, weak phrasing, and leadership gaps.',
]

const FALLBACK_GAPS = ['impact metrics', 'leadership', 'scalability']

export default function PrepHub() {
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const analysis = useResumeStore((state) => state.analysis)
  const setAnalysis = useResumeStore((state) => state.setAnalysis)
  const clearAnalysis = useResumeStore((state) => state.clearAnalysis)
  const addResume = useResumeStore((state) => state.addResume)
  const setCurrentResume = useResumeStore((state) => state.setCurrentResume)
  const navigate = useNavigate()
  const [analyzing, setAnalyzing] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [fileName, setFileName] = useState('')
  const [progress, setProgress] = useState(0)
  const [progressText, setProgressText] = useState('Analyzing your resume...')
  const [error, setError] = useState('')
  
  const openUpgrade = useUIStore((s) => s.openUpgradeModal)
  const openHelp = useUIStore((s) => s.openHelpModal)

  useEffect(() => {
    const loadLatest = async () => {
      if (!user) return
      try {
        const res = await resumeAPI.getAll()
        if (res.data && res.data.length > 0) {
          const latest = res.data[0]
          setFileName(latest.fileName)
          if (latest.analysis) {
            setAnalysis(latest.analysis)
            setCurrentResume(latest)
          }
        }
      } catch (err) {
        console.error('Error loading latest resume:', err)
      }
    }
    loadLatest()
  }, [user, setAnalysis, setCurrentResume])

  if (!user) {
    navigate('/login')
    return null
  }

  const firstName = user.firstName || 'U'

  const processFile = async (file) => {
    if (!file) return
    setFileName(file.name)
    setError('')
    clearAnalysis()
    setAnalyzing(true)
    setProgress(10)
    setProgressText('Uploading resume...')

    try {
      const formData = new FormData()
      formData.append('resume', file)
      const uploadResponse = await resumeAPI.upload(formData)
      const resumeId = uploadResponse.data.resumeId
      setProgress(30)
      setProgressText('Extracting technical context...')

      const resumeResponse = await resumeAPI.getById(resumeId)
      addResume(resumeResponse.data)
      setCurrentResume(resumeResponse.data)
      setProgress(50)
      setProgressText('Running AI ATS analysis...')

      const analysisResponse = await resumeAPI.analyze(resumeId)
      setAnalysis(analysisResponse.data)
      setProgress(75)
      setProgressText('Personalizing your career roadmap...')

      // Automatic roadmap generation
      await roadmapAPI.generate({
        targetRole: user.targetRole || 'Senior Software Engineer',
        experience: user.experience || 'mid'
      })
      
      setProgress(100)
      setProgressText('Roadmap generated successfully!')
    } catch (requestError) {
      setError(requestError.response?.data?.error || 'Resume processing failed.')
      setProgress(0)
    } finally {
      setTimeout(() => setAnalyzing(false), 1000)
    }
  }

  const handleFileChange = (event) => {
    const file = event.target.files?.[0]
    if (file) {
      processFile(file)
      event.target.value = ''
    }
  }

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true) }
  const handleDragLeave = () => { setIsDragging(false) }
  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) processFile(file)
  }

  const strengths = analysis?.strengths?.slice(0, 2) || FALLBACK_STRENGTHS
  const weaknesses = analysis?.weaknesses?.slice(0, 2) || FALLBACK_WEAKNESSES
  const skillGaps = analysis?.keywords_missing?.slice(0, 5) || FALLBACK_GAPS
  const insight = analysis?.recommendations?.[0] || analysis?.improvements?.[0]
  const score = typeof analysis?.score === 'number' ? Math.round(analysis.score) : null
  const dashoffset = 314 - (314 * progress) / 100

  const scoreDescription = score === null
    ? 'Upload a resume to get your ATS score, strongest signals, and improvement areas.'
    : score >= 85
      ? 'Strong positioning for senior roles. Keep sharpening leadership framing.'
      : score >= 70
        ? 'Solid foundation. A few targeted edits can raise recruiter confidence fast.'
        : 'Your profile has potential, but it needs tighter impact and keyword alignment.'

  return (
    <div className="ph-root">
      <style>{styles}</style>

      <Topbar showSearch={false}>
        <nav className="tb-nav">
          <button className="tb-link" onClick={() => navigate('/dashboard')}>Dashboard</button>
          <button className="tb-link active">Prep Hub</button>
        </nav>
      </Topbar>

      <main className="main">
        <div className="pg-top">
          <div className="pg-title">Resume Intelligence</div>
          <div className="pg-sub">
            Upload your resume to discover how recruiters and AI screening systems perceive your career story.
          </div>
        </div>

        {error && <div className="message error">{error}</div>}

        {!analysis && !error && (
          <div className="message info">
            Your analysis will be saved to the backend after upload, then reused whenever you reopen this flow.
          </div>
        )}

        <div className="content-grid">
          <div>
            <label 
              className={`upload-zone ${analyzing ? 'analyzing' : ''} ${isDragging ? 'dragging' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                className="upload-input"
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFileChange}
              />
              <div className="circle-wrap">
                <svg width="110" height="110" viewBox="0 0 110 110">
                  <circle className="c-bg" cx="55" cy="55" r="50" />
                  <circle
                    className="c-fill"
                    cx="55"
                    cy="55"
                    r="50"
                    style={{ strokeDashoffset: dashoffset }}
                  />
                </svg>
                <div className="c-text">{progress}%</div>
              </div>
              {analyzing ? (
                <>
                  <div className="uz-analyzing">{progressText}</div>
                  <div className="uz-analyzing-sub">
                    Comparing your experience with strong senior candidate patterns and ATS expectations.
                  </div>
                </>
              ) : (
                <>
                  <div className="uz-title">{fileName ? fileName : 'Drop your resume here'}</div>
                  <div className="uz-sub">OR CLICK TO BROWSE (PDF, DOCX, TXT UP TO 5MB)</div>
                </>
              )}
            </label>

            <div className="analysis-grid">
              <div className="an-card">
                <div className="an-title">
                  <span className="an-icon">⚡</span>
                  Top Signals
                </div>
                {strengths.map((s, i) => (
                  <div key={i} className="an-item">
                    <div className="an-item-head">
                      <span className="an-item-name">{s.title || 'Strength Signal'}</span>
                      <span className="badge b-expert">Matched</span>
                    </div>
                    <p className="an-item-desc">{s.description || s}</p>
                  </div>
                ))}
              </div>

              <div className="an-card">
                <div className="an-title">
                  <span className="an-icon">⚠️</span>
                  Improvement Areas
                </div>
                {weaknesses.map((w, i) => (
                  <div key={i} className="an-item">
                    <div className="an-item-head">
                      <span className="an-item-name">{w.title || 'Weak Phrasing'}</span>
                      <span className={`badge ${analysis ? 'b-issue' : 'b-missing'}`}>
                        {analysis ? 'Low Impact' : 'Required'}
                      </span>
                    </div>
                    <p className="an-item-desc">{w.description || w}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="right-col">
            <div className="score-card">
              <div className="ats-badge">ATS Profile</div>
              <div className="sc-label">Resume Score</div>
              <div className="sc-number">{score || '--'}<span>/100</span></div>
              <p className="sc-desc">{scoreDescription}</p>
              <div className="sc-bar">
                <div className="sc-fill" style={{ width: `${score || 0}%` }} />
              </div>
            </div>

            <div className="skills-card">
              <div className="sk-title">Keyword Gaps</div>
              <p className="sk-sub">Missing from your profile compared to <button>Senior Roles</button></p>
              <div className="sk-tags">
                {skillGaps.map((g, i) => (
                  <div key={i} className="sk-tag">
                    <div className="sk-dot" style={{ background: '#f87171' }} />
                    {g}
                  </div>
                ))}
              </div>
              <button className="roadmap-btn" onClick={() => navigate('/roadmap')}>
                Generate Bridge Roadmap
                <span>→</span>
              </button>
            </div>

            <div className="insight-card">
              <div className="ins-title">💡 Sharp Insight</div>
              <p className="ins-text">
                "{insight || 'Once your resume is analyzed, we will surface the sharpest rewrite suggestion here.'}"
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="footer">
        <div>
          <div className="f-brand">Placifai AI</div>
          <div className="f-copy">© 2026 Placifai AI. Intellectual Career Guidance.</div>
        </div>
        <div className="f-links">
          <button className="f-link">Privacy Policy</button>
          <button className="f-link">Terms of Service</button>
          <button className="f-link" onClick={openHelp}>Contact Support</button>
        </div>
      </footer>
    </div>
  )
}
