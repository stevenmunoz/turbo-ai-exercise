/**
 * Homepage — Presentation page for AI PM Exercise video
 * Sections: Hero, Phasing & Roadmap, Sprint 1 Deep Dive, Prototype, AI Tools
 */

import { Link } from 'react-router-dom';
import { type CSSProperties, useState } from 'react';
import {
  colors,
  typography,
  spacing,
  radii,
  shadows,
} from '../shared/design-tokens';

// ─── Data ────────────────────────────────────────────────────

const PROBLEMS = [
  {
    rank: 1,
    severity: 'Critical',
    title: 'Data entry is error-prone and fragile',
    desc: 'One broken field cascades through the entire spreadsheet. Hidden table lookups make debugging nearly impossible.',
    color: colors.danger[500],
    bg: colors.danger[50],
  },
  {
    rank: 2,
    severity: 'Critical',
    title: 'No structured product catalog',
    desc: 'Product costs, vendors, and categories live in hidden Excel tabs. No single source of truth for pricing.',
    color: colors.danger[500],
    bg: colors.danger[50],
  },
  {
    rank: 3,
    severity: 'High',
    title: 'Manual document generation',
    desc: 'Encounter forms, patient invoices, and proof of delivery are created manually as PDFs every time.',
    color: colors.warning[500],
    bg: colors.warning[50],
  },
  {
    rank: 4,
    severity: 'High',
    title: 'Manual vendor ordering',
    desc: 'Team re-enters order data into vendor portals even though it already exists in the spreadsheet.',
    color: colors.warning[500],
    bg: colors.warning[50],
  },
  {
    rank: 5,
    severity: 'Medium',
    title: 'No approval workflow',
    desc: 'Manager approvals for specific HCPCS codes happen via SharePoint with manual follow-up.',
    color: colors.primary[500],
    bg: colors.primary[50],
  },
];

const SPRINTS = [
  {
    num: 1,
    title: 'Order Data Entry',
    desc: 'Replace the spreadsheet with a structured multi-step form. Auto-populate pricing from product and fee schedule tables.',
    items: ['Patient info form', 'Product selection with search', 'Auto-pricing engine', 'Measurement form uploads', 'Insurance provider selection'],
    active: true,
  },
  {
    num: 2,
    title: 'Document Generation',
    desc: 'Auto-generate encounter forms, patient invoices, and proof of delivery as downloadable PDFs.',
    items: ['Encounter form PDF', 'Patient invoice + Stripe link', 'Proof of delivery template', 'DocuSign integration'],
    active: false,
  },
  {
    num: 3,
    title: 'Workflow & Approvals',
    desc: 'Manager approval flow for HCPCS codes that require authorization. Full order status tracking.',
    items: ['Approval queue', 'Status lifecycle', 'Notification system', 'Audit trail'],
    active: false,
  },
  {
    num: 4,
    title: 'Vendor Integration',
    desc: 'Auto-send orders to the correct vendor email. Prior authorization tracking and self-pay defaults.',
    items: ['Vendor auto-routing', 'Prior auth tracking', 'Self-pay MSRP defaults', 'Reporting dashboard'],
    active: false,
  },
];

const BUILDING = [
  'Multi-step order entry wizard',
  'Product catalog with search and filtering',
  'Auto-calculated pricing from fee schedules',
  'Measurement form uploads per line item',
  'Insurance provider selection',
  'Patient info with address autocomplete',
];

const NOT_BUILDING = [
  'PDF document generation',
  'DocuSign integration',
  'Vendor portal automation',
  'Manager approval workflows',
  'Prior authorization tracking',
  'Payment processing (Stripe)',
];

const DECISIONS = [
  {
    icon: '🧩',
    title: 'Multi-step wizard over single form',
    rationale: 'Breaking the order flow into steps (patient, products, review) reduces cognitive load and prevents the "wall of fields" problem that makes the spreadsheet overwhelming.',
  },
  {
    icon: '📦',
    title: 'Product catalog as source of truth',
    rationale: 'Auto-populating from a structured product database eliminates manual price lookups, reduces errors, and makes it impossible to enter invalid product/pricing combinations.',
  },
  {
    icon: '📎',
    title: 'Measurement forms per line item',
    rationale: 'Therapists need to attach sizing forms to specific products (not the whole order). This is a unique requirement Alex mentioned that no off-the-shelf tool handles well.',
  },
];

const AI_TOOLS = [
  {
    name: 'Conductor',
    desc: 'Parallel AI workspace management. Ran multiple agents simultaneously for design system creation, prototype building, and documentation.',
    color: colors.primary[500],
    bg: colors.primary[50],
  },
  {
    name: 'Claude Code (Opus 4.6)',
    desc: 'AI pair programming with Planning mode for architecture decisions and execution mode for implementation. Custom skills and agents for repeatable workflows.',
    color: colors.accent[500],
    bg: colors.accent[50],
  },
  {
    name: 'Wispr Flow',
    desc: 'Voice-to-text dictation for all instructions. Thinking out loud and letting AI capture intent, significantly faster than typing complex PM-level requirements.',
    color: colors.success[500],
    bg: colors.success[50],
  },
];

