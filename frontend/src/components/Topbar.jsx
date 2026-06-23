import React from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import useUIStore from '../store/uiStore'

const styles = `
  .tb-container {
    position: fixed;
    top: 0;
    left: 200px;
    right: 0;
    height: 60px;
    background: rgba(15, 17, 23, 0.97);
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    backdrop-filter: blur(20px);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 32px;
    z-index: 90;
  }
  .tb-left {
    display: flex;
    align-items: center;
    gap: 20px;
    flex: 1;
  }
  .tb-search-box {
    display: flex;
    align-items: center;
    gap: 8px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 8px;
    padding: 8px 14px;
    width: 280px;
  }
  .tb-search-box input {
    background: none;
    border: none;
    outline: none;
    color: rgba(232, 232, 240, 0.6);
    font-size: 13px;
    width: 100%;
    font-family: 'DM Sans', sans-serif;
  }
  .tb-search-box input::placeholder {
    color: rgba(232, 232, 240, 0.25);
  }
  .tb-right {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .tb-btn {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.08);
    color: rgba(232, 232, 240, 0.5);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    transition: all 0.2s;
  }
  .tb-btn:hover {
    background: rgba(255, 255, 255, 0.08);
    color: #818cf8;
    border-color: rgba(99, 102, 241, 0.3);
  }
  .tb-profile {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 600;
    color: white;
    cursor: pointer;
    border: 2px solid rgba(99, 102, 241, 0.4);
    transition: transform 0.2s;
  }
  .tb-profile:hover {
    transform: scale(1.05);
  }
`

export default function Topbar({ placeholder = "Search resources...", showSearch = true, children }) {
  const user = useAuthStore((s) => s.user)
  const firstName = user?.firstName || 'U'

  const handleNotifications = () => {
    alert('Notifications: No new alerts.')
  }

  const handleSettings = () => {
    alert('Settings: Feature coming soon!')
  }

  return (
    <header className="tb-container">
      <style>{styles}</style>
      
      <div className="tb-left">
        {showSearch && (
          <div className="tb-search-box">
            <span style={{ color: 'rgba(232, 232, 240, 0.3)', fontSize: '13px' }}>🔍</span>
            <input placeholder={placeholder} />
          </div>
        )}
        {children}
      </div>

      <div className="tb-right">
        <button className="tb-btn" onClick={handleNotifications} title="Notifications">
          🔔
        </button>
        <button className="tb-btn" onClick={handleSettings} title="Settings">
          ⚙
        </button>
        <div className="tb-profile" title="Profile">
          {firstName[0].toUpperCase()}
        </div>
      </div>
    </header>
  )
}
