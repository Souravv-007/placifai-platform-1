import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Split from 'react-split'
import Editor from '@monaco-editor/react'
import ReactMarkdown from 'react-markdown'
import { dojoAPI, aiAPI } from '../services/api'
import Topbar from '../components/Topbar'
import useAuthStore from '../store/authStore'

const styles = `
  .workspace-root {
    height: 100vh;
    background: #050608;
    color: #e8e8f0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .split-container {
    display: flex;
    flex: 1;
    overflow: hidden;
    margin-left: 200px;
    margin-top: 60px;
    height: calc(100vh - 60px);
  }

  .pane {
    background: #0f1117;
    border: 1px solid rgba(255,255,255,0.05);
    display: flex;
    flex-direction: column;
    min-height: 0;
  }

  .pane-content {
    flex: 1;
    overflow-y: auto;
    padding: 32px;
  }

  .gutter {
    background-color: #050608;
    transition: background-color 0.2s;
  }

  .gutter:hover { background-color: rgba(6, 182, 212, 0.2); }
  .gutter.gutter-horizontal { cursor: col-resize; width: 6px !important; }
  .gutter.gutter-vertical { cursor: row-resize; height: 6px !important; }

  .tab-header {
    display: flex;
    background: #161821;
    border-bottom: 1px solid rgba(255,255,255,0.05);
    flex-shrink: 0;
  }

  .tab {
    padding: 12px 24px;
    font-size: 13px;
    font-weight: 600;
    color: rgba(232,232,240,0.4);
    cursor: pointer;
    border-right: 1px solid rgba(255,255,255,0.05);
  }

  .tab.active {
    color: #06b6d4;
    background: #0f1117;
    border-bottom: 2px solid #06b6d4;
  }

  .problem-title { font-size: 28px; font-weight: 800; margin-bottom: 16px; }
  
  .section-label {
    font-size: 11px;
    font-weight: 800;
    color: #06b6d4;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 12px;
    display: block;
  }

  .example-block {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.05);
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 20px;
    font-family: 'DM Mono', monospace;
    font-size: 13px;
  }

  .ai-content {
    font-size: 14px;
    line-height: 1.8;
    color: rgba(232, 232, 240, 0.8);
    white-space: pre-wrap;
  }

  .btn-ai {
    background: rgba(139, 92, 246, 0.1);
    border: 1px solid rgba(139, 92, 246, 0.2);
    color: #a78bfa;
    padding: 6px 12px;
    border-radius: 6px;
    font-size: 11px;
    font-weight: 700;
    cursor: pointer;
    margin-left: 12px;
  }

  .markdown-body {
    font-size: 15px;
    line-height: 1.7;
    color: rgba(232, 232, 240, 0.85);
  }
  .markdown-body p { margin-bottom: 16px; }
  .markdown-body code { background: rgba(255,255,255,0.1); padding: 2px 4px; border-radius: 4px; font-family: 'DM Mono', monospace; }
  .markdown-body pre { background: #050608; padding: 16px; border-radius: 8px; margin-bottom: 16px; overflow-x: auto; }
  
  .editor-header {
    background: #161821;
    padding: 8px 16px;
    border-bottom: 1px solid rgba(255,255,255,0.05);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .lang-select {
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    color: #e8e8f0;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    outline: none;
  }

  .console-panel {
    background: #0f1117;
    border-top: 1px solid rgba(255,255,255,0.05);
    display: flex;
    flex-direction: column;
    min-height: 0;
  }

  .console-header {
    background: #161821;
    padding: 8px 16px;
    border-bottom: 1px solid rgba(255,255,255,0.05);
    color: rgba(232,232,240,0.4);
  }

  .action-btns {
    padding: 12px 16px;
    background: #161821;
    border-top: 1px solid rgba(255,255,255,0.05);
    display: flex;
    justify-content: flex-end;
    gap: 12px;
  }

  .btn {
    padding: 8px 20px;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn-run {
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    color: #e8e8f0;
  }

  .btn-submit {
    background: #06b6d4;
    border: none;
    color: #050608;
  }

  .btn:hover:not(:disabled) { opacity: 0.8; }
  .btn:disabled { opacity: 0.5; cursor: not-allowed; }
`