const JOURNEY_MAP = [
  {
    stage: 'Receive Order',
    icon: '🏥',
    action: 'Therapist sends Rx for a patient needing compression garments or medical supplies',
    feeling: 'neutral',
    pain: null,
    sprint: 1,
  },
  {
    stage: 'Enter Data',
    icon: '📋',
    action: 'Employee manually types patient info, insurance, shipping address into the spreadsheet',
    feeling: 'frustrated',
    pain: 'One wrong field breaks the entire sheet. No validation, no guardrails.',
    sprint: 1,
  },
  {
    stage: 'Look Up Pricing',
    icon: '💰',
    action: 'Cross-reference 3-4 hidden Excel tabs to calculate margin, cost per unit, and billable amounts',
    feeling: 'overwhelmed',
    pain: 'Fragile formulas depend on vendor, product type, state, and payer. Constant errors.',
    sprint: 1,
  },
  {
    stage: 'Get Approval',
    icon: '✅',
    action: 'Some HCPCS codes require manager sign-off via SharePoint with manual follow-up',
    feeling: 'waiting',
    pain: 'No visibility into approval status. Manual emails to chase managers.',
    sprint: 3,
  },
  {
    stage: 'Generate Docs',
    icon: '📄',
    action: 'Manually create encounter form, patient invoice, and proof of delivery as PDFs',
    feeling: 'tedious',
    pain: 'Three separate documents created by hand every single order. Copy-paste errors.',
    sprint: 2,
  },
  {
    stage: 'Send Invoice',
    icon: '✉️',
    action: 'Upload to DocuSign, attach Stripe payment link, send to patient',
    feeling: 'tedious',
    pain: 'Manual upload and link creation. No tracking if patient received it.',
    sprint: 2,
  },
  {
    stage: 'Place Order',
    icon: '🚚',
    action: 'Re-enter all order data into the vendor portal manually',
    feeling: 'frustrated',
    pain: 'Data already exists in the spreadsheet but must be retyped. Highest time waste.',
    sprint: 4,
  },
  {
    stage: 'Ship & Sign',
    icon: '📬',
    action: 'Vendor drop-ships to patient, then POD must be sent and signed',
    feeling: 'neutral',
    pain: 'Manual tracking of whether POD was received and signed.',
    sprint: 2,
  },
];

const FEELING_CONFIG: Record<string, { emoji: string; color: string }> = {
  neutral: { emoji: '😐', color: colors.neutral[400] },
  frustrated: { emoji: '😤', color: colors.danger[500] },
  overwhelmed: { emoji: '🤯', color: colors.danger[500] },
  waiting: { emoji: '⏳', color: colors.warning[500] },
  tedious: { emoji: '😩', color: colors.warning[600] },
};

// ─── Reusable sub-components ─────────────────────────────────

function SectionHeader({ label, title, subtitle }: { label: string; title: string; subtitle: string }) {
  return (
    <div style={{ textAlign: 'center', marginBottom: spacing[10] }}>
      <div style={s.sectionLabel}>{label}</div>
      <h2 style={s.sectionTitle}>{title}</h2>
      <p style={s.sectionSubtitle}>{subtitle}</p>
    </div>
  );
}

function HoverButton({ to, primary, children }: { to: string; primary?: boolean; children: React.ReactNode }) {
  const [hover, setHover] = useState(false);
  const base: CSSProperties = primary
    ? { ...s.btnPrimary, transform: hover ? 'translateY(-2px)' : 'none', boxShadow: hover ? shadows.lg : shadows.sm }
    : { ...s.btnSecondary, borderColor: hover ? colors.primary[500] : colors.primary[200], color: hover ? colors.primary[700] : colors.primary[500] };
  return (
    <Link to={to} style={base} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      {children}
    </Link>
  );
}

// ─── Flow Diagram (2D branching layout) ──────────────────────

function FlowBox({ label, sub, color, bg }: { label: string; sub: string; color: string; bg: string }) {
  return (
    <div style={{
      padding: `${spacing[3]} ${spacing[4]}`,
      background: bg,
      borderRadius: radii.lg,
      border: `1px solid ${color}25`,
      textAlign: 'center' as const,
      minWidth: '130px',
      boxShadow: shadows.xs,
    }}>
      <div style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold, color }}>{label}</div>
      <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[500], marginTop: '2px' }}>{sub}</div>
    </div>
  );
}

