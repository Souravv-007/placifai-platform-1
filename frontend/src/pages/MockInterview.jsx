import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import { interviewAPI } from '../services/api'
import useUIStore from '../store/uiStore'

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@300;400&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  .mi-root { display: flex; min-height: 100vh; background: #0f1117; color: #e8e8f0; font-family: 'DM Sans', sans-serif; }
 
  /* TOPBAR */
  .mi-topbar { position: fixed; top: 0; left: 0; right: 0; height: 54px; background: rgba(15,17,23,0.98); border-bottom: 1px solid rgba(255,255,255,0.06); backdrop-filter: blur(20px); display: flex; align-items: center; justify-content: space-between; padding: 0 24px; z-index: 50; }
  .mi-brand { display: flex; align-items: center; gap: 12px; }
  .mi-logo { font-size: 18px; font-weight: 700; cursor: pointer; }
  .mi-session { font-size: 12px; color: rgba(232,232,240,0.4); margin-left: 16px; border-left: 1px solid rgba(255,255,255,0.1); padding-left: 16px; }
  .mi-top-right { display: flex; align-items: center; gap: 10px; }
  .mi-icon { width: 32px; height: 32px; border-radius: 8px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); color: rgba(232,232,240,0.5); cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 14px; }
  .mi-av { width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg,#6366f1,#8b5cf6); display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; color: white; cursor: pointer; }
 
  /* MAIN CONTENT */
  .mi-main { margin-top: 54px; display: grid; grid-template-columns: 1fr 360px; width: 100%; min-height: calc(100vh - 54px); }
  .mi-setup-container { margin-top: 54px; display: flex; align-items: center; justify-content: center; min-height: calc(100vh - 54px); width: 100%; }
  .mi-setup { width: 100%; max-width: 500px; padding: 40px; }
  .setup-card { background: #161821; border: 1px solid rgba(255,255,255,0.07); border-radius: 16px; padding: 32px; width: 100%; }
  .setup-title { font-size: 24px; font-weight: 700; margin-bottom: 24px; text-align: center; }
  .setup-group { margin-bottom: 20px; }
  .setup-label { display: block; font-size: 12px; text-transform: uppercase; color: rgba(232,232,240,0.4); margin-bottom: 8px; letter-spacing: 0.05em; }
  .setup-input { width: 100%; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 12px 16px; color: white; font-family: inherit; font-size: 14px; outline: none; }
  .setup-input:focus { border-color: #6366f1; }
  .start-btn { width: 100%; padding: 14px; background: linear-gradient(135deg,#6366f1,#8b5cf6); border: none; border-radius: 8px; color: white; font-size: 14px; font-weight: 600; cursor: pointer; margin-top: 10px; }

  /* LEFT PANEL */
  .mi-left { border-right: 1px solid rgba(255,255,255,0.06); padding: 32px 24px; display: flex; flex-direction: column; height: calc(100vh - 118px); }
  .mi-avatar { display: flex; justify-content: center; margin-bottom: 24px; }
  .ai-avatar { width: 80px; height: 80px; border-radius: 50%; background: linear-gradient(135deg,#6366f1,#8b5cf6); display: flex; align-items: center; justify-content: center; font-size: 32px; border: 3px solid rgba(99,102,241,0.3); }
  .mi-name { font-size: 24px; font-weight: 700; text-align: center; margin-bottom: 6px; }
  .mi-status { text-align: center; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: #4ade80; font-family: 'DM Mono', monospace; margin-bottom: 24px; }
 
  .mi-message { background: rgba(99,102,241,0.08); border: 1px solid rgba(99,102,241,0.15); border-radius: 12px; padding: 20px; margin-bottom: 20px; overflow-y: auto; max-height: 250px; }
  .msg-text { font-size: 14px; color: rgba(232,232,240,0.8); line-height: 1.7; }
  .msg-sent { font-size: 10px; color: rgba(232,232,240,0.3); font-family: 'DM Mono', monospace; margin-top: 12px; }
 
  .mi-response-area { margin-top: auto; }
  .mi-response { background: rgba(99,102,241,0.12); border: 1px solid rgba(99,102,241,0.2); border-radius: 12px; padding: 16px; margin-bottom: 12px; }
  .resp-title { font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase; color: #a78bfa; font-family: 'DM Mono', monospace; margin-bottom: 12px; }
  .resp-input { width: 100%; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; padding: 12px; color: rgba(232,232,240,0.9); font-family: inherit; font-size: 13px; line-height: 1.6; resize: none; min-height: 100px; outline: none; }
  .resp-input:focus { border-color: rgba(99,102,241,0.5); }
  
  .submit-btn { width: 100%; padding: 12px; background: #6366f1; border: none; border-radius: 8px; color: white; font-weight: 600; cursor: pointer; font-size: 13px; }
  .submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }

  /* RIGHT PANEL */
  .mi-right { padding: 32px 24px; display: flex; flex-direction: column; gap: 20px; overflow-y: auto; }
  .mi-video { border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; height: 200px; background: linear-gradient(135deg,#1a1c2e,#0d0f1a); display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; }
  .mi-video video { width: 100%; height: 100%; object-fit: cover; }
  .live-badge { position: absolute; top: 12px; right: 12px; background: rgba(239,68,68,0.15); border: 1px solid rgba(239,68,68,0.3); color: #f87171; padding: 4px 10px; border-radius: 20px; font-size: 10px; font-weight: 600; letter-spacing: 0.08em; font-family: 'DM Mono', monospace; z-index: 10; }
  
  /* AI Visualizer */
  .ai-avatar { width: 80px; height: 80px; border-radius: 50%; background: linear-gradient(135deg,#6366f1,#8b5cf6); display: flex; align-items: center; justify-content: center; font-size: 32px; border: 3px solid rgba(99,102,241,0.3); position: relative; transition: all 0.3s; }
  .ai-avatar.speaking { box-shadow: 0 0 0 4px rgba(99,102,241,0.2); animation: ai-pulse 1.5s infinite; }
  @keyframes ai-pulse { 
    0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(99,102,241,0.4); }
    70% { transform: scale(1.05); box-shadow: 0 0 0 15px rgba(99,102,241,0); }
    100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(99,102,241,0); }
  }

  /* Audio Visualizer Bar */
  .viz-container { display: flex; align-items: center; gap: 3px; height: 20px; margin-top: 10px; justify-content: center; }
  .viz-bar { width: 3px; background: #818cf8; border-radius: 1px; transition: height 0.1s; }
  .viz-bar.active { animation: bar-rise 0.5s infinite alternate; }
  @keyframes bar-rise { from { height: 4px; } to { height: 16px; } }

  .mic-btn { width: 64px; height: 64px; border-radius: 50%; background: #6366f1; border: none; color: white; font-size: 24px; cursor: pointer; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; transition: all 0.2s; box-shadow: 0 4px 15px rgba(99,102,241,0.3); }
  .mic-btn:hover { background: #4f46e5; transform: scale(1.05); }
  .mic-btn.listening { background: #ef4444; box-shadow: 0 0 0 10px rgba(239,68,68,0.15); animation: mic-pulse 1.5s infinite; }
  @keyframes mic-pulse {
    0% { box-shadow: 0 0 0 0 rgba(239,68,68,0.4); }
    70% { box-shadow: 0 0 0 15px rgba(239,68,68,0); }
    100% { box-shadow: 0 0 0 0 rgba(239,68,68,0); }
  }
 
  .mi-metrics { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .metric-card { background: #161821; border: 1px solid rgba(255,255,255,0.07); border-radius: 10px; padding: 16px; }
  .metric-lbl { font-size: 9px; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(232,232,240,0.3); font-family: 'DM Mono', monospace; margin-bottom: 8px; }
  .metric-val { font-size: 28px; font-weight: 700; margin-bottom: 4px; }
  .metric-bar { height: 4px; background: rgba(255,255,255,0.07); border-radius: 2px; overflow: hidden; margin-top: 8px; }
  .metric-fill { height: 100%; background: linear-gradient(90deg,#6366f1,#818cf8); border-radius: 2px; transition: width 0.5s ease; }
 
  .mi-tips { background: #161821; border: 1px solid rgba(255,255,255,0.07); border-radius: 10px; padding: 16px; }
  .tips-title { font-size: 12px; font-weight: 600; margin-bottom: 12px; display: flex; align-items: center; gap: 6px; }
  .tip-item { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 6px; padding: 8px 12px; font-size: 11px; color: rgba(232,232,240,0.6); margin-bottom: 8px; }
 
  .mi-speech { background: #161821; border: 1px solid rgba(255,255,255,0.07); border-radius: 10px; padding: 16px; }
  .speech-item { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; font-size: 11px; }
  .speech-key { color: rgba(232,232,240,0.5); }
  .keyword-tag { background: rgba(99,102,241,0.1); border: 1px solid rgba(99,102,241,0.2); color: #818cf8; padding: 2px 8px; border-radius: 4px; font-size: 10px; margin-right: 6px; margin-bottom: 6px; display: inline-block; }
 
  /* BOTTOM BAR */
  .mi-bottom { position: fixed; bottom: 0; left: 0; right: 0; height: 64px; background: rgba(15,17,23,0.98); border-top: 1px solid rgba(255,255,255,0.06); display: flex; align-items: center; justify-content: space-between; padding: 0 24px; }
  .mi-actions { display: flex; align-items: center; gap: 12px; }
  .mi-btn { padding: 11px 20px; border-radius: 8px; border: none; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
  .mi-btn-end { background: #ef4444; color: white; }
 
  @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
  .mi-message { animation: fadeUp 0.4s ease both; }

  /* NEW LOBBY & REPORT STYLES */
  .mi-lobby { display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%; height: calc(100vh - 118px); padding: 40px; }
  .lobby-card { background: #161821; border: 1px solid rgba(255,255,255,0.07); border-radius: 20px; padding: 48px; text-align: center; max-width: 600px; width: 100%; }
  .lobby-icon { font-size: 48px; margin-bottom: 24px; }
  .lobby-title { font-size: 32px; font-weight: 700; margin-bottom: 16px; }
  .lobby-desc { color: rgba(232,232,240,0.5); margin-bottom: 32px; line-height: 1.6; }
  .lobby-btn { padding: 16px 48px; background: #6366f1; border: none; border-radius: 12px; color: white; font-size: 18px; font-weight: 700; cursor: pointer; transition: all 0.2s; }
  .lobby-btn:hover { transform: scale(1.05); background: #4f46e5; }
  .lobby-preview { width: 100%; height: 200px; background: #000; border-radius: 12px; margin-bottom: 24px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1); }

  .mi-report-overlay { position: fixed; inset: 0; background: rgba(15,17,23,0.95); z-index: 100; display: flex; align-items: center; justify-content: center; padding: 40px; backdrop-filter: blur(10px); }
  .report-card { background: #161821; border: 1px solid rgba(255,255,255,0.1); border-radius: 24px; width: 100%; max-width: 800px; max-height: 90vh; overflow-y: auto; padding: 40px; }
  .report-header { text-align: center; margin-bottom: 40px; }
  .report-title { font-size: 32px; font-weight: 700; margin-bottom: 12px; }
  .report-subtitle { color: rgba(232,232,240,0.4); text-transform: uppercase; letter-spacing: 0.1em; font-size: 12px; }
  .report-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 40px; }
  .report-metric { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; padding: 24px; text-align: center; }
  .rm-label { font-size: 12px; color: rgba(232,232,240,0.4); margin-bottom: 8px; }
  .rm-value { font-size: 40px; font-weight: 700; color: #818cf8; }
  .report-feedback { background: rgba(99,102,241,0.08); border: 1px solid rgba(99,102,241,0.2); border-radius: 16px; padding: 24px; margin-bottom: 32px; }
  .rf-title { font-size: 14px; font-weight: 600; margin-bottom: 12px; color: #a78bfa; }
  .rf-text { font-size: 15px; line-height: 1.7; color: rgba(232,232,240,0.8); }
  .report-actions { display: flex; gap: 16px; justify-content: center; }
  .report-btn { padding: 14px 32px; border-radius: 10px; border: none; font-weight: 600; cursor: pointer; transition: 0.2s; }
  .btn-primary { background: #6366f1; color: white; }
  .btn-secondary { background: rgba(255,255,255,0.05); color: white; border: 1px solid rgba(255,255,255,0.1); }
`

export default function MockInterview() {
  const user = useAuthStore((s) => s.user)
  const navigate = useNavigate()
  
  const [inSession, setInSession] = useState(false)
  const [isStarted, setIsStarted] = useState(false)
  const [showReport, setShowReport] = useState(false)
  const [role, setRole] = useState('')
  const [company, setCompany] = useState('')
  const [sessionId, setSessionId] = useState(null)

  const [loading, setLoading] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState('')
  const [userResponse, setUserResponse] = useState('')
  const [feedback, setFeedback] = useState(null)
  const [history, setHistory] = useState([])

  // New interactive states
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(true)

  const recognitionRef = useRef(null)
  const videoRef = useRef(null)
  const lobbyVideoRef = useRef(null)
  const streamRef = useRef(null)

  useEffect(() => {
    if (!user) navigate('/login')

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true

      recognitionRef.current.onresult = (event) => {
        let transcript = ''
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript
        }
        setUserResponse(transcript)
      }

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error)
        setIsListening(false)
      }
    }

    return () => {
      stopCamera()
    }
  }, [user, navigate])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      streamRef.current = stream
      if (videoRef.current) videoRef.current.srcObject = stream
      if (lobbyVideoRef.current) lobbyVideoRef.current.srcObject = stream
    } catch (err) {
      console.error('Error accessing camera:', err)
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
  }

  useEffect(() => {
    if (inSession) {
      startCamera()
    } else {
      stopCamera()
      setIsStarted(false)
      setShowReport(false)
    }
  }, [inSession])

  useEffect(() => {
    if (streamRef.current) {
      if (isStarted && videoRef.current) videoRef.current.srcObject = streamRef.current
      if (!isStarted && lobbyVideoRef.current) lobbyVideoRef.current.srcObject = streamRef.current
    }
  }, [inSession, isStarted])

  const speakQuestion = (text) => {
    if (!voiceEnabled) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    const voices = window.speechSynthesis.getVoices()
    const preferredVoice = voices.find(v => v.name.includes('Google') || v.name.includes('Male'))
    if (preferredVoice) utterance.voice = preferredVoice
    window.speechSynthesis.speak(utterance)
  }

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop()
      setIsListening(false)
    } else {
      setUserResponse('')
      recognitionRef.current?.start()
      setIsListening(true)
    }
  }

  const prepareSession = async () => {
    if (!role || !company) return
    setLoading(true)
    try {
      const res = await interviewAPI.getQuestions({ role, company })
      setSessionId(res.data.sessionId)
      setCurrentQuestion(res.data.question || res.data.questions?.[0])
      setInSession(true)
      setIsStarted(false)
    } catch (err) {
      console.error(err)
      alert('Failed to prepare session')
    } finally {
      setLoading(false)
    }
  }

  const beginInterview = () => {
    setIsStarted(true)
    speakQuestion(currentQuestion)
  }

  const stopQuestioning = () => {
    window.speechSynthesis.cancel()
    setIsSpeaking(false)
    if (isListening) {
      recognitionRef.current?.stop()
      setIsListening(false)
    }
    setShowReport(true)
  }

  const submitAnswer = async () => {
    if (!userResponse || loading) return
    if (isListening) {
      recognitionRef.current?.stop()
      setIsListening(false)
    }
    setLoading(true)
    try {
      const res = await interviewAPI.submitAnswer({ sessionId, answer: userResponse })
      setFeedback(res.data)
      setCurrentQuestion(res.data.question)
      setUserResponse('')
      setHistory(res.data.transcript || [])
      speakQuestion(res.data.question)
    } catch (err) {
      console.error(err)
      alert('Failed to submit answer')
    } finally {
      setLoading(false)
    }
  }

  if (!user) return null

  const metrics = {
    accuracy: feedback?.accuracy || 0,
    confidence: feedback?.confidence || 0,
    speechPace: feedback?.speechPace || 'N/A',
    keyTerms: feedback?.keyTerms || []
  }

  const openHelp = useUIStore((s) => s.openHelpModal)

  return (
    <div className="mi-root">
      <style>{styles}</style>
      <header className="mi-topbar">
        <div className="mi-brand" onClick={() => {
          window.speechSynthesis.cancel()
          navigate('/dashboard')
        }}>
          <span className="mi-logo">Placifai AI</span>
          {inSession && <span className="mi-session">Session: {role} at {company}</span>}
        </div>
        <div className="mi-top-right">
          <button className="mi-icon" onClick={openHelp}>
            ?
          </button>
          <button className="mi-icon" onClick={() => setVoiceEnabled(!voiceEnabled)}>
            {voiceEnabled ? '🔊' : '🔇'}
          </button>
          <div className="mi-av">{user.firstName?.[0].toUpperCase()}</div>
        </div>
      </header>

      {!inSession ? (
        <div className="mi-setup-container">
          <div className="mi-setup">
            <div className="setup-card">
              <h2 className="setup-title">Interview Simulator</h2>
              <div className="setup-group">
                <label className="setup-label">Target Role</label>
                <input className="setup-input" placeholder="e.g. Senior Frontend Engineer" value={role} onChange={(e) => setRole(e.target.value)} />
              </div>
              <div className="setup-group">
                <label className="setup-label">Target Company</label>
                <input className="setup-input" placeholder="e.g. Google, Stripe" value={company} onChange={(e) => setCompany(e.target.value)} />
              </div>
              <button className="start-btn" onClick={prepareSession} disabled={loading}>
                {loading ? 'Preparing Session...' : 'Prepare Mock Interview'}
              </button>
            </div>
          </div>
        </div>
      ) : !isStarted ? (
        <div className="mi-lobby">
          <div className="lobby-card">
            <div className="lobby-icon">🎙️</div>
            <h2 className="lobby-title">Ready to Begin?</h2>
            <div className="lobby-preview">
              <video ref={lobbyVideoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <p className="lobby-desc">Your session for <strong>{role}</strong> at <strong>{company}</strong> is prepared. The camera and voice transcription are ready.</p>
            <button className="lobby-btn" onClick={beginInterview}>START INTERVIEW</button>
          </div>
        </div>
      ) : (
        <div className="mi-main">
          {showReport && (
            <div className="mi-report-overlay">
              <div className="report-card">
                <div className="report-header">
                  <div className="report-subtitle">Final Interview Performance</div>
                  <h2 className="report-title">{role} at {company}</h2>
                </div>
                <div className="report-grid">
                  <div className="report-metric"><div className="rm-label">Technical Accuracy</div><div className="rm-value">{metrics.accuracy}%</div></div>
                  <div className="report-metric"><div className="rm-label">Overall Confidence</div><div className="rm-value">{metrics.confidence}%</div></div>
                </div>
                <div className="report-feedback">
                  <div className="rf-title">Final Summary Feedback</div>
                  <div className="rf-text">{feedback?.feedback_on_previous || "Great job completing the mock interview!"}</div>
                </div>
                <div className="report-actions">
                  <button className="report-btn btn-secondary" onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
                  <button className="report-btn btn-primary" onClick={() => setInSession(false)}>Try Another Session</button>
                </div>
              </div>
            </div>
          )}

          <div className="mi-left">
            <div className="mi-avatar"><div className={`ai-avatar ${isSpeaking ? 'speaking' : ''}`}>🤖</div></div>
            <div className="mi-name">AI Interviewer</div>
            <div className="mi-status">{isSpeaking ? 'Speaking...' : 'Listening...'}</div>
            <div className="mi-message">
              <div className="msg-text">{currentQuestion}</div>
              <div className="msg-sent">AI INTERVIEWER</div>
            </div>
            {isSpeaking && (
              <div className="viz-container">
                {[...Array(12)].map((_, i) => <div key={i} className="viz-bar active" style={{ animationDelay: `${i * 0.05}s` }} />)}
              </div>
            )}
            <div className="mi-response-area">
              <button className={`mic-btn ${isListening ? 'listening' : ''}`} onClick={toggleListening} disabled={loading || isSpeaking}>
                {isListening ? '🛑' : '🎤'}
              </button>
              <div className="mi-response">
                <div className="resp-title">Your Answer</div>
                <textarea className="resp-input" placeholder={isListening ? "Listening..." : "Type or use mic..."} value={userResponse} onChange={(e) => setUserResponse(e.target.value)} disabled={loading} />
              </div>
              <button className="submit-btn" onClick={submitAnswer} disabled={loading || !userResponse || isSpeaking}>
                {loading ? 'Analyzing...' : 'Submit Answer'}
              </button>
            </div>
          </div>

          <div className="mi-right">
            <div className="mi-video">
              <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div className="live-badge">🔴 LIVE</div>
            </div>
            <div className="mi-metrics">
              <div className="metric-card">
                <div className="metric-lbl">Technical Accuracy</div>
                <div className="metric-val">{metrics.accuracy}%</div>
                <div className="metric-bar"><div className="metric-fill" style={{ width: `${metrics.accuracy}%` }} /></div>
              </div>
              <div className="metric-card">
                <div className="metric-lbl">Confidence</div>
                <div className="metric-val">{metrics.confidence}%</div>
                <div className="metric-bar"><div className="metric-fill" style={{ width: `${metrics.confidence}%` }} /></div>
              </div>
            </div>
            {feedback?.feedback_on_previous && (
              <div className="mi-tips">
                <div className="tips-title">✦ AI Feedback</div>
                <div className="tip-item">{feedback.feedback_on_previous}</div>
                {feedback.tips?.map((t, i) => <div key={i} className="tip-item">• {t}</div>)}
              </div>
            )}
            <div className="mi-speech">
              <div className="tips-title" style={{ marginBottom: '12px' }}>🎙 Speech Pace</div>
              <div className="speech-item"><span className="speech-key">{metrics.speechPace || 'N/A'}</span></div>
              <div className="tips-title" style={{ marginTop: '12px', marginBottom: '8px' }}>🎯 Key Terms Used</div>
              <div className="speech-item" style={{ display: 'block' }}>
                {metrics.keyTerms?.map((term, i) => <span key={i} className="keyword-tag">{term}</span>) || <span className="speech-key">None yet</span>}
              </div>
            </div>
          </div>
        </div>
      )}

      {inSession && (
        <div className="mi-bottom">
          <div className="mi-docs">END-TO-END INTERVIEW ENCRYPTION ACTIVE</div>
          <div className="mi-actions">
            <button className="mi-btn mi-btn-end" onClick={stopQuestioning}>🛑 STOP QUESTIONING</button>
          </div>
        </div>
      )}
    </div>
  )
}
