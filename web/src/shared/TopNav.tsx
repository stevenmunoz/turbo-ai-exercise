/**
 * Shared top navigation bar — used across all pages.
 */

import { Link, useLocation } from 'react-router-dom';
import { type CSSProperties } from 'react';
import {
  colors,
  typography,
  spacing,
  radii,
} from './design-tokens';

const NAV_LINKS = [
  { to: '/app', label: 'Prototype' },
  { to: '/replay', label: 'Replay' },
  { to: '/library', label: 'Library' },
  { to: '/design-system', label: 'Design System' },
];

export function TopNav() {
  const { pathname } = useLocation();

  return (
    <>
      <style>{`
        .top-nav-link:hover { background: ${colors.neutral[100]}; color: ${colors.primary[600]}; }
      `}</style>
      <nav style={s.topNav}>
        <div style={s.topNavInner}>
          <Link to="/" style={s.topNavBrand}>
            <span style={s.topNavLogo}>M</span>
            <span style={s.topNavBrandName}>MedFlow</span>
          </Link>
          <div style={s.topNavLinks}>
            {NAV_LINKS.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className="top-nav-link"
                style={{
                  ...s.topNavLink,
                  ...(pathname === to ? s.topNavLinkActive : {}),
                }}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </>
  );
}

const s: Record<string, CSSProperties> = {
  topNav: {
    position: 'sticky',
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
  topNavLinkActive: {
    background: colors.primary[50],
    color: colors.primary[600],
  },
};
