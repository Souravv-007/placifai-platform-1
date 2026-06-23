import React, { useState } from 'react'
import useUIStore from '../store/uiStore'
import { aiAPI } from '../services/api'

const styles = `
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(10, 11, 15, 0.85);
    backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 20px;
  }
  .modal-card {
    background: #161821;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 24px;
    width: 100%;
    max-width: 600px;
    max-height: 90vh;
    overflow-y: auto;
    position: relative;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    animation: modalFadeIn 0.3s ease-out;
    display: flex;
    flex-direction: column;
  }
  .modal-header {
    padding: 32px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  }
  .modal-title {
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 8px;
  }
  .modal-sub {
    font-size: 14px;
    color: rgba(232, 232, 240, 0.4);
  }
  .close-btn {
    position: absolute;
    top: 24px;
    right: 24px;
    width: 32px;
    height: 32px;
    background: rgba(255, 255, 255, 0.05);
    border: none;
    border-radius: 50%;
    color: rgba(232, 232, 240, 0.4);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    z-index: 10;
  }
  .help-content {
    padding: 32px;
    flex: 1;
  }
  .ai-search-container {
    margin-bottom: 32px;
  }
  .ai-search-label {
    font-size: 12px;
    font-weight: 600;
    color: #818cf8;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 12px;
    display: block;
  }
  .ai-input-wrapper {
    position: relative;
    display: flex;
    gap: 10px;
  }
  .ai-input {
    flex: 1;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 14px 18px;
    color: #e8e8f0;
    font-family: inherit;
    font-size: 14px;
    outline: none;
    transition: border-color 0.2s;
  }
  .ai-input:focus {
    border-color: rgba(99, 102, 241, 0.5);
  }
  .ai-send-btn {
    padding: 0 20px;
    background: #6366f1;
    border: none;
    border-radius: 12px;
    color: white;
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.2s;
  }
  .ai-send-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  .ai-response {
    margin-top: 20px;
    padding: 20px;
    background: rgba(99, 102, 241, 0.05);
    border: 1px solid rgba(99, 102, 241, 0.15);
    border-radius: 14px;
    font-size: 14px;
    line-height: 1.6;
    color: rgba(232, 232, 240, 0.8);
    animation: fadeIn 0.4s ease;
  }
  .ai-response-header {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 11px;
    font-weight: 700;
    color: #818cf8;
    margin-bottom: 10px;
    text-transform: uppercase;
  }
  .faq-item {
    margin-bottom: 24px;
  }
  .faq-q {
    font-size: 15px;
    font-weight: 600;
    margin-bottom: 8px;
    color: #818cf8;
  }
  .faq-a {
    font-size: 14px;
    color: rgba(232, 232, 240, 0.6);
    line-height: 1.6;
  }
  .contact-footer {
    padding: 24px 32px;
    background: rgba(255, 255, 255, 0.02);
    border-top: 1px solid rgba(255, 255, 255, 0.06);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .contact-btn {
    padding: 10px 20px;
    background: rgba(99, 102, 241, 0.1);
    border: 1px solid rgba(99, 102, 241, 0.2);
    border-radius: 8px;
    color: #818cf8;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }
  .contact-btn:hover {
    background: rgba(99, 102, 241, 0.2);
  }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
`

export default function HelpModal() {
  const isOpen = useUIStore((s) => s.isHelpModalOpen)
  const close = useUIStore((s) => s.closeHelpModal)
  
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const handleAsk = async (e) => {
    e.preventDefault()
    if (!question.trim() || loading) return

    setLoading(true)
    setAnswer('')
    try {
      const res = await aiAPI.ask(question)
      setAnswer(res.data.answer)
    } catch (err) {
      console.error(err)
      setAnswer('Sorry, I encountered an error. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={close}>
      <style>{styles}</style>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={close}>×</button>
        
        <div className="modal-header">
          <h2 className="modal-title">AI Career Assistant</h2>
          <p className="modal-sub">Ask anything about your career trajectory or the platform.</p>
        </div>

        <div className="help-content">
          <div className="ai-search-container">
            <span className="ai-search-label">Quick Ask</span>
            <form className="ai-input-wrapper" onSubmit={handleAsk}>
              <input 
                className="ai-input" 
                placeholder="Ex: How can I improve my system design score?" 
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
              <button className="ai-send-btn" type="submit" disabled={loading}>
                {loading ? '...' : 'Ask'}
              </button>
            </form>
            
            {answer && (
              <div className="ai-response">
                <div className="ai-response-header">
                  <span>✦</span> AI COACH RESPONSE
                </div>
                {answer}
              </div>
            )}
          </div>

          <div style={{borderBottom: '1px solid rgba(255,255,255,0.06)', margin: '32px 0'}} />
          
          <span className="ai-search-label" style={{marginBottom: '20px'}}>Frequent Questions</span>
          <div className="faq-item">
            <div className="faq-q">How does the AI Resume Analysis work?</div>
            <div className="faq-a">
              Our AI parses your resume using LLMs trained on 50,000+ successful FAANG applications. It identifies keywords, quantifies impact, and suggests staff-level framing.
            </div>
          </div>
          <div className="faq-item">
            <div className="faq-q">Can I practice for specific companies?</div>
            <div className="faq-a">
              Yes! In the Prep Hub or Mock Interview section, you can specify your target company. Our AI will adjust its questioning style and focus based on that company's known interview bar.
            </div>
          </div>
        </div>

        <div className="contact-footer">
          <span style={{fontSize: '13px', color: 'rgba(232, 232, 240, 0.4)'}}>Still have questions?</span>
          <button className="contact-btn" onClick={() => alert('Support ticket created!')}>Contact Support</button>
        </div>
      </div>
    </div>
  )
}
