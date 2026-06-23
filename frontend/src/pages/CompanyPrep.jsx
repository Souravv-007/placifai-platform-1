import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import useUIStore from '../store/uiStore'
import Topbar from '../components/Topbar'

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@300;400&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  .cp-root { display: flex; min-height: 100vh; background: #0f1117; color: #e8e8f0; font-family: 'DM Sans', sans-serif; }

  /* MAIN */
  .main { margin-left: 200px; padding: 84px 0 0; min-height: 100vh; display: flex; flex-direction: column; width: 100%; }

  /* PAGE HEADER */
  .pg-header { padding: 28px 28px 0; }
  .pg-title { font-size: 34px; font-weight: 700; margin-bottom: 10px; }
  .pg-sub { font-size: 13px; color: rgba(232,232,240,0.4); line-height: 1.7; max-width: 580px; margin-bottom: 24px; }

  /* CONTENT */
  .content { display: grid; grid-template-columns: 260px 1fr; flex: 1; }

  /* COMPANY LIST */
  .company-list { border-right: 1px solid rgba(255,255,255,0.07); padding: 0 0 28px; overflow-y: auto; }
  .company-item { padding: 16px 20px; cursor: pointer; transition: all 0.2s; border-left: 3px solid transparent; border-bottom: 1px solid rgba(255,255,255,0.04); }
  .company-item:hover { background: rgba(255,255,255,0.03); }
  .company-item.selected { background: rgba(99,102,241,0.08); border-left-color: #6366f1; }
  .ci-top { display: flex; align-items: center; gap: 12px; margin-bottom: 8px; }
  .ci-logo { width: 42px; height: 42px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 18px; font-weight: 700; flex-shrink: 0; }
  .logo-google { background: linear-gradient(135deg,#4285f4,#34a853); color: white; }
  .logo-amazon { background: linear-gradient(135deg,#ff9900,#ff6600); color: white; }
  .logo-stripe { background: linear-gradient(135deg,#635bff,#8b85ff); color: white; }
  .logo-meta { background: linear-gradient(135deg,#0668e1,#0099ff); color: white; }
  .ci-info { flex: 1; }
  .ci-name { font-size: 15px; font-weight: 600; margin-bottom: 2px; }
  .ci-focus { font-size: 11px; color: rgba(232,232,240,0.4); }
  .ci-active-badge { font-size: 9px; letter-spacing: 0.1em; text-transform: uppercase; color: #818cf8; font-family: 'DM Mono', monospace; font-weight: 600; }
  .ci-tags { display: flex; gap: 6px; flex-wrap: wrap; }
  .ci-tag { padding: 3px 8px; border-radius: 4px; font-size: 9px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; font-family: 'DM Mono', monospace; }
  .tag-tier { background: rgba(99,102,241,0.15); color: #818cf8; }
  .tag-elite { background: rgba(239,68,68,0.12); color: #f87171; border: 1px solid rgba(239,68,68,0.2); }
  .tag-high { background: rgba(245,158,11,0.12); color: #fbbf24; border: 1px solid rgba(245,158,11,0.2); }
  .tag-vhigh { background: rgba(239,68,68,0.15); color: #f87171; border: 1px solid rgba(239,68,68,0.25); }

  /* DETAIL PANEL */
  .detail { display: flex; flex-direction: column; }
  .detail-hero { position: relative; height: 200px; overflow: hidden; background: linear-gradient(135deg,#1a1c2e,#0d0f1a); display: flex; align-items: flex-end; padding: 24px; }
  .detail-hero-bg { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-size: 120px; opacity: 0.06; pointer-events: none; }
  .detail-hero-content { position: relative; z-index: 1; display: flex; align-items: flex-end; gap: 18px; }
  .detail-logo { width: 72px; height: 72px; border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 30px; font-weight: 700; border: 2px solid rgba(255,255,255,0.1); }
  .detail-name { font-size: 28px; font-weight: 700; margin-bottom: 8px; }
  .detail-diff { display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; background: rgba(99,102,241,0.15); border: 1px solid rgba(99,102,241,0.3); border-radius: 5px; font-size: 9px; letter-spacing: 0.12em; text-transform: uppercase; color: #a78bfa; font-family: 'DM Mono', monospace; margin-right: 10px; }
  .detail-stars { color: #fbbf24; font-size: 14px; letter-spacing: 2px; }

  /* DETAIL BODY */
  .detail-body { display: grid; grid-template-columns: 1fr 1fr; gap: 0; flex: 1; }
  .detail-left { padding: 24px; border-right: 1px solid rgba(255,255,255,0.06); }
  .detail-right { padding: 24px; }

  .sec-lbl { font-size: 9px; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(232,232,240,0.3); font-family: 'DM Mono', monospace; margin-bottom: 14px; display: flex; align-items: center; gap: 6px; }
  .topic-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 24px; }
  .topic-tag { padding: 7px 14px; border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; font-size: 12px; color: rgba(232,232,240,0.7); cursor: pointer; transition: all 0.2s; background: rgba(255,255,255,0.03); }
  .topic-tag:hover { border-color: rgba(99,102,241,0.4); color: #818cf8; }

  .culture-item { display: flex; align-items: flex-start; gap: 10px; margin-bottom: 12px; }
  .culture-check { width: 20px; height: 20px; border-radius: 50%; background: #6366f1; display: flex; align-items: center; justify-content: center; font-size: 10px; color: white; flex-shrink: 0; margin-top: 1px; }
  .culture-text { font-size: 13px; color: rgba(232,232,240,0.65); line-height: 1.5; }
  .culture-text strong { color: #e8e8f0; }

  .q-item { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; padding: 13px 15px; margin-bottom: 10px; cursor: pointer; transition: all 0.2s; }
  .q-item:hover { background: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.1); }
  .q-text { font-size: 13px; color: rgba(232,232,240,0.7); line-height: 1.5; margin-bottom: 8px; font-style: italic; }
  .q-meta { display: flex; gap: 10px; align-items: center; }
  .q-type { font-size: 9px; letter-spacing: 0.1em; text-transform: uppercase; padding: 2px 7px; border-radius: 3px; font-family: 'DM Mono', monospace; font-weight: 600; }
  .qt-sys { background: rgba(99,102,241,0.15); color: #818cf8; }
  .qt-code { background: rgba(74,222,128,0.12); color: #4ade80; }
  .qt-beh { background: rgba(245,158,11,0.12); color: #fbbf24; }
  .q-seen { font-size: 10px; color: rgba(232,232,240,0.25); margin-left: auto; }

  /* CTA */
  .detail-cta { border-top: 1px solid rgba(255,255,255,0.06); padding: 20px 24px; display: flex; align-items: center; justify-content: space-between; background: rgba(10,11,15,0.5); }
  .cta-left { display: flex; align-items: center; gap: 14px; }
  .cta-icon { width: 44px; height: 44px; border-radius: 10px; background: rgba(99,102,241,0.15); display: flex; align-items: center; justify-content: center; font-size: 20px; }
  .cta-title { font-size: 15px; font-weight: 700; margin-bottom: 3px; }
  .cta-sub { font-size: 11px; color: rgba(232,232,240,0.4); }
  .cta-btn { display: flex; align-items: center; gap: 10px; padding: 14px 24px; background: linear-gradient(135deg,#6366f1,#8b5cf6); border: none; border-radius: 10px; color: white; font-size: 14px; font-weight: 600; font-family: 'DM Sans', sans-serif; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
  .cta-btn:hover { opacity: 0.9; transform: translateY(-1px); }
  .cta-btn-icon { width: 28px; height: 28px; border-radius: 50%; background: rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center; font-size: 12px; }

  /* FOOTER */
  .footer { background: #0a0b0f; border-top: 1px solid rgba(255,255,255,0.06); padding: 20px 28px; display: flex; justify-content: space-between; align-items: center; margin-left: 200px; }
  .f-brand { font-size: 13px; font-weight: 600; margin-bottom: 2px; }
  .f-copy { font-size: 11px; color: rgba(232,232,240,0.25); }
  .f-links { display: flex; gap: 20px; }
  .f-link { font-size: 11px; color: rgba(232,232,240,0.3); background: none; border: none; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: color 0.2s; }
  .f-link:hover { color: rgba(232,232,240,0.6); }
`

const COMPANIES = [
  {
    id: 'google', name: 'Google', emoji: 'G', logoClass: 'logo-google',
    focus: 'Systems & Algorithms focus', active: true,
    tags: [{ label: 'Tier 1', cls: 'tag-tier' }, { label: 'Elite Difficulty', cls: 'tag-elite' }],
    diff: 'Difficulty Level: Elite', stars: '★★★★★',
    topics: ['Distributed Systems', 'Graph Algorithms', 'Dynamic Programming', 'Big O Optimization'],
    culture: [
      { title: 'Googliness', desc: 'Proactive problem solving and collaborative spirit.' },
      { title: 'Intellectual Humility', desc: 'Willingness to learn and admit when wrong.' },
      { title: 'Ambiguity', desc: 'Ability to thrive in undefined project environments.' },
    ],
    questions: [
      { text: '"Design a global load balancer for YouTube..."', type: 'System Design', typeClass: 'qt-sys', seen: 42 },
      { text: '"Given a stream of integers, find the median..."', type: 'Coding', typeClass: 'qt-code', seen: 18 },
      { text: '"Tell me about a time you had a conflict with a lead..."', type: 'Behavioral', typeClass: 'qt-beh', seen: 65 },
    ],
    cta: 'Ready for the Google simulation? Includes 3 coding rounds & 1 system design challenge.',
  },
  {
    id: 'amazon', name: 'Amazon', emoji: 'A', logoClass: 'logo-amazon',
    focus: 'Leadership Principles focus', active: false,
    tags: [{ label: 'High Difficulty', cls: 'tag-high' }],
    diff: 'Difficulty Level: High', stars: '★★★★',
    topics: ['Leadership Principles', 'System Design', 'Coding', 'Behavioral'],
    culture: [
      { title: 'Customer Obsession', desc: 'Leaders start with the customer and work backwards.' },
      { title: 'Ownership', desc: 'Leaders act on behalf of the entire company.' },
      { title: 'Invent & Simplify', desc: 'Leaders expect and require innovation from their teams.' },
    ],
    questions: [
      { text: '"Design Amazon\'s recommendation system..."', type: 'System Design', typeClass: 'qt-sys', seen: 38 },
      { text: '"Tell me about a time you failed..."', type: 'Behavioral', typeClass: 'qt-beh', seen: 72 },
      { text: '"Find the kth largest element in an array..."', type: 'Coding', typeClass: 'qt-code', seen: 25 },
    ],
    cta: 'Ready for the Amazon simulation? Includes Leadership Principle deep-dives & coding rounds.',
  },
  {
    id: 'stripe', name: 'Stripe', emoji: 'S', logoClass: 'logo-stripe',
    focus: 'Systems Design focus', active: false,
    tags: [{ label: 'Elite Difficulty', cls: 'tag-elite' }],
    diff: 'Difficulty Level: Elite', stars: '★★★★★',
    topics: ['API Design', 'Distributed Payments', 'Data Consistency', 'Security'],
    culture: [
      { title: 'User Empathy', desc: 'Deep care for developer experience and documentation.' },
      { title: 'Precision', desc: 'High attention to detail in payment-critical systems.' },
      { title: 'Global Scale', desc: 'Thinking about systems that handle billions in transactions.' },
    ],
    questions: [
      { text: '"Design a payment processing system at scale..."', type: 'System Design', typeClass: 'qt-sys', seen: 31 },
      { text: '"How would you handle distributed transactions?"', type: 'System Design', typeClass: 'qt-sys', seen: 27 },
      { text: '"Implement a rate limiter for an API..."', type: 'Coding', typeClass: 'qt-code', seen: 19 },
    ],
    cta: 'Ready for the Stripe simulation? Includes API design & distributed systems challenges.',
  },
  {
    id: 'meta', name: 'Meta', emoji: 'M', logoClass: 'logo-meta',
    focus: 'Product Logic focus', active: false,
    tags: [{ label: 'Very High Difficulty', cls: 'tag-vhigh' }],
    diff: 'Difficulty Level: Very High', stars: '★★★★',
    topics: ['Social Graphs', 'News Feed Design', 'ML Systems', 'Product Sense'],
    culture: [
      { title: 'Move Fast', desc: 'Ship quickly and iterate based on real user data.' },
      { title: 'Be Bold', desc: 'Take risks and try things even if they might fail.' },
      { title: 'Build Social Value', desc: 'Create products that connect people meaningfully.' },
    ],
    questions: [
      { text: '"Design Facebook\'s News Feed algorithm..."', type: 'System Design', typeClass: 'qt-sys', seen: 44 },
      { text: '"How would you detect fake accounts at scale?"', type: 'System Design', typeClass: 'qt-sys', seen: 33 },
      { text: '"Tell me about a product decision you disagreed with..."', type: 'Behavioral', typeClass: 'qt-beh', seen: 28 },
    ],
    cta: 'Ready for the Meta simulation? Includes product sense & social graph design challenges.',
  },
]

export default function CompanyPrep() {
  const user = useAuthStore((s) => s.user)
  const navigate = useNavigate()
  const [selected, setSelected] = useState('google')

  if (!user) { navigate('/login'); return null }

  const firstName = user?.firstName || 'U'
  const company = COMPANIES.find(c => c.id === selected)
  const openHelp = useUIStore((s) => s.openHelpModal)

  return (
    <div className="cp-root">
      <style>{styles}</style>

      <Topbar placeholder="Search top-tier companies..." />

      {/* MAIN */}
      <main className="main">
        <div className="pg-header">
          <div className="pg-title">Company Prep</div>
          <div className="pg-sub">Access curated intelligence on the world's most competitive engineering and product roles. Master the culture and technical bar of your dream employer.</div>
        </div>

        <div className="content">
          {/* Company List */}
          <div className="company-list">
            {COMPANIES.map(c => (
              <div key={c.id} className={`company-item ${selected === c.id ? 'selected' : ''}`}
                onClick={() => setSelected(c.id)}>
                <div className="ci-top">
                  <div className={`ci-logo ${c.logoClass}`}>{c.emoji}</div>
                  <div className="ci-info">
                    <div className="ci-name">{c.name}</div>
                    {selected === c.id
                      ? <div className="ci-active-badge">Active Choice</div>
                      : <div className="ci-focus">{c.focus}</div>
                    }
                  </div>
                </div>
                <div className="ci-tags">
                  {c.tags.map((t, i) => (
                    <span key={i} className={`ci-tag ${t.cls}`}>{t.label}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Detail Panel */}
          {company && (
            <div className="detail">
              <div className="detail-hero">
                <div className="detail-hero-bg">{company.emoji}</div>
                <div className="detail-hero-content">
                  <div className={`detail-logo ${company.logoClass}`}>{company.emoji}</div>
                  <div className="detail-info">
                    <div className="detail-name">{company.name}</div>
                    <span className="detail-diff">{company.diff}</span>
                    <span className="detail-stars">{company.stars}</span>
                  </div>
                </div>
              </div>

              <div className="detail-body">
                {/* LEFT */}
                <div className="detail-left">
                  <div className="sec-lbl"><span className="sec-lbl-icon">{'</>'}</span> Expected Technical Topics</div>
                  <div className="topic-tags">
                    {company.topics.map((t, i) => (
                      <span key={i} className="topic-tag">{t}</span>
                    ))}
                  </div>

                  <div className="sec-lbl"><span>👤</span> Culture Fit Focus</div>
                  {company.culture.map((c, i) => (
                    <div key={i} className="culture-item">
                      <div className="culture-check">✓</div>
                      <div className="culture-text"><strong>{c.title}:</strong> {c.desc}</div>
                    </div>
                  ))}
                </div>

                {/* RIGHT */}
                <div className="detail-right">
                  <div className="sec-lbl"><span className="sec-lbl-icon">📋</span> Past Interview Questions</div>
                  {company.questions.map((q, i) => (
                    <div key={i} className="q-item">
                      <div className="q-text">{q.text}</div>
                      <div className="q-meta">
                        <span className={`q-type ${q.typeClass}`}>{q.type}</span>
                        <span className="q-seen">Seen {q.seen} times</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="detail-cta">
                <div className="cta-left">
                  <div className="cta-icon">⚡</div>
                  <div>
                    <div className="cta-title">Ready for the {company.name} simulation?</div>
                    <div className="cta-sub">{company.cta}</div>
                  </div>
                </div>
                <button className="cta-btn" onClick={() => navigate('/interview')}>
                  <div className="cta-btn-icon">▶</div>
                  Start Mock Interview for this Company
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* FOOTER */}
      <footer className="footer">
        <div><div className="f-brand">Placifai AI</div><div className="f-copy">© 2026 Placifai AI. Intellectual Career Guidance.</div></div>
        <div className="f-links">
          <button className="f-link">Privacy Policy</button>
          <button className="f-link">Terms of Service</button>
          <button className="f-link" onClick={openHelp}>Contact Support</button>
        </div>
      </footer>
    </div>
  )
}
