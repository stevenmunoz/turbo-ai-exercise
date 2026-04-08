/**
 * MedFlow Sprint 1 — Mock Data
 * Products, fee schedules, vendors, and sample orders.
 */

export interface Vendor {
  id: string;
  name: string;
  email: string;
  portal: string;
}

export interface Product {
  id: string;
  name: string;
  hcpcsCode: string;
  category: ProductCategory;
  vendorId: string;
  unitCost: number;
  msrp: number;
  description: string;
  requiresMeasurement: boolean;
  requiresPriorAuth: boolean;
  sizes?: string[];
  imageUrl?: string;
}

export type ProductCategory =
  | 'Compression Garments'
  | 'Breast Prosthetics'
  | 'Surgical Supplies'
  | 'Lymphedema'
  | 'Night Garments'
  | 'Accessories';

export interface FeeSchedule {
  id: string;
  payerName: string;
  hcpcsCode: string;
  allowedAmount: number;
  multiplier: number;
  state: string;
}

export interface InsuranceProvider {
  id: string;
  name: string;
  shortName: string;
}

export type OrderStatus = 'draft' | 'pending_approval' | 'approved' | 'ordered' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderLineItem {
  productId: string;
  productName: string;
  hcpcsCode: string;
  vendor: string;
  quantity: number;
  size?: string;
  unitCost: number;
  billableAmount: number;
  patientResponsibility: number;
}

export interface Order {
  id: string;
  patientName: string;
  patientDOB: string;
  patientPhone: string;
  patientEmail: string;
  shippingAddress: string;
  insuranceProvider: string;
  policyNumber: string;
  groupNumber: string;
  isSelfPay: boolean;
  lineItems: OrderLineItem[];
  status: OrderStatus;
  totalBillable: number;
  totalVendorCost: number;
  margin: number;
  marginPercent: number;
  patientOwes: number;
  createdAt: string;
  createdBy: string;
  requiresApproval: boolean;
  notes: string;
}

// ─── Vendors ──────────────────────────────────────────────────
export const vendors: Vendor[] = [
  { id: 'medi', name: 'Medi USA', email: 'orders@mediusa.com', portal: 'portal.mediusa.com' },
  { id: 'juzo', name: 'Juzo', email: 'orders@juzo.com', portal: 'orders.juzo.com' },
  { id: 'sigvaris', name: 'Sigvaris', email: 'customercare@sigvaris.com', portal: 'pro.sigvaris.com' },
  { id: 'amoena', name: 'Amoena', email: 'orders@amoena.com', portal: 'portal.amoena.com' },
  { id: 'bsn', name: 'BSN Medical', email: 'orders@bsnmedical.com', portal: 'orders.bsn.com' },
  { id: 'solaris', name: 'Solaris', email: 'info@sfrmed.com', portal: 'sfrmed.com' },
];