export default function ChallengeWorkspace() {
  const { id } = useParams()
  const navigate = useNavigate()
  
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('question')
  const [language, setLanguage] = useState('javascript')
  const [code, setCode] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [results, setResults] = useState(null)
  const [submission, setSubmission] = useState(null)
  
  const [isExplaining, setIsExplaining] = useState(false)
  const [explanation, setExplanation] = useState('')
  const [isSolving, setIsSolving] = useState(false)
  const [solution, setSolution] = useState('')

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        const res = await dojoAPI.getChallenge(id)
        setData(res.data)
        const initialLang = 'javascript'
        setLanguage(initialLang)
        setCode(res.data.challenge.starterCode[initialLang] || '')
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchChallenge()
  }, [id])

  const handleRun = async () => {
    setIsRunning(true)
    setResults(null)
    setSubmission(null)
    try {
      const res = await dojoAPI.run(id, { language, code })
      setResults(res.data.results)
    } catch (err) { alert('Execution failed') } finally { setIsRunning(false) }
  }

  const handleSubmit = async () => {
    setIsRunning(true)
    setResults(null)
    setSubmission(null)
    try {
      const res = await dojoAPI.submit(id, { language, code })
      setSubmission(res.data.submission)
      if (res.data.submission.status === 'Accepted') alert('Challenge Accepted! +' + res.data.xpGained + ' XP')
    } catch (err) { alert('Submission failed') } finally { setIsRunning(false) }
  }

  const handleExplain = async () => {
    setIsExplaining(true)
    setActiveTab('explanation')
    setExplanation('Analyzing algorithm...')
    try {
      const res = await aiAPI.explainCode({ code, language, problemTitle: data.challenge.title, problemDescription: data.challenge.description })
      setExplanation(res.data.explanation)
    } catch (err) { setExplanation('Failed to synthesize explanation.') } finally { setIsExplaining(false) }
  }

  const handleGetSolution = async () => {
    setIsSolving(true)
    setActiveTab('solution')
    setSolution('Synthesizing optimal solution...')
    try {
      const res = await aiAPI.getSolution({ 
        language, 
        problemTitle: data.challenge.title, 
        problemDescription: data.challenge.description,
        constraints: data.challenge.constraints
      })
      setSolution(res.data.solution)
    } catch (err) { setSolution('Neural link failed to provide solution.') } finally { setIsSolving(false) }
  }

  if (loading) return <div className="workspace-root" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><p style={{ color: '#06b6d4', fontFamily: 'DM Mono' }}>LOADING_WORKSPACE...</p></div>
  if (!data) return <div className="workspace-root">Challenge not found</div>

  const { challenge, submissions } = data

  return (
    <div className="workspace-root">
      <style>{styles}</style>
      <Topbar>
        <button onClick={() => navigate('/dojo')} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#e8e8f0', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}>← Back to Dojo</button>
      </Topbar>
      
      <div className="split-container">
        <Split className="flex flex-1" sizes={[40, 60]} minSize={300} gutterSize={6} style={{ display: 'flex', width: '100%' }}>
          {/* Left Pane */}
          <div className="pane">
            <div className="tab-header">
              <div className={`tab ${activeTab === 'question' ? 'active' : ''}`} onClick={() => setActiveTab('question')}>Question</div>
              <div className={`tab ${activeTab === 'solution' ? 'active' : ''}`} onClick={() => setActiveTab('solution')}>Solution</div>
            </div>
            
            <div className="pane-content">
              {activeTab === 'question' ? (
                <>
                  <h1 className="problem-title">{challenge.title}</h1>
                  <div className="markdown-body">
                    <ReactMarkdown>{challenge.description}</ReactMarkdown>
                  </div>
                  
                  <span className="section-label" style={{ marginTop: '32px' }}>Examples</span>
                  {challenge.testCases?.map((tc, i) => (
                    <div key={tc.id} className="example-block">
                      <div style={{ color: '#06b6d4', marginBottom: '4px' }}>Example {i + 1}:</div>
                      <div><span style={{ color: 'rgba(255,255,255,0.3)' }}>Input:</span> {tc.input}</div>
                      <div><span style={{ color: 'rgba(255,255,255,0.3)' }}>Output:</span> <span style={{ color: '#10b981' }}>{tc.expectedOutput}</span></div>
                    </div>
                  ))}

                  {challenge.constraints && (
                    <div style={{ marginTop: '32px' }}>
                      <span className="section-label">Constraints</span>
                      <div className="markdown-body" style={{ fontSize: '13px', background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px' }}>
                         <ReactMarkdown>{challenge.constraints}</ReactMarkdown>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="ai-content">
                   <ReactMarkdown>{solution || "Click 'View Solution ✦' to see the optimal AI-generated code."}</ReactMarkdown>
                </div>
              )}
            </div>
          </div>

          {/* Right Pane */}
          <div className="pane" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Split 
              direction="vertical" 
              sizes={[65, 35]} 
              minSize={100} 
              gutterSize={6} 
              style={{ height: '100%' }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                <div className="editor-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <select className="lang-select" value={language} onChange={(e) => {
                      const newLang = e.target.value;
                      setLanguage(newLang);
                      setCode(data.challenge.starterCode[newLang] || '');
                    }}>
                      <option value="javascript">JavaScript</option>
                      <option value="python">Python</option>
                      <option value="cpp">C++</option>
                      <option value="java">Java</option>
                    </select>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn-ai" onClick={handleGetSolution} disabled={isSolving}>View Solution ✦</button>
                  </div>
                </div>
                <div style={{ flex: 1, minHeight: 0 }}>
                  <Editor height="100%" theme="vs-dark" language={language === 'cpp' ? 'cpp' : language} value={code} onChange={(val) => setCode(val)} options={{ fontSize: 14, minimap: { enabled: false }, automaticLayout: true }} />
                </div>
              </div>

              <div className="console-panel" style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                <div className="console-header"><span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '1px' }}>CONSOLE_OUTPUT</span></div>
                <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
                  {isRunning && <div style={{ color: '#06b6d4', fontFamily: 'DM Mono', fontSize: '13px' }}>SYNTHESIZING_EXECUTION...</div>}
                  {results && results.map((r, i) => (
                    <div key={i} className="example-block" style={{ marginBottom: '12px' }}>
                      <div style={{ color: r.passed ? '#10b981' : '#ef4444', fontWeight: '800' }}>Test Case {i + 1}: {r.passed ? 'PASSED' : 'FAILED'}</div>
                      {!r.passed && (
                        <div style={{ marginTop: '8px', fontSize: '12px' }}>
                           <div><span style={{ color: 'rgba(255,255,255,0.3)' }}>Input:</span> {r.input}</div>
                           <div><span style={{ color: 'rgba(255,255,255,0.3)' }}>Expected:</span> <span style={{ color: '#10b981' }}>{r.expectedOutput}</span></div>
                           <div><span style={{ color: 'rgba(255,255,255,0.3)' }}>Actual:</span> <span style={{ color: '#ef4444' }}>{r.actualOutput}</span></div>
                        </div>
                      )}
                      {r.error && <pre style={{ color: '#ef4444', fontSize: '12px', marginTop: '8px', whiteSpace: 'pre-wrap' }}>{r.error}</pre>}
                    </div>
                  ))}
                  {submission && (
                    <div className="example-block" style={{ borderLeft: `4px solid ${submission.status === 'Accepted' ? '#10b981' : '#ef4444'}` }}>
                      <div style={{ fontSize: '20px', fontWeight: '800', color: submission.status === 'Accepted' ? '#10b981' : '#ef4444' }}>{submission.status}</div>
                      {submission.error && <pre style={{ color: '#ef4444', fontSize: '12px', marginTop: '8px', whiteSpace: 'pre-wrap' }}>{submission.error}</pre>}
                      <div style={{ marginTop: '8px', display: 'flex', gap: '24px', fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>
                        <div>RUNTIME: {submission.runtimeMs} ms</div>
                        <div>MEMORY: {(submission.memoryKb / 1024).toFixed(2)} MB</div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="action-btns">
                  <button className="btn btn-run" onClick={handleRun} disabled={isRunning}>Run Code</button>
                  <button className="btn btn-submit" onClick={handleSubmit} disabled={isRunning}>Submit</button>
                </div>
              </div>
            </Split>
          </div>
        </Split>
      </div>
    </div>
  )
}
