import React from 'react'
import useUIStore from '../store/uiStore'

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
    overflow: hidden;
    position: relative;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    animation: modalFadeIn 0.3s ease-out;
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
  }
  .help-content {
    padding: 32px;
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
`

export default function HelpModal() {
  const isOpen = useUIStore((s) => s.isHelpModalOpen)
  const close = useUIStore((s) => s.closeHelpModal)

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={close}>
      <style>{styles}</style>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={close}>×</button>
        
        <div className="modal-header">
          <h2 className="modal-title">Help Center</h2>
          <p className="modal-sub">How can we help you today?</p>
        </div>

        <div className="help-content">
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
          <div className="faq-item">
            <div className="faq-q">Is my data private?</div>
            <div className="faq-a">
              Absolutely. Your resumes and interview recordings are encrypted and used only to provide you with feedback. We never share your data with recruiters without your explicit consent.
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
