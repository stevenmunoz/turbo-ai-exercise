import { useState } from 'react';
import {
  colors,
  typography,
  spacing,
  radii,
  shadows,
  transitions,
  layout,
} from '../shared/design-tokens';
import { TopNav } from '../shared/TopNav';

// ─── Google Fonts ─────────────────────────────────────────────
const fontLink = document.createElement('link');
fontLink.rel = 'stylesheet';
fontLink.href =
  'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap';
if (!document.head.querySelector(`link[href="${fontLink.href}"]`)) {
  document.head.appendChild(fontLink);
}

// ─── Section wrapper ──────────────────────────────────────────
function Section({
  id,
  title,
  description,
  children,
}: {
  id: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} style={s.section}>
      <div style={s.sectionHeader}>
        <h2 style={s.sectionTitle}>{title}</h2>
        {description && <p style={s.sectionDesc}>{description}</p>}
      </div>
      {children}
    </section>
  );
}

// ─── Color swatch ─────────────────────────────────────────────
function Swatch({
  name,
  hex,
  isLight,
}: {
  name: string;
  hex: string;
  isLight?: boolean;
}) {
  return (
    <div style={s.swatch}>
      <div
        style={{
          ...s.swatchColor,
          backgroundColor: hex,
          border: isLight ? `1px solid ${colors.neutral[200]}` : 'none',
        }}
      >
        <span
          style={{
            ...s.swatchHex,
            color: isLight ? colors.neutral[700] : '#fff',
          }}
        >
          {hex}
        </span>
      </div>
      <span style={s.swatchName}>{name}</span>
    </div>
  );
}

// ─── Color palette row ───────────────────────────────────────
function PaletteRow({
  label,
  shades,
}: {
  label: string;
  shades: Record<string | number, string>;
}) {
  const entries = Object.entries(shades);
  return (
    <div style={s.paletteRow}>
      <div style={s.paletteLabel}>{label}</div>
      <div style={s.paletteSwatches}>
        {entries.map(([key, hex]) => (
          <Swatch
            key={key}
            name={key}
            hex={hex}
            isLight={
              parseInt(String(key)) <= 100 ||
              key === '0' ||
              key === '50'
            }
          />
        ))}
      </div>
    </div>
  );
}

// ─── Type specimen ────────────────────────────────────────────
function TypeSpecimen({
  label,
  size,
  weight,
  family,
  sample,
}: {
  label: string;
  size: string;
  weight: number;
  family: string;
  sample?: string;
}) {
  return (
    <div style={s.typeRow}>
      <div style={s.typeMeta}>
        <span style={s.typeLabel}>{label}</span>
        <span style={s.typeSpec}>
          {size} / {weight}
        </span>
      </div>
      <div
        style={{
          fontSize: size,
          fontWeight: weight,
          fontFamily: family,
          color: colors.neutral[900],
          lineHeight: typography.lineHeight.snug,
        }}
      >
        {sample || 'Order #1042 — Compression Garment'}
      </div>
    </div>
  );
}