function Arrow({ direction = 'right' }: { direction?: 'right' | 'down' }) {
  if (direction === 'down') {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: `${spacing[1]} 0` }}>
        <svg width="16" height="24" viewBox="0 0 16 24" fill="none">
          <path d="M8 0v20M3 16l5 5 5-5" stroke={colors.primary[300]} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    );
  }
  return (
    <div style={{ display: 'flex', alignItems: 'center', padding: `0 ${spacing[1]}` }}>
      <svg width="28" height="16" viewBox="0 0 28 16" fill="none">
        <path d="M0 8h24M20 3l5 5-5 5" stroke={colors.primary[300]} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

function FlowDiagram() {
  return (
    <div style={{
      padding: spacing[6],
      background: colors.neutral[50],
      borderRadius: radii.xl,
      border: `1px solid ${colors.neutral[200]}`,
      overflowX: 'auto' as const,
    }}>
      {/* Row 1: Main order flow (Therapist → MedFlow → Approval → Vendor) */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <FlowBox label="Therapist Order" sub="Clinic sends patient Rx" color={colors.accent[500]} bg={colors.accent[50]} />
        <Arrow />
        {/* MedFlow is the hub: order flow goes right, data layer branches down */}
        <div style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'center' }}>
          <FlowBox label="MedFlow" sub="Structured order entry" color={colors.primary[500]} bg={colors.primary[50]} />
          <Arrow direction="down" />
        </div>
        <Arrow />
        <FlowBox label="Manager Approval" sub="HCPCS code review" color={colors.warning[500]} bg={colors.warning[50]} />
        <Arrow />
        <FlowBox label="Vendor Order" sub="Auto-route to supplier" color={colors.neutral[600]} bg={colors.neutral[100]} />
      </div>

      {/* Row 2: Data sources → Auto-Pricing → Documents */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: spacing[2], alignItems: 'center' }}>
          <FlowBox label="Product Catalog" sub="Costs, vendors, HCPCS" color={colors.success[600]} bg={colors.success[50]} />
          <div style={{ fontSize: typography.fontSize.xs, color: colors.success[400], fontWeight: typography.fontWeight.medium }}>+</div>
          <FlowBox label="Fee Schedules" sub="Payer rates, multipliers" color={colors.success[600]} bg={colors.success[50]} />
        </div>
        <Arrow />
        <FlowBox label="Auto-Pricing" sub="Margin, cost, billable amt" color={colors.primary[600]} bg={colors.primary[50]} />
        <Arrow />
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: spacing[2], alignItems: 'center' }}>
          <FlowBox label="Encounter Form" sub="Internal order summary" color={colors.warning[500]} bg={colors.warning[50]} />
          <FlowBox label="Patient Invoice" sub="Stripe + DocuSign" color={colors.warning[500]} bg={colors.warning[50]} />
          <FlowBox label="Proof of Delivery" sub="Patient signature" color={colors.warning[500]} bg={colors.warning[50]} />
        </div>
      </div>

      {/* Sprint labels */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: spacing[6],
        marginTop: spacing[5],
        paddingTop: spacing[4],
        borderTop: `1px dashed ${colors.neutral[200]}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2] }}>
          <span style={{ ...flowLabelStyle, background: colors.primary[500] }}>Sprint 1</span>
          <span style={{ fontSize: typography.fontSize.xs, color: colors.neutral[500] }}>Order entry + auto-pricing</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2] }}>
          <span style={{ ...flowLabelStyle, background: colors.warning[500] }}>Sprint 2</span>
          <span style={{ fontSize: typography.fontSize.xs, color: colors.neutral[500] }}>Document generation</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2] }}>
          <span style={{ ...flowLabelStyle, background: colors.neutral[500] }}>Sprint 3-4</span>
          <span style={{ fontSize: typography.fontSize.xs, color: colors.neutral[500] }}>Approvals + vendor automation</span>
        </div>
      </div>
    </div>
  );
}

const flowLabelStyle: CSSProperties = {
  display: 'inline-block',
  padding: `2px ${spacing[2]}`,
  borderRadius: radii.full,
  fontSize: '10px',
  fontWeight: typography.fontWeight.semibold,
  color: '#FFFFFF',
  letterSpacing: typography.letterSpacing.wide,
};

// ─── Main Component ──────────────────────────────────────────

export const HomePage = () => {
  return (
    <div style={s.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');
        @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
        .home-card:hover { transform: translateY(-3px); box-shadow: ${shadows.lg}; }
        .top-nav-link:hover { background: ${colors.neutral[100]}; color: ${colors.primary[600]}; }
      `}</style>

      {/* ── TOP NAV ── */}
      <nav style={s.topNav}>
        <div style={s.topNavInner}>
          <Link to="/" style={s.topNavBrand}>
            <span style={s.topNavLogo}>M</span>
            <span style={s.topNavBrandName}>MedFlow</span>
          </Link>
          <div style={s.topNavLinks}>
            <Link to="/app" className="top-nav-link" style={s.topNavLink}>Prototype</Link>
            <Link to="/replay" className="top-nav-link" style={s.topNavLink}>Replay</Link>
            <Link to="/library" className="top-nav-link" style={s.topNavLink}>Library</Link>
            <Link to="/design-system" className="top-nav-link" style={s.topNavLink}>Design System</Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={s.hero}>
        <div style={s.heroInner}>
          <img
            src="/images/steven-whatsapp-sticker.png"
            alt="Steven"
            style={{
              display: 'block',
              width: '88px',
              height: '88px',
              borderRadius: '50%',
              objectFit: 'cover',
              marginBottom: spacing[4],
              marginLeft: 'auto',
              marginRight: 'auto',
              border: `3px solid ${colors.surface.card}`,
              boxShadow: shadows.lg,
            }}
          />
          <div style={s.heroBadge}>AI PM Challenge</div>
          <h1 style={s.heroTitle}>
            Hey, I'm Steven <span style={{ display: 'inline-block', animation: 'float 2s ease-in-out infinite' }}>👋</span>
          </h1>
          <p style={s.heroSubtitle}>
            I'm very excited to show you the thinking behind this challenge.
            Below is my approach to turning Alex's scattered vision into a focused,
            buildable product.
          </p>
          <div style={s.heroActions}>
            <HoverButton to="/app" primary>See the Prototype</HoverButton>
            <HoverButton to="/replay">Watch the Replay</HoverButton>
          </div>
        </div>
        {/* AI-generated hero illustration */}
        <div style={{ textAlign: 'center', marginTop: spacing[10], position: 'relative', zIndex: 1 }}>
          <img
            src="/images/hero-medflow.png"
            alt="MedFlow dashboard concept"
            style={{
              maxWidth: '420px',
              width: '100%',
              borderRadius: radii['2xl'],
              boxShadow: shadows.xl,
              border: `1px solid ${colors.neutral[200]}`,
            }}
          />
        </div>
        {/* Decorative gradient blob */}
        <div style={s.heroBlob} />
        <div style={s.heroBlob2} />
      </section>

      {/* ── SECTION 1: PHASING & ROADMAP ── */}
      <section style={s.section}>
        <SectionHeader
          label="SECTION 1"
          title="Phasing & Roadmap"
          subtitle="How I broke the vision into phases. Prioritizing and sequencing work to deliver value quickly."
        />

        {/* Problem Priority */}
        <div style={s.subsection}>
          <h3 style={s.subsectionTitle}>The most acute problems</h3>
          <p style={s.subsectionDesc}>
            From Alex's transcript, I identified 5 core pain points, ranked by how much they block daily operations.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[3] }}>
            {PROBLEMS.map((p) => (
              <div key={p.rank} style={{ ...s.problemCard }} className="home-card">
                <div style={{ ...s.problemRank, background: p.bg, color: p.color }}>{p.rank}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2], marginBottom: '4px' }}>
                    <span style={{ fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semibold, color: colors.neutral[900] }}>{p.title}</span>
                    <span style={{ ...s.severityBadge, background: p.bg, color: p.color }}>{p.severity}</span>
                  </div>
                  <div style={{ fontSize: typography.fontSize.sm, color: colors.neutral[500], lineHeight: typography.lineHeight.normal }}>{p.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Journey — Empathy Map */}
        <div style={s.subsection}>
          <h3 style={s.subsectionTitle}>Customer journey map</h3>
          <p style={s.subsectionDesc}>
            The full order lifecycle through Alex's team's eyes. Pain points surface at every stage.
          </p>

          {/* Journey map table */}
          <div style={s.journeyMap}>
            {/* Header row */}
            <div style={s.journeyHeaderRow}>
              <div style={{ ...s.journeyHeaderCell, flex: '0 0 140px' }}>Stage</div>
              <div style={{ ...s.journeyHeaderCell, flex: 1 }}>What the team does</div>
              <div style={{ ...s.journeyHeaderCell, flex: '0 0 60px', textAlign: 'center' }}>Feeling</div>
              <div style={{ ...s.journeyHeaderCell, flex: 1 }}>Pain point</div>
              <div style={{ ...s.journeyHeaderCell, flex: '0 0 70px', textAlign: 'center' }}>Sprint</div>
            </div>

            {/* Data rows */}
            {JOURNEY_MAP.map((step, i) => {
              const feel = FEELING_CONFIG[step.feeling];
              const isSprint1 = step.sprint === 1;
              return (
                <div
                  key={step.stage}
                  style={{
                    ...s.journeyRow,
                    background: isSprint1 ? `${colors.primary[50]}80` : i % 2 === 0 ? colors.surface.card : colors.neutral[50],
                    borderLeft: isSprint1 ? `3px solid ${colors.primary[500]}` : '3px solid transparent',
                  }}
                >
                  {/* Stage */}
                  <div style={{ flex: '0 0 140px', display: 'flex', alignItems: 'center', gap: spacing[2] }}>
                    <span style={{ fontSize: '18px' }}>{step.icon}</span>
                    <span style={{
                      fontSize: typography.fontSize.sm,
                      fontWeight: typography.fontWeight.semibold,
                      color: isSprint1 ? colors.primary[700] : colors.neutral[800],
                    }}>{step.stage}</span>
                  </div>

                  {/* Action */}
                  <div style={{ flex: 1, fontSize: typography.fontSize.xs, color: colors.neutral[600], lineHeight: typography.lineHeight.relaxed }}>
                    {step.action}
                  </div>

                  {/* Feeling */}
                  <div style={{ flex: '0 0 60px', textAlign: 'center', fontSize: '20px' }} title={step.feeling}>
                    {feel.emoji}
                  </div>

                  {/* Pain point */}
                  <div style={{ flex: 1 }}>
                    {step.pain ? (
                      <div style={{
                        fontSize: typography.fontSize.xs,
                        color: feel.color,
                        lineHeight: typography.lineHeight.relaxed,
                        fontStyle: 'italic',
                      }}>
                        {step.pain}
                      </div>
                    ) : (
                      <span style={{ fontSize: typography.fontSize.xs, color: colors.neutral[300] }}>--</span>
                    )}
                  </div>

                  {/* Sprint */}
                  <div style={{ flex: '0 0 70px', textAlign: 'center' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: `2px ${spacing[2]}`,
                      borderRadius: radii.full,
                      fontSize: '11px',
                      fontWeight: typography.fontWeight.semibold,
                      background: isSprint1 ? colors.primary[500] : colors.neutral[200],
                      color: isSprint1 ? '#FFFFFF' : colors.neutral[500],
                    }}>
                      Sprint {step.sprint}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', gap: spacing[5], marginTop: spacing[4], justifyContent: 'center', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2] }}>
              <div style={{ width: '12px', height: '12px', borderRadius: radii.sm, background: `${colors.primary[50]}`, border: `2px solid ${colors.primary[500]}` }} />
              <span style={{ fontSize: typography.fontSize.xs, color: colors.neutral[500] }}>Sprint 1 scope (what we're solving first)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2] }}>
              <span style={{ fontSize: '14px' }}>😤</span>
              <span style={{ fontSize: typography.fontSize.xs, color: colors.neutral[500] }}>Emotional temperature at each stage</span>
            </div>
          </div>
        </div>

        {/* App Information Flow */}
        <div style={s.subsection}>
          <h3 style={s.subsectionTitle}>App information flow</h3>
          <p style={s.subsectionDesc}>
            How data moves through MedFlow, from therapist order to automated pricing and document generation.
          </p>
          <FlowDiagram />
        </div>

        {/* Phased Sprints */}
        <div style={s.subsection}>
          <h3 style={s.subsectionTitle}>Phased approach (4 two-week sprints)</h3>
          <div style={s.sprintGrid}>
            {SPRINTS.map((sp) => (
              <div
                key={sp.num}
                className="home-card"
                style={{
                  ...s.sprintCard,
                  borderColor: sp.active ? colors.primary[300] : colors.neutral[200],
                  background: sp.active ? `linear-gradient(135deg, ${colors.primary[50]}, ${colors.surface.card})` : colors.surface.card,
                }}
              >
                <div style={{
                  ...s.sprintNum,
                  background: sp.active ? colors.primary[500] : colors.neutral[300],
                }}>
                  Sprint {sp.num}
                </div>
                <h4 style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.bold, color: colors.neutral[900], margin: `${spacing[2]} 0 ${spacing[1]}` }}>
                  {sp.title}
                </h4>
                <p style={{ fontSize: typography.fontSize.sm, color: colors.neutral[500], lineHeight: typography.lineHeight.normal, marginBottom: spacing[3] }}>
                  {sp.desc}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {sp.items.map((item) => (
                    <div key={item} style={{ display: 'flex', alignItems: 'center', gap: spacing[2] }}>
                      <span style={{ color: sp.active ? colors.primary[500] : colors.neutral[400], fontSize: '12px' }}>&#9679;</span>
                      <span style={{ fontSize: typography.fontSize.sm, color: sp.active ? colors.neutral[700] : colors.neutral[500] }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 2: SPRINT 1 DEEP DIVE ── */}
      <section style={{ ...s.section, background: colors.neutral[50] }}>
        <SectionHeader
          label="SECTION 2"
          title="Sprint 1 Deep Dive"
          subtitle="The specific problem Sprint 1 solves, key decisions, and what we're explicitly not building yet."
        />

        {/* Problem statement */}
        <div style={s.problemStatement}>
          <div style={s.problemStatementBar} />
          <div>
            <h3 style={{ fontSize: typography.fontSize.xl, fontWeight: typography.fontWeight.bold, color: colors.neutral[900], marginBottom: spacing[2] }}>
              The spreadsheet is breaking the team.
            </h3>
            <p style={{ fontSize: typography.fontSize.base, color: colors.neutral[600], lineHeight: typography.lineHeight.relaxed }}>
              Alex's team manages patient orders in a massive Excel sheet with hidden lookup tables, fragile formulas,
              and no validation. One wrong field cascades errors everywhere. Sprint 1 replaces the core data entry flow
              with a structured, guided wizard that auto-populates pricing from a real product catalog.
            </p>
          </div>
        </div>

        {/* Key decisions */}
        <div style={s.subsection}>
          <h3 style={s.subsectionTitle}>Key decisions</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: spacing[4] }}>
            {DECISIONS.map((d) => (
              <div key={d.title} className="home-card" style={s.decisionCard}>
                <span style={{ fontSize: '28px', marginBottom: spacing[3], display: 'block' }}>{d.icon}</span>
                <h4 style={{ fontSize: typography.fontSize.md, fontWeight: typography.fontWeight.semibold, color: colors.neutral[900], marginBottom: spacing[2] }}>{d.title}</h4>
                <p style={{ fontSize: typography.fontSize.sm, color: colors.neutral[500], lineHeight: typography.lineHeight.normal }}>{d.rationale}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Scope boundary */}
        <div style={s.subsection}>
          <h3 style={s.subsectionTitle}>Scope boundary</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing[6] }}>
            <div>
              <div style={{ ...s.scopeHeader, color: colors.success[600] }}>Building in Sprint 1</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[2] }}>
                {BUILDING.map((item) => (
                  <div key={item} style={s.scopeItem}>
                    <span style={{ color: colors.success[500], fontWeight: typography.fontWeight.bold, fontSize: '16px' }}>&#10003;</span>
                    <span style={{ fontSize: typography.fontSize.sm, color: colors.neutral[700] }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div style={{ ...s.scopeHeader, color: colors.neutral[400] }}>Not building yet</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[2] }}>
                {NOT_BUILDING.map((item) => (
                  <div key={item} style={s.scopeItem}>
                    <span style={{ color: colors.neutral[400], fontWeight: typography.fontWeight.bold, fontSize: '16px' }}>&#10007;</span>
                    <span style={{ fontSize: typography.fontSize.sm, color: colors.neutral[400] }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 3: PROTOTYPE WALKTHROUGH ── */}
      <section style={s.section}>
        <SectionHeader
          label="SECTION 3"
          title="Prototype Walkthrough"
          subtitle="A clickable prototype of Sprint 1's order entry flow. See how this improves the team's workflow."
        />

        <div style={s.protoCard}>
          <div style={s.protoPreview}>
            <div style={s.protoDots}>
              <span style={{ ...s.protoDot, background: '#FF5F56' }} />
              <span style={{ ...s.protoDot, background: '#FFBD2E' }} />
              <span style={{ ...s.protoDot, background: '#27C93F' }} />
              <span style={{ marginLeft: spacing[3], fontSize: typography.fontSize.xs, color: colors.neutral[400], fontFamily: typography.fontFamily.mono }}>
                localhost:3000/app
              </span>
            </div>
            <div style={s.protoBody}>
              <div style={{ display: 'flex', gap: spacing[4], flexWrap: 'wrap', justifyContent: 'center' }}>
                {['Patient Info Entry', 'Product Selection', 'Insurance Lookup', 'Measurement Upload', 'Order Summary'].map((flow) => (
                  <div key={flow} style={s.flowChip}>{flow}</div>
                ))}
              </div>
              <p style={{ fontSize: typography.fontSize.base, color: colors.neutral[500], textAlign: 'center', marginTop: spacing[6], lineHeight: typography.lineHeight.normal }}>
                Walk through the complete order creation flow: enter patient details, select products with auto-pricing,
                attach measurement forms, and review before submission.
              </p>
            </div>
          </div>
          <div style={{ textAlign: 'center', marginTop: spacing[6] }}>
            <HoverButton to="/app" primary>Launch Prototype &#8594;</HoverButton>
          </div>
        </div>
      </section>

      {/* ── SECTION 4: HOW I USED AI ── */}
      <section style={{ ...s.section, background: colors.neutral[50] }}>
        <SectionHeader
          label="SECTION 4"
          title="How I Used AI Tools"
          subtitle="Every step of this challenge was augmented by AI. Here's what I used and how."
        />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: spacing[4] }}>
          {AI_TOOLS.map((tool) => (
            <div key={tool.name} className="home-card" style={s.toolCard}>
              <div style={{ ...s.toolDot, background: tool.color }} />
              <h4 style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.bold, color: colors.neutral[900], marginBottom: spacing[2] }}>
                {tool.name}
              </h4>
              <p style={{ fontSize: typography.fontSize.sm, color: colors.neutral[500], lineHeight: typography.lineHeight.normal }}>
                {tool.desc}
              </p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: spacing[10] }}>
          <p style={{ fontSize: typography.fontSize.base, color: colors.neutral[500], marginBottom: spacing[4] }}>
            Every action was logged in real-time. See the full timeline with screenshots and reasoning.
          </p>
          <HoverButton to="/replay">See Full Replay &#8594;</HoverButton>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={s.footer}>
        <div style={s.footerInner}>
          <span style={{ fontSize: typography.fontSize.sm, color: colors.neutral[400] }}>
            Built with an AI-augmented workflow
          </span>
          <div style={{ display: 'flex', gap: spacing[4] }}>
            <Link to="/app" style={s.footerLink}>Prototype</Link>
            <Link to="/replay" style={s.footerLink}>Replay</Link>
            <Link to="/library" style={s.footerLink}>Library</Link>
            <Link to="/design-system" style={s.footerLink}>Design System</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

// ─── Styles ──────────────────────────────────────────────────

const s: Record<string, CSSProperties> = {
  page: {
    minHeight: '100vh',
    background: colors.surface.page,
    color: colors.neutral[900],
    fontFamily: typography.fontFamily.body,
  },

  // Top Nav
  topNav: {
    position: 'sticky' as const,
    top: 0,
    zIndex: 50,
    background: 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    borderBottom: `1px solid ${colors.neutral[200]}`,
    padding: `${spacing[3]} ${spacing[6]}`,
  },
  topNavInner: {
    maxWidth: '1100px',
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topNavBrand: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[2],
    textDecoration: 'none',
  },
  topNavLogo: {
    width: '32px',
    height: '32px',
    borderRadius: radii.lg,
    background: `linear-gradient(135deg, ${colors.primary[500]}, ${colors.primary[600]})`,
    color: '#FFFFFF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: typography.fontFamily.display,
    fontWeight: typography.fontWeight.bold,
    fontSize: typography.fontSize.sm,
  },
  topNavBrandName: {
    fontFamily: typography.fontFamily.display,
    fontWeight: typography.fontWeight.bold,
    fontSize: typography.fontSize.base,
    color: colors.neutral[900],
  },
  topNavLinks: {
    display: 'flex',
    gap: spacing[1],
  },
  topNavLink: {
    padding: `${spacing[2]} ${spacing[3]}`,
    borderRadius: radii.md,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.neutral[600],
    textDecoration: 'none',
    transition: 'all 0.15s ease',
  },

  // Hero
  hero: {
    position: 'relative',
    overflow: 'hidden',
    padding: `${spacing[16]} ${spacing[6]} ${spacing[16]}`,
  },
  heroInner: {
    position: 'relative',
    zIndex: 1,
    maxWidth: '720px',
    margin: '0 auto',
    textAlign: 'center',
  },
  heroBadge: {
    display: 'inline-block',
    padding: `${spacing[1]} ${spacing[4]}`,
    borderRadius: radii.full,
    background: colors.primary[50],
    color: colors.primary[600],
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    letterSpacing: typography.letterSpacing.wider,
    textTransform: 'uppercase' as const,
    marginBottom: spacing[5],
    border: `1px solid ${colors.primary[200]}`,
  },
  heroTitle: {
    fontFamily: typography.fontFamily.display,
    fontSize: 'clamp(2rem, 5vw, 3rem)',
    fontWeight: typography.fontWeight.bold,
    letterSpacing: typography.letterSpacing.tight,
    lineHeight: typography.lineHeight.tight,
    color: colors.neutral[900],
    marginBottom: spacing[4],
  },
  heroSubtitle: {
    fontSize: typography.fontSize.lg,
    lineHeight: typography.lineHeight.relaxed,
    color: colors.neutral[500],
    maxWidth: '560px',
    margin: '0 auto',
  },
  heroActions: {
    display: 'flex',
    gap: spacing[3],
    justifyContent: 'center',
    marginTop: spacing[8],
    flexWrap: 'wrap' as const,
  },
  heroBlob: {
    position: 'absolute' as const,
    top: '-10%',
    right: '-5%',
    width: '400px',
    height: '400px',
    borderRadius: '50%',
    background: `radial-gradient(circle, ${colors.primary[100]}80 0%, transparent 70%)`,
    pointerEvents: 'none' as const,
    zIndex: 0,
  },
  heroBlob2: {
    position: 'absolute' as const,
    bottom: '-15%',
    left: '-5%',
    width: '300px',
    height: '300px',
    borderRadius: '50%',
    background: `radial-gradient(circle, ${colors.accent[100]}60 0%, transparent 70%)`,
    pointerEvents: 'none' as const,
    zIndex: 0,
  },

  // Buttons
  btnPrimary: {
    display: 'inline-block',
    padding: `${spacing[3]} ${spacing[6]}`,
    background: colors.accent[500],
    color: '#FFFFFF',
    textDecoration: 'none',
    borderRadius: radii.lg,
    fontWeight: typography.fontWeight.semibold,
    fontSize: typography.fontSize.base,
    transition: 'all 0.2s ease',
    border: 'none',
    boxShadow: shadows.sm,
  },
  btnSecondary: {
    display: 'inline-block',
    padding: `${spacing[3]} ${spacing[6]}`,
    background: 'transparent',
    color: colors.primary[500],
    textDecoration: 'none',
    borderRadius: radii.lg,
    fontWeight: typography.fontWeight.semibold,
    fontSize: typography.fontSize.base,
    border: `1px solid ${colors.primary[200]}`,
    transition: 'all 0.2s ease',
  },

  // Sections
  section: {
    padding: `${spacing[16]} ${spacing[6]}`,
    maxWidth: '1080px',
    margin: '0 auto',
  },
  sectionLabel: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    color: colors.primary[500],
    letterSpacing: typography.letterSpacing.widest,
    textTransform: 'uppercase' as const,
    marginBottom: spacing[2],
  },
  sectionTitle: {
    fontFamily: typography.fontFamily.display,
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral[900],
    letterSpacing: typography.letterSpacing.tight,
    marginBottom: spacing[3],
  },
  sectionSubtitle: {
    fontSize: typography.fontSize.md,
    color: colors.neutral[500],
    lineHeight: typography.lineHeight.relaxed,
    maxWidth: '600px',
    margin: '0 auto',
  },

  // Subsections
  subsection: {
    marginBottom: spacing[12],
  },
  subsectionTitle: {
    fontFamily: typography.fontFamily.display,
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral[800],
    marginBottom: spacing[2],
  },
  subsectionDesc: {
    fontSize: typography.fontSize.base,
    color: colors.neutral[500],
    lineHeight: typography.lineHeight.normal,
    marginBottom: spacing[5],
  },

  // Problem cards
  problemCard: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: spacing[4],
    padding: spacing[4],
    background: colors.surface.card,
    borderRadius: radii.lg,
    border: `1px solid ${colors.neutral[150]}`,
    boxShadow: shadows.xs,
    transition: 'all 0.2s ease',
    cursor: 'default',
  },
  problemRank: {
    width: '36px',
    height: '36px',
    borderRadius: radii.md,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: typography.fontWeight.bold,
    fontSize: typography.fontSize.base,
    flexShrink: 0,
  },
  severityBadge: {
    padding: `2px ${spacing[2]}`,
    borderRadius: radii.full,
    fontSize: '11px',
    fontWeight: typography.fontWeight.medium,
    flexShrink: 0,
  },

  // Customer journey — empathy map
  journeyMap: {
    borderRadius: radii.xl,
    border: `1px solid ${colors.neutral[200]}`,
    overflow: 'hidden',
  },
  journeyHeaderRow: {
    display: 'flex',
    gap: spacing[3],
    padding: `${spacing[3]} ${spacing[4]}`,
    background: colors.neutral[100],
    borderBottom: `1px solid ${colors.neutral[200]}`,
    alignItems: 'center',
  },
  journeyHeaderCell: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral[400],
    textTransform: 'uppercase' as const,
    letterSpacing: typography.letterSpacing.wider,
    fontFamily: typography.fontFamily.body,
  },
  journeyRow: {
    display: 'flex',
    gap: spacing[3],
    padding: `${spacing[3]} ${spacing[4]}`,
    alignItems: 'center',
    borderBottom: `1px solid ${colors.neutral[100]}`,
    transition: 'background 0.15s ease',
  },

  // Sprint cards
  sprintGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: spacing[4],
  },
  sprintCard: {
    padding: spacing[5],
    borderRadius: radii.xl,
    border: '1px solid',
    boxShadow: shadows.sm,
    transition: 'all 0.2s ease',
    cursor: 'default',
  },
  sprintNum: {
    display: 'inline-block',
    padding: `${spacing[1]} ${spacing[3]}`,
    borderRadius: radii.full,
    color: '#FFFFFF',
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    letterSpacing: typography.letterSpacing.wide,
  },

  // Sprint 1 deep dive
  problemStatement: {
    display: 'flex',
    gap: spacing[5],
    padding: spacing[6],
    background: colors.surface.card,
    borderRadius: radii.xl,
    boxShadow: shadows.md,
    marginBottom: spacing[10],
  },
  problemStatementBar: {
    width: '4px',
    borderRadius: radii.full,
    background: `linear-gradient(180deg, ${colors.primary[500]}, ${colors.accent[500]})`,
    flexShrink: 0,
  },
  decisionCard: {
    padding: spacing[5],
    background: colors.surface.card,
    borderRadius: radii.xl,
    border: `1px solid ${colors.neutral[150]}`,
    boxShadow: shadows.sm,
    transition: 'all 0.2s ease',
    cursor: 'default',
  },

  // Scope
  scopeHeader: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    letterSpacing: typography.letterSpacing.wide,
    textTransform: 'uppercase' as const,
    marginBottom: spacing[4],
  },
  scopeItem: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[3],
  },

  // Prototype section
  protoCard: {
    maxWidth: '720px',
    margin: '0 auto',
  },
  protoPreview: {
    background: colors.neutral[900],
    borderRadius: radii.xl,
    overflow: 'hidden',
    boxShadow: shadows.xl,
  },
  protoDots: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[2],
    padding: `${spacing[3]} ${spacing[4]}`,
    borderBottom: `1px solid ${colors.neutral[800]}`,
  },
  protoDot: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    display: 'inline-block',
  },
  protoBody: {
    padding: `${spacing[8]} ${spacing[6]}`,
  },
  flowChip: {
    padding: `${spacing[2]} ${spacing[4]}`,
    background: 'rgba(79, 106, 232, 0.15)',
    color: colors.primary[300],
    borderRadius: radii.full,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    border: `1px solid rgba(79, 106, 232, 0.25)`,
  },

  // AI tools
  toolCard: {
    padding: spacing[6],
    background: colors.surface.card,
    borderRadius: radii.xl,
    border: `1px solid ${colors.neutral[150]}`,
    boxShadow: shadows.sm,
    transition: 'all 0.2s ease',
    cursor: 'default',
  },
  toolDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    marginBottom: spacing[4],
  },

  // Footer
  footer: {
    borderTop: `1px solid ${colors.neutral[200]}`,
    padding: `${spacing[6]} ${spacing[6]}`,
    background: colors.surface.card,
  },
  footerInner: {
    maxWidth: '1080px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap' as const,
    gap: spacing[4],
  },
  footerLink: {
    fontSize: typography.fontSize.sm,
    color: colors.neutral[400],
    textDecoration: 'none',
    transition: 'color 0.2s',
  },
};
