import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import Topbar from '../components/Topbar'
import { dojoAPI } from '../services/api'

const styles = `
  .dojo-container {
    min-height: 100vh;
    background: #050608;
    color: #e8e8f0;
    margin-left: 200px;
    padding: 84px 40px 40px;
  }

  .daily-banner {
    background: linear-gradient(135deg, rgba(6, 182, 212, 0.15), rgba(139, 92, 246, 0.15));
    border: 1px solid rgba(6, 182, 212, 0.3);
    border-radius: 24px;
    padding: 32px;
    margin-bottom: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    overflow: hidden;
  }

  .daily-banner::after {
    content: 'DAILY';
    position: absolute;
    right: -20px;
    top: -10px;
    font-size: 100px;
    font-weight: 900;
    color: rgba(255,255,255,0.03);
    pointer-events: none;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    margin-bottom: 40px;
  }

  .stat-card {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 16px;
    padding: 20px;
    text-align: center;
  }

  .stat-val { font-size: 24px; font-weight: 800; color: #06b6d4; }
  .stat-lbl { font-size: 12px; color: rgba(232,232,240,0.4); text-transform: uppercase; margin-top: 4px; }

  .problem-table {
    width: 100%;
    border-collapse: collapse;
    background: rgba(22, 24, 33, 0.6);
    border-radius: 16px;
    overflow: hidden;
  }

  .problem-table th {
    text-align: left;
    padding: 16px 24px;
    font-size: 12px;
    color: rgba(232,232,240,0.3);
    text-transform: uppercase;
    border-bottom: 1px solid rgba(255,255,255,0.05);
  }

  .problem-table td {
    padding: 16px 24px;
    border-bottom: 1px solid rgba(255,255,255,0.03);
    font-size: 14px;
  }

  .problem-row:hover {
    background: rgba(255,255,255,0.02);
    cursor: pointer;
  }

  .diff-badge {
    padding: 4px 10px;
    border-radius: 12px;
    font-size: 11px;
    font-weight: 700;
  }

  .Easy { color: #10b981; }
  .Medium { color: #f59e0b; }
  .Hard { color: #ef4444; }

  .category-pill {
    padding: 4px 12px;
    background: rgba(255,255,255,0.05);
    border-radius: 20px;
    font-size: 12px;
    margin-right: 8px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .category-pill.active {
    background: #06b6d4;
    color: #050608;
  }
`

export default function CodingDojo() {
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('All')

  const fetchDojoData = async () => {
    try {
      setLoading(true)
      const res = await dojoAPI.getSummary()
      setData(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDojoData()
  }, [])

  if (loading) return <div className="dojo-container">Loading Dojo...</div>

  const { dailyChallenge, challenges, stats, leaderboard } = data
  const categories = ['All', ...new Set(challenges.map(c => c.category))]
  
  const filteredChallenges = filter === 'All' 
    ? challenges 
    : challenges.filter(c => c.category === filter)

  return (
    <div className="dojo-container">
      <style>{styles}</style>
      <Topbar placeholder="Search problems..." />

      {dailyChallenge ? (
        <div className="daily-banner">
          <div>
            <div style={{ color: '#06b6d4', fontSize: '12px', fontWeight: '800', marginBottom: '8px' }}>PROBLEM OF THE DAY</div>
            <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '12px' }}>{dailyChallenge.title}</h1>
            <p style={{ color: 'rgba(232,232,240,0.5)', maxWidth: '600px', marginBottom: '24px', fontSize: '14px', lineHeight: '1.5' }}>
              {dailyChallenge.description.length > 200 
                ? dailyChallenge.description.replace(/[#*`]/g, '').slice(0, 200) + '...' 
                : dailyChallenge.description.replace(/[#*`]/g, '')}
            </p>
            <button 
              className="solve-btn" 
              style={{ width: 'auto', padding: '12px 32px' }}
              onClick={() => navigate(`/dojo/${dailyChallenge.id}`)}
            >
              SOLVE CHALLENGE
            </button>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '48px' }}>🔥</div>
            <div style={{ fontSize: '14px', fontWeight: '700' }}>{stats.streak} Day Streak</div>
          </div>
        </div>
      ) : (
        <div className="daily-banner" style={{ justifyContent: 'center', opacity: 0.5 }}>
           <p>No daily challenge available. Check back later!</p>
        </div>
      )}

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-val">{stats.solvedCount}/{stats.totalCount}</div>
          <div className="stat-lbl">Problems Solved</div>
        </div>
        <div className="stat-card">
          <div className="stat-val">{stats.xp.toLocaleString()}</div>
          <div className="stat-lbl">Total XP</div>
        </div>
        <div className="stat-card">
          <div className="stat-val">{stats.level}</div>
          <div className="stat-lbl">Current Level</div>
        </div>
        <div className="stat-card">
          <div className="stat-val">{stats.rank}</div>
          <div className="stat-lbl">Dojo Rank</div>
        </div>
      </div>

      <div style={{ marginBottom: '24px', display: 'flex', gap: '8px' }}>
        {categories.map(cat => (
          <span 
            key={cat} 
            className={`category-pill ${filter === cat ? 'active' : ''}`}
            onClick={() => setFilter(cat)}
          >
            {cat}
          </span>
        ))}
      </div>

      <table className="problem-table">
        <thead>
          <tr>
            <th>Status</th>
            <th>Title</th>
            <th>Difficulty</th>
            <th>Category</th>
            <th>XP</th>
          </tr>
        </thead>
        <tbody>
          {filteredChallenges.map(c => {
            const isSolved = stats.solvedChallengeIds?.includes(c.id);
            return (
              <tr key={c.id} className="problem-row" onClick={() => navigate(`/dojo/${c.id}`)}>
                <td style={{ color: isSolved ? '#10b981' : 'rgba(255,255,255,0.1)', textAlign: 'center' }}>
                  {isSolved ? '✓' : '○'}
                </td>
                <td style={{ fontWeight: '600' }}>{c.title}</td>
                <td><span className={`diff-badge ${c.difficulty}`}>{c.difficulty}</span></td>
                <td><span style={{ color: 'rgba(232,232,240,0.4)' }}>{c.category}</span></td>
                <td style={{ color: '#10b981', fontWeight: '700' }}>+{c.rewardXP}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  )
}