// ─── Product Image Generator (gradient SVG thumbnails) ────────
/** Realistic product illustration SVGs */
const productImages: Record<string, string> = {
  // P1: Flat-Knit Compression Sleeve — beige arm sleeve
  p1: `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
    <rect width="200" height="200" rx="20" fill="#F8F7F5"/>
    <defs>
      <linearGradient id="sleeve" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#D4C4A8"/><stop offset="30%" stop-color="#E8DCCA"/>
        <stop offset="70%" stop-color="#E2D5C0"/><stop offset="100%" stop-color="#C9B896"/>
      </linearGradient>
      <linearGradient id="sleeveShade" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="rgba(0,0,0,0)" /><stop offset="100%" stop-color="rgba(0,0,0,0.06)" />
      </linearGradient>
    </defs>
    <ellipse cx="100" cy="178" rx="32" ry="4" fill="rgba(0,0,0,0.06)"/>
    <path d="M72 40 C70 40, 66 44, 65 52 L60 155 C60 162, 68 168, 78 170 L122 170 C132 168, 140 162, 140 155 L135 52 C134 44, 130 40, 128 40 Z" fill="url(#sleeve)" stroke="#C4B496" stroke-width="0.8"/>
    <path d="M72 40 C70 40, 66 44, 65 52 L60 155 C60 162, 68 168, 78 170 L122 170 C132 168, 140 162, 140 155 L135 52 C134 44, 130 40, 128 40 Z" fill="url(#sleeveShade)"/>
    <path d="M68 56 L132 56" stroke="#C9B896" stroke-width="0.5" opacity="0.5"/>
    <path d="M66 72 L134 72" stroke="#C9B896" stroke-width="0.5" opacity="0.4"/>
    <path d="M64 88 L136 88" stroke="#C9B896" stroke-width="0.5" opacity="0.4"/>
    <path d="M63 104 L137 104" stroke="#C9B896" stroke-width="0.5" opacity="0.3"/>
    <path d="M62 120 L138 120" stroke="#C9B896" stroke-width="0.5" opacity="0.3"/>
    <path d="M61 136 L139 136" stroke="#C9B896" stroke-width="0.5" opacity="0.3"/>
    <path d="M60 152 L140 152" stroke="#C9B896" stroke-width="0.5" opacity="0.2"/>
    <path d="M72 40 C85 36, 115 36, 128 40" stroke="#B8A580" stroke-width="1.5" fill="none"/>
    <path d="M78 170 C90 172, 110 172, 122 170" stroke="#B8A580" stroke-width="1.5" fill="none"/>
    <path d="M72 42 C85 38, 115 38, 128 42" stroke="#E8DCCA" stroke-width="0.8" fill="none" opacity="0.6"/>
  </svg>`,

  // P2: Compression Gauntlet — beige fingerless glove
  p2: `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
    <rect width="200" height="200" rx="20" fill="#F8F7F5"/>
    <defs>
      <linearGradient id="gaunt" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#D9CBAE"/><stop offset="50%" stop-color="#EAE0CE"/>
        <stop offset="100%" stop-color="#CEBF9F"/>
      </linearGradient>
    </defs>
    <ellipse cx="100" cy="176" rx="28" ry="3.5" fill="rgba(0,0,0,0.05)"/>
    <path d="M70 85 L68 160 C68 165, 78 170, 100 170 C122 170, 132 165, 132 160 L130 85 C130 78, 120 72, 100 72 C80 72, 70 78, 70 85 Z" fill="url(#gaunt)" stroke="#C0AD8E" stroke-width="0.8"/>
    <path d="M82 72 L80 48 C80 44, 83 40, 86 40 L90 40 C93 40, 95 44, 95 48 L94 72" fill="url(#gaunt)" stroke="#C0AD8E" stroke-width="0.8"/>
    <path d="M94 72 L93 42 C93 38, 95 34, 98 34 L102 34 C105 34, 107 38, 107 42 L106 72" fill="url(#gaunt)" stroke="#C0AD8E" stroke-width="0.8"/>
    <path d="M106 72 L105 46 C105 42, 107 38, 110 38 L114 38 C117 38, 119 42, 119 46 L118 72" fill="url(#gaunt)" stroke="#C0AD8E" stroke-width="0.8"/>
    <path d="M118 72 L117 54 C117 50, 119 47, 121 47 L124 47 C126 47, 128 50, 128 54 L128 76" fill="url(#gaunt)" stroke="#C0AD8E" stroke-width="0.8"/>
    <path d="M70 85 C80 82, 120 82, 130 85" stroke="#B8A580" stroke-width="0.6" fill="none" opacity="0.5"/>
    <path d="M72 100 L128 100" stroke="#C9B896" stroke-width="0.4" opacity="0.4"/>
    <path d="M70 115 L130 115" stroke="#C9B896" stroke-width="0.4" opacity="0.4"/>
    <path d="M69 130 L131 130" stroke="#C9B896" stroke-width="0.4" opacity="0.3"/>
    <path d="M68 145 L132 145" stroke="#C9B896" stroke-width="0.4" opacity="0.3"/>
  </svg>`,

  // P3: Thigh-High Stocking — beige compression stocking
  p3: `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
    <rect width="200" height="200" rx="20" fill="#F8F7F5"/>
    <defs>
      <linearGradient id="stock" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#D6C9AD"/><stop offset="40%" stop-color="#E6DACA"/>
        <stop offset="100%" stop-color="#CBBC9C"/>
      </linearGradient>
    </defs>
    <ellipse cx="100" cy="180" rx="26" ry="3" fill="rgba(0,0,0,0.05)"/>
    <path d="M78 22 C76 22, 73 26, 72 32 L68 148 C68 152, 66 156, 62 162 L58 172 C56 176, 60 180, 70 180 L94 180 C100 180, 102 176, 100 172 L96 162 C94 158, 92 154, 92 148 L92 32" fill="url(#stock)" stroke="#BBA882" stroke-width="0.8"/>
    <path d="M108 32 L108 148 C108 154, 106 158, 104 162 L100 172 C98 176, 100 180, 106 180 L130 180 C140 180, 144 176, 142 172 L138 162 C134 156, 132 152, 132 148 L128 32 C128 26, 124 22, 122 22" fill="url(#stock)" stroke="#BBA882" stroke-width="0.8"/>
    <path d="M78 22 C86 20, 92 20, 92 22" stroke="#A89670" stroke-width="1" fill="none"/>
    <path d="M108 22 C112 20, 118 20, 122 22" stroke="#A89670" stroke-width="1" fill="none"/>
    <path d="M74 50 L90 50 M110 50 L126 50" stroke="#C9B896" stroke-width="0.4" opacity="0.4"/>
    <path d="M72 80 L92 80 M108 80 L128 80" stroke="#C9B896" stroke-width="0.4" opacity="0.4"/>
    <path d="M70 110 L92 110 M108 110 L130 110" stroke="#C9B896" stroke-width="0.4" opacity="0.3"/>
    <path d="M68 140 L92 140 M108 140 L132 140" stroke="#C9B896" stroke-width="0.4" opacity="0.3"/>
  </svg>`,

  // P4: Full Breast Prosthetic — skin-tone teardrop form
  p4: `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
    <rect width="200" height="200" rx="20" fill="#F8F7F5"/>
    <defs>
      <radialGradient id="pros" cx="45%" cy="40%" r="55%">
        <stop offset="0%" stop-color="#F0D5C0"/><stop offset="60%" stop-color="#E4C4AA"/>
        <stop offset="100%" stop-color="#D4AA88"/>
      </radialGradient>
    </defs>
    <ellipse cx="100" cy="170" rx="40" ry="5" fill="rgba(0,0,0,0.05)"/>
    <ellipse cx="100" cy="108" rx="48" ry="54" fill="url(#pros)" stroke="#C9A07A" stroke-width="0.6"/>
    <ellipse cx="88" cy="92" rx="18" ry="14" fill="rgba(255,255,255,0.12)"/>
    <ellipse cx="100" cy="108" rx="46" ry="52" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1.5"/>
  </svg>`,

  // P5: Partial Breast Prosthetic — smaller crescent form
  p5: `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
    <rect width="200" height="200" rx="20" fill="#F8F7F5"/>
    <defs>
      <radialGradient id="partpros" cx="45%" cy="40%" r="55%">
        <stop offset="0%" stop-color="#F2D8C4"/><stop offset="60%" stop-color="#E6C8AE"/>
        <stop offset="100%" stop-color="#D6AE8E"/>
      </radialGradient>
    </defs>
    <ellipse cx="100" cy="162" rx="30" ry="4" fill="rgba(0,0,0,0.05)"/>
    <path d="M60 110 C60 80, 80 60, 100 60 C120 60, 140 75, 140 100 C140 120, 130 140, 115 150 C105 156, 90 156, 80 148 C66 138, 60 126, 60 110 Z" fill="url(#partpros)" stroke="#C9A07A" stroke-width="0.6"/>
    <path d="M76 92 C82 82, 94 76, 104 78" stroke="rgba(255,255,255,0.15)" stroke-width="2" fill="none"/>
  </svg>`,

  // P6: Night Compression Garment Set — navy blue with velcro
  p6: `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
    <rect width="200" height="200" rx="20" fill="#F8F7F5"/>
    <defs>
      <linearGradient id="night" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#1E2A5E"/><stop offset="50%" stop-color="#2A3B7A"/>
        <stop offset="100%" stop-color="#1A2550"/>
      </linearGradient>
    </defs>
    <ellipse cx="100" cy="178" rx="36" ry="4" fill="rgba(0,0,0,0.06)"/>
    <path d="M65 38 C63 38, 60 42, 58 50 L54 158 C54 164, 64 170, 80 172 L120 172 C136 170, 146 164, 146 158 L142 50 C140 42, 137 38, 135 38 Z" fill="url(#night)" stroke="#141D42" stroke-width="0.8"/>
    <rect x="62" y="56" width="76" height="8" rx="2" fill="#3B4D8A" opacity="0.5"/>
    <rect x="60" y="80" width="80" height="8" rx="2" fill="#3B4D8A" opacity="0.4"/>
    <rect x="58" y="104" width="84" height="8" rx="2" fill="#3B4D8A" opacity="0.35"/>
    <rect x="56" y="128" width="88" height="8" rx="2" fill="#3B4D8A" opacity="0.3"/>
    <rect x="70" y="60" width="14" height="4" rx="1" fill="#8B9DC3" opacity="0.6"/>
    <rect x="70" y="84" width="14" height="4" rx="1" fill="#8B9DC3" opacity="0.5"/>
    <rect x="70" y="108" width="14" height="4" rx="1" fill="#8B9DC3" opacity="0.4"/>
    <rect x="70" y="132" width="14" height="4" rx="1" fill="#8B9DC3" opacity="0.4"/>
    <path d="M65 38 C80 34, 120 34, 135 38" stroke="#0F1633" stroke-width="1.5" fill="none"/>
  </svg>`,

  // P7: Compression Bandage Kit — rolled bandages
  p7: `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
    <rect width="200" height="200" rx="20" fill="#F8F7F5"/>
    <ellipse cx="100" cy="170" rx="50" ry="5" fill="rgba(0,0,0,0.04)"/>
    <ellipse cx="76" cy="120" rx="30" ry="30" fill="#F5F0E8" stroke="#D4C9B8" stroke-width="0.8"/>
    <ellipse cx="76" cy="120" rx="10" ry="10" fill="#F8F7F5" stroke="#D4C9B8" stroke-width="0.5"/>
    <path d="M76 90 C82 90, 96 92, 104 98" stroke="#E8DDD0" stroke-width="1" fill="none"/>
    <ellipse cx="76" cy="120" rx="22" ry="22" fill="none" stroke="#E2D8C8" stroke-width="0.4"/>
    <ellipse cx="124" cy="128" rx="26" ry="26" fill="#EDE5D6" stroke="#C4B89A" stroke-width="0.8"/>
    <ellipse cx="124" cy="128" rx="9" ry="9" fill="#F8F7F5" stroke="#C4B89A" stroke-width="0.5"/>
    <ellipse cx="124" cy="128" rx="18" ry="18" fill="none" stroke="#D4C8AE" stroke-width="0.4"/>
    <ellipse cx="100" cy="86" rx="22" ry="22" fill="#FFFFFF" stroke="#D8CFC0" stroke-width="0.8"/>
    <ellipse cx="100" cy="86" rx="8" ry="8" fill="#F8F7F5" stroke="#D8CFC0" stroke-width="0.5"/>
    <ellipse cx="100" cy="86" rx="16" ry="16" fill="none" stroke="#E6DED0" stroke-width="0.4"/>
  </svg>`,

  // P8: Surgical Mastectomy Bra — white, front-closure
  p8: `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
    <rect width="200" height="200" rx="20" fill="#F8F7F5"/>
    <defs>
      <linearGradient id="bra" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#FFFFFF"/><stop offset="100%" stop-color="#F0ECE6"/>
      </linearGradient>
    </defs>
    <ellipse cx="100" cy="168" rx="42" ry="4" fill="rgba(0,0,0,0.04)"/>
    <path d="M42 80 C42 68, 56 56, 78 54 L100 52 L122 54 C144 56, 158 68, 158 80 L158 100 C158 118, 148 130, 130 134 L100 140 L70 134 C52 130, 42 118, 42 100 Z" fill="url(#bra)" stroke="#D4CFC6" stroke-width="0.8"/>
    <path d="M100 52 L100 140" stroke="#D4CFC6" stroke-width="0.6" stroke-dasharray="3,3"/>
    <path d="M100 62 C86 66, 56 74, 50 90" stroke="#E8E2D8" stroke-width="0.5" fill="none"/>
    <path d="M100 62 C114 66, 144 74, 150 90" stroke="#E8E2D8" stroke-width="0.5" fill="none"/>
    <path d="M42 80 L36 70 C34 66, 30 66, 28 68 L24 78" stroke="#D4CFC6" stroke-width="0.8" fill="url(#bra)"/>
    <path d="M158 80 L164 70 C166 66, 170 66, 172 68 L176 78" stroke="#D4CFC6" stroke-width="0.8" fill="url(#bra)"/>
    <circle cx="100" cy="72" r="2.5" fill="#D4CFC6"/>
    <circle cx="100" cy="82" r="2.5" fill="#D4CFC6"/>
    <circle cx="100" cy="92" r="2.5" fill="#D4CFC6"/>
  </svg>`,

  // P9: Foam Padding Sheets — stacked beige sheets
  p9: `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
    <rect width="200" height="200" rx="20" fill="#F8F7F5"/>
    <ellipse cx="100" cy="170" rx="42" ry="4" fill="rgba(0,0,0,0.04)"/>
    <rect x="48" y="138" width="104" height="8" rx="2" fill="#E8DCC6" stroke="#D4C8AA" stroke-width="0.5"/>
    <rect x="50" y="126" width="100" height="8" rx="2" fill="#ECDFCA" stroke="#D4C8AA" stroke-width="0.5"/>
    <rect x="48" y="114" width="104" height="8" rx="2" fill="#E8DCC6" stroke="#D4C8AA" stroke-width="0.5"/>
    <rect x="50" y="102" width="100" height="8" rx="2" fill="#ECDFCA" stroke="#D4C8AA" stroke-width="0.5"/>
    <rect x="48" y="90" width="104" height="8" rx="2" fill="#E8DCC6" stroke="#D4C8AA" stroke-width="0.5"/>
    <rect x="50" y="78" width="100" height="8" rx="2" fill="#F0E4CE" stroke="#D4C8AA" stroke-width="0.5"/>
    <path d="M50 78 L54 72 L154 72 L150 78" fill="#F4E8D4" stroke="#D4C8AA" stroke-width="0.5"/>
  </svg>`,

  // P10: Donning Gloves — orange/coral rubber gloves
  p10: `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
    <rect width="200" height="200" rx="20" fill="#F8F7F5"/>
    <defs>
      <linearGradient id="glove" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#E8734A"/><stop offset="50%" stop-color="#F28C60"/>
        <stop offset="100%" stop-color="#D4643C"/>
      </linearGradient>
    </defs>
    <ellipse cx="100" cy="176" rx="32" ry="3.5" fill="rgba(0,0,0,0.05)"/>
    <path d="M66 90 L64 160 C64 166, 74 172, 96 172 L96 172 C96 172, 96 90, 96 90 Z" fill="url(#glove)" stroke="#C05030" stroke-width="0.6" opacity="0.85"/>
    <path d="M78 90 L76 52 C76 47, 78 44, 82 44 L86 44 C89 44, 91 47, 91 52 L90 90" fill="url(#glove)" stroke="#C05030" stroke-width="0.6"/>
    <path d="M90 90 L89 44 C89 39, 91 35, 94 35 L98 35 C101 35, 103 39, 103 44 L102 90" fill="url(#glove)" stroke="#C05030" stroke-width="0.6"/>
    <path d="M102 90 L101 48 C101 43, 103 40, 106 40 L110 40 C113 40, 115 43, 115 48 L114 90" fill="url(#glove)" stroke="#C05030" stroke-width="0.6"/>
    <path d="M114 90 L113 56 C113 52, 114 49, 117 49 L120 49 C122 49, 124 52, 124 56 L124 94" fill="url(#glove)" stroke="#C05030" stroke-width="0.6"/>
    <path d="M66 90 C66 82, 76 76, 96 76 C116 76, 134 82, 134 94 L132 160 C132 166, 122 172, 104 172" fill="url(#glove)" stroke="#C05030" stroke-width="0.6"/>
    <path d="M66 100 C76 96, 120 96, 134 100" stroke="rgba(255,255,255,0.15)" stroke-width="1" fill="none"/>
    <path d="M68 120 L130 120" stroke="rgba(255,255,255,0.08)" stroke-width="0.5"/>
    <path d="M66 140 L132 140" stroke="rgba(255,255,255,0.06)" stroke-width="0.5"/>
  </svg>`,
};

