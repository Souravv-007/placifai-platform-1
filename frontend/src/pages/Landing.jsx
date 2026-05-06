import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import useUIStore from '../store/uiStore'

export default function Landing() {
  const navigate = useNavigate()
  const heroRef = useRef(null)
  const openUpgrade = useUIStore((s) => s.openUpgradeModal)
  const openHelp = useUIStore((s) => s.openHelpModal)

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!heroRef.current) return
      const { clientX, clientY } = e
      const { innerWidth, innerHeight } = window
      const x = (clientX / innerWidth - 0.5) * 20
      const y = (clientY / innerHeight - 0.5) * 20
      heroRef.current.style.setProperty('--mx', `${x}px`)
      heroRef.current.style.setProperty('--my', `${y}px`)
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div style={{
      minHeight: '100vh',
      background: '#080810',
      color: '#f0f0ff',
      fontFamily: "'Georgia', 'Times New Roman', serif",
      overflowX: 'hidden',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Mono:wght@300;400&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .landing-root {
          font-family: 'Cormorant Garamond', Georgia, serif;
          background: #080810;
          color: #f0f0ff;
          min-height: 100vh;
        }

        .noise {
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 0;
          opacity: 0.4;
        }

        .nav {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 48px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          background: rgba(8,8,16,0.8);
          backdrop-filter: blur(20px);
        }

        .nav-logo {
          font-family: 'Cormorant Garamond', serif;
          font-size: 22px;
          font-weight: 300;
          letter-spacing: 0.15em;
          color: #f0f0ff;
          text-transform: uppercase;
        }

        .nav-logo span {
          color: #7b6ef6;
        }

        .nav-links {
          display: flex;
          gap: 36px;
          align-items: center;
        }

        .nav-link {
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.1em;
          color: rgba(240,240,255,0.5);
          text-decoration: none;
          text-transform: uppercase;
          transition: color 0.3s;
          cursor: pointer;
          background: none;
          border: none;
        }

        .nav-link:hover { color: #f0f0ff; }

        .nav-cta {
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 10px 24px;
          border: 1px solid rgba(123,110,246,0.5);
          color: #7b6ef6;
          background: transparent;
          cursor: pointer;
          transition: all 0.3s;
        }

        .nav-cta:hover {
          background: #7b6ef6;
          color: #080810;
        }

        .hero {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          padding: 120px 48px 80px;
          --mx: 0px;
          --my: 0px;
        }

        .hero-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
        }

        .hero-orb-1 {
          width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(123,110,246,0.15) 0%, transparent 70%);
          top: -100px; right: -100px;
          transform: translate(calc(var(--mx) * 0.5), calc(var(--my) * 0.5));
          transition: transform 0.8s ease;
        }

        .hero-orb-2 {
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(99,180,246,0.1) 0%, transparent 70%);
          bottom: 100px; left: 200px;
          transform: translate(calc(var(--mx) * -0.3), calc(var(--my) * -0.3));
          transition: transform 0.8s ease;
        }

        .hero-content {
          position: relative;
          z-index: 1;
          max-width: 700px;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 14px;
          border: 1px solid rgba(123,110,246,0.3);
          background: rgba(123,110,246,0.08);
          border-radius: 2px;
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #7b6ef6;
          margin-bottom: 40px;
          animation: fadeUp 0.8s ease both;
        }

        .badge-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #7b6ef6;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        .hero-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(52px, 7vw, 96px);
          font-weight: 300;
          line-height: 1.0;
          letter-spacing: -0.02em;
          margin-bottom: 32px;
          animation: fadeUp 0.8s 0.1s ease both;
        }

        .hero-title em {
          font-style: italic;
          color: #7b6ef6;
        }

        .hero-subtitle {
          font-size: 18px;
          font-weight: 300;
          line-height: 1.7;
          color: rgba(240,240,255,0.55);
          max-width: 480px;
          margin-bottom: 48px;
          animation: fadeUp 0.8s 0.2s ease both;
        }

        .hero-actions {
          display: flex;
          gap: 16px;
          align-items: center;
          animation: fadeUp 0.8s 0.3s ease both;
        }

        .btn-primary {
          font-family: 'DM Mono', monospace;
          font-size: 12px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 16px 36px;
          background: #7b6ef6;
          color: #080810;
          border: none;
          cursor: pointer;
          transition: all 0.3s;
          font-weight: 400;
        }

        .btn-primary:hover {
          background: #9b8ef6;
          transform: translateY(-2px);
        }

        .btn-secondary {
          font-family: 'DM Mono', monospace;
          font-size: 12px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 16px 36px;
          background: transparent;
          color: rgba(240,240,255,0.6);
          border: 1px solid rgba(240,240,255,0.15);
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-secondary:hover {
          border-color: rgba(240,240,255,0.4);
          color: #f0f0ff;
        }

        .hero-right {
          position: absolute;
          right: 48px;
          top: 50%;
          transform: translateY(-50%);
          width: 420px;
          animation: fadeUp 0.8s 0.4s ease both;
        }

        .auth-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          padding: 40px;
          backdrop-filter: blur(20px);
        }

        .auth-card h3 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 28px;
          font-weight: 300;
          margin-bottom: 6px;
        }

        .auth-card p {
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          color: rgba(240,240,255,0.4);
          letter-spacing: 0.05em;
          margin-bottom: 32px;
        }

        .auth-input {
          width: 100%;
          padding: 14px 16px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          color: #f0f0ff;
          font-family: 'DM Mono', monospace;
          font-size: 13px;
          margin-bottom: 12px;
          outline: none;
          transition: border-color 0.3s;
        }

        .auth-input::placeholder { color: rgba(240,240,255,0.25); }
        .auth-input:focus { border-color: rgba(123,110,246,0.5); }

        .auth-btn {
          width: 100%;
          padding: 16px;
          background: #7b6ef6;
          color: #080810;
          border: none;
          font-family: 'DM Mono', monospace;
          font-size: 12px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
          margin-top: 4px;
          transition: all 0.3s;
        }

        .auth-btn:hover { background: #9b8ef6; }

        .auth-divider {
          text-align: center;
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          color: rgba(240,240,255,0.25);
          letter-spacing: 0.1em;
          margin: 20px 0;
        }

        .auth-google {
          width: 100%;
          padding: 14px;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.1);
          color: rgba(240,240,255,0.7);
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.05em;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .auth-google:hover { border-color: rgba(255,255,255,0.25); }

        .stats-bar {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          border-top: 1px solid rgba(255,255,255,0.06);
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }

        .stat-item {
          padding: 48px;
          border-right: 1px solid rgba(255,255,255,0.06);
          text-align: center;
        }

        .stat-item:last-child { border-right: none; }

        .stat-number {
          font-family: 'Cormorant Garamond', serif;
          font-size: 52px;
          font-weight: 300;
          color: #f0f0ff;
          line-height: 1;
          margin-bottom: 8px;
        }

        .stat-number span { color: #7b6ef6; }

        .stat-label {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(240,240,255,0.35);
        }

        .features {
          padding: 120px 48px;
          position: relative;
        }

        .section-label {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #7b6ef6;
          margin-bottom: 20px;
        }

        .section-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(36px, 4vw, 56px);
          font-weight: 300;
          line-height: 1.1;
          margin-bottom: 80px;
          max-width: 500px;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.06);
        }

        .feature-card {
          padding: 48px;
          background: #080810;
          transition: background 0.3s;
          cursor: pointer;
        }

        .feature-card:hover {
          background: rgba(123,110,246,0.05);
        }

        .feature-icon {
          font-size: 28px;
          margin-bottom: 20px;
        }

        .feature-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 26px;
          font-weight: 400;
          margin-bottom: 12px;
        }

        .feature-desc {
          font-family: 'DM Mono', monospace;
          font-size: 12px;
          line-height: 1.8;
          color: rgba(240,240,255,0.4);
          letter-spacing: 0.02em;
        }

        .feature-tag {
          display: inline-block;
          margin-top: 20px;
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #7b6ef6;
          border-bottom: 1px solid rgba(123,110,246,0.3);
          padding-bottom: 2px;
        }

        .cta-section {
          padding: 120px 48px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .cta-bg {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at center, rgba(123,110,246,0.1) 0%, transparent 70%);
        }

        .cta-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(48px, 6vw, 80px);
          font-weight: 300;
          line-height: 1.1;
          margin-bottom: 24px;
          position: relative;
        }

        .cta-sub {
          font-family: 'DM Mono', monospace;
          font-size: 12px;
          color: rgba(240,240,255,0.4);
          letter-spacing: 0.05em;
          margin-bottom: 48px;
          position: relative;
        }

        .footer {
          padding: 40px 48px;
          border-top: 1px solid rgba(255,255,255,0.06);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .footer-text {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          color: rgba(240,240,255,0.25);
          letter-spacing: 0.1em;
        }

        .footer-links {
          display: flex;
          gap: 24px;
        }

        .footer-link {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          color: rgba(240,240,255,0.25);
          letter-spacing: 0.1em;
          text-decoration: none;
          text-transform: uppercase;
          cursor: pointer;
          background: none;
          border: none;
          transition: color 0.3s;
        }

        .footer-link:hover { color: rgba(240,240,255,0.6); }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 1024px) {
          .hero-right { display: none; }
          .stats-bar { grid-template-columns: repeat(2, 1fr); }
          .features-grid { grid-template-columns: 1fr; }
          .nav { padding: 16px 24px; }
          .hero { padding: 120px 24px 80px; }
          .features { padding: 80px 24px; }
          .cta-section { padding: 80px 24px; }
          .footer { padding: 32px 24px; flex-direction: column; gap: 16px; }
        }
      `}</style>

      <div className="landing-root">
        <div className="noise" />

        {/* NAV */}
        <nav className="nav">
          <div className="nav-logo">Placif<span>AI</span></div>
          <div className="nav-links">
            <button className="nav-link">Product</button>
            <button className="nav-link">Success Stories</button>
            <button className="nav-link" onClick={openUpgrade}>Pricing</button>
            <button className="nav-cta" onClick={() => navigate('/login')}>Sign In</button>
          </div>
        </nav>

        {/* HERO */}
        <section className="hero" ref={heroRef}>
          <div className="hero-orb hero-orb-1" />
          <div className="hero-orb hero-orb-2" />

          <div className="hero-content">
            <div className="hero-badge">
              <div className="badge-dot" />
              Claude-Powered Career Coaching
            </div>
            <h1 className="hero-title">
              Your AI Career<br /><em>DNA, Decoded.</em>
            </h1>
            <p className="hero-subtitle">
              Engineered for high-performers. PlacifAI leverages advanced LLMs
              to map your trajectory to FAANG-level opportunities with surgical precision.
            </p>
            <div className="hero-actions">
              <button className="btn-primary" onClick={() => navigate('/register')}>
                Get Started Free
              </button>
              <button className="btn-secondary" onClick={() => navigate('/login')}>
                Sign In →
              </button>
            </div>
          </div>

          {/* Auth Card */}
          <div className="hero-right">
            <div className="auth-card">
              <h3>Welcome Back</h3>
              <p>Continue your journey to the top 1%.</p>

              <button className="auth-google">
                <span>G</span> Get Started with Google
              </button>

              <div className="auth-divider">— OR EMAIL —</div>

              <input className="auth-input" type="email" placeholder="name@company.com" />
              <input className="auth-input" type="password" placeholder="••••••••" />
              <button className="auth-btn" onClick={() => navigate('/register')}>
                Create Account
              </button>
            </div>
          </div>
        </section>

        {/* STATS */}
        <div className="stats-bar">
          {[
            { num: '$140k', label: 'Average Salary Increase' },
            { num: '94%', label: 'Offer Success Rate' },
            { num: '1.2s', label: 'AI Logic Response' },
            { num: '12k+', label: 'Career Paths Mapped' },
          ].map((s, i) => (
            <div className="stat-item" key={i}>
              <div className="stat-number">{s.num}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* FEATURES */}
        <section className="features">
          <div className="section-label">Precision Intelligence</div>
          <h2 className="section-title">Premium career coaching for the top 1%</h2>

          <div className="features-grid">
            {[
              {
                icon: '⚡',
                title: 'FAANG-Tier Interview Synthesis',
                desc: 'Our AI analyzes thousands of successful interview transcripts to build your custom playbooks.',
                tag: 'Explore Prep Hub →',
              },
              {
                icon: '🎭',
                title: 'Live Roleplay Sessions',
                desc: 'Voice-enabled AI sessions that simulate high-pressure board meetings and technical bar-raisers.',
                tag: 'Try a Session →',
              },
              {
                icon: '📈',
                title: 'Market Arbitrage',
                desc: 'Identify salary gaps and negotiation leverage using real-time offer data from thousands of roles.',
                tag: 'See Your Data →',
              },
              {
                icon: '🎯',
                title: 'Portfolio Transformation',
                desc: 'Not just a resume builder. We help you curate a narrative that resonates with executive leadership.',
                tag: 'Start Building →',
              },
            ].map((f, i) => (
              <div className="feature-card" key={i}>
                <div className="feature-icon">{f.icon}</div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
                <span className="feature-tag">{f.tag}</span>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="cta-section">
          <div className="cta-bg" />
          <h2 className="cta-title">Ready to decode<br /><em>your career DNA?</em></h2>
          <p className="cta-sub">Join 12,000+ professionals already on their path to the top.</p>
          <button className="btn-primary" onClick={() => navigate('/register')}>
            Start Free Today
          </button>
        </section>

        {/* FOOTER */}
        <footer className="footer">
          <div className="footer-text">© 2026 Placifai AI. Intellectual Career Guidance.</div>
          <div className="footer-links">
            <button className="footer-link">Privacy Policy</button>
            <button className="footer-link">Terms of Service</button>
            <button className="footer-link" onClick={openHelp}>Contact Support</button>
          </div>
        </footer>
      </div>
    </div>
  )
}