// ─── Nav item for sidebar preview ─────────────────────────────
function NavItem({
  icon,
  label,
  active,
}: {
  icon: string;
  label: string;
  active?: boolean;
}) {
  return (
    <div
      style={{
        ...s.navItem,
        ...(active
          ? {
              background: `linear-gradient(135deg, rgba(79, 106, 232, 0.18), rgba(79, 106, 232, 0.10))`,
              color: colors.neutral[0],
              fontWeight: typography.fontWeight.semibold,
              boxShadow: 'inset 3px 0 0 0 #4F6AE8',
            }
          : {}),
      }}
    >
      <span style={s.navIcon}>{icon}</span>
      <span style={s.navLabel}>{label}</span>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────
export function DesignSystemPage() {
  const [activeBtnTab, setActiveBtnTab] = useState<'primary' | 'secondary' | 'ghost' | 'danger'>('primary');
  const [sampleInput, setSampleInput] = useState('');
  const [sampleSelect, setSampleSelect] = useState('');
  const [sampleChecked, setSampleChecked] = useState(true);

  return (
    <>
      <TopNav />
      <div style={s.page}>
      {/* ── Sidebar TOC ───────────────────────────── */}
      <nav style={s.toc}>
        <div style={s.tocBrand}>
          <div style={s.tocLogo}>M</div>
          <div>
            <div style={s.tocTitle}>MedFlow</div>
            <div style={s.tocVersion}>Design System v1.0</div>
          </div>
        </div>
        <div style={s.tocDivider} />
        {[
          ['#overview', 'Overview'],
          ['#colors', 'Colors'],
          ['#typography', 'Typography'],
          ['#spacing', 'Spacing & Layout'],
          ['#buttons', 'Buttons'],
          ['#inputs', 'Form Inputs'],
          ['#badges', 'Badges & Status'],
          ['#cards', 'Cards'],
          ['#kpi', 'KPI Cards'],
          ['#table', 'Data Table'],
          ['#sidebar', 'Sidebar Nav'],
          ['#patterns', 'Sprint 1 Patterns'],
        ].map(([href, label]) => (
          <a key={href} href={href} style={s.tocLink}>
            {label}
          </a>
        ))}
      </nav>

      {/* ── Main content ──────────────────────────── */}
      <main style={s.main}>
        {/* Hero */}
        <header style={s.hero}>
          <div style={s.heroTag}>Design System</div>
          <h1 style={s.heroTitle}>MedFlow</h1>
          <p style={s.heroSubtitle}>
            A design system for medical supply order management — synthesized
            from Airbnb, Hourglass, Pills, Dentexa, and Xenityhealth references.
            Built for Sprint 1: order intake, product catalog, fee schedules, and
            auto-calculations.
          </p>
          <div style={s.heroMeta}>
            <span style={s.heroMetaItem}>5 references</span>
            <span style={s.heroMetaDot}>·</span>
            <span style={s.heroMetaItem}>Phase 1 focused</span>
            <span style={s.heroMetaDot}>·</span>
            <span style={s.heroMetaItem}>Light theme</span>
          </div>
        </header>

        {/* ── Overview ──────────────────────────── */}
        <Section
          id="overview"
          title="Design Philosophy"
          description="Guiding principles distilled from our reference library."
        >
          <div style={s.principleGrid}>
            {[
              {
                icon: '🩺',
                title: 'Warm, Not Clinical',
                body: 'Healthcare tools should feel approachable. Soft backgrounds, rounded corners, and warm neutrals replace sterile blue-white interfaces.',
                source: 'Hourglass + Pills',
              },
              {
                icon: '📐',
                title: 'Dense, Not Cluttered',
                body: 'Dashboard views show high information density with clear hierarchy. Every pixel earns its place through whitespace and grouping.',
                source: 'Dentexa + Xenityhealth',
              },
              {
                icon: '🧭',
                title: 'Progressive Disclosure',
                body: 'Show what matters now, reveal details on demand. Multi-step forms with visible progress, expandable sections, hover previews.',
                source: 'Airbnb + Pills',
              },
              {
                icon: '⚡',
                title: 'Speed Over Polish',
                body: 'Internal tools prioritize speed: keyboard shortcuts, auto-populated fields, smart defaults. Every click saved multiplied by 50 orders/day.',
                source: 'Sprint 1 goal',
              },
            ].map((p) => (
              <div key={p.title} style={s.principleCard}>
                <div style={s.principleIcon}>{p.icon}</div>
                <h3 style={s.principleTitle}>{p.title}</h3>
                <p style={s.principleBody}>{p.body}</p>
                <span style={s.principleSource}>← {p.source}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Colors ────────────────────────────── */}
        <Section
          id="colors"
          title="Color Palette"
          description="Primary blue for trust, orange accent for actions and alerts, warm neutrals for backgrounds."
        >
          <PaletteRow label="Primary" shades={colors.primary} />
          <PaletteRow label="Accent" shades={colors.accent} />
          <PaletteRow label="Success" shades={colors.success} />
          <PaletteRow label="Warning" shades={colors.warning} />
          <PaletteRow label="Danger" shades={colors.danger} />
          <PaletteRow label="Neutral" shades={colors.neutral} />

          <div style={{ marginTop: spacing[6] }}>
            <div style={s.paletteLabel}>Surfaces</div>
            <div style={s.surfaceGrid}>
              {Object.entries(colors.surface).map(([name, value]) => (
                <div key={name} style={s.surfaceChip}>
                  <div
                    style={{
                      ...s.surfaceSwatch,
                      backgroundColor: value,
                      border:
                        name === 'sidebar' || name === 'sidebarHover' || name === 'sidebarActive'
                          ? 'none'
                          : `1px solid ${colors.neutral[200]}`,
                    }}
                  />
                  <span style={s.surfaceName}>{name}</span>
                  <span style={s.surfaceValue}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* ── Typography ────────────────────────── */}
        <Section
          id="typography"
          title="Typography"
          description="Plus Jakarta Sans for headings (distinctive, warm), Inter for body (legible at small sizes), JetBrains Mono for data."
        >
          <div style={s.typeFamilies}>
            {Object.entries(typography.fontFamily).map(([key, value]) => (
              <div key={key} style={s.typeFamilyCard}>
                <div style={s.typeFamilyLabel}>{key}</div>
                <div
                  style={{
                    fontFamily: value,
                    fontSize: typography.fontSize['2xl'],
                    fontWeight: 600,
                    color: colors.neutral[900],
                  }}
                >
                  Aa Bb Cc 123
                </div>
                <div style={s.typeFamilyName}>{value.split(',')[0].replace(/'/g, '')}</div>
              </div>
            ))}
          </div>

          <div style={s.typeScale}>
            <TypeSpecimen
              label="4xl — KPI Number"
              size={typography.fontSize['4xl']}
              weight={typography.fontWeight.bold}
              family={typography.fontFamily.display}
              sample="$487,650"
            />
            <TypeSpecimen
              label="3xl — Page Title"
              size={typography.fontSize['3xl']}
              weight={typography.fontWeight.bold}
              family={typography.fontFamily.display}
              sample="Order Management"
            />
            <TypeSpecimen
              label="2xl — Section Title"
              size={typography.fontSize['2xl']}
              weight={typography.fontWeight.semibold}
              family={typography.fontFamily.display}
              sample="New Patient Order"
            />
            <TypeSpecimen
              label="xl — Card Title"
              size={typography.fontSize.xl}
              weight={typography.fontWeight.semibold}
              family={typography.fontFamily.display}
            />
            <TypeSpecimen
              label="lg — Section Header"
              size={typography.fontSize.lg}
              weight={typography.fontWeight.semibold}
              family={typography.fontFamily.body}
              sample="Patient Information"
            />
            <TypeSpecimen
              label="md — Input Text"
              size={typography.fontSize.md}
              weight={typography.fontWeight.regular}
              family={typography.fontFamily.body}
              sample="Enter patient name..."
            />
            <TypeSpecimen
              label="base — Body"
              size={typography.fontSize.base}
              weight={typography.fontWeight.regular}
              family={typography.fontFamily.body}
              sample="Compression garment, bilateral, custom-fit. Vendor: Medi USA. HCPCS: A6531."
            />
            <TypeSpecimen
              label="sm — Label"
              size={typography.fontSize.sm}
              weight={typography.fontWeight.medium}
              family={typography.fontFamily.body}
              sample="INSURANCE PROVIDER"
            />
            <TypeSpecimen
              label="xs — Caption"
              size={typography.fontSize.xs}
              weight={typography.fontWeight.regular}
              family={typography.fontFamily.body}
              sample="Last updated 2 hours ago"
            />
            <TypeSpecimen
              label="mono — Code/Data"
              size={typography.fontSize.base}
              weight={typography.fontWeight.regular}
              family={typography.fontFamily.mono}
              sample="HCPCS: A6531 · ICD-10: I89.0 · NPI: 1234567890"
            />
          </div>
        </Section>

        {/* ── Spacing ───────────────────────────── */}
        <Section
          id="spacing"
          title="Spacing & Layout"
          description="4px base unit. Generous card padding (16-24px), tight label-to-input gaps (4-8px)."
        >
          <div style={s.spacingGrid}>
            {Object.entries(spacing).map(([key, value]) => (
              <div key={key} style={s.spacingRow}>
                <span style={s.spacingKey}>{key}</span>
                <div style={s.spacingBarTrack}>
                  <div
                    style={{
                      ...s.spacingBar,
                      width: value === '0' ? '2px' : value,
                    }}
                  />
                </div>
                <span style={s.spacingValue}>{value}</span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: spacing[8] }}>
            <h3 style={s.subTitle}>Layout Constants</h3>
            <div style={s.layoutGrid}>
              {Object.entries(layout).map(([key, value]) => (
                <div key={key} style={s.layoutCard}>
                  <div style={s.layoutValue}>{value}</div>
                  <div style={s.layoutKey}>{key.replace(/([A-Z])/g, ' $1').toLowerCase()}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: spacing[8] }}>
            <h3 style={s.subTitle}>Border Radii</h3>
            <div style={s.radiiGrid}>
              {Object.entries(radii).map(([key, value]) => (
                <div key={key} style={s.radiiItem}>
                  <div
                    style={{
                      ...s.radiiBox,
                      borderRadius: value,
                    }}
                  />
                  <span style={s.radiiLabel}>{key}</span>
                  <span style={s.radiiValue}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: spacing[8] }}>
            <h3 style={s.subTitle}>Shadows</h3>
            <div style={s.shadowGrid}>
              {Object.entries(shadows).map(([key, value]) => (
                <div key={key} style={{ ...s.shadowBox, boxShadow: value }}>
                  {key}
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* ── Buttons ───────────────────────────── */}
        <Section
          id="buttons"
          title="Buttons"
          description="Four variants: primary (fill), secondary (outline), ghost (text-only), danger. Three sizes."
        >
          <div style={s.btnTabs}>
            {(['primary', 'secondary', 'ghost', 'danger'] as const).map((v) => (
              <button
                key={v}
                onClick={() => setActiveBtnTab(v)}
                style={{
                  ...s.btnTab,
                  ...(activeBtnTab === v ? s.btnTabActive : {}),
                }}
              >
                {v}
              </button>
            ))}
          </div>

          <div style={s.btnShowcase}>
            {(['sm', 'md', 'lg'] as const).map((size) => {
              const base: React.CSSProperties = {
                fontFamily: typography.fontFamily.body,
                fontWeight: typography.fontWeight.semibold,
                borderRadius: radii.md,
                cursor: 'pointer',
                transition: `all ${transitions.default}`,
                border: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: spacing[2],
                width: 'auto',
                ...(size === 'sm'
                  ? { fontSize: typography.fontSize.sm, padding: '6px 12px' }
                  : size === 'md'
                    ? { fontSize: typography.fontSize.base, padding: '8px 16px' }
                    : { fontSize: typography.fontSize.md, padding: '10px 20px' }),
              };
              const variants: Record<string, React.CSSProperties> = {
                primary: {
                  ...base,
                  backgroundColor: colors.primary[500],
                  color: '#fff',
                },
                secondary: {
                  ...base,
                  backgroundColor: 'transparent',
                  color: colors.primary[600],
                  border: `1px solid ${colors.primary[300]}`,
                },
                ghost: {
                  ...base,
                  backgroundColor: 'transparent',
                  color: colors.neutral[600],
                },
                danger: {
                  ...base,
                  backgroundColor: colors.danger[500],
                  color: '#fff',
                },
              };
              return (
                <button key={size} style={variants[activeBtnTab]}>
                  {size === 'sm' ? 'Small' : size === 'md' ? 'Medium' : 'Large'} Button
                </button>
              );
            })}

            {/* Disabled state */}
            <button
              disabled
              style={{
                fontFamily: typography.fontFamily.body,
                fontWeight: typography.fontWeight.semibold,
                borderRadius: radii.md,
                cursor: 'not-allowed',
                border: 'none',
                fontSize: typography.fontSize.base,
                padding: '8px 16px',
                backgroundColor: colors.neutral[200],
                color: colors.neutral[400],
                opacity: 0.7,
                width: 'auto',
              }}
            >
              Disabled
            </button>
          </div>

          <div style={{ marginTop: spacing[4] }}>
            <h3 style={s.subTitle}>Icon Buttons</h3>
            <div style={s.btnShowcase}>
              {[
                { icon: '＋', label: 'New Order' },
                { icon: '📄', label: 'Generate PDF' },
                { icon: '✓', label: 'Approve' },
              ].map((b) => (
                <button
                  key={b.label}
                  style={{
                    fontFamily: typography.fontFamily.body,
                    fontWeight: typography.fontWeight.semibold,
                    borderRadius: radii.md,
                    cursor: 'pointer',
                    transition: `all ${transitions.default}`,
                    border: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: spacing[2],
                    fontSize: typography.fontSize.base,
                    padding: '8px 16px',
                    backgroundColor: colors.primary[500],
                    color: '#fff',
                    width: 'auto',
                  }}
                >
                  <span>{b.icon}</span> {b.label}
                </button>
              ))}
            </div>
          </div>
        </Section>

        {/* ── Form Inputs ───────────────────────── */}
        <Section
          id="inputs"
          title="Form Inputs"
          description="Clean, accessible form controls for the order intake form. Labels above, validation inline."
        >
          <div style={s.inputGrid}>
            {/* Text input */}
            <div style={s.field}>
              <label style={s.label}>Patient Name</label>
              <input
                type="text"
                placeholder="e.g. Jane Doe"
                value={sampleInput}
                onChange={(e) => setSampleInput(e.target.value)}
                style={s.input}
              />
              <span style={s.hint}>First and last name as it appears on insurance</span>
            </div>

            {/* Select */}
            <div style={s.field}>
              <label style={s.label}>Insurance Provider</label>
              <select
                value={sampleSelect}
                onChange={(e) => setSampleSelect(e.target.value)}
                style={s.input}
              >
                <option value="">Select provider...</option>
                <option value="aetna">Aetna</option>
                <option value="bcbs">Blue Cross Blue Shield</option>
                <option value="cigna">Cigna</option>
                <option value="uhc">UnitedHealthcare</option>
                <option value="self">Self-Pay</option>
              </select>
            </div>

            {/* Error state */}
            <div style={s.field}>
              <label style={s.label}>HCPCS Code</label>
              <input
                type="text"
                value="X999"
                readOnly
                style={{ ...s.input, ...s.inputError }}
              />
              <span style={s.errorHint}>Invalid HCPCS code. Must match format: A0000–A9999</span>
            </div>

            {/* Disabled */}
            <div style={s.field}>
              <label style={{ ...s.label, color: colors.neutral[400] }}>
                Auto-calculated Margin
              </label>
              <input
                type="text"
                value="$42.50 (35%)"
                readOnly
                disabled
                style={{ ...s.input, ...s.inputDisabled }}
              />
              <span style={s.hint}>Calculated from fee schedule and vendor cost</span>
            </div>

            {/* Checkbox */}
            <div style={s.field}>
              <label style={s.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={sampleChecked}
                  onChange={(e) => setSampleChecked(e.target.checked)}
                  style={s.checkbox}
                />
                <span>Requires prior authorization</span>
              </label>
            </div>

            {/* Textarea */}
            <div style={{ ...s.field, gridColumn: '1 / -1' }}>
              <label style={s.label}>Order Notes</label>
              <textarea
                placeholder="Add any special instructions for this order..."
                rows={3}
                style={{ ...s.input, resize: 'vertical' as const }}
              />
            </div>
          </div>
        </Section>

        {/* ── Badges & Status ───────────────────── */}
        <Section
          id="badges"
          title="Badges & Status"
          description="Order status indicators, approval states, and category tags."
        >
          <div style={s.badgeGroup}>
            <h3 style={s.subTitle}>Order Status</h3>
            <div style={s.badgeRow}>
              {[
                { label: 'New', bg: colors.primary[50], fg: colors.primary[700], dot: colors.primary[500] },
                { label: 'Pending Approval', bg: colors.warning[50], fg: colors.warning[600], dot: colors.warning[500] },
                { label: 'Approved', bg: colors.success[50], fg: colors.success[700], dot: colors.success[500] },
                { label: 'Shipped', bg: colors.accent[50], fg: colors.accent[700], dot: colors.accent[500] },
                { label: 'Delivered', bg: colors.success[50], fg: colors.success[700], dot: colors.success[600] },
                { label: 'Cancelled', bg: colors.danger[50], fg: colors.danger[600], dot: colors.danger[500] },
              ].map((b) => (
                <span
                  key={b.label}
                  style={{
                    ...s.badge,
                    backgroundColor: b.bg,
                    color: b.fg,
                  }}
                >
                  <span style={{ ...s.badgeDot, backgroundColor: b.dot }} />
                  {b.label}
                </span>
              ))}
            </div>
          </div>

          <div style={s.badgeGroup}>
            <h3 style={s.subTitle}>Category Tags (Pill Chips)</h3>
            <div style={s.badgeRow}>
              {[
                'Compression Garments',
                'Surgical Supplies',
                'Lymphedema',
                'Breast Prosthetics',
                'Self-Pay',
                'Prior Auth Required',
              ].map((label) => (
                <span key={label} style={s.chip}>
                  {label}
                </span>
              ))}
            </div>
          </div>

          <div style={s.badgeGroup}>
            <h3 style={s.subTitle}>Priority Indicators</h3>
            <div style={s.badgeRow}>
              {[
                { label: 'Urgent', bg: colors.danger[500], fg: '#fff' },
                { label: 'High', bg: colors.accent[500], fg: '#fff' },
                { label: 'Normal', bg: colors.neutral[200], fg: colors.neutral[700] },
                { label: 'Low', bg: colors.neutral[100], fg: colors.neutral[500] },
              ].map((b) => (
                <span
                  key={b.label}
                  style={{
                    ...s.priorityBadge,
                    backgroundColor: b.bg,
                    color: b.fg,
                  }}
                >
                  {b.label}
                </span>
              ))}
            </div>
          </div>
        </Section>

        {/* ── Cards ──────────────────────────────── */}
        <Section
          id="cards"
          title="Cards"
          description="Card containers for grouping related information. White surface, subtle shadow, rounded corners."
        >
          <div style={s.cardGrid}>
            {/* Standard card */}
            <div style={s.card}>
              <div style={s.cardHeader}>
                <h3 style={s.cardTitle}>Patient Information</h3>
                <button style={s.cardAction}>Edit</button>
              </div>
              <div style={s.cardBody}>
                <div style={s.cardRow}>
                  <span style={s.cardLabel}>Name</span>
                  <span style={s.cardValue}>Sarah Johnson</span>
                </div>
                <div style={s.cardRow}>
                  <span style={s.cardLabel}>DOB</span>
                  <span style={s.cardValue}>03/15/1978</span>
                </div>
                <div style={s.cardRow}>
                  <span style={s.cardLabel}>Insurance</span>
                  <span style={s.cardValue}>Blue Cross Blue Shield</span>
                </div>
                <div style={s.cardRow}>
                  <span style={s.cardLabel}>Policy #</span>
                  <span style={{ ...s.cardValue, fontFamily: typography.fontFamily.mono }}>
                    BCB-482910-A
                  </span>
                </div>
              </div>
            </div>

            {/* Product card */}
            <div style={s.card}>
              <div style={s.cardHeader}>
                <h3 style={s.cardTitle}>Product Details</h3>
                <span style={{ ...s.badge, backgroundColor: colors.success[50], color: colors.success[700] }}>
                  <span style={{ ...s.badgeDot, backgroundColor: colors.success[500] }} />
                  In Stock
                </span>
              </div>
              <div style={s.cardBody}>
                <div style={s.cardRow}>
                  <span style={s.cardLabel}>Product</span>
                  <span style={s.cardValue}>Flat-Knit Compression Sleeve</span>
                </div>
                <div style={s.cardRow}>
                  <span style={s.cardLabel}>HCPCS</span>
                  <span style={{ ...s.cardValue, fontFamily: typography.fontFamily.mono }}>A6531</span>
                </div>
                <div style={s.cardRow}>
                  <span style={s.cardLabel}>Vendor</span>
                  <span style={s.cardValue}>Medi USA</span>
                </div>
                <div style={s.cardRow}>
                  <span style={s.cardLabel}>Unit Cost</span>
                  <span style={{ ...s.cardValue, fontWeight: 600, color: colors.neutral[900] }}>
                    $78.50
                  </span>
                </div>
              </div>
            </div>

            {/* Summary card */}
            <div style={{ ...s.card, gridColumn: '1 / -1' }}>
              <div style={s.cardHeader}>
                <h3 style={s.cardTitle}>Order Summary</h3>
                <span style={{ ...s.badge, backgroundColor: colors.warning[50], color: colors.warning[600] }}>
                  <span style={{ ...s.badgeDot, backgroundColor: colors.warning[500] }} />
                  Pending Approval
                </span>
              </div>
              <div style={s.summaryGrid}>
                <div style={s.summaryItem}>
                  <span style={s.summaryLabel}>Billable Amount</span>
                  <span style={s.summaryValue}>$245.00</span>
                </div>
                <div style={s.summaryItem}>
                  <span style={s.summaryLabel}>Vendor Cost</span>
                  <span style={s.summaryValue}>$157.00</span>
                </div>
                <div style={s.summaryItem}>
                  <span style={s.summaryLabel}>Margin</span>
                  <span style={{ ...s.summaryValue, color: colors.success[600] }}>$88.00 (36%)</span>
                </div>
                <div style={s.summaryItem}>
                  <span style={s.summaryLabel}>Patient Owes</span>
                  <span style={s.summaryValue}>$45.00</span>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* ── KPI Cards ─────────────────────────── */}
        <Section
          id="kpi"
          title="KPI Cards"
          description="Dashboard metric cards with sparkline trends. Pattern from Xenityhealth."
        >
          <div style={s.kpiGrid}>
            {[
              { label: 'Active Orders', value: '47', change: '+12%', up: true, icon: '📦' },
              { label: 'Pending Approvals', value: '8', change: '-3', up: false, icon: '⏳' },
              { label: 'Revenue (MTD)', value: '$34,850', change: '+18%', up: true, icon: '💰' },
              { label: 'Shipped Today', value: '12', change: '+5', up: true, icon: '🚚' },
            ].map((kpi) => (
              <div key={kpi.label} style={s.kpiCard}>
                <div style={s.kpiTop}>
                  <span style={s.kpiIcon}>{kpi.icon}</span>
                  <span
                    style={{
                      ...s.kpiChange,
                      color: kpi.up ? colors.success[600] : colors.danger[500],
                      backgroundColor: kpi.up ? colors.success[50] : colors.danger[50],
                    }}
                  >
                    {kpi.up ? '↑' : '↓'} {kpi.change}
                  </span>
                </div>
                <div style={s.kpiValue}>{kpi.value}</div>
                <div style={s.kpiLabel}>{kpi.label}</div>
                {/* Sparkline placeholder */}
                <svg width="100%" height="32" viewBox="0 0 120 32" style={{ marginTop: spacing[2] }}>
                  <polyline
                    points={
                      kpi.up
                        ? '0,28 15,24 30,26 45,20 60,18 75,14 90,10 105,8 120,4'
                        : '0,8 15,10 30,6 45,12 60,18 75,20 90,16 105,22 120,26'
                    }
                    fill="none"
                    stroke={kpi.up ? colors.success[400] : colors.danger[400]}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Data Table ────────────────────────── */}
        <Section
          id="table"
          title="Data Table"
          description="Order list view with sortable columns, inline status badges, and row actions."
        >
          <div style={s.tableContainer}>
            <table style={s.table}>
              <thead>
                <tr>
                  {['Order #', 'Patient', 'Product', 'Vendor', 'Status', 'Amount', ''].map(
                    (h) => (
                      <th key={h} style={s.th}>
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    id: '#1042',
                    patient: 'Sarah Johnson',
                    product: 'Compression Sleeve',
                    vendor: 'Medi USA',
                    status: 'Approved',
                    statusColor: colors.success,
                    amount: '$245.00',
                  },
                  {
                    id: '#1041',
                    patient: 'Michael Chen',
                    product: 'Breast Prosthetic',
                    vendor: 'Amoena',
                    status: 'Pending Approval',
                    statusColor: colors.warning,
                    amount: '$380.00',
                  },
                  {
                    id: '#1040',
                    patient: 'Lisa Rivera',
                    product: 'Compression Gauntlet',
                    vendor: 'Juzo',
                    status: 'Shipped',
                    statusColor: colors.accent,
                    amount: '$165.00',
                  },
                  {
                    id: '#1039',
                    patient: 'James Williams',
                    product: 'Night Garment Set',
                    vendor: 'Medi USA',
                    status: 'Delivered',
                    statusColor: colors.success,
                    amount: '$520.00',
                  },
                ].map((row, i) => (
                  <tr
                    key={row.id}
                    style={{
                      ...s.tr,
                      backgroundColor: i % 2 === 0 ? colors.neutral[0] : colors.neutral[50],
                    }}
                  >
                    <td style={{ ...s.td, fontFamily: typography.fontFamily.mono, fontWeight: 600 }}>
                      {row.id}
                    </td>
                    <td style={s.td}>{row.patient}</td>
                    <td style={s.td}>{row.product}</td>
                    <td style={{ ...s.td, color: colors.neutral[500] }}>{row.vendor}</td>
                    <td style={s.td}>
                      <span
                        style={{
                          ...s.badge,
                          backgroundColor: row.statusColor[50],
                          color: row.statusColor[600] || row.statusColor[700],
                        }}
                      >
                        <span
                          style={{
                            ...s.badgeDot,
                            backgroundColor: row.statusColor[500],
                          }}
                        />
                        {row.status}
                      </span>
                    </td>
                    <td style={{ ...s.td, fontWeight: 600 }}>{row.amount}</td>
                    <td style={s.td}>
                      <button style={s.rowAction}>···</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        {/* ── Sidebar Nav ───────────────────────── */}
        <Section
          id="sidebar"
          title="Sidebar Navigation"
          description="Grouped navigation pattern from Dentexa — sections for Orders, Billing, Products, and Admin."
        >
          <div style={s.sidebarPreview}>
            <div style={s.sidebarDemo}>
              <div style={s.sidebarBrand}>
                <div style={s.sidebarLogo}>M</div>
                <div>
                  <div style={s.sidebarBrandName}>MedFlow</div>
                  <div style={s.sidebarBrandSub}>Order Management</div>
                </div>
              </div>
              <div style={s.sidebarDivider} />

              <div style={s.sidebarGroup}>
                <div style={s.sidebarGroupLabel}>ORDERS</div>
                <NavItem icon="📋" label="Dashboard" active />
                <NavItem icon="📝" label="New Order" />
                <NavItem icon="📦" label="All Orders" />
                <NavItem icon="⏳" label="Pending Approval" />
              </div>

              <div style={s.sidebarGroup}>
                <div style={s.sidebarGroupLabel}>BILLING</div>
                <NavItem icon="💰" label="Fee Schedules" />
                <NavItem icon="📄" label="Invoices" />
                <NavItem icon="💳" label="Payments" />
              </div>

              <div style={s.sidebarGroup}>
                <div style={s.sidebarGroupLabel}>CATALOG</div>
                <NavItem icon="🏷️" label="Products" />
                <NavItem icon="🏭" label="Vendors" />
              </div>

              <div style={{ flex: 1 }} />
              <div style={s.sidebarDivider} />
              <NavItem icon="⚙️" label="Settings" />
              <NavItem icon="❓" label="Help" />
            </div>

            <div style={s.sidebarCaption}>
              <h4 style={s.sidebarCaptionTitle}>Navigation Groups</h4>
              <p style={s.sidebarCaptionText}>
                Grouped by workflow: <strong>Orders</strong> (daily tasks),{' '}
                <strong>Billing</strong> (financial ops), <strong>Catalog</strong>{' '}
                (reference data). Active state uses a highlighted background with the sidebar accent color.
              </p>
            </div>
          </div>
        </Section>

        {/* ── Sprint 1 Patterns ─────────────────── */}
        <Section
          id="patterns"
          title="Sprint 1 Patterns"
          description="Key UI patterns we'll implement in the first sprint."
        >
          <div style={s.patternGrid}>
            {[
              {
                title: 'Multi-Step Order Form',
                desc: 'Airbnb-style accordion with visible progress. Steps: Patient Info → Product Selection → Insurance & Billing → Review & Submit.',
                source: 'Airbnb checkout flow',
                status: 'Sprint 1',
              },
              {
                title: 'Product Selector with Category Chips',
                desc: 'Pills-style filter chips for product categories (Compression, Surgical, Prosthetics). Dropdown with auto-populate from product catalog.',
                source: 'Pills e-commerce',
                status: 'Sprint 1',
              },
              {
                title: 'Auto-Calculation Panel',
                desc: 'Sticky sidebar showing real-time cost breakdown: vendor cost, billable amount, margin %, and patient responsibility. Updates as products are selected.',
                source: 'Airbnb price breakdown',
                status: 'Sprint 1',
              },
              {
                title: 'Order Dashboard with KPIs',
                desc: 'Top-level KPI cards (active orders, pending approvals, revenue) with sparkline trends. Filterable order table below.',
                source: 'Xenityhealth + Dentexa',
                status: 'Sprint 1',
              },
              {
                title: 'Document Generation',
                desc: 'Encounter form, patient invoice, and proof of delivery generated from order data. Preview before download.',
                source: 'Alex requirement',
                status: 'Sprint 2',
              },
              {
                title: 'Approval Workflow',
                desc: 'Inline approval for HCPCS codes requiring manager sign-off. Notification badges on sidebar. One-click approve/reject.',
                source: 'Alex requirement',
                status: 'Sprint 2',
              },
            ].map((p) => (
              <div key={p.title} style={s.patternCard}>
                <div style={s.patternTop}>
                  <h4 style={s.patternTitle}>{p.title}</h4>
                  <span
                    style={{
                      ...s.patternBadge,
                      backgroundColor: p.status === 'Sprint 1' ? colors.primary[50] : colors.neutral[100],
                      color: p.status === 'Sprint 1' ? colors.primary[700] : colors.neutral[500],
                    }}
                  >
                    {p.status}
                  </span>
                </div>
                <p style={s.patternDesc}>{p.desc}</p>
                <span style={s.patternSource}>← {p.source}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* Footer */}
        <footer style={s.footer}>
          <div style={s.footerLine} />
          <p style={s.footerText}>
            MedFlow Design System · Built with React + TypeScript · Tokens in{' '}
            <code style={s.footerCode}>shared/design-tokens.ts</code>
          </p>
        </footer>
      </main>
    </div>
    </>
  );
}

// ─── Styles ───────────────────────────────────────────────────
const s: Record<string, React.CSSProperties> = {
  // Page layout — note: App.css sets `button { width: 100% }` globally,
  // so every button in this page needs explicit width: 'auto'.
  page: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: colors.surface.page,
    fontFamily: typography.fontFamily.body,
    color: colors.neutral[800],
  },

  // TOC sidebar
  toc: {
    width: '220px',
    flexShrink: 0,
    position: 'sticky' as const,
    top: 0,
    height: 'calc(100vh - 52px)',
    overflowY: 'auto' as const,
    backgroundColor: colors.neutral[900],
    padding: `${spacing[5]} ${spacing[4]}`,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: spacing[1],
    borderRight: `1px solid ${colors.neutral[800]}`,
  },
  tocBrand: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[3],
    marginBottom: spacing[2],
  },
  tocLogo: {
    width: '32px',
    height: '32px',
    borderRadius: radii.md,
    backgroundColor: colors.primary[500],
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: typography.fontFamily.display,
    fontWeight: typography.fontWeight.bold,
    fontSize: typography.fontSize.md,
  },
  tocTitle: {
    fontFamily: typography.fontFamily.display,
    fontWeight: typography.fontWeight.bold,
    fontSize: typography.fontSize.base,
    color: colors.neutral[0],
  },
  tocVersion: {
    fontSize: typography.fontSize.xs,
    color: colors.neutral[500],
  },
  tocDivider: {
    height: '1px',
    backgroundColor: colors.neutral[800],
    margin: `${spacing[2]} 0`,
  },
  tocLink: {
    display: 'block',
    fontSize: typography.fontSize.sm,
    color: colors.neutral[400],
    textDecoration: 'none',
    padding: `${spacing[1]} ${spacing[2]}`,
    borderRadius: radii.sm,
    transition: `all ${transitions.fast}`,
    lineHeight: typography.lineHeight.normal,
  },

  // Main content
  main: {
    flex: 1,
    minWidth: 0,
    maxWidth: '960px',
    margin: '0 auto',
    padding: `${spacing[10]} ${spacing[8]}`,
  },

  // Hero
  hero: {
    marginBottom: spacing[16],
  },
  heroTag: {
    display: 'inline-block',
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    textTransform: 'uppercase' as const,
    letterSpacing: typography.letterSpacing.widest,
    color: colors.primary[500],
    backgroundColor: colors.primary[50],
    padding: `${spacing[1]} ${spacing[3]}`,
    borderRadius: radii.full,
    marginBottom: spacing[4],
  },
  heroTitle: {
    fontFamily: typography.fontFamily.display,
    fontSize: '3.5rem',
    fontWeight: 800,
    color: colors.neutral[900],
    letterSpacing: '-0.03em',
    margin: `0 0 ${spacing[4]}`,
    lineHeight: 1.1,
  },
  heroSubtitle: {
    fontSize: typography.fontSize.lg,
    color: colors.neutral[500],
    lineHeight: typography.lineHeight.relaxed,
    maxWidth: '600px',
    margin: `0 0 ${spacing[5]}`,
  },
  heroMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[2],
    fontSize: typography.fontSize.sm,
    color: colors.neutral[400],
  },
  heroMetaItem: {},
  heroMetaDot: { color: colors.neutral[300] },

  // Section
  section: {
    marginBottom: spacing[16],
  },
  sectionHeader: {
    marginBottom: spacing[6],
    borderBottom: `1px solid ${colors.neutral[200]}`,
    paddingBottom: spacing[4],
  },
  sectionTitle: {
    fontFamily: typography.fontFamily.display,
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral[900],
    margin: `0 0 ${spacing[1]}`,
    letterSpacing: typography.letterSpacing.tight,
  },
  sectionDesc: {
    fontSize: typography.fontSize.base,
    color: colors.neutral[500],
    margin: 0,
    lineHeight: typography.lineHeight.relaxed,
  },
  subTitle: {
    fontFamily: typography.fontFamily.display,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral[700],
    margin: `0 0 ${spacing[3]}`,
  },

  // Principles
  principleGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: spacing[4],
  },
  principleCard: {
    backgroundColor: colors.surface.card,
    borderRadius: radii.xl,
    padding: spacing[6],
    border: `1px solid ${colors.neutral[200]}`,
  },
  principleIcon: {
    fontSize: '1.5rem',
    marginBottom: spacing[3],
  },
  principleTitle: {
    fontFamily: typography.fontFamily.display,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral[900],
    margin: `0 0 ${spacing[2]}`,
  },
  principleBody: {
    fontSize: typography.fontSize.base,
    color: colors.neutral[600],
    lineHeight: typography.lineHeight.relaxed,
    margin: `0 0 ${spacing[3]}`,
  },
  principleSource: {
    fontSize: typography.fontSize.xs,
    color: colors.primary[500],
    fontWeight: typography.fontWeight.medium,
  },

  // Color palette
  paletteRow: {
    marginBottom: spacing[5],
  },
  paletteLabel: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral[600],
    textTransform: 'capitalize' as const,
    marginBottom: spacing[2],
    letterSpacing: typography.letterSpacing.wide,
  },
  paletteSwatches: {
    display: 'flex',
    gap: spacing[1],
    flexWrap: 'wrap' as const,
  },
  swatch: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: spacing[1],
  },
  swatchColor: {
    width: '56px',
    height: '40px',
    borderRadius: radii.md,
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingBottom: '3px',
  },
  swatchHex: {
    fontSize: '9px',
    fontFamily: typography.fontFamily.mono,
    opacity: 0.8,
  },
  swatchName: {
    fontSize: '10px',
    color: colors.neutral[500],
    fontFamily: typography.fontFamily.mono,
  },

  // Surfaces
  surfaceGrid: {
    display: 'flex',
    gap: spacing[4],
    flexWrap: 'wrap' as const,
  },
  surfaceChip: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: spacing[1],
  },
  surfaceSwatch: {
    width: '64px',
    height: '48px',
    borderRadius: radii.lg,
  },
  surfaceName: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
    color: colors.neutral[600],
  },
  surfaceValue: {
    fontSize: '10px',
    fontFamily: typography.fontFamily.mono,
    color: colors.neutral[400],
    maxWidth: '80px',
    textAlign: 'center' as const,
    wordBreak: 'break-all' as const,
  },

  // Typography
  typeFamilies: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: spacing[4],
    marginBottom: spacing[8],
  },
  typeFamilyCard: {
    backgroundColor: colors.surface.card,
    borderRadius: radii.lg,
    padding: spacing[5],
    border: `1px solid ${colors.neutral[200]}`,
  },
  typeFamilyLabel: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    textTransform: 'uppercase' as const,
    letterSpacing: typography.letterSpacing.widest,
    color: colors.primary[500],
    marginBottom: spacing[2],
  },
  typeFamilyName: {
    fontSize: typography.fontSize.xs,
    color: colors.neutral[400],
    fontFamily: typography.fontFamily.mono,
    marginTop: spacing[2],
  },

  typeScale: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: spacing[1],
  },
  typeRow: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[6],
    padding: `${spacing[3]} 0`,
    borderBottom: `1px solid ${colors.neutral[150]}`,
  },
  typeMeta: {
    width: '160px',
    flexShrink: 0,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '2px',
  },
  typeLabel: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral[700],
  },
  typeSpec: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.mono,
    color: colors.neutral[400],
  },

  // Spacing
  spacingGrid: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: spacing[2],
  },
  spacingRow: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[3],
  },
  spacingKey: {
    width: '28px',
    textAlign: 'right' as const,
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.mono,
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral[600],
  },
  spacingBarTrack: {
    flex: 1,
    maxWidth: '300px',
  },
  spacingBar: {
    height: '12px',
    backgroundColor: colors.primary[400],
    borderRadius: radii.sm,
    minWidth: '2px',
  },
  spacingValue: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.mono,
    color: colors.neutral[400],
  },

  // Layout constants
  layoutGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: spacing[3],
  },
  layoutCard: {
    backgroundColor: colors.surface.card,
    borderRadius: radii.lg,
    padding: spacing[4],
    border: `1px solid ${colors.neutral[200]}`,
    textAlign: 'center' as const,
  },
  layoutValue: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    fontFamily: typography.fontFamily.mono,
    color: colors.primary[600],
    marginBottom: spacing[1],
  },
  layoutKey: {
    fontSize: typography.fontSize.xs,
    color: colors.neutral[500],
    textTransform: 'capitalize' as const,
  },

  // Radii
  radiiGrid: {
    display: 'flex',
    gap: spacing[4],
    flexWrap: 'wrap' as const,
  },
  radiiItem: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: spacing[1],
  },
  radiiBox: {
    width: '56px',
    height: '56px',
    backgroundColor: colors.primary[100],
    border: `2px solid ${colors.primary[400]}`,
  },
  radiiLabel: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral[700],
  },
  radiiValue: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.mono,
    color: colors.neutral[400],
  },

  // Shadows
  shadowGrid: {
    display: 'flex',
    gap: spacing[4],
    flexWrap: 'wrap' as const,
  },
  shadowBox: {
    width: '100px',
    height: '72px',
    backgroundColor: colors.surface.card,
    borderRadius: radii.lg,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.neutral[500],
  },

  // Buttons
  btnTabs: {
    display: 'flex',
    gap: spacing[1],
    marginBottom: spacing[4],
    borderBottom: `1px solid ${colors.neutral[200]}`,
    paddingBottom: spacing[2],
  },
  btnTab: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    fontFamily: typography.fontFamily.body,
    padding: `${spacing[1]} ${spacing[3]}`,
    borderRadius: radii.md,
    border: 'none',
    cursor: 'pointer',
    backgroundColor: 'transparent',
    color: colors.neutral[500],
    transition: `all ${transitions.fast}`,
    textTransform: 'capitalize' as const,
    width: 'auto',
  },
  btnTabActive: {
    backgroundColor: colors.primary[50],
    color: colors.primary[700],
    fontWeight: typography.fontWeight.semibold,
  },
  btnShowcase: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[3],
    flexWrap: 'wrap' as const,
  },

  // Form inputs
  inputGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: spacing[5],
    backgroundColor: colors.surface.card,
    borderRadius: radii.xl,
    padding: spacing[6],
    border: `1px solid ${colors.neutral[200]}`,
  },
  field: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: spacing[1],
  },
  label: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.neutral[700],
  },
  input: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.body,
    padding: `${spacing[2]} ${spacing[3]}`,
    borderRadius: radii.md,
    border: `1px solid ${colors.neutral[300]}`,
    outline: 'none',
    transition: `border-color ${transitions.fast}, box-shadow ${transitions.fast}`,
    backgroundColor: colors.surface.card,
    color: colors.neutral[900],
    lineHeight: typography.lineHeight.normal,
  },
  inputError: {
    borderColor: colors.danger[400],
    boxShadow: `0 0 0 3px ${colors.danger[50]}`,
  },
  inputDisabled: {
    backgroundColor: colors.neutral[100],
    color: colors.neutral[500],
    cursor: 'not-allowed',
  },
  hint: {
    fontSize: typography.fontSize.xs,
    color: colors.neutral[400],
  },
  errorHint: {
    fontSize: typography.fontSize.xs,
    color: colors.danger[500],
    fontWeight: typography.fontWeight.medium,
  },
  checkbox: {
    accentColor: colors.primary[500],
    width: '16px',
    height: '16px',
    cursor: 'pointer',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[2],
    fontSize: typography.fontSize.base,
    color: colors.neutral[700],
    cursor: 'pointer',
  },

  // Badges
  badgeGroup: {
    marginBottom: spacing[6],
  },
  badgeRow: {
    display: 'flex',
    gap: spacing[2],
    flexWrap: 'wrap' as const,
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: spacing[1],
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    padding: `3px ${spacing[2]}`,
    borderRadius: radii.full,
    lineHeight: typography.lineHeight.normal,
  },
  badgeDot: {
    width: '6px',
    height: '6px',
    borderRadius: radii.full,
    flexShrink: 0,
  },
  chip: {
    display: 'inline-block',
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    padding: `${spacing[1]} ${spacing[3]}`,
    borderRadius: radii.full,
    border: `1px solid ${colors.neutral[300]}`,
    color: colors.neutral[700],
    backgroundColor: colors.surface.card,
    cursor: 'pointer',
    transition: `all ${transitions.fast}`,
  },
  priorityBadge: {
    display: 'inline-block',
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    padding: `2px ${spacing[2]}`,
    borderRadius: radii.sm,
    textTransform: 'uppercase' as const,
    letterSpacing: typography.letterSpacing.wider,
  },

  // Cards
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: spacing[4],
  },
  card: {
    backgroundColor: colors.surface.card,
    borderRadius: radii.xl,
    border: `1px solid ${colors.neutral[200]}`,
    overflow: 'hidden',
    boxShadow: shadows.sm,
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: `${spacing[4]} ${spacing[5]}`,
    borderBottom: `1px solid ${colors.neutral[150]}`,
  },
  cardTitle: {
    fontFamily: typography.fontFamily.display,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral[900],
    margin: 0,
  },
  cardAction: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.primary[500],
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontFamily: typography.fontFamily.body,
    padding: `${spacing[1]} ${spacing[2]}`,
    borderRadius: radii.sm,
    width: 'auto',
  },
  cardBody: {
    padding: `${spacing[4]} ${spacing[5]}`,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: spacing[3],
  },
  cardRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.neutral[500],
  },
  cardValue: {
    fontSize: typography.fontSize.base,
    color: colors.neutral[800],
    fontWeight: typography.fontWeight.medium,
  },

  // Summary grid
  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: spacing[4],
    padding: spacing[5],
  },
  summaryItem: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: spacing[1],
    textAlign: 'center' as const,
  },
  summaryLabel: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
    color: colors.neutral[500],
    textTransform: 'uppercase' as const,
    letterSpacing: typography.letterSpacing.wider,
  },
  summaryValue: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    fontFamily: typography.fontFamily.display,
    color: colors.neutral[900],
  },

  // KPI cards
  kpiGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: spacing[4],
  },
  kpiCard: {
    backgroundColor: colors.surface.card,
    borderRadius: radii.xl,
    padding: spacing[5],
    border: `1px solid ${colors.neutral[200]}`,
    boxShadow: shadows.sm,
  },
  kpiTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[2],
  },
  kpiIcon: {
    fontSize: '1.2rem',
  },
  kpiChange: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    padding: `1px ${spacing[2]}`,
    borderRadius: radii.full,
  },
  kpiValue: {
    fontSize: typography.fontSize['4xl'],
    fontWeight: typography.fontWeight.bold,
    fontFamily: typography.fontFamily.display,
    color: colors.neutral[900],
    lineHeight: 1,
    letterSpacing: typography.letterSpacing.tight,
  },
  kpiLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.neutral[500],
    marginTop: spacing[1],
  },

  // Table
  tableContainer: {
    backgroundColor: colors.surface.card,
    borderRadius: radii.xl,
    border: `1px solid ${colors.neutral[200]}`,
    overflow: 'hidden',
    boxShadow: shadows.sm,
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    fontSize: typography.fontSize.base,
  },
  th: {
    textAlign: 'left' as const,
    padding: `${spacing[3]} ${spacing[4]}`,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    textTransform: 'uppercase' as const,
    letterSpacing: typography.letterSpacing.wider,
    color: colors.neutral[500],
    borderBottom: `1px solid ${colors.neutral[200]}`,
    backgroundColor: colors.neutral[50],
  },
  tr: {
    transition: `background-color ${transitions.fast}`,
  },
  td: {
    padding: `${spacing[3]} ${spacing[4]}`,
    borderBottom: `1px solid ${colors.neutral[150]}`,
    color: colors.neutral[800],
  },
  rowAction: {
    background: 'none',
    border: `1px solid ${colors.neutral[200]}`,
    borderRadius: radii.md,
    padding: `${spacing[1]} ${spacing[2]}`,
    cursor: 'pointer',
    fontSize: typography.fontSize.base,
    color: colors.neutral[500],
    fontFamily: typography.fontFamily.body,
    width: 'auto',
  },

  // Sidebar preview
  sidebarPreview: {
    display: 'flex',
    gap: spacing[6],
    alignItems: 'flex-start',
  },
  sidebarDemo: {
    width: layout.sidebarWidth,
    flexShrink: 0,
    backgroundColor: colors.surface.sidebar,
    borderRadius: radii.xl,
    padding: `${spacing[5]} ${spacing[3]}`,
    display: 'flex',
    flexDirection: 'column' as const,
    minHeight: '480px',
  },
  sidebarBrand: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[3],
    padding: `0 ${spacing[2]}`,
    marginBottom: spacing[4],
  },
  sidebarLogo: {
    width: '36px',
    height: '36px',
    borderRadius: radii.lg,
    backgroundColor: colors.primary[500],
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: typography.fontFamily.display,
    fontWeight: typography.fontWeight.bold,
    fontSize: typography.fontSize.lg,
  },
  sidebarBrandName: {
    fontFamily: typography.fontFamily.display,
    fontWeight: typography.fontWeight.bold,
    fontSize: typography.fontSize.base,
    color: colors.neutral[0],
  },
  sidebarBrandSub: {
    fontSize: typography.fontSize.xs,
    color: colors.neutral[500],
  },
  sidebarDivider: {
    height: '1px',
    backgroundColor: colors.neutral[800],
    margin: `${spacing[2]} ${spacing[2]}`,
  },
  sidebarGroup: {
    marginBottom: spacing[4],
  },
  sidebarGroupLabel: {
    fontSize: '10px',
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral[500],
    letterSpacing: typography.letterSpacing.widest,
    padding: `0 ${spacing[3]} ${spacing[1]}`,
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '9px 12px',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: `all ${transitions.fast}`,
    marginBottom: '2px',
    color: '#8B95A5',
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },
  navIcon: {
    fontSize: '1rem',
    width: '20px',
    textAlign: 'center' as const,
  },
  navLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.neutral[300],
    fontWeight: typography.fontWeight.medium,
  },

  sidebarCaption: {
    flex: 1,
    padding: spacing[4],
    backgroundColor: colors.surface.card,
    borderRadius: radii.xl,
    border: `1px solid ${colors.neutral[200]}`,
  },
  sidebarCaptionTitle: {
    fontFamily: typography.fontFamily.display,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral[900],
    margin: `0 0 ${spacing[2]}`,
  },
  sidebarCaptionText: {
    fontSize: typography.fontSize.base,
    color: colors.neutral[600],
    lineHeight: typography.lineHeight.relaxed,
    margin: 0,
  },

  // Sprint 1 patterns
  patternGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: spacing[4],
  },
  patternCard: {
    backgroundColor: colors.surface.card,
    borderRadius: radii.xl,
    padding: spacing[5],
    border: `1px solid ${colors.neutral[200]}`,
    boxShadow: shadows.xs,
  },
  patternTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing[2],
    marginBottom: spacing[2],
  },
  patternTitle: {
    fontFamily: typography.fontFamily.display,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral[900],
    margin: 0,
  },
  patternBadge: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    padding: `2px ${spacing[2]}`,
    borderRadius: radii.full,
    flexShrink: 0,
    whiteSpace: 'nowrap' as const,
  },
  patternDesc: {
    fontSize: typography.fontSize.base,
    color: colors.neutral[600],
    lineHeight: typography.lineHeight.relaxed,
    margin: `0 0 ${spacing[3]}`,
  },
  patternSource: {
    fontSize: typography.fontSize.xs,
    color: colors.primary[500],
    fontWeight: typography.fontWeight.medium,
  },

  // Footer
  footer: {
    marginTop: spacing[16],
    textAlign: 'center' as const,
  },
  footerLine: {
    height: '1px',
    backgroundColor: colors.neutral[200],
    marginBottom: spacing[5],
  },
  footerText: {
    fontSize: typography.fontSize.sm,
    color: colors.neutral[400],
  },
  footerCode: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.xs,
    backgroundColor: colors.neutral[100],
    padding: `1px ${spacing[1]}`,
    borderRadius: radii.sm,
    color: colors.primary[600],
  },
};