function productImage(id: string): string {
  const svg = productImages[id];
  if (!svg) return '';
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

// ─── Products ─────────────────────────────────────────────────
export const products: Product[] = [
  {
    id: 'p1', name: 'Flat-Knit Compression Sleeve', hcpcsCode: 'A6531',
    category: 'Compression Garments', vendorId: 'medi', unitCost: 78.50, msrp: 165.00,
    description: 'Custom-fit flat-knit compression sleeve for upper extremity lymphedema',
    requiresMeasurement: true, requiresPriorAuth: false,
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'Custom'],
    imageUrl: productImage('p1'),
  },
  {
    id: 'p2', name: 'Compression Gauntlet', hcpcsCode: 'A6532',
    category: 'Compression Garments', vendorId: 'juzo', unitCost: 45.00, msrp: 95.00,
    description: 'Compression gauntlet for hand and wrist lymphedema management',
    requiresMeasurement: true, requiresPriorAuth: false,
    sizes: ['S', 'M', 'L', 'XL'],
    imageUrl: productImage('p2'),
  },
  {
    id: 'p3', name: 'Circular-Knit Thigh-High Stocking', hcpcsCode: 'A6533',
    category: 'Compression Garments', vendorId: 'sigvaris', unitCost: 62.00, msrp: 130.00,
    description: 'Graduated compression stocking, thigh-high, 20-30 mmHg',
    requiresMeasurement: true, requiresPriorAuth: false,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    imageUrl: productImage('p3'),
  },
  {
    id: 'p4', name: 'Silicone Breast Prosthetic, Full', hcpcsCode: 'L8030',
    category: 'Breast Prosthetics', vendorId: 'amoena', unitCost: 142.00, msrp: 385.00,
    description: 'Silicone breast prosthesis, full form, custom weighted',
    requiresMeasurement: true, requiresPriorAuth: true,
    sizes: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
    imageUrl: productImage('p4'),
  },
  {
    id: 'p5', name: 'Silicone Breast Prosthetic, Partial', hcpcsCode: 'L8031',
    category: 'Breast Prosthetics', vendorId: 'amoena', unitCost: 98.00, msrp: 260.00,
    description: 'Silicone breast prosthesis, partial form',
    requiresMeasurement: true, requiresPriorAuth: true,
    sizes: ['S', 'M', 'L'],
    imageUrl: productImage('p5'),
  },
  {
    id: 'p6', name: 'Night Compression Garment Set', hcpcsCode: 'A6531',
    category: 'Night Garments', vendorId: 'solaris', unitCost: 195.00, msrp: 520.00,
    description: 'Nighttime compression system with foam channels for arm lymphedema',
    requiresMeasurement: true, requiresPriorAuth: true,
    sizes: ['S', 'M', 'L', 'XL'],
    imageUrl: productImage('p6'),
  },
  {
    id: 'p7', name: 'Compression Bandage Kit', hcpcsCode: 'A6448',
    category: 'Surgical Supplies', vendorId: 'bsn', unitCost: 35.00, msrp: 72.00,
    description: 'Short-stretch compression bandage system, multi-layer',
    requiresMeasurement: false, requiresPriorAuth: false,
    imageUrl: productImage('p7'),
  },
  {
    id: 'p8', name: 'Surgical Mastectomy Bra', hcpcsCode: 'L8000',
    category: 'Breast Prosthetics', vendorId: 'amoena', unitCost: 28.00, msrp: 65.00,
    description: 'Post-surgical mastectomy bra with bilateral pockets',
    requiresMeasurement: false, requiresPriorAuth: false,
    sizes: ['32A', '34A', '34B', '36B', '36C', '38C', '38D', '40D', '42D'],
    imageUrl: productImage('p8'),
  },
  {
    id: 'p9', name: 'Foam Padding Sheets (6-pack)', hcpcsCode: 'A6531',
    category: 'Accessories', vendorId: 'solaris', unitCost: 18.00, msrp: 42.00,
    description: 'Closed-cell foam padding for use under compression garments',
    requiresMeasurement: false, requiresPriorAuth: false,
    imageUrl: productImage('p9'),
  },
  {
    id: 'p10', name: 'Donning Gloves, Pair', hcpcsCode: 'A4927',
    category: 'Accessories', vendorId: 'medi', unitCost: 8.50, msrp: 18.00,
    description: 'Rubber donning gloves for application of compression garments',
    requiresMeasurement: false, requiresPriorAuth: false,
    sizes: ['S', 'M', 'L', 'XL'],
    imageUrl: productImage('p10'),
  },
];

