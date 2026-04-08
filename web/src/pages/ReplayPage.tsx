import { useState, useEffect, useRef } from 'react';
import {
  colors,
  typography,
  spacing,
  radii,
  shadows,
  transitions,
} from '@/shared/design-tokens';

interface Screenshot {
  filename: string;
  description: string;
}

interface Step {
  number: number;
  title: string;
  when: string;
  phase: string;
  action: string;
  why: string;
  screenshots: Screenshot[];
  logs: string;
  outcome: string;
}

const PHASE_CONFIG: Record<string, { emoji: string; color: string; bg: string }> = {
  Discovery: { emoji: '🔍', color: '#7C3AED', bg: '#F5F3FF' },
  Design: { emoji: '🎨', color: '#DB2777', bg: '#FDF2F8' },
  Setup: { emoji: '🔧', color: colors.primary[500], bg: colors.primary[50] },
  Implementation: { emoji: '⚙️', color: colors.success[600], bg: colors.success[50] },
  Testing: { emoji: '🧪', color: '#D97706', bg: '#FFFBEB' },
  Review: { emoji: '👀', color: colors.accent[600], bg: '#FFF7ED' },
  Deployment: { emoji: '🚀', color: '#DC2626', bg: '#FEF2F2' },
  Documentation: { emoji: '📝', color: '#6366F1', bg: '#EEF2FF' },
  Optimization: { emoji: '⚡', color: '#0D9488', bg: '#F0FDFA' },
};

function extractField(block: string, fieldName: string, nextFields: string[]): string {
  const pattern = new RegExp(
    `\\*\\*${fieldName}:\\*\\*\\s*([\\s\\S]*?)(?=\\n\\*\\*(?:${nextFields.join('|')}):\\*\\*|$)`
  );
  const match = block.match(pattern);
  return match ? match[1].trim() : '';
}

