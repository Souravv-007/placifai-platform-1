import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import useUIStore from '../store/uiStore'

const NAV = [
  { ico: '⊞', label: 'Dashboard', id: 'dashboard', path: '/dashboard' },
  { ico: '⚡', label: 'Prep Hub', id: 'prep', path: '/prep' },
  { ico: '📍', label: 'Roadmap', id: 'roadmap', path: '/roadmap' },
  { ico: '🎤', label: 'Mock Interview', id: 'interview', path: '/interview' },
  { ico: '📈', label: 'Progress', id: 'progress', path: '/progress' },
  { ico: '⚔️', label: 'The Dojo', id: 'dojo', path: '/dojo' },
]

const styles = `
  .sb-container {
    width: 200px;
    min-height: 100vh;
    background: #0a0b0f;
    border-right: 1px solid rgba(255,255,255,0.07);
    display: flex;
    flex-direction: column;
    padding: 24px 0;
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    z-index: 100;
  }
  .sb-brand {
    padding: 0 20px 20px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    margin-bottom: 16px;
  }
  .sb-brand-name {
    font-size: 16px;
    font-weight: 600;
    color: #e8e8f0;
  }
  .sb-brand-sub {
    font-size: 11px;
    color: rgba(232,232,240,0.35);
    margin-top: 2px;
  }
  .sb-nav {
    flex: 1;
    padding: 0 10px;
  }
  .sb-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    border-radius: 8px;
    font-size: 13px;
    color: rgba(232,232,240,0.45);
    cursor: pointer;
    transition: all 0.2s;
    background: none;
    border: none;
    width: 100%;
    text-align: left;
    margin-bottom: 2px;
    font-family: 'DM Sans', sans-serif;
  }
  .sb-item:hover {
    background: rgba(255,255,255,0.05);
    color: rgba(232,232,240,0.8);
  }
  .sb-item.active {
    background: rgba(99,102,241,0.15);
    color: #818cf8;
    font-weight: 500;
  }
  .sb-item .ico {
    width: 18px;
    text-align: center;
    font-size: 14px;
  }
  .sb-bottom {
    padding: 14px 10px;
    border-top: 1px solid rgba(255,255,255,0.06);
  }
  .sb-upgrade-btn {
    width: 100%;
    padding: 11px 14px;
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    border: none;
    border-radius: 8px;
    color: white;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    margin-bottom: 6px;
    font-family: 'DM Sans', sans-serif;
    transition: opacity 0.2s;
    text-align: left;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .sb-upgrade-btn:hover {
    opacity: 0.85;
  }
`

export default function Sidebar() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const logout = useAuthStore((s) => s.logout)
  const openUpgrade = useUIStore((s) => s.openUpgradeModal)
  const openHelp = useUIStore((s) => s.openHelpModal)

  const hideSidebar = ['/', '/login', '/register', '/interview'].includes(pathname)
  if (hideSidebar) return null

  return (
    <aside className="sb-container">
      <style>{styles}</style>
      <div className="sb-brand">
        <div className="sb-brand-name">Placifai AI</div>
        <div className="sb-brand-sub">AI Career Coach</div>
      </div>
      
      <nav className="sb-nav">
        {NAV.map((n) => (
          <button 
            key={n.id} 
            className={`sb-item ${pathname === n.path ? 'active' : ''}`}
            onClick={() => navigate(n.path)}
          >
            <span className="ico">{n.ico}</span>
            {n.label}
          </button>
        ))}
      </nav>

      <div className="sb-bottom">
        <button className="sb-upgrade-btn" onClick={openUpgrade}>
          <span>✦</span> Upgrade to Pro
        </button>
        <button className="sb-item" onClick={openHelp}>
          <span className="ico">?</span> Help Center
        </button>
        <button className="sb-item" onClick={() => { logout(); navigate('/login') }}>
          <span className="ico">→</span> Logout
        </button>
      </div>
    </aside>
  )
}