// ─── Insurance Providers ──────────────────────────────────────
export const insuranceProviders: InsuranceProvider[] = [
  { id: 'bcbs', name: 'Blue Cross Blue Shield', shortName: 'BCBS' },
  { id: 'aetna', name: 'Aetna', shortName: 'Aetna' },
  { id: 'uhc', name: 'UnitedHealthcare', shortName: 'UHC' },
  { id: 'cigna', name: 'Cigna Healthcare', shortName: 'Cigna' },
  { id: 'humana', name: 'Humana', shortName: 'Humana' },
  { id: 'medicare', name: 'Medicare', shortName: 'Medicare' },
  { id: 'medicaid', name: 'Medicaid', shortName: 'Medicaid' },
  { id: 'tricare', name: 'TRICARE', shortName: 'TRICARE' },
];

// ─── Fee Schedules ────────────────────────────────────────────
export const feeSchedules: FeeSchedule[] = [
  { id: 'fs1', payerName: 'Blue Cross Blue Shield', hcpcsCode: 'A6531', allowedAmount: 165.00, multiplier: 1.0, state: 'FL' },
  { id: 'fs2', payerName: 'Blue Cross Blue Shield', hcpcsCode: 'A6532', allowedAmount: 88.00, multiplier: 1.0, state: 'FL' },
  { id: 'fs3', payerName: 'Blue Cross Blue Shield', hcpcsCode: 'A6533', allowedAmount: 125.00, multiplier: 1.0, state: 'FL' },
  { id: 'fs4', payerName: 'Blue Cross Blue Shield', hcpcsCode: 'L8030', allowedAmount: 340.00, multiplier: 1.0, state: 'FL' },
  { id: 'fs5', payerName: 'Blue Cross Blue Shield', hcpcsCode: 'L8031', allowedAmount: 225.00, multiplier: 1.0, state: 'FL' },
  { id: 'fs6', payerName: 'Blue Cross Blue Shield', hcpcsCode: 'A6448', allowedAmount: 68.00, multiplier: 1.0, state: 'FL' },
  { id: 'fs7', payerName: 'Blue Cross Blue Shield', hcpcsCode: 'L8000', allowedAmount: 55.00, multiplier: 1.0, state: 'FL' },
  { id: 'fs8', payerName: 'Blue Cross Blue Shield', hcpcsCode: 'A4927', allowedAmount: 16.00, multiplier: 1.0, state: 'FL' },
  { id: 'fs9', payerName: 'Aetna', hcpcsCode: 'A6531', allowedAmount: 155.00, multiplier: 1.05, state: 'FL' },
  { id: 'fs10', payerName: 'Aetna', hcpcsCode: 'A6532', allowedAmount: 82.00, multiplier: 1.05, state: 'FL' },
  { id: 'fs11', payerName: 'Aetna', hcpcsCode: 'L8030', allowedAmount: 330.00, multiplier: 1.05, state: 'FL' },
  { id: 'fs12', payerName: 'UnitedHealthcare', hcpcsCode: 'A6531', allowedAmount: 170.00, multiplier: 0.95, state: 'FL' },
  { id: 'fs13', payerName: 'UnitedHealthcare', hcpcsCode: 'A6532', allowedAmount: 90.00, multiplier: 0.95, state: 'FL' },
  { id: 'fs14', payerName: 'UnitedHealthcare', hcpcsCode: 'L8030', allowedAmount: 350.00, multiplier: 0.95, state: 'FL' },
  { id: 'fs15', payerName: 'Medicare', hcpcsCode: 'A6531', allowedAmount: 148.00, multiplier: 1.0, state: 'FL' },
  { id: 'fs16', payerName: 'Medicare', hcpcsCode: 'A6532', allowedAmount: 78.00, multiplier: 1.0, state: 'FL' },
  { id: 'fs17', payerName: 'Medicare', hcpcsCode: 'L8030', allowedAmount: 310.00, multiplier: 1.0, state: 'FL' },
  { id: 'fs18', payerName: 'Medicare', hcpcsCode: 'L8000', allowedAmount: 48.00, multiplier: 1.0, state: 'FL' },
];