function parseScreenshots(raw: string): Screenshot[] {
  if (!raw || raw === 'None for this step.' || raw === '—') return [];
  const items: Screenshot[] = [];
  const lines = raw.split('\n');
  for (const line of lines) {
    const match = line.match(/^-\s*`([^`]+)`\s*—\s*(.+)/);
    if (match) {
      items.push({ filename: match[1], description: match[2].trim() });
    }
  }
  return items;
}

function parseLog(md: string): { steps: Step[]; startTime: string } {
  const startMatch = md.match(/\*\*Start time:\*\*\s*(.+)/);
  const startTime = startMatch ? startMatch[1].trim() : '';
  const stepBlocks = md.split(/(?=## Step \d+)/).filter((b) => b.startsWith('## Step'));

  const steps: Step[] = [];
  for (const block of stepBlocks) {
    const headerMatch = block.match(/## Step (\d+) — (.+)/);
    if (!headerMatch) continue;

    const number = parseInt(headerMatch[1]);
    const title = headerMatch[2].trim();
    const when = extractField(block, 'When', ['Phase', 'Action', 'Why', 'Screenshots', 'Logs', 'Outcome']);
    const phase = extractField(block, 'Phase', ['Action', 'Why', 'Screenshots', 'Logs', 'Outcome']);
    const action = extractField(block, 'Action', ['Why', 'Screenshots', 'Logs', 'Outcome']);
    const why = extractField(block, 'Why', ['Screenshots', 'Logs', 'Outcome']);
    const screenshotsRaw = extractField(block, 'Screenshots', ['Logs', 'Outcome']);
    const logs = extractField(block, 'Logs', ['Outcome']);
    const outcome = extractField(block, 'Outcome', []);

    steps.push({ number, title, when, phase, action, why, screenshots: parseScreenshots(screenshotsRaw), logs, outcome });
  }
  return { steps, startTime };
}

// Render text with URLs as clickable links and `code` as inline code
function RichText({ text, style }: { text: string; style?: React.CSSProperties }) {
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  // Combined regex for URLs and backtick code
  const combinedRegex = /(https?:\/\/[^\s),]+)|`([^`]+)`/g;

  while ((match = combinedRegex.exec(text)) !== null) {
    // Add text before match
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    if (match[1]) {
      // URL
      parts.push(
        <a
          key={match.index}
          href={match[1]}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: colors.primary[500],
            textDecoration: 'none',
            borderBottom: `1px solid ${colors.primary[200]}`,
            wordBreak: 'break-all' as const,
            transition: 'color 0.15s ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = colors.primary[700]; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = colors.primary[500]; }}
        >
          {match[1].replace(/^https?:\/\//, '').replace(/\/$/, '')}
        </a>
      );
    } else if (match[2]) {
      // Backtick code
      parts.push(
        <code
          key={match.index}
          style={{
            fontFamily: typography.fontFamily.mono,
            fontSize: '0.9em',
            background: colors.neutral[100],
            padding: '1px 5px',
            borderRadius: radii.sm,
            color: colors.primary[600],
            border: `1px solid ${colors.neutral[200]}`,
          }}
        >
          {match[2]}
        </code>
      );
    }

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return <span style={style}>{parts.length > 0 ? parts : text}</span>;
}

function extractTime(when: string): string {
  const timeMatch = when.match(/(\d{1,2}:\d{2}\s*(?:AM|PM))/i);
  return timeMatch ? timeMatch[1] : when;
}

function getPhaseCounts(steps: Step[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const step of steps) {
    counts[step.phase] = (counts[step.phase] || 0) + 1;
  }
  return counts;
}

// ── Lightbox ──────────────────────────────────────────────────
function Lightbox({
  screenshots,
  initialIndex,
  onClose,
}: {
  screenshots: Screenshot[];
  initialIndex: number;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(initialIndex);
  const current = screenshots[index];
  const hasPrev = index > 0;
  const hasNext = index < screenshots.length - 1;

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && hasNext) setIndex(index + 1);
      if (e.key === 'ArrowLeft' && hasPrev) setIndex(index - 1);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [index, hasNext, hasPrev, onClose]);

  return (
    <div style={st.lightboxOverlay} onClick={onClose}>
      <div style={st.lightboxContent} onClick={(e) => e.stopPropagation()}>
        <div style={st.lightboxTopBar}>
          <button style={st.lightboxClose} onClick={onClose}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            Close
          </button>
          <div style={st.lightboxCounter}>
            {index + 1} / {screenshots.length}
          </div>
          <div style={{ width: '90px' }} />
        </div>

        <div style={st.lightboxImageArea}>
          <div style={st.lightboxNavCol}>
            {hasPrev && (
              <button style={st.lightboxNav} onClick={() => setIndex(index - 1)}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            )}
          </div>
          <div style={st.lightboxImageWrap}>
            <img
              src={`${import.meta.env.BASE_URL}data/attachments/${encodeURIComponent(current.filename)}`}
              alt={current.description}
              style={st.lightboxImage}
            />
          </div>
          <div style={st.lightboxNavCol}>
            {hasNext && (
              <button style={st.lightboxNav} onClick={() => setIndex(index + 1)}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M7.5 5L12.5 10L7.5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            )}
          </div>
        </div>

        <div style={st.lightboxCaption}>
          <div style={st.lightboxFilename}>{current.filename}</div>
          <div style={st.lightboxDesc}>{current.description}</div>
        </div>
      </div>
    </div>
  );
}

// ── Screenshot thumbnail ──────────────────────────────────────
function ScreenshotItem({ screenshot, onClick }: { screenshot: Screenshot; onClick: () => void }) {
  const [loaded, setLoaded] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        ...st.screenshotItem,
        borderColor: hovered ? colors.primary[200] : colors.neutral[150],
      }}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={st.screenshotThumbWrap}>
        <img
          src={`${import.meta.env.BASE_URL}data/attachments/${encodeURIComponent(screenshot.filename)}`}
          alt={screenshot.description}
          style={{ ...st.screenshotThumb, opacity: loaded ? 1 : 0 }}
          onLoad={() => setLoaded(true)}
        />
        {!loaded && (
          <div style={st.screenshotPlaceholder}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <rect x="2" y="3" width="16" height="14" rx="2" stroke={colors.neutral[300]} strokeWidth="1.5" />
              <circle cx="7" cy="8" r="1.5" fill={colors.neutral[300]} />
              <path d="M2 14l4-4 3 3 4-5 5 6" stroke={colors.neutral[300]} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        )}
      </div>
      <div style={st.screenshotInfo}>
        <div style={st.screenshotFilename}>{screenshot.filename}</div>
        <div style={st.screenshotDesc}>{screenshot.description}</div>
      </div>
    </div>
  );
}

// ── Cinematic Intro ───────────────────────────────────────────

/*
 * Phase-based intro: each phase fades in as a group, holds, then the whole
 * wrapper cross-fades to the next phase. The final phase fades out to reveal
 * the timeline. No blur, no jitter — just pure opacity + translateY with
 * long, buttery cubic-bezier easing.
 */

interface IntroLine {
  text: string;
  align: 'left' | 'right' | 'center';
  accent?: boolean;
  size?: 'xl' | 'lg' | 'md' | 'sm';
  sub?: boolean; // smaller muted subtext
}

interface IntroPhase {
  lines: IntroLine[];
  duration: number;
  photo?: boolean; // show Steven's photo in this phase
}

const PHASES: IntroPhase[] = [
  {
    duration: 3200,
    lines: [
      { text: 'What you are about to see', align: 'left', size: 'xl' },
      { text: 'is a conversation.', align: 'right', size: 'xl' },
    ],
  },
  {
    duration: 3200,
    lines: [
      { text: 'Between a human', align: 'left', accent: true, size: 'xl' },
      { text: 'and a machine.', align: 'right', accent: true, size: 'xl' },
    ],
  },
  {
    duration: 4800,
    lines: [
      { text: 'I turned on my microphone.', align: 'left', size: 'lg' },
      { text: 'Put a custom skill in the middle.', align: 'right', size: 'lg' },
      { text: 'And let it record everything.', align: 'left', size: 'lg' },
    ],
  },
  {
    duration: 4000,
    lines: [
      { text: 'Every decision.', align: 'right', size: 'lg' },
      { text: 'Every iteration.', align: 'left', size: 'lg' },
      { text: 'Every screenshot.', align: 'right', size: 'lg' },
    ],
  },
  {
    duration: 3000,
    lines: [
      { text: 'This is the result.', align: 'left', accent: true, size: 'xl' },
    ],
  },
];

const INTRO_FADE_MS = 800;

function CinematicIntro({ onComplete }: { onComplete: () => void }) {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [phaseState, setPhaseState] = useState<'entering' | 'visible' | 'exiting'>('entering');
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (done) return;
    const phase = PHASES[phaseIndex];
    if (!phase) { setDone(true); return; }

    const timers: ReturnType<typeof setTimeout>[] = [];

    // Enter
    timers.push(setTimeout(() => setPhaseState('visible'), INTRO_FADE_MS));

    // Start exit
    timers.push(setTimeout(() => setPhaseState('exiting'), INTRO_FADE_MS + phase.duration));

    // Move to next phase
    timers.push(setTimeout(() => {
      if (phaseIndex < PHASES.length - 1) {
        setPhaseIndex(phaseIndex + 1);
        setPhaseState('entering');
      } else {
        setDone(true);
      }
    }, INTRO_FADE_MS + phase.duration + INTRO_FADE_MS));

    return () => timers.forEach(clearTimeout);
  }, [phaseIndex, done]);

  useEffect(() => {
    if (done) {
      const t = setTimeout(onComplete, 600);
      return () => clearTimeout(t);
    }
  }, [done, onComplete]);

  const phase = PHASES[phaseIndex];
  const containerOpacity = done ? 0 : 1;
  const groupOpacity = phaseState === 'visible' ? 1 : phaseState === 'entering' ? 0 : 0;
  const groupTranslateY = phaseState === 'visible' ? '0px' : phaseState === 'entering' ? '20px' : '-10px';

  const sizeMap: Record<string, string> = {
    xl: 'clamp(2.2rem, 5vw, 3.5rem)',
    lg: 'clamp(1.6rem, 3.5vw, 2.4rem)',
    md: 'clamp(1.2rem, 2.5vw, 1.6rem)',
    sm: 'clamp(0.85rem, 1.5vw, 1rem)',
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: '#06080E',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: typography.fontFamily.display,
        overflow: 'hidden',
        opacity: containerOpacity,
        transition: 'opacity 0.6s ease',
      }}
    >
      <style>{`
        @keyframes glowDrift {
          0% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -20px) scale(1.1); }
          66% { transform: translate(-20px, 15px) scale(0.95); }
          100% { transform: translate(0, 0) scale(1); }
        }
        @keyframes subtlePulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        @keyframes horizontalLine {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
        @keyframes photoRing {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      {/* Ambient glows — slow drifting */}
      <div style={{
        position: 'absolute', top: '15%', left: '10%',
        width: '500px', height: '500px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(79, 106, 232, 0.12) 0%, transparent 70%)',
        animation: 'glowDrift 12s ease-in-out infinite, subtlePulse 6s ease-in-out infinite',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '10%', right: '15%',
        width: '400px', height: '400px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(249, 115, 22, 0.08) 0%, transparent 70%)',
        animation: 'glowDrift 15s ease-in-out infinite reverse, subtlePulse 8s ease-in-out infinite 2s',
        pointerEvents: 'none',
      }} />

      {/* Subtle center horizontal line — cinematic */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '10%',
        right: '10%',
        height: '1px',
        background: 'linear-gradient(90deg, transparent 0%, rgba(79, 106, 232, 0.15) 30%, rgba(79, 106, 232, 0.15) 70%, transparent 100%)',
        animation: 'horizontalLine 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
        transformOrigin: 'left center',
        pointerEvents: 'none',
      }} />

      {/* Phase text group */}
      {phase && (
        <div
          style={{
            maxWidth: '900px',
            width: '100%',
            padding: `0 ${spacing[10]}`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: phase.photo ? 'center' : 'stretch',
            gap: phase.photo ? '20px' : phase.lines.length === 1 ? '0' : '16px',
            position: 'relative',
            zIndex: 1,
            opacity: groupOpacity,
            transform: `translateY(${groupTranslateY})`,
            transition: `opacity ${INTRO_FADE_MS}ms cubic-bezier(0.25, 0.46, 0.45, 0.94), transform ${INTRO_FADE_MS}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`,
          }}
        >
          {/* Photo avatar */}
          {phase.photo && (
            <div style={{
              position: 'relative',
              width: '140px',
              height: '140px',
              marginBottom: spacing[2],
              opacity: groupOpacity,
              transform: phaseState === 'visible' ? 'scale(1)' : 'scale(0.7)',
              transition: `opacity ${INTRO_FADE_MS}ms cubic-bezier(0.25, 0.46, 0.45, 0.94), transform ${INTRO_FADE_MS}ms cubic-bezier(0.34, 1.56, 0.64, 1)`,
            }}>
              {/* Rotating gradient ring */}
              <div style={{
                position: 'absolute',
                inset: '-4px',
                borderRadius: '50%',
                background: `conic-gradient(from 0deg, ${colors.primary[500]}, ${colors.accent[500]}, ${colors.primary[500]})`,
                animation: 'photoRing 6s linear infinite',
              }} />
              {/* Inner mask */}
              <div style={{
                position: 'absolute',
                inset: '2px',
                borderRadius: '50%',
                backgroundColor: '#06080E',
              }} />
              {/* Photo */}
              <img
                src={`${import.meta.env.BASE_URL}images/steven-sticker.png`}
                alt="Steven"
                style={{
                  position: 'absolute',
                  inset: '4px',
                  width: 'calc(100% - 8px)',
                  height: 'calc(100% - 8px)',
                  borderRadius: '50%',
                  objectFit: 'cover',
                }}
              />
            </div>
          )}

          {phase.lines.map((line, i) => (
            <div
              key={`${phaseIndex}-${i}`}
              style={{
                textAlign: line.align,
                color: line.sub
                  ? 'rgba(255, 255, 255, 0.35)'
                  : line.accent
                    ? colors.primary[400]
                    : 'rgba(255, 255, 255, 0.9)',
                fontStyle: line.accent && !line.sub ? 'italic' : 'normal',
                fontWeight: line.sub
                  ? typography.fontWeight.regular
                  : line.accent
                    ? typography.fontWeight.bold
                    : typography.fontWeight.medium,
                fontSize: sizeMap[line.size || 'lg'],
                lineHeight: 1.3,
                letterSpacing: line.sub ? typography.letterSpacing.wide : typography.letterSpacing.tight,
                opacity: groupOpacity,
                transform: `translateY(${phaseState === 'visible' ? '0px' : '12px'})`,
                transition: `opacity ${INTRO_FADE_MS}ms cubic-bezier(0.25, 0.46, 0.45, 0.94) ${(phase.photo ? 400 : 0) + i * 200}ms, transform ${INTRO_FADE_MS}ms cubic-bezier(0.25, 0.46, 0.45, 0.94) ${(phase.photo ? 400 : 0) + i * 200}ms`,
              }}
            >
              {line.sub ? (
                <a
                  href="https://moonlightlabs.me/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: 'inherit',
                    textDecoration: 'none',
                    borderBottom: '1px solid rgba(255,255,255,0.15)',
                    paddingBottom: '2px',
                    transition: 'color 0.2s ease, border-color 0.2s ease',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = colors.primary[400]; e.currentTarget.style.borderColor = colors.primary[400]; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.35)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; }}
                >
                  {line.text}
                </a>
              ) : line.text}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Scroll-reveal hook ────────────────────────────────────────

function useScrollReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, visible };
}

// ── Scroll-reveal wrapper ─────────────────────────────────────

function RevealOnScroll({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, visible } = useScrollReveal(0.1);
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(32px)',
        transition: `opacity 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}ms, transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// ── Narrative interstitials ───────────────────────────────────
