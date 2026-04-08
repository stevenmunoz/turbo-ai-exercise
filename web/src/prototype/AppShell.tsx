import { type ReactNode, useState } from 'react';
import { colors, typography, spacing, radii, layout, transitions } from '@/shared/design-tokens';
import './prototype.css';

type View = 'dashboard' | 'new-order' | 'orders' | 'products' | 'fee-schedules' | 'vendors';

interface NavItemDef {
  id: View | string;
  icon: string;
  label: string;
  badge?: number;
}

const navGroups: { label: string; items: NavItemDef[] }[] = [
  {
    label: 'ORDERS',
    items: [
      { id: 'dashboard', icon: '📋', label: 'Dashboard' },
      { id: 'new-order', icon: '📝', label: 'New Order' },
      { id: 'orders', icon: '📦', label: 'All Orders' },
      { id: 'approvals', icon: '⏳', label: 'Pending Approval', badge: 3 },
    ],
  },
  {
    label: 'BILLING',
    items: [
      { id: 'fee-schedules', icon: '💰', label: 'Fee Schedules' },
      { id: 'invoices', icon: '📄', label: 'Invoices' },
      { id: 'payments', icon: '💳', label: 'Payments' },
    ],
  },
  {
    label: 'CATALOG',
    items: [
      { id: 'products', icon: '🏷️', label: 'Products' },
      { id: 'vendors', icon: '🏭', label: 'Vendors' },
    ],
  },
];