// ─── Sample Orders ────────────────────────────────────────────
export const sampleOrders: Order[] = [
  {
    id: 'ORD-1042', patientName: 'Sarah Johnson', patientDOB: '03/15/1978',
    patientPhone: '(305) 555-0142', patientEmail: 'sarah.j@email.com',
    shippingAddress: '2847 Palm Beach Blvd, Miami, FL 33133',
    insuranceProvider: 'Blue Cross Blue Shield', policyNumber: 'BCB-482910-A', groupNumber: 'GRP-7820',
    isSelfPay: false,
    lineItems: [
      { productId: 'p1', productName: 'Flat-Knit Compression Sleeve', hcpcsCode: 'A6531', vendor: 'Medi USA', quantity: 2, size: 'M', unitCost: 78.50, billableAmount: 165.00, patientResponsibility: 33.00 },
      { productId: 'p10', productName: 'Donning Gloves — Pair', hcpcsCode: 'A4927', vendor: 'Medi USA', quantity: 1, size: 'M', unitCost: 8.50, billableAmount: 16.00, patientResponsibility: 3.20 },
    ],
    status: 'approved', totalBillable: 346.00, totalVendorCost: 165.50,
    margin: 180.50, marginPercent: 52.2, patientOwes: 69.20,
    createdAt: '2026-04-07T09:15:00', createdBy: 'Maria G.', requiresApproval: false, notes: '',
  },
  {
    id: 'ORD-1041', patientName: 'Michael Chen', patientDOB: '11/22/1965',
    patientPhone: '(786) 555-0198', patientEmail: 'mchen@email.com',
    shippingAddress: '1420 Ocean Drive, Fort Lauderdale, FL 33304',
    insuranceProvider: 'Aetna', policyNumber: 'AET-991204-C', groupNumber: 'GRP-3310',
    isSelfPay: false,
    lineItems: [
      { productId: 'p4', productName: 'Silicone Breast Prosthetic — Full', hcpcsCode: 'L8030', vendor: 'Amoena', quantity: 1, size: '6', unitCost: 142.00, billableAmount: 346.50, patientResponsibility: 69.30 },
      { productId: 'p8', productName: 'Surgical Mastectomy Bra', hcpcsCode: 'L8000', vendor: 'Amoena', quantity: 2, size: '36B', unitCost: 28.00, billableAmount: 55.00, patientResponsibility: 11.00 },
    ],
    status: 'pending_approval', totalBillable: 456.50, totalVendorCost: 198.00,
    margin: 258.50, marginPercent: 56.6, patientOwes: 91.30,
    createdAt: '2026-04-07T08:30:00', createdBy: 'Jessica T.', requiresApproval: true, notes: 'L8030 requires prior auth',
  },
  {
    id: 'ORD-1040', patientName: 'Lisa Rivera', patientDOB: '06/08/1982',
    patientPhone: '(954) 555-0167', patientEmail: 'lrivera@email.com',
    shippingAddress: '890 Cypress Creek Rd, Pompano Beach, FL 33069',
    insuranceProvider: 'UnitedHealthcare', policyNumber: 'UHC-334521-B', groupNumber: 'GRP-5540',
    isSelfPay: false,
    lineItems: [
      { productId: 'p2', productName: 'Compression Gauntlet', hcpcsCode: 'A6532', vendor: 'Juzo', quantity: 1, size: 'L', unitCost: 45.00, billableAmount: 85.50, patientResponsibility: 17.10 },
    ],
    status: 'shipped', totalBillable: 85.50, totalVendorCost: 45.00,
    margin: 40.50, marginPercent: 47.4, patientOwes: 17.10,
    createdAt: '2026-04-06T14:20:00', createdBy: 'Maria G.', requiresApproval: false, notes: '',
  },
  {
    id: 'ORD-1039', patientName: 'James Williams', patientDOB: '01/30/1955',
    patientPhone: '(561) 555-0234', patientEmail: 'jwilliams@email.com',
    shippingAddress: '4520 W Broward Blvd, Plantation, FL 33317',
    insuranceProvider: 'Medicare', policyNumber: 'MED-88712-D', groupNumber: '',
    isSelfPay: false,
    lineItems: [
      { productId: 'p6', productName: 'Night Compression Garment Set', hcpcsCode: 'A6531', vendor: 'Solaris', quantity: 1, size: 'L', unitCost: 195.00, billableAmount: 148.00, patientResponsibility: 29.60 },
      { productId: 'p1', productName: 'Flat-Knit Compression Sleeve', hcpcsCode: 'A6531', vendor: 'Medi USA', quantity: 2, size: 'L', unitCost: 78.50, billableAmount: 148.00, patientResponsibility: 29.60 },
      { productId: 'p9', productName: 'Foam Padding Sheets (6-pack)', hcpcsCode: 'A6531', vendor: 'Solaris', quantity: 1, unitCost: 18.00, billableAmount: 148.00, patientResponsibility: 29.60 },
    ],
    status: 'delivered', totalBillable: 444.00, totalVendorCost: 370.00,
    margin: 74.00, marginPercent: 16.7, patientOwes: 88.80,
    createdAt: '2026-04-05T11:45:00', createdBy: 'Jessica T.', requiresApproval: true, notes: 'Night garment requires PA — approved 4/5',
  },
  {
    id: 'ORD-1038', patientName: 'Patricia Anderson', patientDOB: '09/12/1970',
    patientPhone: '(305) 555-0189', patientEmail: 'panderson@email.com',
    shippingAddress: '3200 S University Dr, Davie, FL 33328',
    insuranceProvider: 'Cigna Healthcare', policyNumber: 'CIG-654321-E', groupNumber: 'GRP-9910',
    isSelfPay: false,
    lineItems: [
      { productId: 'p3', productName: 'Circular-Knit Thigh-High Stocking', hcpcsCode: 'A6533', vendor: 'Sigvaris', quantity: 2, size: 'M', unitCost: 62.00, billableAmount: 125.00, patientResponsibility: 25.00 },
    ],
    status: 'ordered', totalBillable: 250.00, totalVendorCost: 124.00,
    margin: 126.00, marginPercent: 50.4, patientOwes: 50.00,
    createdAt: '2026-04-05T09:00:00', createdBy: 'Maria G.', requiresApproval: false, notes: '',
  },
  {
    id: 'ORD-1037', patientName: 'Robert Kim', patientDOB: '04/25/1988',
    patientPhone: '(954) 555-0211', patientEmail: 'rkim@email.com',
    shippingAddress: '7700 W Oakland Park Blvd, Sunrise, FL 33351',
    insuranceProvider: '', policyNumber: '', groupNumber: '',
    isSelfPay: true,
    lineItems: [
      { productId: 'p7', productName: 'Compression Bandage Kit', hcpcsCode: 'A6448', vendor: 'BSN Medical', quantity: 3, unitCost: 35.00, billableAmount: 72.00, patientResponsibility: 72.00 },
    ],
    status: 'delivered', totalBillable: 216.00, totalVendorCost: 105.00,
    margin: 111.00, marginPercent: 51.4, patientOwes: 216.00,
    createdAt: '2026-04-04T16:30:00', createdBy: 'Jessica T.', requiresApproval: false, notes: 'Self-pay patient — charged MSRP',
  },
];

