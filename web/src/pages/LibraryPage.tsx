import { useState, useEffect } from 'react';
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

interface DesignReference {
  id: string;
  name: string;
  description: string;
  designSystem: {
    colors: Record<string, string>;
    typography: string;
    spacing: string;
    patterns: string[];
    keyTakeaways: string[];
  };
  screenshots: Screenshot[];
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
          <div style={st.captionText}>{current.description}</div>
        </div>
      </div>
    </div>
  );
}

// ── Reference Card ────────────────────────────────────────────
function ReferenceCard({
  reference,
  onScreenshotClick,
}: {
  reference: DesignReference;
  onScreenshotClick: (screenshots: Screenshot[], index: number) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const dsColors = Object.entries(reference.designSystem.colors);

  return (
    <div style={st.refCard}>
      {/* Header */}
      <div style={st.refHeader} onClick={() => setExpanded(!expanded)}>
        <div style={{ flex: 1 }}>
          <h2 style={st.refName}>{reference.name}</h2>
          <p style={st.refDesc}>{reference.description}</p>
        </div>
        <div style={st.refMeta}>
          <span style={st.metaBadge}>
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" style={{ verticalAlign: '-1px' }}>
              <rect x="1.5" y="3" width="13" height="10" rx="1.5" stroke={colors.neutral[400]} strokeWidth="1.2" />
              <circle cx="5.5" cy="7" r="1.2" fill={colors.neutral[400]} />
              <path d="M1.5 11l3.5-3 2.5 2 3-4L14.5 11" stroke={colors.neutral[400]} strokeWidth="1.2" />
            </svg>
            {' '}{reference.screenshots.length} screens
          </span>
          <svg
            width="12" height="12" viewBox="0 0 12 12" fill="none"
            style={{ transition: transitions.fast, transform: expanded ? 'rotate(180deg)' : 'rotate(0)' }}
          >
            <path d="M2.5 4.5L6 8L9.5 4.5" stroke={colors.neutral[400]} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* Screenshot thumbnails */}
      <div style={st.thumbGrid}>
        {reference.screenshots.map((ss, i) => (
          <div
            key={i}
            style={st.thumbCard}
            onClick={() => onScreenshotClick(reference.screenshots, i)}
          >
            <img
              src={`${import.meta.env.BASE_URL}data/attachments/${encodeURIComponent(ss.filename)}`}
              alt={ss.description}
              style={st.thumbImg}
            />
          </div>
        ))}
      </div>

      {/* Expanded design system details */}
      {expanded && (
        <div style={st.designDetails}>
          {/* Colors */}
          {dsColors.length > 0 && (
            <div style={st.detailSection}>
              <h3 style={st.detailTitle}>Colors</h3>
              <div style={st.colorGrid}>
                {dsColors.map(([name, value]) => {
                  const hexMatch = value.match(/#[0-9A-Fa-f]{6}/);
                  const hex = hexMatch ? hexMatch[0] : '#888';
                  return (
                    <div key={name} style={st.colorChip}>
                      <div style={{ ...st.colorSwatch, backgroundColor: hex }} />
                      <div style={st.colorLabel}>{name}</div>
                      <div style={st.colorValue}>{value}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Typography */}
          {reference.designSystem.typography && (
            <div style={st.detailSection}>
              <h3 style={st.detailTitle}>Typography</h3>
              <p style={st.detailText}>{reference.designSystem.typography}</p>
            </div>
          )}

          {/* Spacing */}
          {reference.designSystem.spacing && (
            <div style={st.detailSection}>
              <h3 style={st.detailTitle}>Spacing</h3>
              <p style={st.detailText}>{reference.designSystem.spacing}</p>
            </div>
          )}

          {/* Patterns */}
          {reference.designSystem.patterns.length > 0 && (
            <div style={st.detailSection}>
              <h3 style={st.detailTitle}>Design Patterns</h3>
              <div style={st.patternGrid}>
                {reference.designSystem.patterns.map((p, i) => (
                  <div key={i} style={st.patternItem}>{p}</div>
                ))}
              </div>
            </div>
          )}

          {/* Key Takeaways */}
          {reference.designSystem.keyTakeaways.length > 0 && (
            <div style={st.detailSection}>
              <h3 style={st.detailTitle}>Key Takeaways</h3>
              <div style={{ display: 'flex', flexDirection: 'column' as const, gap: spacing[2] }}>
                {reference.designSystem.keyTakeaways.map((t, i) => (
                  <div key={i} style={st.takeawayItem}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: '2px' }}>
                      <path d="M8 1C4.13 1 1 4.13 1 8s3.13 7 7 7 7-3.13 7-7-3.13-7-7-7zm0 3a1 1 0 110 2 1 1 0 010-2zm1.5 8h-3v-1h1V8h-1V7h2v4h1v1z" fill={colors.primary[400]} />
                    </svg>
                    <span>{t}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────
export function LibraryPage() {
  const [references, setReferences] = useState<DesignReference[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState<{ screenshots: Screenshot[]; index: number } | null>(null);

  useEffect(() => {
    fetch(import.meta.env.BASE_URL + 'data/design-library.json')
      .then((res) => res.json())
      .then((data) => {
        setReferences(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={st.page}>
        <div style={st.loading}>Loading design library...</div>
      </div>
    );
  }

  return (
    <div style={st.page}>
      <header style={st.header}>
        <div style={st.headerBadge}>Reference Collection</div>
        <h1 style={st.title}>Design Library</h1>
        <p style={st.subtitle}>
          {references.length} reference{references.length !== 1 ? 's' : ''} · {references.reduce((sum, r) => sum + r.screenshots.length, 0)} screenshots
        </p>
      </header>

      <div style={st.content}>
        {references.map((ref) => (
          <ReferenceCard
            key={ref.id}
            reference={ref}
            onScreenshotClick={(screenshots, index) => setLightbox({ screenshots, index })}
          />
        ))}
      </div>

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
    height: '100vh',
    fontSize: typography.fontSize.base,
    color: colors.neutral[400],
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
    color: '#DB2777',
    backgroundColor: '#FDF2F8',
    border: '1px solid #FBCFE8',
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
  content: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: `0 ${spacing[6]}`,
  },

  // Reference card
  refCard: {
    backgroundColor: colors.surface.card,
    borderRadius: radii.xl,
    border: `1px solid ${colors.neutral[150]}`,
    marginBottom: spacing[6],
    overflow: 'hidden',
    boxShadow: shadows.sm,
  },
  refHeader: {
    padding: `${spacing[5]} ${spacing[5]}`,
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing[4],
  },
  refName: {
    fontFamily: typography.fontFamily.display,
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    margin: 0,
    color: colors.neutral[900],
  },
  refDesc: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm,
    color: colors.neutral[500],
    lineHeight: typography.lineHeight.relaxed,
    margin: `${spacing[1]} 0 0`,
    maxWidth: '600px',
  },
  refMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[3],
    flexShrink: 0,
  },
  metaBadge: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.xs,
    color: colors.neutral[500],
    backgroundColor: colors.neutral[50],
    padding: `3px ${spacing[3]}`,
    borderRadius: radii.full,
    border: `1px solid ${colors.neutral[150]}`,
  },

  // Thumbnail grid
  thumbGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: spacing[2],
    padding: `0 ${spacing[4]} ${spacing[4]}`,
  },
  thumbCard: {
    borderRadius: radii.lg,
    overflow: 'hidden',
    cursor: 'pointer',
    border: `1px solid ${colors.neutral[150]}`,
    transition: `border-color ${transitions.fast}, transform ${transitions.fast}`,
    aspectRatio: '16/10',
  },
  thumbImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const,
  },

  // Design details
  designDetails: {
    padding: `0 ${spacing[5]} ${spacing[5]}`,
    borderTop: `1px solid ${colors.neutral[100]}`,
    paddingTop: spacing[5],
  },
  detailSection: {
    marginBottom: spacing[5],
  },
  detailTitle: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral[400],
    textTransform: 'uppercase' as const,
    letterSpacing: typography.letterSpacing.wide,
    margin: `0 0 ${spacing[3]}`,
  },
  detailText: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm,
    color: colors.neutral[700],
    lineHeight: typography.lineHeight.relaxed,
    margin: 0,
  },

  // Colors
  colorGrid: {
    display: 'flex',
    gap: spacing[3],
    flexWrap: 'wrap' as const,
  },
  colorChip: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '3px',
  },
  colorSwatch: {
    width: '40px',
    height: '40px',
    borderRadius: radii.lg,
    border: `1px solid ${colors.neutral[200]}`,
    boxShadow: shadows.sm,
  },
  colorLabel: {
    fontFamily: typography.fontFamily.body,
    fontSize: '10px',
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral[600],
    textTransform: 'capitalize' as const,
  },
  colorValue: {
    fontFamily: typography.fontFamily.mono,
    fontSize: '10px',
    color: colors.neutral[400],
    maxWidth: '80px',
    textAlign: 'center' as const,
    overflow: 'hidden',
    textOverflow: 'ellipsis' as const,
    whiteSpace: 'nowrap' as const,
  },

  // Patterns
  patternGrid: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: spacing[2],
  },
  patternItem: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.xs,
    color: colors.neutral[600],
    backgroundColor: colors.neutral[50],
    padding: `${spacing[2]} ${spacing[3]}`,
    borderRadius: radii.lg,
    border: `1px solid ${colors.neutral[100]}`,
  },

  // Takeaways
  takeawayItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: spacing[2],
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm,
    color: colors.neutral[700],
    lineHeight: typography.lineHeight.relaxed,
    padding: `${spacing[3]} ${spacing[4]}`,
    backgroundColor: colors.primary[50],
    borderRadius: radii.lg,
    border: `1px solid ${colors.primary[100]}`,
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
  lightboxCounter: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: 'rgba(255,255,255,0.7)',
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
  captionText: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: typography.lineHeight.relaxed,
    maxWidth: '700px',
    margin: '0 auto',
  },
};
