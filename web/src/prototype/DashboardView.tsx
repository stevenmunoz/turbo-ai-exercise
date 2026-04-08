import { useState, useMemo } from 'react';
import {
  colors,
  typography,
  spacing,
  radii,
  borders,
  shadows,
  transitions,
} from '@/shared/design-tokens';
import {
  sampleOrders,
  statusConfig,
  type OrderStatus,
} from '@/shared/mock-data';

// ─── Types ─────────────────────────────────────────────────
interface DashboardViewProps {
  onNewOrder: () => void;
  onViewOrder: (orderId: string) => void;
}

// ─── Helpers ───────────────────────────────────────────────
function formatCurrency(n: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function todayFormatted(): string {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// Mini sparkline SVG (deterministic from seed values)
function Sparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 80;
  const h = 32;
  const pts = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / range) * (h - 4) - 2;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none">
      <polyline
        points={pts}
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <linearGradient id={`grad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={color} stopOpacity="0.2" />
        <stop offset="100%" stopColor={color} stopOpacity="0" />
      </linearGradient>
      <polygon
        points={`0,${h} ${pts} ${w},${h}`}
        fill={`url(#grad-${color.replace('#', '')})`}
      />
    </svg>
  );
}

// ─── Status filter chips ───────────────────────────────────
const ALL_STATUSES: (OrderStatus | 'all')[] = [
  'all',
  'draft',
  'pending_approval',
  'approved',
  'ordered',
  'shipped',
  'delivered',
  'cancelled',
];

// ─── Component ─────────────────────────────────────────────
export function DashboardView({ onNewOrder, onViewOrder }: DashboardViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');

  // KPI computations
  const activeCount = sampleOrders.filter(
    (o) => o.status !== 'delivered' && o.status !== 'cancelled',
  ).length;

  const pendingCount = sampleOrders.filter(
    (o) => o.status === 'pending_approval',
  ).length;

  const revenueMTD = sampleOrders.reduce((s, o) => s + o.totalBillable, 0);

  const shippedToday = sampleOrders.filter(
    (o) => o.status === 'shipped',
  ).length;

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return sampleOrders.filter((o) => {
      const matchesStatus =
        statusFilter === 'all' || o.status === statusFilter;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        o.id.toLowerCase().includes(q) ||
        o.patientName.toLowerCase().includes(q) ||
        o.insuranceProvider.toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [searchQuery, statusFilter]);

  // KPI card definitions
  const kpis = [
    {
      icon: '📦',
      value: activeCount,
      label: 'Active Orders',
      change: '+12%',
      up: true,
      sparkData: [3, 5, 4, 7, 6, 8, activeCount],
      color: colors.primary[500],
    },
    {
      icon: '⏳',
      value: pendingCount,
      label: 'Pending Approvals',
      change: '-8%',
      up: false,
      sparkData: [5, 4, 6, 3, 4, 2, pendingCount],
      color: colors.warning[500],
    },
    {
      icon: '💰',
      value: formatCurrency(revenueMTD),
      label: 'Revenue MTD',
      change: '+23%',
      up: true,
      sparkData: [400, 600, 550, 800, 750, 1200, revenueMTD / 100],
      color: colors.success[500],
    },
    {
      icon: '🚚',
      value: shippedToday,
      label: 'Shipped Today',
      change: '+5%',
      up: true,
      sparkData: [1, 0, 2, 1, 3, 2, shippedToday],
      color: colors.accent[500],
    },
  ];

  return (
    <div style={{ padding: spacing[8], maxWidth: '1200px', margin: '0 auto' }}>
      {/* ── Welcome Header ─────────────────────────── */}
      <div
        className="animate-fade-in-up"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: spacing[8],
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: typography.fontFamily.display,
              fontSize: typography.fontSize['3xl'],
              fontWeight: typography.fontWeight.bold,
              color: colors.neutral[900],
              lineHeight: typography.lineHeight.tight,
              letterSpacing: typography.letterSpacing.tight,
              margin: 0,
            }}
          >
            {getGreeting()}, Maria
          </h1>
          <p
            style={{
              fontFamily: typography.fontFamily.body,
              fontSize: typography.fontSize.base,
              color: colors.neutral[500],
              marginTop: spacing[1],
              margin: 0,
              marginBlockStart: spacing[1],
            }}
          >
            {todayFormatted()}
          </p>
        </div>
        <button
          onClick={onNewOrder}
          style={{
            width: 'auto',
            display: 'inline-flex',
            alignItems: 'center',
            gap: spacing[2],
            padding: `${spacing[3]} ${spacing[6]}`,
            background: colors.primary[500],
            color: '#FFFFFF',
            border: 'none',
            borderRadius: radii.lg,
            fontFamily: typography.fontFamily.display,
            fontSize: typography.fontSize.base,
            fontWeight: typography.fontWeight.semibold,
            cursor: 'pointer',
            boxShadow: `0 2px 8px rgba(79, 106, 232, 0.3)`,
            transition: transitions.smooth,
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background =
              colors.primary[600];
            (e.currentTarget as HTMLButtonElement).style.transform =
              'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background =
              colors.primary[500];
            (e.currentTarget as HTMLButtonElement).style.transform =
              'translateY(0)';
          }}
        >
          <span style={{ fontSize: '1.1rem' }}>＋</span>
          New Order
        </button>
      </div>

      {/* ── KPI Cards ──────────────────────────────── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: spacing[4],
          marginBottom: spacing[8],
        }}
      >
        {kpis.map((kpi, i) => (
          <div
            key={kpi.label}
            className={`kpi-card animate-fade-in-up delay-${i + 1}`}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: spacing[3],
              }}
            >
              <span style={{ fontSize: '1.5rem' }}>{kpi.icon}</span>
              <Sparkline data={kpi.sparkData} color={kpi.color} />
            </div>
            <div
              style={{
                fontFamily: typography.fontFamily.display,
                fontSize: typography.fontSize['4xl'],
                fontWeight: typography.fontWeight.bold,
                color: colors.neutral[900],
                lineHeight: typography.lineHeight.tight,
                letterSpacing: typography.letterSpacing.tight,
              }}
            >
              {kpi.value}
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: spacing[1],
              }}
            >
              <span
                style={{
                  fontFamily: typography.fontFamily.body,
                  fontSize: typography.fontSize.sm,
                  color: colors.neutral[500],
                }}
              >
                {kpi.label}
              </span>
              <span
                style={{
                  fontFamily: typography.fontFamily.body,
                  fontSize: typography.fontSize.xs,
                  fontWeight: typography.fontWeight.medium,
                  color: kpi.up ? colors.success[600] : colors.danger[500],
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '2px',
                }}
              >
                {kpi.up ? '↑' : '↓'} {kpi.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Quick Actions Strip ────────────────────── */}
      <div
        style={{
          display: 'flex',
          gap: spacing[3],
          marginBottom: spacing[4],
        }}
      >
        {['Export CSV', 'Print Report', 'Filter by Vendor'].map((label) => (
          <button
            key={label}
            style={{
              width: 'auto',
              padding: `${spacing[1]} ${spacing[4]}`,
              background: colors.neutral[50],
              border: borders.light,
              borderRadius: radii.md,
              fontFamily: typography.fontFamily.body,
              fontSize: typography.fontSize.xs,
              fontWeight: typography.fontWeight.medium,
              color: colors.neutral[600],
              cursor: 'pointer',
              transition: transitions.fast,
              display: 'inline-flex',
              alignItems: 'center',
              gap: spacing[1],
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                colors.neutral[100];
              (e.currentTarget as HTMLButtonElement).style.color =
                colors.neutral[800];
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                colors.neutral[50];
              (e.currentTarget as HTMLButtonElement).style.color =
                colors.neutral[600];
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Orders Table Container ─────────────────── */}
      <div
        className="animate-fade-in-up delay-5"
        style={{
          background: colors.surface.card,
          borderRadius: radii.xl,
          border: borders.light,
          boxShadow: shadows.sm,
          overflow: 'hidden',
        }}
      >
        {/* Search & Filter Bar */}
        <div
          style={{
            padding: `${spacing[5]} ${spacing[6]}`,
            borderBottom: borders.light,
            display: 'flex',
            alignItems: 'center',
            gap: spacing[4],
            flexWrap: 'wrap',
          }}
        >
          <h2
            style={{
              fontFamily: typography.fontFamily.display,
              fontSize: typography.fontSize.lg,
              fontWeight: typography.fontWeight.semibold,
              color: colors.neutral[900],
              margin: 0,
              marginRight: 'auto',
            }}
          >
            Recent Orders
          </h2>

          {/* Search */}
          <div style={{ position: 'relative' }}>
            <span
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: colors.neutral[400],
                fontSize: typography.fontSize.sm,
                pointerEvents: 'none',
              }}
            >
              🔍
            </span>
            <input
              className="medflow-input"
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '220px',
                paddingLeft: '36px',
                fontSize: typography.fontSize.sm,
              }}
            />
          </div>
        </div>

        {/* Status Filter Chips */}
        <div
          style={{
            padding: `${spacing[3]} ${spacing[6]}`,
            borderBottom: borders.light,
            display: 'flex',
            gap: spacing[2],
            flexWrap: 'wrap',
            alignItems: 'center',
          }}
        >
          {ALL_STATUSES.map((s) => {
            const isActive = statusFilter === s;
            const cfg = s !== 'all' ? statusConfig[s as OrderStatus] : null;
            const label = s === 'all' ? 'All' : cfg!.label;
            return (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                style={{
                  width: 'auto',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '7px',
                  padding: '7px 14px',
                  borderRadius: radii.full,
                  border: isActive
                    ? `1.5px solid ${s === 'all' ? colors.primary[500] : cfg!.dot}`
                    : `1px solid ${colors.neutral[200]}`,
                  background: isActive
                    ? s === 'all' ? colors.primary[50] : cfg!.bg
                    : colors.neutral[0],
                  color: isActive
                    ? s === 'all' ? colors.primary[700] : cfg!.color
                    : colors.neutral[500],
                  fontSize: typography.fontSize.sm,
                  fontWeight: isActive ? typography.fontWeight.semibold : typography.fontWeight.medium,
                  fontFamily: typography.fontFamily.body,
                  cursor: 'pointer',
                  transition: 'all 0.18s ease',
                  whiteSpace: 'nowrap',
                  lineHeight: '1',
                }}
              >
                {cfg && (
                  <span
                    style={{
                      width: '7px',
                      height: '7px',
                      borderRadius: '50%',
                      background: isActive ? cfg.dot : cfg.dot,
                      opacity: isActive ? 1 : 0.6,
                      display: 'inline-block',
                      flexShrink: 0,
                    }}
                  />
                )}
                {label}
              </button>
            );
          })}
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table
            className="medflow-table"
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontFamily: typography.fontFamily.body,
              fontSize: typography.fontSize.sm,
            }}
          >
            <thead>
              <tr
                style={{
                  borderBottom: borders.light,
                  background: colors.neutral[50],
                }}
              >
                {[
                  'Order #',
                  'Patient',
                  'Products',
                  'Status',
                  'Amount',
                  'Date',
                  '',
                ].map((col) => (
                  <th
                    key={col}
                    style={{
                      padding: `${spacing[3]} ${spacing[4]}`,
                      textAlign: 'left',
                      fontWeight: typography.fontWeight.medium,
                      color: colors.neutral[500],
                      fontSize: typography.fontSize.xs,
                      letterSpacing: typography.letterSpacing.wider,
                      textTransform: 'uppercase' as const,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => {
                const sc = statusConfig[order.status];
                const firstProduct = order.lineItems[0];
                const extraCount = order.lineItems.length - 1;
                return (
                  <tr
                    key={order.id}
                    style={{
                      borderBottom: borders.light,
                      cursor: 'pointer',
                    }}
                    onClick={() => onViewOrder(order.id)}
                  >
                    {/* Order # */}
                    <td
                      style={{
                        padding: `${spacing[4]}`,
                        fontFamily: typography.fontFamily.mono,
                        fontSize: typography.fontSize.sm,
                        fontWeight: typography.fontWeight.medium,
                        color: colors.primary[600],
                      }}
                    >
                      {order.id}
                    </td>

                    {/* Patient */}
                    <td
                      style={{
                        padding: `${spacing[4]}`,
                        color: colors.neutral[800],
                        fontWeight: typography.fontWeight.medium,
                      }}
                    >
                      <div>{order.patientName}</div>
                      <div
                        style={{
                          fontSize: typography.fontSize.xs,
                          color: colors.neutral[400],
                          marginTop: '2px',
                        }}
                      >
                        {order.insuranceProvider || 'Self-Pay'}
                      </div>
                    </td>

                    {/* Products */}
                    <td
                      style={{
                        padding: `${spacing[4]}`,
                        color: colors.neutral[700],
                        maxWidth: '200px',
                      }}
                    >
                      <div
                        style={{
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {firstProduct?.productName}
                      </div>
                      {extraCount > 0 && (
                        <span
                          style={{
                            fontSize: typography.fontSize.xs,
                            color: colors.neutral[400],
                          }}
                        >
                          +{extraCount} more
                        </span>
                      )}
                    </td>

                    {/* Status */}
                    <td style={{ padding: `${spacing[4]}` }}>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: `${spacing[1]} ${spacing[3]}`,
                          borderRadius: radii.full,
                          background: sc.bg,
                          color: sc.color,
                          fontSize: typography.fontSize.xs,
                          fontWeight: typography.fontWeight.medium,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        <span
                          style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            background: sc.dot,
                            flexShrink: 0,
                          }}
                        />
                        {sc.label}
                      </span>
                    </td>

                    {/* Amount */}
                    <td
                      style={{
                        padding: `${spacing[4]}`,
                        fontFamily: typography.fontFamily.display,
                        fontWeight: typography.fontWeight.semibold,
                        color: colors.neutral[900],
                      }}
                    >
                      {formatCurrency(order.totalBillable)}
                    </td>

                    {/* Date */}
                    <td
                      style={{
                        padding: `${spacing[4]}`,
                        color: colors.neutral[500],
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {formatDate(order.createdAt)}
                    </td>

                    {/* Actions */}
                    <td
                      style={{
                        padding: `${spacing[4]}`,
                        textAlign: 'center',
                      }}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onViewOrder(order.id);
                        }}
                        style={{
                          width: 'auto',
                          padding: `${spacing[1]} ${spacing[2]}`,
                          background: 'transparent',
                          border: 'none',
                          borderRadius: radii.md,
                          cursor: 'pointer',
                          color: colors.neutral[400],
                          fontSize: typography.fontSize.md,
                          lineHeight: 1,
                          transition: transitions.fast,
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.background =
                            colors.neutral[100];
                          (e.currentTarget as HTMLButtonElement).style.color =
                            colors.neutral[700];
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.background =
                            'transparent';
                          (e.currentTarget as HTMLButtonElement).style.color =
                            colors.neutral[400];
                        }}
                      >
                        &middot;&middot;&middot;
                      </button>
                    </td>
                  </tr>
                );
              })}

              {filteredOrders.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    style={{
                      padding: spacing[12],
                      textAlign: 'center',
                      color: colors.neutral[400],
                      fontFamily: typography.fontFamily.body,
                      fontSize: typography.fontSize.base,
                    }}
                  >
                    No orders match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
