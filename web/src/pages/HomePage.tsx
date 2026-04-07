/**
 * Home page — celebratory landing for the starter template
 */

import { Link } from 'react-router-dom';
import { useAuthStore } from '@/core/store/auth-store';
import { useEffect, useState, type CSSProperties } from 'react';

const BOOT_LINES = [
  { text: '$ initializing template...', delay: 0 },
  { text: '  [ok] Firebase Cloud Functions (Python 3.11)', delay: 400 },
  { text: '  [ok] React 18 + TypeScript + Vite', delay: 700 },
  { text: '  [ok] Clean Architecture layers wired', delay: 1000 },
  { text: '  [ok] Firestore connected', delay: 1250 },
  { text: '  [ok] Firebase Auth ready', delay: 1450 },
  { text: '  [ok] Claude Code tooling loaded', delay: 1650 },
  { text: '', delay: 1850 },
  { text: '  All systems go. Ready to build.', delay: 2000 },
];

const TECH_STACK = [
  {
    label: 'Backend',
    title: 'Firebase Cloud Functions',
    desc: 'Python 3.11 serverless functions with Clean Architecture',
    icon: 'fn',
    color: '#FFCA28',
  },
  {
    label: 'Frontend',
    title: 'React + TypeScript + Vite',
    desc: 'Fast dev server, strict types, hot module replacement',
    icon: 'ts',
    color: '#61DAFB',
  },
  {
    label: 'Database',
    title: 'Cloud Firestore',
    desc: 'NoSQL document database with real-time sync',
    icon: 'db',
    color: '#FF7043',
  },
  {
    label: 'Auth',
    title: 'Firebase Authentication',
    desc: 'Email/password, OAuth, JWT token management',
    icon: 'id',
    color: '#AB47BC',
  },
  {
    label: 'Architecture',
    title: 'Clean Architecture',
    desc: 'Domain \u2192 Application \u2192 Infrastructure \u2192 Presentation',
    icon: 'ca',
    color: '#26A69A',
  },
  {
    label: 'AI Tooling',
    title: 'Claude Code',
    desc: 'Skills, commands, and agents in .claude/ directory',
    icon: 'ai',
    color: '#EF5350',
  },
];

