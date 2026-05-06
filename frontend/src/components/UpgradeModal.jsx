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
    max-width: 800px;
    overflow: hidden;
    position: relative;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    animation: modalFadeIn 0.3s ease-out;
  }
  @keyframes modalFadeIn {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
  }
  .modal-header {
    padding: 32px 32px 0;
    text-align: center;
  }
  .modal-title {
    font-size: 32px;
    font-weight: 700;
    background: linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.7) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 12px;
  }
  .modal-sub {
    font-size: 14px;
    color: rgba(232, 232, 240, 0.4);
    max-width: 400px;
    margin: 0 auto;
    line-height: 1.6;
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
    transition: all 0.2s;
  }
  .close-btn:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #fff;
  }
  .plans-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    padding: 32px;
  }
  .plan-card {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 20px;
    padding: 24px;
    display: flex;
    flex-direction: column;
    transition: all 0.2s;
  }
  .plan-card.featured {
    background: rgba(99, 102, 241, 0.05);
    border-color: rgba(99, 102, 241, 0.3);
  }
  .plan-badge {
    align-self: flex-start;
    padding: 4px 10px;
    background: rgba(99, 102, 241, 0.15);
    color: #818cf8;
    border-radius: 6px;
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 16px;
  }
  .plan-name {
    font-size: 20px;
    font-weight: 700;
    margin-bottom: 8px;
  }
  .plan-price {
    font-size: 36px;
    font-weight: 700;
    margin-bottom: 24px;
  }
  .plan-price span {
    font-size: 14px;
    font-weight: 400;
    color: rgba(232, 232, 240, 0.4);
  }
  .plan-features {
    list-style: none;
    padding: 0;
    margin: 0 0 32px;
    flex: 1;
  }
  .feature-item {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 13px;
    color: rgba(232, 232, 240, 0.6);
    margin-bottom: 12px;
  }
  .feature-check {
    color: #818cf8;
    font-size: 14px;
  }
  .plan-btn {
    width: 100%;
    padding: 14px;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    font-family: inherit;
  }
  .btn-free {
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: rgba(232, 232, 240, 0.6);
  }
  .btn-pro {
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    border: none;
    color: white;
    box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
  }
  .btn-pro:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);
  }
`

export default function UpgradeModal() {
  const isOpen = useUIStore((s) => s.isUpgradeModalOpen)
  const close = useUIStore((s) => s.closeUpgradeModal)

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={close}>
      <style>{styles}</style>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={close}>×</button>
        
        <div className="modal-header">
          <h2 className="modal-title">Elevate Your Career</h2>
          <p className="modal-sub">
            Join 10,000+ engineers who used Placifai Pro to land roles at FAANG and Tier-1 startups.
          </p>
        </div>

        <div className="plans-grid">
          <div className="plan-card">
            <div className="plan-name">Free</div>
            <div className="plan-price">$0<span>/forever</span></div>
            <ul className="plan-features">
              <li className="feature-item"><span className="feature-check">✓</span> 1 Resume Analysis / mo</li>
              <li className="feature-item"><span className="feature-check">✓</span> Basic Roadmap</li>
              <li className="feature-item"><span className="feature-check">✓</span> 2 Mock Interviews / mo</li>
              <li className="feature-item"><span className="feature-check">✓</span> Community Support</li>
            </ul>
            <button className="plan-btn btn-free" disabled>Current Plan</button>
          </div>

          <div className="plan-card featured">
            <div className="plan-badge">Most Popular</div>
            <div className="plan-name">Pro</div>
            <div className="plan-price">$19<span>/month</span></div>
            <ul className="plan-features">
              <li className="feature-item"><span className="feature-check">✓</span> Unlimited Resume Analysis</li>
              <li className="feature-item"><span className="feature-check">✓</span> Personalized Staff-level Roadmap</li>
              <li className="feature-item"><span className="feature-check">✓</span> Unlimited Mock Interviews</li>
              <li className="feature-item"><span className="feature-check">✓</span> FAANG Interviewer Feedback</li>
              <li className="feature-item"><span className="feature-check">✓</span> Priority AI Processing</li>
            </ul>
            <button className="plan-btn btn-pro" onClick={() => alert('Redirecting to payment...')}>Upgrade to Pro</button>
          </div>
        </div>
      </div>
    </div>
  )
}