// ── Nav item (matches design system exactly) ──────────────────
function SidebarNavItem({
  icon,
  label,
  active,
  badge,
  onClick,
}: {
  icon: string;
  label: string;
  active?: boolean;
  badge?: number;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  const baseStyle: React.CSSProperties = {
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
    border: 'none',
    background: 'transparent',
    width: '100%',
    textAlign: 'left' as const,
    fontFamily: typography.fontFamily.body,
  };

  const activeStyle: React.CSSProperties = active
    ? {
        background: `linear-gradient(135deg, rgba(79, 106, 232, 0.18), rgba(79, 106, 232, 0.10))`,
        color: colors.neutral[0],
        fontWeight: typography.fontWeight.semibold,
        boxShadow: 'inset 3px 0 0 0 #4F6AE8',
      }
    : {};

  const hoverStyle: React.CSSProperties =
    hovered && !active
      ? { backgroundColor: 'rgba(255, 255, 255, 0.07)', color: '#E2E8F0' }
      : hovered && active
        ? { background: 'linear-gradient(135deg, rgba(79, 106, 232, 0.24), rgba(79, 106, 232, 0.14))' }
        : {};

  return (
    <button
      style={{ ...baseStyle, ...activeStyle, ...hoverStyle }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span
        style={{
          fontSize: '1rem',
          width: '20px',
          textAlign: 'center' as const,
          flexShrink: 0,
          opacity: active || hovered ? 1 : 0.75,
          transition: `opacity ${transitions.fast}`,
        }}
      >
        {icon}
      </span>
      <span
        style={{
          fontSize: typography.fontSize.sm,
          color: active ? colors.neutral[0] : hovered ? '#E2E8F0' : colors.neutral[300],
          fontWeight: active ? typography.fontWeight.semibold : typography.fontWeight.medium,
        }}
      >
        {label}
      </span>
      {badge != null && (
        <span style={s.badge}>{badge}</span>
      )}
    </button>
  );
}

// ── AppShell ──────────────────────────────────────────────────
interface AppShellProps {
  activeView: View;
  onNavigate: (view: View) => void;
  children: ReactNode;
}

export function AppShell({ activeView, onNavigate, children }: AppShellProps) {
  return (
    <div className="medflow-app" style={s.shell}>
      {/* ── Sidebar ─────────────────────────────── */}
      <aside style={s.sidebar}>
        {/* Brand */}
        <div style={s.brand}>
          <div style={s.logo}>M</div>
          <div>
            <div style={s.brandName}>MedFlow</div>
            <div style={s.brandSub}>Order Management</div>
          </div>
        </div>

        <div style={s.divider} />

        {/* Nav groups */}
        <nav style={s.nav}>
          {navGroups.map((group) => (
            <div key={group.label} style={s.navGroup}>
              <div style={s.groupLabel}>{group.label}</div>
              {group.items.map((item) => (
                <SidebarNavItem
                  key={item.id}
                  icon={item.icon}
                  label={item.label}
                  badge={item.badge}
                  active={activeView === item.id}
                  onClick={() => onNavigate(item.id as View)}
                />
              ))}
            </div>
          ))}
        </nav>

        {/* Bottom */}
        <div style={{ flex: 1 }} />
        <div style={s.divider} />
        <SidebarNavItem icon="⚙️" label="Settings" onClick={() => {}} />
        <SidebarNavItem icon="❓" label="Help" onClick={() => {}} />

        {/* User */}
        <div style={s.divider} />
        <div style={s.userSection}>
          <div style={s.avatar}>MG</div>
          <div>
            <div style={s.userName}>Maria Garcia</div>
            <div style={s.userRole}>Order Specialist</div>
          </div>
        </div>
      </aside>

      {/* ── Main content ────────────────────────── */}
      <main style={s.main}>
        {children}
      </main>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  shell: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: colors.surface.page,
    fontFamily: typography.fontFamily.body,
  },

  // Sidebar
  sidebar: {
    width: layout.sidebarWidth,
    flexShrink: 0,
    backgroundColor: colors.surface.sidebar,
    display: 'flex',
    flexDirection: 'column',
    padding: `${spacing[5]} ${spacing[3]}`,
    position: 'fixed',
    top: 0,
    left: 0,
    bottom: 0,
    zIndex: 10,
    overflowY: 'auto',
    borderRight: '1px solid rgba(255,255,255,0.04)',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[3],
    padding: `0 ${spacing[2]}`,
    marginBottom: spacing[4],
  },
  logo: {
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
  brandName: {
    fontFamily: typography.fontFamily.display,
    fontWeight: typography.fontWeight.bold,
    fontSize: typography.fontSize.base,
    color: colors.neutral[0],
  },
  brandSub: {
    fontSize: typography.fontSize.xs,
    color: colors.neutral[500],
  },
  divider: {
    height: '1px',
    backgroundColor: colors.neutral[800],
    margin: `${spacing[2]} ${spacing[2]}`,
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
  },
  navGroup: {
    marginBottom: spacing[4],
  },
  groupLabel: {
    fontSize: '10px',
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral[500],
    letterSpacing: typography.letterSpacing.widest,
    padding: `0 ${spacing[3]} ${spacing[1]}`,
  },
  badge: {
    marginLeft: 'auto',
    fontSize: '10px',
    fontWeight: typography.fontWeight.bold,
    backgroundColor: colors.accent[500],
    color: '#fff',
    borderRadius: radii.full,
    padding: '2px 8px',
    lineHeight: '14px',
    boxShadow: '0 1px 4px rgba(249, 115, 22, 0.3)',
  },

  // User section
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[3],
    padding: `${spacing[3]} ${spacing[3]}`,
    borderRadius: radii.lg,
    margin: `0 ${spacing[1]}`,
  },
  avatar: {
    width: '34px',
    height: '34px',
    borderRadius: radii.full,
    background: `linear-gradient(135deg, ${colors.primary[400]}, ${colors.accent[400]})`,
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: typography.fontFamily.display,
    fontWeight: typography.fontWeight.bold,
    fontSize: typography.fontSize.xs,
    flexShrink: 0,
    boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
  },
  userName: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral[200],
  },
  userRole: {
    fontSize: '10px',
    color: colors.neutral[500],
    letterSpacing: typography.letterSpacing.wide,
  },

  // Main
  main: {
    flex: 1,
    marginLeft: layout.sidebarWidth,
    minHeight: '100vh',
    overflowX: 'hidden',
  },
};