// These appear between timeline sections to keep the recruiter engaged.
// Key: the step number BEFORE which this interstitial appears.

interface Interstitial {
  beforeStep: number;
  lines: string[];
  accent?: string; // override color
  emoji?: string;
}

const INTERSTITIALS: Interstitial[] = [
  {
    beforeStep: 6,
    lines: ['Okay, the repo is cloned, the logs are rolling.', 'Now let\'s actually think.'],
    emoji: '🧠',
  },
  {
    beforeStep: 12,
    lines: ['I need to understand what Alex actually needs.', 'Not what she thinks she wants.'],
    emoji: '🔍',
  },
  {
    beforeStep: 17,
    lines: ['The prototype is taking shape.', 'But I don\'t want it to look like every other medical tool.'],
    emoji: '🎨',
  },
  {
    beforeStep: 21,
    lines: ['Five design references studied.', 'Time to synthesize them into one coherent system.'],
    emoji: '✨',
  },
  {
    beforeStep: 22,
    lines: ['Design system locked.', 'Now, the real build begins.'],
    emoji: '🚀',
  },
  {
    beforeStep: 26,
    lines: ['The form works. But "works" is a low bar.', 'Let\'s make it delightful.'],
    emoji: '💎',
  },
  {
    beforeStep: 29,
    lines: ['Every micro-interaction is intentional.', 'Because the team using this tool deserves better than Excel.'],
    emoji: '🎯',
  },
  {
    beforeStep: 35,
    lines: ['The prototype is done.', 'Now let\'s tell the story of how it was built.'],
    emoji: '📖',
  },
  {
    beforeStep: 38,
    lines: ['Almost there.', 'Let\'s package this into something presentable.'],
    emoji: '🎬',
  },
];