// ─── Helpers ──────────────────────────────────────────────────
export function getVendor(id: string): Vendor | undefined {
  return vendors.find(v => v.id === id);
}

export function getProduct(id: string): Product | undefined {
  return products.find(p => p.id === id);
}

export function lookupFeeSchedule(payerName: string, hcpcsCode: string): FeeSchedule | undefined {
  return feeSchedules.find(fs => fs.payerName === payerName && fs.hcpcsCode === hcpcsCode);
}

export function calculateBilling(
  product: Product,
  quantity: number,
  payerName: string,
  isSelfPay: boolean,
): { billableAmount: number; vendorCost: number; margin: number; marginPercent: number; patientResponsibility: number } {
  const vendorCost = product.unitCost * quantity;

  if (isSelfPay) {
    const billable = product.msrp * quantity;
    return {
      billableAmount: billable,
      vendorCost,
      margin: billable - vendorCost,
      marginPercent: ((billable - vendorCost) / billable) * 100,
      patientResponsibility: billable,
    };
  }

  const fs = lookupFeeSchedule(payerName, product.hcpcsCode);
  const billablePerUnit = fs ? fs.allowedAmount * fs.multiplier : product.msrp;
  const billable = billablePerUnit * quantity;
  const patientShare = billable * 0.20; // assume 20% coinsurance
  return {
    billableAmount: billable,
    vendorCost,
    margin: billable - vendorCost,
    marginPercent: ((billable - vendorCost) / billable) * 100,
    patientResponsibility: patientShare,
  };
}

export const productCategories: ProductCategory[] = [
  'Compression Garments',
  'Breast Prosthetics',
  'Surgical Supplies',
  'Lymphedema',
  'Night Garments',
  'Accessories',
];

export const statusConfig: Record<OrderStatus, { label: string; color: string; bg: string; dot: string }> = {
  draft: { label: 'Draft', color: '#4B5563', bg: '#F3F4F6', dot: '#9CA3AF' },
  pending_approval: { label: 'Pending Approval', color: '#D97706', bg: '#FFFBEB', dot: '#F59E0B' },
  approved: { label: 'Approved', color: '#047857', bg: '#ECFDF5', dot: '#10B981' },
  ordered: { label: 'Ordered', color: '#3B52CC', bg: '#EEF2FF', dot: '#4F6AE8' },
  shipped: { label: 'Shipped', color: '#EA580C', bg: '#FFF7ED', dot: '#F97316' },
  delivered: { label: 'Delivered', color: '#047857', bg: '#ECFDF5', dot: '#059669' },
  cancelled: { label: 'Cancelled', color: '#DC2626', bg: '#FEF2F2', dot: '#EF4444' },
};
