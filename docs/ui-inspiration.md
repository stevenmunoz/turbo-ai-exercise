# UI Inspiration — Order Management System

> Design references for building a modern, clean internal tool.
> We intentionally avoid typical medical software aesthetics.

---

## 1. Linear — Operations & Workflow Management

**Why it's relevant:** Best-in-class UI in modern SaaS. Pioneered the "Linear Design" trend: radical noise reduction, monochrome base, functional-only color.

### Design Patterns to Borrow

| Element | Pattern | Our Application |
|---------|---------|----------------|
| **Navigation** | Slim left sidebar, icon+label, collapsible | Product categories, order queues, customer lists |
| **Side panels** | Click row → detail panel on right, list stays visible | Click order → see line items, calculations, documents |
| **Color** | Monochrome base, status colors only (green/yellow/red) | Order status, payment status, stock levels |
| **Typography** | Inter Display headings, Inter body, bold hierarchy | Clean data-heavy screens that stay readable |
| **Spacing** | Consistent 8px grid | Uniform padding across all forms and tables |
| **Command palette** | Cmd+K for fast navigation | Jump to any order, customer, product |

**References:**
- [linear.app](https://linear.app)
- [How we redesigned the Linear UI](https://linear.app/now/how-we-redesigned-the-linear-ui)
- [Linear Design System (Figma)](https://www.figma.com/community/file/1222872653732371433/linear-design-system)

---

## 2. Retool — Internal Tools & Data-Heavy Interfaces

**Why it's relevant:** Purpose-built for CRUD operations, data tables, forms, and admin dashboards. Their component library is optimized for operations staff doing repetitive data entry at speed.

### Design Patterns to Borrow

| Element | Pattern | Our Application |
|---------|---------|----------------|
| **Master-detail** | Full-height table left, detail panel right | Order list → order detail with line items |
| **Table design** | No horizontal scroll, conditional row colors, expandable rows | Status-colored order rows, expand for items |
| **Form inputs** | 40+ types with built-in validation, currency auto-format | Price fields, quantity validation, insurance codes |
| **Multi-step forms** | Wizard with branching logic | Create order: customer → products → pricing → review |
| **Filtering** | Dropdown filter bars, combinable, saved presets | Filter by status, date, customer, product category |
| **Hide empty states** | Components with no data are hidden, not shown empty | Special instructions, backorder info only when relevant |

**References:**
- [Redesigned UI component library](https://retool.com/blog/redesigned-ui-component-library)
- [Table UX/UI best practices](https://community.retool.com/t/guide-table-component-ux-ui-best-practices-ui-tips-for-data-dashboards/42038)
- [Retool UI Kit (Figma)](https://www.figma.com/community/file/1266122775591593614/retool-ui-kit)

---

## 3. Ramp — Fintech Operations Dashboard

**Why it's relevant:** Structurally similar problem — complex financial data, multi-step approvals, document generation, and dashboards that operations teams live in all day. Among the cleanest fintech UIs.

### Design Patterns to Borrow

| Element | Pattern | Our Application |
|---------|---------|----------------|
| **Dashboard cards** | KPI grid at top, detailed table below | Today's orders, pending approval, backorders, revenue |
| **Status colors** | Green (approved), Red (error), Yellow (pending), Blue (info) | Order lifecycle: Draft → Pending → Approved → Shipped |
| **Multi-step forms** | Cascading flows, each step depends on prior | Customer lookup → product selection → pricing → submit |
| **Search-first** | Global search across all entities | Search orders, customers, products, SKUs from one input |
| **Confirmation patterns** | Toasts for success, modals for destructive actions | "Order submitted" toast, "Cancel order?" modal |

**References:**
- [ramp.com](https://ramp.com)
- [Ramp design case study (Bakken & Baeck)](https://bakkenbaeck.com/case/ramp)
- [Ramp UI screens (NicelyDone)](https://nicelydone.club/apps/ramp)

---

## Synthesis: Design System for Sprint 1

### Layout
- **Slim left sidebar** (240px expanded / 64px collapsed) with icon+label nav
- **Master-detail** as primary: table center, detail panel right
- **Card-based dashboard** landing with 4-6 KPI cards above the order table
- **No horizontal table scrolling** — ever

### Color Palette
- Near-monochrome base (slate grays)
- Five semantic colors: Success/Green, Error/Red, Warning/Yellow, Info/Blue, Primary/Brand
- Light mode default

### Typography
- Inter (or equivalent geometric sans-serif)
- 12px metadata, 14px body/table, 16px section headers, 20-24px page titles, 32px+ KPIs

### Spacing
- 8px base grid (8, 16, 24, 32, 48)
- 12-16px inside cards, 24px between sections

### Forms
- Multi-step wizard for order creation
- Inline validation with auto-formatting (currency, quantities)
- Smart defaults (pre-fill addresses, standard pricing)
- Conditional sections (show/hide based on order type)

### Tables
- Conditional row coloring by status (subtle tint)
- Expandable rows for line-item preview
- Action column with icon buttons (edit, duplicate, print)
- Saved filter presets (Today's Orders, Pending Approval, etc.)
- Currency right-aligned, dates as relative labels, status as chips