function NarrativeInterstitial({ interstitial }: { interstitial: Interstitial }) {
  const { ref, visible } = useScrollReveal(0.3);

  return (
    <div
      ref={ref}
      style={{
        padding: `${spacing[10]} ${spacing[6]}`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: spacing[3],
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: 'opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      }}
    >
      {interstitial.emoji && (
        <span style={{
          fontSize: '32px',
          opacity: visible ? 1 : 0,
          transform: visible ? 'scale(1)' : 'scale(0.5)',
          transition: 'opacity 0.5s ease 0.2s, transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s',
        }}>
          {interstitial.emoji}
        </span>
      )}
      {interstitial.lines.map((line, i) => (
        <div
          key={i}
          style={{
            fontFamily: typography.fontFamily.display,
            fontSize: i === 0 ? typography.fontSize['2xl'] : typography.fontSize.lg,
            fontWeight: i === 0 ? typography.fontWeight.semibold : typography.fontWeight.regular,
            color: i === 0 ? colors.neutral[800] : colors.neutral[400],
            textAlign: 'center',
            fontStyle: i > 0 ? 'italic' : 'normal',
            lineHeight: typography.lineHeight.snug,
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(12px)',
            transition: `opacity 0.6s ease ${300 + i * 200}ms, transform 0.6s ease ${300 + i * 200}ms`,
          }}
        >
          {line}
        </div>
      ))}
      {/* Decorative line */}
      <div style={{
        width: '48px',
        height: '2px',
        background: `linear-gradient(90deg, transparent, ${colors.primary[300]}, transparent)`,
        marginTop: spacing[2],
        opacity: visible ? 1 : 0,
        transform: visible ? 'scaleX(1)' : 'scaleX(0)',
        transition: 'opacity 0.5s ease 0.6s, transform 0.5s ease 0.6s',
      }} />
    </div>
  );
}

// ── Timeline Finale ───────────────────────────────────────────

function TimelineFinale({ stepCount }: { stepCount: number }) {
  const { ref, visible } = useScrollReveal(0.3);

  return (
    <div
      ref={ref}
      style={{
        padding: `${spacing[16]} ${spacing[6]} ${spacing[10]}`,
        textAlign: 'center',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(32px)',
        transition: 'opacity 1s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      }}
    >
      <div style={{
        width: '64px',
        height: '64px',
        borderRadius: '50%',
        background: `linear-gradient(135deg, ${colors.primary[500]}, ${colors.accent[500]})`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto',
        marginBottom: spacing[5],
        fontSize: '28px',
        boxShadow: `0 8px 32px ${colors.primary[500]}40`,
        opacity: visible ? 1 : 0,
        transform: visible ? 'scale(1)' : 'scale(0.3)',
        transition: 'opacity 0.6s ease 0.3s, transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s',
      }}>
        ✨
      </div>
      <h2 style={{
        fontFamily: typography.fontFamily.display,
        fontSize: typography.fontSize['3xl'],
        fontWeight: typography.fontWeight.bold,
        color: colors.neutral[900],
        marginBottom: spacing[3],
        letterSpacing: typography.letterSpacing.tight,
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.6s ease 0.5s',
      }}>
        {stepCount} steps. One evening.
      </h2>
      <p style={{
        fontFamily: typography.fontFamily.display,
        fontSize: typography.fontSize.xl,
        fontStyle: 'italic',
        color: colors.primary[500],
        marginBottom: spacing[6],
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.6s ease 0.7s',
      }}>
        Human + machine.
      </p>
      <p style={{
        fontSize: typography.fontSize.base,
        color: colors.neutral[400],
        maxWidth: '480px',
        margin: '0 auto',
        lineHeight: typography.lineHeight.relaxed,
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.6s ease 0.9s',
      }}>
        Every decision, every iteration, every pixel was captured in real time.
        This is what AI-augmented product management looks like.
      </p>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────
export function ReplayPage() {
  const [steps, setSteps] = useState<Step[]>([]);
  const [startTime, setStartTime] = useState('');
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [showIntro, setShowIntro] = useState(true);
  const [lightbox, setLightbox] = useState<{ screenshots: Screenshot[]; index: number } | null>(null);

  useEffect(() => {
    fetch(import.meta.env.BASE_URL + 'data/replay-log.md')
      .then((res) => res.text())
      .then((md) => {
        const parsed = parseLog(md);
        setSteps(parsed.steps);
        setStartTime(parsed.startTime);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (showIntro) {
    return <CinematicIntro onComplete={() => setShowIntro(false)} />;
  }

  if (loading) {
    return (
      <div style={st.page}>
        <div style={st.loading}>
          <div style={st.loadingDot} />
          Loading timeline...
        </div>
      </div>
    );
  }

  const phaseCounts = getPhaseCounts(steps);

  return (
    <div style={st.page}>
      {/* Header */}
      <header style={st.header}>
        <div style={st.headerBadge}>Exercise Replay</div>
        <h1 style={st.title}>AI PM Exercise Timeline</h1>
        <p style={st.subtitle}>
          Started {startTime} · {steps.length} steps recorded
        </p>

        {/* Phase summary chips */}
        <div style={st.phaseChips}>
          {Object.entries(phaseCounts).map(([phase, count]) => {
            const config = PHASE_CONFIG[phase] || { emoji: '📌', color: colors.neutral[500], bg: colors.neutral[50] };
            return (
              <span
                key={phase}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: `${spacing[1]} ${spacing[3]}`,
                  borderRadius: radii.full,
                  fontSize: typography.fontSize.xs,
                  fontWeight: typography.fontWeight.medium,
                  fontFamily: typography.fontFamily.body,
                  color: config.color,
                  background: config.bg,
                  border: `1px solid ${config.color}20`,
                }}
              >
                {config.emoji} {phase} ({count})
              </span>
            );
          })}
        </div>
      </header>

      {/* How to read this — same style as interstitials */}
      <NarrativeInterstitial interstitial={{
        beforeStep: 0,
        emoji: '📖',
        lines: ['Each card below is one step I took, in real time.', 'Click any card to expand the full reasoning.'],
      }} />

      {/* Timeline */}
      <div style={st.timeline}>
        {steps.map((step, i) => {
          const phaseConfig = PHASE_CONFIG[step.phase] || { emoji: '📌', color: colors.neutral[500], bg: colors.neutral[50] };
          const isExpanded = expandedStep === step.number;
          const interstitial = INTERSTITIALS.find((it) => it.beforeStep === step.number);

          return (
            <div key={step.number}>
              {/* Narrative interstitial */}
              {interstitial && <NarrativeInterstitial interstitial={interstitial} />}

              <RevealOnScroll>
              <div style={st.timelineItem}>
              {/* Timeline line + dot */}
              <div style={st.timelineTrack}>
                <div
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: phaseConfig.color,
                    border: `2px solid ${colors.surface.card}`,
                    boxShadow: `0 0 0 2px ${phaseConfig.color}40`,
                    flexShrink: 0,
                    zIndex: 1,
                  }}
                />
                {i < steps.length - 1 && (
                  <div
                    style={{
                      width: '2px',
                      flex: 1,
                      background: `linear-gradient(180deg, ${phaseConfig.color}30, ${colors.neutral[200]})`,
                    }}
                  />
                )}
              </div>

              {/* Card */}
              <div
                style={{
                  ...st.card,
                  borderColor: isExpanded ? colors.primary[200] : colors.neutral[150],
                  boxShadow: isExpanded ? `0 4px 16px rgba(79, 106, 232, 0.08)` : shadows.sm,
                }}
                onClick={() => setExpandedStep(isExpanded ? null : step.number)}
              >
                {/* Card header */}
                <div style={st.cardHeader}>
                  <div style={st.cardTitleRow}>
                    <span style={st.stepNumber}>Step {step.number}</span>
                    <h3 style={st.stepTitle}>{step.title}</h3>
                  </div>
                  <span
                    style={{
                      ...st.phaseBadge,
                      backgroundColor: phaseConfig.bg,
                      color: phaseConfig.color,
                      border: `1px solid ${phaseConfig.color}25`,
                    }}
                  >
                    {phaseConfig.emoji} {step.phase}
                  </span>
                </div>

                {/* Meta */}
                <div style={st.cardMeta}>
                  <span style={st.metaItem}>
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" style={{ verticalAlign: '-1px' }}>
                      <circle cx="8" cy="8" r="6.5" stroke={colors.neutral[400]} strokeWidth="1.2" />
                      <path d="M8 4.5V8l2.5 1.5" stroke={colors.neutral[400]} strokeWidth="1.2" strokeLinecap="round" />
                    </svg>
                    {' '}{extractTime(step.when)}
                  </span>
                  {step.screenshots.length > 0 && (
                    <span style={st.metaItem}>
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="none" style={{ verticalAlign: '-1px' }}>
                        <rect x="1.5" y="3" width="13" height="10" rx="1.5" stroke={colors.neutral[400]} strokeWidth="1.2" />
                        <circle cx="5.5" cy="7" r="1.2" fill={colors.neutral[400]} />
                        <path d="M1.5 11l3.5-3 2.5 2 3-4L14.5 11" stroke={colors.neutral[400]} strokeWidth="1.2" />
                      </svg>
                      {' '}{step.screenshots.length} screenshot{step.screenshots.length > 1 ? 's' : ''}
                    </span>
                  )}
                </div>

                {/* Action text */}
                <p style={st.actionSummary}>
                  <RichText text={step.action.length > 200 && !isExpanded
                    ? step.action.slice(0, 200) + '...'
                    : step.action} />
                </p>

                {/* Outcome */}
                <div style={st.outcomePill}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
                    <path d="M2.5 7L5.5 10.5L11.5 3.5" stroke={colors.success[500]} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <RichText text={step.outcome} />
                </div>

                {/* Expanded section */}
                {isExpanded && (
                  <div style={st.expandedSection}>
                    <div style={st.detailBlock}>
                      <h4 style={st.detailLabel}>Why</h4>
                      <p style={st.detailText}><RichText text={step.why} /></p>
                    </div>

                    {step.screenshots.length > 0 && (
                      <div style={st.detailBlock}>
                        <h4 style={st.detailLabel}>Screenshots</h4>
                        {step.screenshots.map((ss, idx) => (
                          <ScreenshotItem
                            key={idx}
                            screenshot={ss}
                            onClick={() => setLightbox({ screenshots: step.screenshots, index: idx })}
                          />
                        ))}
                      </div>
                    )}

                    {step.logs && step.logs !== '—' && (
                      <div style={st.detailBlock}>
                        <h4 style={st.detailLabel}>Logs</h4>
                        <pre style={st.logBlock}>{step.logs}</pre>
                      </div>
                    )}
                  </div>
                )}

                {/* Expand hint */}
                <div style={st.expandHint}>
                  <svg
                    width="12" height="12" viewBox="0 0 12 12" fill="none"
                    style={{ transition: transitions.fast, transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)' }}
                  >
                    <path d="M2.5 4.5L6 8L9.5 4.5" stroke={colors.neutral[400]} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {isExpanded ? 'Collapse' : 'Expand details'}
                </div>
              </div>
            </div>
              </RevealOnScroll>
            </div>
          );
        })}
      </div>

      {/* Finale */}
      <TimelineFinale stepCount={steps.length} />

      {lightbox && (
        <Lightbox
          screenshots={lightbox.screenshots}
          initialIndex={lightbox.index}
          onClose={() => setLightbox(null)}
        />
      )}
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────
const st: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    backgroundColor: colors.surface.page,
    fontFamily: typography.fontFamily.body,
    padding: `0 0 ${spacing[10]} 0`,
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing[3],
    height: '100vh',
    fontSize: typography.fontSize.base,
    color: colors.neutral[400],
    fontFamily: typography.fontFamily.body,
  },
  loadingDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: colors.primary[400],
    animation: 'pulse 1.2s ease-in-out infinite',
  },

  // Header
  header: {
    textAlign: 'center' as const,
    padding: `${spacing[10]} ${spacing[6]} ${spacing[6]}`,
    borderBottom: `1px solid ${colors.neutral[150]}`,
    marginBottom: spacing[8],
  },
  headerBadge: {
    display: 'inline-block',
    padding: `${spacing[1]} ${spacing[4]}`,
    borderRadius: radii.full,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    fontFamily: typography.fontFamily.body,
    color: colors.primary[600],
    backgroundColor: colors.primary[50],
    border: `1px solid ${colors.primary[100]}`,
    marginBottom: spacing[4],
    letterSpacing: typography.letterSpacing.wide,
    textTransform: 'uppercase' as const,
  },
  title: {
    fontFamily: typography.fontFamily.display,
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral[900],
    margin: 0,
    letterSpacing: typography.letterSpacing.tight,
  },
  subtitle: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.base,
    color: colors.neutral[400],
    marginTop: spacing[2],
  },
  phaseChips: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap' as const,
    gap: spacing[2],
    marginTop: spacing[5],
  },

  // Timeline
  timeline: {
    maxWidth: '760px',
    margin: '0 auto',
    padding: `0 ${spacing[6]}`,
  },
  timelineItem: {
    display: 'flex',
    gap: spacing[4],
    position: 'relative' as const,
  },
  timelineTrack: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    paddingTop: '22px',
    width: '14px',
    flexShrink: 0,
  },

  // Card
  card: {
    flex: 1,
    backgroundColor: colors.surface.card,
    borderRadius: radii.xl,
    padding: `${spacing[5]} ${spacing[5]}`,
    cursor: 'pointer',
    transition: `all ${transitions.fast}`,
    border: `1px solid ${colors.neutral[150]}`,
    marginBottom: spacing[4],
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing[3],
    marginBottom: spacing[2],
  },
  cardTitleRow: {
    display: 'flex',
    alignItems: 'baseline',
    gap: spacing[2],
    flex: 1,
  },
  stepNumber: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral[400],
    textTransform: 'uppercase' as const,
    letterSpacing: typography.letterSpacing.wide,
    flexShrink: 0,
  },
  stepTitle: {
    fontFamily: typography.fontFamily.display,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    margin: 0,
    color: colors.neutral[900],
    lineHeight: typography.lineHeight.snug,
  },
  phaseBadge: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
    padding: `3px ${spacing[3]}`,
    borderRadius: radii.full,
    flexShrink: 0,
    whiteSpace: 'nowrap' as const,
  },
  cardMeta: {
    display: 'flex',
    gap: spacing[4],
    marginBottom: spacing[3],
  },
  metaItem: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.xs,
    color: colors.neutral[400],
  },
  actionSummary: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm,
    color: colors.neutral[600],
    lineHeight: typography.lineHeight.relaxed,
    margin: `0 0 ${spacing[3]} 0`,
  },
  outcomePill: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[2],
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm,
    color: colors.success[700],
    backgroundColor: colors.success[50],
    padding: `${spacing[2]} ${spacing[3]}`,
    borderRadius: radii.lg,
    border: `1px solid ${colors.success[100]}`,
  },

  // Expanded
  expandedSection: {
    marginTop: spacing[4],
    paddingTop: spacing[4],
    borderTop: `1px solid ${colors.neutral[100]}`,
  },
  detailBlock: {
    marginBottom: spacing[4],
  },
  detailLabel: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral[400],
    margin: `0 0 ${spacing[2]} 0`,
    textTransform: 'uppercase' as const,
    letterSpacing: typography.letterSpacing.wide,
  },
  detailText: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm,
    color: colors.neutral[700],
    lineHeight: typography.lineHeight.relaxed,
    margin: 0,
  },
  logBlock: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.xs,
    color: colors.neutral[600],
    backgroundColor: colors.neutral[50],
    padding: spacing[4],
    borderRadius: radii.lg,
    overflow: 'auto',
    whiteSpace: 'pre-wrap' as const,
    margin: 0,
    border: `1px solid ${colors.neutral[100]}`,
  },
  expandHint: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.xs,
    color: colors.neutral[400],
    marginTop: spacing[3],
  },


  // Screenshot items
  screenshotItem: {
    backgroundColor: colors.neutral[50],
    border: `1px solid ${colors.neutral[150]}`,
    borderRadius: radii.lg,
    padding: spacing[3],
    marginBottom: spacing[2],
    cursor: 'pointer',
    transition: `border-color ${transitions.fast}`,
    display: 'flex',
    gap: spacing[3],
    alignItems: 'flex-start',
  },
  screenshotThumbWrap: {
    width: '120px',
    minWidth: '120px',
    height: '80px',
    borderRadius: radii.md,
    overflow: 'hidden',
    backgroundColor: colors.neutral[100],
    position: 'relative' as const,
  },
  screenshotThumb: {
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const,
    transition: `opacity ${transitions.default}`,
  },
  screenshotPlaceholder: {
    position: 'absolute' as const,
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  screenshotInfo: {
    flex: 1,
    minWidth: 0,
  },
  screenshotFilename: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
    color: colors.primary[500],
    marginBottom: '2px',
    overflow: 'hidden',
    textOverflow: 'ellipsis' as const,
    whiteSpace: 'nowrap' as const,
  },
  screenshotDesc: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.xs,
    color: colors.neutral[500],
    lineHeight: typography.lineHeight.relaxed,
  },

  // Lightbox
  lightboxOverlay: {
    position: 'fixed' as const,
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    zIndex: 1000,
    overflow: 'hidden',
    backdropFilter: 'blur(4px)',
  },
  lightboxContent: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column' as const,
  },
  lightboxTopBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: `${spacing[3]} ${spacing[4]}`,
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(0,0,0,0.5)',
    flexShrink: 0,
  },
  lightboxClose: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: spacing[2],
    background: 'rgba(255,255,255,0.1)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: radii.lg,
    color: '#E2E8F0',
    fontSize: typography.fontSize.sm,
    cursor: 'pointer',
    padding: `${spacing[2]} ${spacing[3]}`,
    fontFamily: typography.fontFamily.body,
    width: '90px',
    transition: transitions.fast,
  },
  lightboxCounter: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: 'rgba(255,255,255,0.7)',
    fontFamily: typography.fontFamily.mono,
  },
  lightboxImageArea: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    minHeight: 0,
    overflow: 'hidden',
  },
  lightboxNavCol: {
    width: '64px',
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lightboxNav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '44px',
    height: '44px',
    background: 'rgba(255,255,255,0.1)',
    border: '1px solid rgba(255,255,255,0.15)',
    color: '#E2E8F0',
    cursor: 'pointer',
    borderRadius: radii.lg,
    transition: transitions.fast,
  },
  lightboxImageWrap: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 0,
    minHeight: 0,
    padding: `${spacing[5]} 0`,
    overflow: 'hidden',
  },
  lightboxImage: {
    maxWidth: '100%',
    maxHeight: '100%',
    width: 'auto',
    height: 'auto',
    objectFit: 'contain' as const,
    borderRadius: radii.lg,
  },
  lightboxCaption: {
    textAlign: 'center' as const,
    padding: `${spacing[3]} ${spacing[5]} ${spacing[4]}`,
    borderTop: '1px solid rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(0,0,0,0.5)',
    flexShrink: 0,
  },
  lightboxFilename: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
    color: colors.primary[300],
    marginBottom: '4px',
  },
  lightboxDesc: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: typography.lineHeight.relaxed,
    maxWidth: '700px',
    margin: '0 auto',
  },
};