export const HomePage = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [visibleLines, setVisibleLines] = useState(0);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    BOOT_LINES.forEach((line, i) => {
      timers.push(setTimeout(() => setVisibleLines(i + 1), line.delay));
    });
    timers.push(setTimeout(() => setShowContent(true), 2400));
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div style={styles.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;800&family=DM+Sans:wght@400;500;600;700;800&display=swap');
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .stack-card:hover { border-color: #30363D !important; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.3); }
        .primary-btn:hover { filter: brightness(1.15); transform: translateY(-1px); }
        .secondary-btn:hover { border-color: #8B949E !important; color: #fff !important; }
      `}</style>

      {/* Grain overlay */}
      <div style={styles.grain} />

      {/* Ambient glows */}
      <div style={styles.glowTopRight} />
      <div style={styles.glowBottomLeft} />

      {/* Terminal boot sequence */}
      <div style={styles.terminal}>
        <div style={styles.terminalDots}>
          <span style={{ ...styles.dot, background: '#FF5F56' }} />
          <span style={{ ...styles.dot, background: '#FFBD2E' }} />
          <span style={{ ...styles.dot, background: '#27C93F' }} />
        </div>
        <div style={styles.terminalBody}>
          {BOOT_LINES.slice(0, visibleLines).map((line, i) => (
            <div
              key={i}
              style={{
                ...styles.terminalLine,
                color: line.text.includes('[ok]')
                  ? '#27C93F'
                  : line.text.startsWith('$')
                    ? '#FFBD2E'
                    : line.text.includes('Ready')
                      ? '#fff'
                      : '#8B949E',
                fontWeight: line.text.includes('Ready') ? 700 : 400,
              }}
            >
              {line.text}
              {i === visibleLines - 1 && !showContent && (
                <span style={styles.cursor}>_</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Hero */}
      <div
        style={{
          ...styles.hero,
          opacity: showContent ? 1 : 0,
          transform: showContent ? 'translateY(0)' : 'translateY(24px)',
        }}
      >
        <div style={styles.badge}>STARTER TEMPLATE</div>
        <h1 style={styles.heading}>
          You're up and running<span style={styles.accent}>.</span>
        </h1>
        <p style={styles.subtitle}>
          A production-ready serverless stack &mdash; opinionated so you don't
          have to be.
          <br />
          Start building features, not boilerplate.
        </p>

        <div style={styles.actions}>
          {!isAuthenticated && (
            <>
              <Link to="/login" style={styles.primaryBtn} className="primary-btn">
                Get Started
              </Link>
              <Link to="/register" style={styles.secondaryBtn} className="secondary-btn">
                Create Account
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Tech stack grid */}
      <div
        style={{
          ...styles.stackSection,
          opacity: showContent ? 1 : 0,
          transform: showContent ? 'translateY(0)' : 'translateY(32px)',
        }}
      >
        <h2 style={styles.stackHeading}>What&apos;s in the box</h2>
        <div style={styles.stackGrid}>
          {TECH_STACK.map((tech) => (
            <div key={tech.title} className="stack-card" style={styles.card}>
              <div
                style={{
                  ...styles.cardIcon,
                  background: `${tech.color}18`,
                  color: tech.color,
                  borderColor: `${tech.color}30`,
                }}
              >
                {tech.icon}
              </div>
              <div style={styles.cardLabel}>{tech.label}</div>
              <div style={styles.cardTitle}>{tech.title}</div>
              <div style={styles.cardDesc}>{tech.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Architecture flow */}
      <div style={{ ...styles.archSection, opacity: showContent ? 1 : 0 }}>
        <div style={styles.archFlow}>
          {['Cloud Functions', 'Handlers', 'Use Cases', 'Domain', 'Firestore'].map(
            (layer, i, arr) => (
              <span key={layer} style={styles.archItem}>
                <span style={styles.archLabel}>{layer}</span>
                {i < arr.length - 1 && (
                  <span style={styles.archArrow}>&rarr;</span>
                )}
              </span>
            )
          )}
        </div>
      </div>

      {/* Footer */}
      <div style={{ ...styles.footer, opacity: showContent ? 1 : 0 }}>
        <span style={styles.footerText}>
          Built by stevenmunoz &middot; For the builders shipping nights &amp; weekends
        </span>
      </div>
    </div>
  );
};

const mono = '"JetBrains Mono", "Fira Code", "SF Mono", Menlo, monospace';
const sans = '"DM Sans", -apple-system, BlinkMacSystemFont, sans-serif';

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: '100vh',
    background: '#0A0A0F',
    color: '#E6EDF3',
    position: 'relative',
    overflow: 'hidden',
    fontFamily: sans,
  },
  grain: {
    position: 'fixed',
    inset: 0,
    opacity: 0.03,
    backgroundImage:
      'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
    backgroundRepeat: 'repeat',
    pointerEvents: 'none',
    zIndex: 0,
  },
  glowTopRight: {
    position: 'fixed',
    top: '-20%',
    right: '-10%',
    width: '600px',
    height: '600px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(39,201,63,0.06) 0%, transparent 70%)',
    pointerEvents: 'none',
    zIndex: 0,
  },
  glowBottomLeft: {
    position: 'fixed',
    bottom: '-20%',
    left: '-10%',
    width: '500px',
    height: '500px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(97,218,251,0.05) 0%, transparent 70%)',
    pointerEvents: 'none',
    zIndex: 0,
  },

  terminal: {
    position: 'relative',
    zIndex: 1,
    maxWidth: '620px',
    margin: '0 auto',
    marginTop: '64px',
    background: '#161B22',
    borderRadius: '12px',
    border: '1px solid #30363D',
    overflow: 'hidden',
    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
  },
  terminalDots: {
    display: 'flex',
    gap: '8px',
    padding: '12px 16px',
    borderBottom: '1px solid #21262D',
  },
  dot: {
    display: 'inline-block',
    width: '12px',
    height: '12px',
    borderRadius: '50%',
  },
  terminalBody: {
    padding: '16px 20px',
    fontFamily: mono,
    fontSize: '13px',
    lineHeight: '1.7',
    minHeight: '200px',
  },
  terminalLine: {
    whiteSpace: 'pre',
  },
  cursor: {
    display: 'inline-block',
    animation: 'blink 1s step-end infinite',
    color: '#27C93F',
    marginLeft: '2px',
  },

  hero: {
    position: 'relative',
    zIndex: 1,
    textAlign: 'center',
    maxWidth: '720px',
    margin: '0 auto',
    padding: '56px 24px 0',
    transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
  },
  badge: {
    display: 'inline-block',
    padding: '4px 14px',
    borderRadius: '100px',
    border: '1px solid rgba(39,201,63,0.25)',
    background: 'rgba(39,201,63,0.06)',
    color: '#27C93F',
    fontSize: '11px',
    fontWeight: 700,
    letterSpacing: '1.5px',
    marginBottom: '20px',
    fontFamily: mono,
  },
  heading: {
    fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
    fontWeight: 800,
    letterSpacing: '-0.03em',
    lineHeight: 1.1,
    marginBottom: '16px',
    background: 'linear-gradient(135deg, #E6EDF3 30%, #8B949E 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  accent: {
    WebkitTextFillColor: '#27C93F',
  },
  subtitle: {
    fontSize: '1.05rem',
    lineHeight: 1.6,
    color: '#8B949E',
    maxWidth: '520px',
    margin: '0 auto',
  },
  actions: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'center',
    marginTop: '32px',
    flexWrap: 'wrap',
  },
  primaryBtn: {
    display: 'inline-block',
    padding: '12px 28px',
    background: '#27C93F',
    color: '#0A0A0F',
    textDecoration: 'none',
    borderRadius: '8px',
    fontWeight: 700,
    fontSize: '15px',
    transition: 'all 0.2s',
    border: 'none',
  },
  secondaryBtn: {
    display: 'inline-block',
    padding: '12px 28px',
    background: 'transparent',
    color: '#E6EDF3',
    textDecoration: 'none',
    borderRadius: '8px',
    fontWeight: 600,
    fontSize: '15px',
    border: '1px solid #30363D',
    transition: 'all 0.2s',
  },

  stackSection: {
    position: 'relative',
    zIndex: 1,
    maxWidth: '960px',
    margin: '0 auto',
    padding: '72px 24px 0',
    transition: 'all 1s cubic-bezier(0.16, 1, 0.3, 1) 0.3s',
  },
  stackHeading: {
    fontWeight: 600,
    color: '#6E7681',
    textAlign: 'center',
    marginBottom: '32px',
    textTransform: 'uppercase' as const,
    fontFamily: mono,
    fontSize: '12px',
    letterSpacing: '2px',
  },
  stackGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '16px',
  },
  card: {
    background: '#161B22',
    border: '1px solid #21262D',
    borderRadius: '12px',
    padding: '24px',
    transition: 'all 0.3s ease',
    cursor: 'default',
  },
  cardIcon: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    border: '1px solid',
    fontSize: '13px',
    fontWeight: 800,
    fontFamily: mono,
    textTransform: 'uppercase' as const,
    marginBottom: '14px',
  },
  cardLabel: {
    fontSize: '11px',
    fontWeight: 600,
    color: '#6E7681',
    textTransform: 'uppercase' as const,
    letterSpacing: '1px',
    marginBottom: '4px',
    fontFamily: mono,
  },
  cardTitle: {
    fontSize: '16px',
    fontWeight: 700,
    color: '#E6EDF3',
    marginBottom: '6px',
  },
  cardDesc: {
    fontSize: '13px',
    lineHeight: 1.5,
    color: '#6E7681',
  },

  archSection: {
    position: 'relative',
    zIndex: 1,
    maxWidth: '960px',
    margin: '0 auto',
    padding: '56px 24px',
    transition: 'all 1s ease 0.5s',
  },
  archFlow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    flexWrap: 'wrap',
    padding: '20px 24px',
    background: '#161B22',
    borderRadius: '12px',
    border: '1px solid #21262D',
  },
  archItem: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
  },
  archLabel: {
    display: 'inline-block',
    padding: '6px 14px',
    borderRadius: '6px',
    background: '#21262D',
    color: '#8B949E',
    fontSize: '12px',
    fontWeight: 600,
    fontFamily: mono,
    whiteSpace: 'nowrap',
  },
  archArrow: {
    color: '#30363D',
    fontSize: '16px',
  },

  footer: {
    position: 'relative',
    zIndex: 1,
    textAlign: 'center',
    padding: '0 24px 48px',
    transition: 'all 1s ease 0.6s',
  },
  footerText: {
    fontSize: '13px',
    color: '#30363D',
    fontFamily: mono,
  },
};
