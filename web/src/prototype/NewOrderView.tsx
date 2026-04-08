import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  colors,
  typography,
  spacing,
  radii,
  shadows,
  transitions,
} from '@/shared/design-tokens';
import {
  products,
  productCategories,
  insuranceProviders,
  calculateBilling,
  getVendor,
  lookupFeeSchedule,
  type Product,
  type ProductCategory,
} from '@/shared/mock-data';
import './prototype.css';

// ─── Types ──────────────────────────────────────────────────
interface NewOrderViewProps {
  onBack: () => void;
  onOrderCreated: (orderId: string) => void;
}

interface MeasurementFile {
  name: string;
  size: number;
  type: string;
  dataUrl: string; // preview for images
}

interface SelectedProduct {
  product: Product;
  quantity: number;
  size?: string;
  measurementForm?: MeasurementFile;
}

interface PatientInfo {
  firstName: string;
  lastName: string;
  dob: string;
  phone: string;
  email: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  referringTherapist: string;
  referringClinic: string;
}

interface BillingInfo {
  isSelfPay: boolean;
  insuranceProviderId: string;
  policyNumber: string;
  groupNumber: string;
}

type Step = 1 | 2 | 3 | 4;

const STEP_LABELS = ['Patient Info', 'Products', 'Billing & Insurance', 'Review'];

const emptyPatient: PatientInfo = {
  firstName: '', lastName: '', dob: '', phone: '', email: '',
  street: '', city: '', state: '', zip: '',
  referringTherapist: '', referringClinic: '',
};

const emptyBilling: BillingInfo = {
  isSelfPay: false, insuranceProviderId: '', policyNumber: '', groupNumber: '',
};

// ─── Helpers ────────────────────────────────────────────────
function generateOrderId(): string {
  return `ORD-${Math.floor(1100 + Math.random() * 900)}`;
}

function formatCurrency(n: number): string {
  return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// ─── Validation ─────────────────────────────────────────────
type ValidationRule = {
  required?: boolean;
  message: string;
  validate?: (value: string) => boolean;
};

const patientValidation: Partial<Record<keyof PatientInfo, ValidationRule>> = {
  firstName: { required: true, message: 'We\'ll need the patient\'s first name to get started' },
  lastName: { required: true, message: 'A last name helps us keep records accurate' },
  email: {
    message: 'Hmm, that doesn\'t look like a valid email address',
    validate: (v) => v === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
  },
  phone: {
    message: 'Try a format like (555) 555-0123',
    validate: (v) => v === '' || /^[\d\s()+-]{7,}$/.test(v),
  },
  zip: {
    message: 'ZIP codes are usually 5 digits',
    validate: (v) => v === '' || /^\d{5}(-\d{4})?$/.test(v),
  },
};

function getFieldError(field: keyof PatientInfo, value: string): string | null {
  const rule = patientValidation[field];
  if (!rule) return null;
  if (rule.required && value.trim() === '') return rule.message;
  if (rule.validate && !rule.validate(value)) return rule.message;
  return null;
}

function getFieldState(field: keyof PatientInfo, value: string, touched: boolean): 'neutral' | 'valid' | 'invalid' {
  if (!touched) return 'neutral';
  const error = getFieldError(field, value);
  if (error) return 'invalid';
  if (value.trim() !== '') return 'valid';
  return 'neutral';
}

// ─── Component ──────────────────────────────────────────────
export function NewOrderView({ onBack, onOrderCreated }: NewOrderViewProps) {
  const [step, setStep] = useState<Step>(1);
  const [direction, setDirection] = useState<'forward' | 'back'>('forward');
  const [patient, setPatient] = useState<PatientInfo>(emptyPatient);
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
  const [billing, setBilling] = useState<BillingInfo>(emptyBilling);
  const [categoryFilter, setCategoryFilter] = useState<ProductCategory | 'All'>('All');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [orderId] = useState(generateOrderId);
  const [billingShimmer, setBillingShimmer] = useState(false);
  const [stepKey, setStepKey] = useState(0);
  const [touched, setTouched] = useState<Set<keyof PatientInfo>>(new Set());
  const [showNudge, setShowNudge] = useState(false);
  const [shakeFields, setShakeFields] = useState(false);
  const [justCompletedStep, setJustCompletedStep] = useState<number | null>(null);
  const [connectorAnimating, setConnectorAnimating] = useState<number | null>(null);
  const prevInsuranceRef = useRef(billing.insuranceProviderId);

  // Trigger shimmer when insurance changes
  useEffect(() => {
    if (prevInsuranceRef.current !== billing.insuranceProviderId && selectedProducts.length > 0) {
      setBillingShimmer(true);
      const t = setTimeout(() => setBillingShimmer(false), 600);
      prevInsuranceRef.current = billing.insuranceProviderId;
      return () => clearTimeout(t);
    }
    prevInsuranceRef.current = billing.insuranceProviderId;
  }, [billing.insuranceProviderId, selectedProducts.length]);

  // ── Navigation ──
  const goTo = useCallback((target: Step, dir: 'forward' | 'back') => {
    setDirection(dir);
    setStepKey(k => k + 1);
    if (dir === 'forward') {
      // The step we're leaving just got completed
      setJustCompletedStep(target - 1);
      setConnectorAnimating(target - 1);
      setTimeout(() => setJustCompletedStep(null), 700);
      setTimeout(() => setConnectorAnimating(null), 1200);
    }
    setStep(target);
  }, []);

  // ── Calculations ──
  const selectedInsurance = useMemo(
    () => insuranceProviders.find(ip => ip.id === billing.insuranceProviderId),
    [billing.insuranceProviderId],
  );

  const billingRows = useMemo(() => {
    return selectedProducts.map(sp => {
      const calc = calculateBilling(
        sp.product,
        sp.quantity,
        selectedInsurance?.name ?? '',
        billing.isSelfPay,
      );
      const fs = billing.isSelfPay
        ? null
        : lookupFeeSchedule(selectedInsurance?.name ?? '', sp.product.hcpcsCode);
      return { ...sp, ...calc, hasFeeSchedule: !!fs || billing.isSelfPay };
    });
  }, [selectedProducts, selectedInsurance, billing.isSelfPay]);

  const totals = useMemo(() => {
    const totalBillable = billingRows.reduce((s, r) => s + r.billableAmount, 0);
    const totalVendorCost = billingRows.reduce((s, r) => s + r.vendorCost, 0);
    const margin = totalBillable - totalVendorCost;
    const marginPercent = totalBillable > 0 ? (margin / totalBillable) * 100 : 0;
    const patientOwes = billingRows.reduce((s, r) => s + r.patientResponsibility, 0);
    return { totalBillable, totalVendorCost, margin, marginPercent, patientOwes };
  }, [billingRows]);

  const hasRequiresPriorAuth = selectedProducts.some(sp => sp.product.requiresPriorAuth);

  // ── Product actions ──
  const addProduct = useCallback((product: Product) => {
    setSelectedProducts(prev => {
      if (prev.find(sp => sp.product.id === product.id)) return prev;
      return [...prev, { product, quantity: 1, size: product.sizes?.[0] }];
    });
  }, []);

  const removeProduct = useCallback((productId: string) => {
    setSelectedProducts(prev => prev.filter(sp => sp.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, delta: number) => {
    setSelectedProducts(prev =>
      prev.map(sp =>
        sp.product.id === productId
          ? { ...sp, quantity: Math.max(1, sp.quantity + delta) }
          : sp,
      ),
    );
  }, []);

  const updateSize = useCallback((productId: string, size: string) => {
    setSelectedProducts(prev =>
      prev.map(sp => (sp.product.id === productId ? { ...sp, size } : sp)),
    );
  }, []);

  const attachMeasurementForm = useCallback((productId: string, file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const mf: MeasurementFile = {
        name: file.name,
        size: file.size,
        type: file.type,
        dataUrl: reader.result as string,
      };
      setSelectedProducts(prev =>
        prev.map(sp => (sp.product.id === productId ? { ...sp, measurementForm: mf } : sp)),
      );
    };
    reader.readAsDataURL(file);
  }, []);

  const removeMeasurementForm = useCallback((productId: string) => {
    setSelectedProducts(prev =>
      prev.map(sp => (sp.product.id === productId ? { ...sp, measurementForm: undefined } : sp)),
    );
  }, []);

  // ── Validation ──
  const step1Errors = useMemo(() => {
    const errors: Partial<Record<keyof PatientInfo, string>> = {};
    for (const field of Object.keys(patientValidation) as (keyof PatientInfo)[]) {
      const err = getFieldError(field, patient[field]);
      if (err) errors[field] = err;
    }
    return errors;
  }, [patient]);

  const canContinue = useMemo(() => {
    if (step === 1) return Object.keys(step1Errors).length === 0;
    if (step === 2) return selectedProducts.length > 0;
    if (step === 3) return billing.isSelfPay || billing.insuranceProviderId !== '';
    return true;
  }, [step, step1Errors, selectedProducts, billing]);

  const handleContinue = useCallback(() => {
    if (canContinue) {
      setShowNudge(false);
      setShakeFields(false);
      goTo((step + 1) as Step, 'forward');
    } else if (step === 1) {
      // Touch all validated fields to reveal errors
      const allValidated = new Set(Object.keys(patientValidation) as (keyof PatientInfo)[]);
      setTouched(allValidated);
      setShowNudge(true);
      setShakeFields(true);
      setTimeout(() => setShakeFields(false), 450);
    }
  }, [canContinue, step, goTo]);

  const markTouched = useCallback((field: keyof PatientInfo) => {
    setTouched(prev => {
      const next = new Set(prev);
      next.add(field);
      return next;
    });
    setShowNudge(false);
  }, []);

  // ── Filtered products ──
  const filteredProducts = useMemo(
    () =>
      categoryFilter === 'All'
        ? products
        : products.filter(p => p.category === categoryFilter),
    [categoryFilter],
  );

  // ── Shared input style ──
  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.neutral[600],
    marginBottom: spacing[1],
  };

  const continueDisabled = step === 2 && selectedProducts.length === 0;

  // ────────────────────── RENDER ──────────────────────────────
  if (submitted) {
    return <SuccessScreen orderId={orderId} patientName={`${patient.firstName} ${patient.lastName}`} productCount={selectedProducts.length} selectedProducts={selectedProducts} onBack={onBack} />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: spacing[4],
          padding: `${spacing[5]} ${spacing[6]}`,
          borderBottom: `1px solid ${colors.neutral[150]}`,
          background: colors.surface.card,
          flexShrink: 0,
        }}
      >
        <button
          onClick={onBack}
          style={{
            width: 'auto',
            display: 'inline-flex',
            alignItems: 'center',
            gap: spacing[2],
            fontFamily: typography.fontFamily.body,
            fontSize: typography.fontSize.sm,
            fontWeight: typography.fontWeight.medium,
            color: colors.neutral[500],
            cursor: 'pointer',
            border: 'none',
            background: 'transparent',
            padding: `${spacing[1]} ${spacing[2]}`,
            borderRadius: radii.md,
            transition: transitions.fast,
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = colors.primary[500]; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = colors.neutral[500]; }}
        >
          <span style={{ fontSize: '1.1rem' }}>&#8592;</span> Back
        </button>
        <div style={{ flex: 1 }}>
          <h1
            style={{
              fontFamily: typography.fontFamily.display,
              fontSize: typography.fontSize['2xl'],
              fontWeight: typography.fontWeight.bold,
              color: colors.neutral[900],
              margin: 0,
              letterSpacing: typography.letterSpacing.tight,
              lineHeight: typography.lineHeight.tight,
            }}
          >
            New Order
          </h1>
          <p
            style={{
              fontFamily: typography.fontFamily.body,
              fontSize: typography.fontSize.sm,
              color: colors.neutral[400],
              margin: `${spacing[1]} 0 0`,
            }}
          >
            {orderId}
          </p>
        </div>
      </div>

      {/* Step indicator */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: `${spacing[5]} ${spacing[8]}`,
          background: colors.surface.card,
          borderBottom: `1px solid ${colors.neutral[150]}`,
          flexShrink: 0,
        }}
      >
        {STEP_LABELS.map((label, i) => {
          const stepNum = (i + 1) as Step;
          const isCompleted = stepNum < step;
          const isActive = stepNum === step;
          const isJustCompleted = justCompletedStep === stepNum;
          const dotClass = [
            'step-dot',
            isCompleted ? 'completed' : isActive ? 'active' : 'upcoming',
            isJustCompleted ? 'just-completed' : '',
          ].filter(Boolean).join(' ');

          // Particle burst colors
          const particleColors = ['#10B981', '#34D399', '#6EE7B7', '#A7F3D0', '#4F6AE8', '#FBBF24'];
          const particleAngles = [0, 60, 120, 180, 240, 300];

          return (
            <div key={label} style={{ display: 'contents' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: spacing[1] }}>
                <div className={dotClass}>
                  {/* Ripple ring on completion */}
                  <div className="step-ring" />
                  {/* Particles on completion */}
                  {isJustCompleted && (
                    <div className="step-particles">
                      {particleAngles.map((angle, pi) => {
                        const rad = (angle * Math.PI) / 180;
                        const dist = 22 + Math.random() * 8;
                        const tx = Math.cos(rad) * dist;
                        const ty = Math.sin(rad) * dist;
                        return (
                          <span
                            key={pi}
                            className="step-particle"
                            style={{
                              background: particleColors[pi % particleColors.length],
                              animationDelay: `${pi * 0.04}s`,
                              // @ts-expect-error CSS custom property for particle direction
                              '--tx': `${tx}px`,
                              '--ty': `${ty}px`,
                              transform: `translate(${tx}px, ${ty}px) scale(0)`,
                            }}
                          />
                        );
                      })}
                    </div>
                  )}
                  {isCompleted ? (
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path className="step-check" d="M2.5 7L5.5 10L11.5 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    stepNum
                  )}
                </div>
                <span
                  className={isActive ? 'step-label-active' : undefined}
                  style={{
                    fontFamily: typography.fontFamily.body,
                    fontSize: typography.fontSize.xs,
                    fontWeight: isActive ? typography.fontWeight.bold : isCompleted ? typography.fontWeight.semibold : typography.fontWeight.medium,
                    color: isActive ? colors.primary[600] : isCompleted ? colors.success[600] : colors.neutral[400],
                    whiteSpace: 'nowrap',
                  }}
                >
                  {isCompleted ? `${label} ✓` : label}
                </span>
              </div>
              {i < STEP_LABELS.length - 1 && (
                <div className="step-connector" style={{ marginTop: '-18px' }}>
                  <div
                    className={`fill${connectorAnimating === stepNum ? ' animating' : ''}`}
                    style={{ width: stepNum < step ? '100%' : stepNum === step ? '50%' : '0%' }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Progress encouragement */}
      {step > 1 && (
        <div
          key={`encourage-${step}`}
          className="animate-fade-in"
          style={{
            textAlign: 'center',
            padding: `${spacing[2]} ${spacing[6]}`,
            background: step === 4
              ? `linear-gradient(90deg, ${colors.success[50]}, ${colors.primary[50]}, ${colors.success[50]})`
              : colors.neutral[50],
            borderBottom: `1px solid ${colors.neutral[150]}`,
            flexShrink: 0,
          }}
        >
          <span style={{
            fontFamily: typography.fontFamily.body,
            fontSize: typography.fontSize.xs,
            fontWeight: typography.fontWeight.medium,
            color: step === 4 ? colors.success[600] : colors.neutral[500],
            letterSpacing: typography.letterSpacing.wide,
          }}>
            {step === 2 && '✨ Great start! Now let\'s pick some products.'}
            {step === 3 && '🎯 Almost there! Just the billing details left.'}
            {step === 4 && '🎉 Looking good! Review everything and submit.'}
          </span>
        </div>
      )}

      {/* Body: left form + right summary */}
      <div style={{ display: 'flex', flex: 1, minHeight: 0, overflow: 'hidden' }}>
        {/* LEFT — Form content */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: spacing[6],
          }}
        >
          <div
            key={stepKey}
            className={direction === 'forward' ? 'step-content-enter' : 'step-content-enter-reverse'}
            style={{ maxWidth: '780px' }}
          >
            {step === 1 && (
              <>
                {showNudge && (
                  <div
                    className="nudge-banner"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: spacing[3],
                      padding: `${spacing[3]} ${spacing[4]}`,
                      borderRadius: radii.lg,
                      background: colors.warning[50],
                      border: `1px solid ${colors.warning[400]}`,
                      marginBottom: spacing[5],
                    }}
                  >
                    <span style={{ fontSize: '1.1rem' }}>👋</span>
                    <span style={{
                      fontFamily: typography.fontFamily.body,
                      fontSize: typography.fontSize.sm,
                      fontWeight: typography.fontWeight.medium,
                      color: colors.warning[600],
                    }}>
                      Almost there! Just a few fields need your attention before we continue.
                    </span>
                  </div>
                )}
                <StepPatient
                  patient={patient}
                  setPatient={setPatient}
                  labelStyle={labelStyle}
                  touched={touched}
                  shakeFields={shakeFields}
                  onBlur={markTouched}
                  errors={step1Errors}
                />
              </>
            )}
            {step === 2 && (
              <StepProducts
                filteredProducts={filteredProducts}
                selectedProducts={selectedProducts}
                categoryFilter={categoryFilter}
                setCategoryFilter={setCategoryFilter}
                addProduct={addProduct}
                removeProduct={removeProduct}
                updateQuantity={updateQuantity}
                updateSize={updateSize}
                attachMeasurementForm={attachMeasurementForm}
                removeMeasurementForm={removeMeasurementForm}
                labelStyle={labelStyle}
              />
            )}
            {step === 3 && (
              <StepBilling
                billing={billing}
                setBilling={setBilling}
                billingRows={billingRows}
                totals={totals}
                billingShimmer={billingShimmer}
                labelStyle={labelStyle}
              />
            )}
            {step === 4 && (
              <StepReview
                patient={patient}
                selectedProducts={selectedProducts}
                billing={billing}
                selectedInsurance={selectedInsurance}
                totals={totals}
                notes={notes}
                setNotes={setNotes}
              />
            )}
          </div>

          {/* Navigation buttons */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: spacing[8],
              paddingTop: spacing[5],
              borderTop: `1px solid ${colors.neutral[150]}`,
              maxWidth: '780px',
            }}
          >
            {step > 1 ? (
              <button
                onClick={() => goTo((step - 1) as Step, 'back')}
                style={{
                  width: 'auto',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: spacing[2],
                  padding: `${spacing[3]} ${spacing[5]}`,
                  fontFamily: typography.fontFamily.body,
                  fontSize: typography.fontSize.base,
                  fontWeight: typography.fontWeight.medium,
                  color: colors.neutral[600],
                  background: colors.surface.card,
                  border: `1px solid ${colors.neutral[200]}`,
                  borderRadius: radii.lg,
                  cursor: 'pointer',
                  transition: transitions.default,
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = colors.neutral[300]; e.currentTarget.style.background = colors.neutral[50]; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = colors.neutral[200]; e.currentTarget.style.background = colors.surface.card; }}
              >
                <span>&#8592;</span> Back
              </button>
            ) : (
              <div />
            )}

            {step < 4 ? (
              <button
                onClick={step === 1 ? handleContinue : () => { if (canContinue) goTo((step + 1) as Step, 'forward'); }}
                disabled={continueDisabled}
                style={{
                  width: 'auto',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: spacing[2],
                  padding: `${spacing[3]} ${spacing[6]}`,
                  fontFamily: typography.fontFamily.body,
                  fontSize: typography.fontSize.base,
                  fontWeight: typography.fontWeight.semibold,
                  color: '#FFFFFF',
                  background: continueDisabled ? colors.neutral[300] : colors.primary[500],
                  border: 'none',
                  borderRadius: radii.lg,
                  cursor: continueDisabled ? 'not-allowed' : 'pointer',
                  transition: transitions.default,
                  boxShadow: continueDisabled ? 'none' : `0 2px 8px rgba(79, 106, 232, 0.25)`,
                  opacity: continueDisabled ? 0.7 : 1,
                }}
                onMouseEnter={e => { if (!continueDisabled) e.currentTarget.style.background = colors.primary[600]; }}
                onMouseLeave={e => { if (!continueDisabled) e.currentTarget.style.background = colors.primary[500]; }}
              >
                Continue <span>&#8594;</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setSubmitted(true);
                  onOrderCreated(orderId);
                }}
                style={{
                  width: 'auto',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: spacing[2],
                  padding: `${spacing[3]} ${spacing[8]}`,
                  fontFamily: typography.fontFamily.display,
                  fontSize: typography.fontSize.md,
                  fontWeight: typography.fontWeight.bold,
                  color: '#FFFFFF',
                  background: `linear-gradient(135deg, ${colors.primary[500]}, ${colors.primary[600]})`,
                  border: 'none',
                  borderRadius: radii.lg,
                  cursor: 'pointer',
                  transition: transitions.default,
                  boxShadow: `0 4px 14px rgba(79, 106, 232, 0.35)`,
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = `0 6px 20px rgba(79, 106, 232, 0.45)`; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `0 4px 14px rgba(79, 106, 232, 0.35)`; }}
              >
                Submit Order
              </button>
            )}
          </div>
        </div>

        {/* RIGHT — Summary panel */}
        <div
          style={{
            width: '320px',
            flexShrink: 0,
            borderLeft: `1px solid ${colors.neutral[150]}`,
            background: `linear-gradient(180deg, ${colors.neutral[50]} 0%, #FFFFFF 100%)`,
            overflowY: 'auto',
            position: 'sticky',
            top: 0,
            alignSelf: 'flex-start',
            height: '100%',
            maxHeight: '100%',
          }}
        >
          <SummaryPanel
            selectedProducts={selectedProducts}
            totals={totals}
            billing={billing}
            selectedInsurance={selectedInsurance}
            hasRequiresPriorAuth={hasRequiresPriorAuth}
          />
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ─── Demo data pool ─────────────────────────────────────────
const demoPatients: PatientInfo[] = [
  { firstName: 'Sarah', lastName: 'Johnson', dob: '1978-03-15', phone: '(305) 555-0142', email: 'sarah.j@email.com', street: '2847 Palm Beach Blvd', city: 'Miami', state: 'FL', zip: '33133', referringTherapist: 'Dr. Emily Chen', referringClinic: 'Palm Beach Lymphedema Center' },
  { firstName: 'Michael', lastName: 'Chen', dob: '1965-11-22', phone: '(786) 555-0198', email: 'mchen@email.com', street: '1420 Ocean Drive', city: 'Fort Lauderdale', state: 'FL', zip: '33304', referringTherapist: 'Dr. James Carter', referringClinic: 'Broward Oncology Associates' },
  { firstName: 'Lisa', lastName: 'Rivera', dob: '1982-06-08', phone: '(954) 555-0167', email: 'lrivera@email.com', street: '890 Cypress Creek Rd', city: 'Pompano Beach', state: 'FL', zip: '33069', referringTherapist: 'Dr. Maria Santos', referringClinic: 'Southeast Vascular Clinic' },
  { firstName: 'James', lastName: 'Williams', dob: '1955-01-30', phone: '(561) 555-0234', email: 'jwilliams@email.com', street: '4520 W Broward Blvd', city: 'Plantation', state: 'FL', zip: '33317', referringTherapist: 'Dr. Robert Kim', referringClinic: 'Plantation Physical Therapy' },
  { firstName: 'Patricia', lastName: 'Anderson', dob: '1970-09-12', phone: '(305) 555-0189', email: 'panderson@email.com', street: '3200 S University Dr', city: 'Davie', state: 'FL', zip: '33328', referringTherapist: 'Dr. Angela Wright', referringClinic: 'Nova Rehabilitation Center' },
  { firstName: 'David', lastName: 'Martinez', dob: '1990-04-03', phone: '(954) 555-0311', email: 'dmartinez@email.com', street: '7700 W Oakland Park Blvd', city: 'Sunrise', state: 'FL', zip: '33351', referringTherapist: 'Dr. Susan Park', referringClinic: 'Sunrise Medical Group' },
  { firstName: 'Karen', lastName: 'Thompson', dob: '1963-12-19', phone: '(561) 555-0456', email: 'kthompson@email.com', street: '1550 N Federal Hwy', city: 'Boca Raton', state: 'FL', zip: '33432', referringTherapist: 'Dr. Thomas Lee', referringClinic: 'Boca Raton Community Hospital' },
  { firstName: 'Robert', lastName: 'Kim', dob: '1988-04-25', phone: '(954) 555-0211', email: 'rkim@email.com', street: '2100 Stirling Rd', city: 'Hollywood', state: 'FL', zip: '33020', referringTherapist: 'Dr. Lisa Nguyen', referringClinic: 'Memorial Healthcare Outpatient' },
];

function getRandomPatient(): PatientInfo {
  return demoPatients[Math.floor(Math.random() * demoPatients.length)];
}

// STEP 1 — Patient Information
// ═══════════════════════════════════════════════════════════════
function StepPatient({
  patient,
  setPatient,
  labelStyle,
  touched,
  shakeFields,
  onBlur,
  errors,
}: {
  patient: PatientInfo;
  setPatient: React.Dispatch<React.SetStateAction<PatientInfo>>;
  labelStyle: React.CSSProperties;
  touched: Set<keyof PatientInfo>;
  shakeFields: boolean;
  onBlur: (field: keyof PatientInfo) => void;
  errors: Partial<Record<keyof PatientInfo, string>>;
}) {
  const update = (field: keyof PatientInfo) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setPatient(prev => ({ ...prev, [field]: e.target.value }));

  const fieldClass = (field: keyof PatientInfo) => {
    const state = getFieldState(field, patient[field], touched.has(field));
    const cls = ['medflow-input'];
    if (state === 'invalid') cls.push('field-invalid');
    if (state === 'valid') cls.push('field-valid');
    if (shakeFields && state === 'invalid') cls.push('field-shake');
    return cls.join(' ');
  };

  const fieldHint = (field: keyof PatientInfo) => {
    if (!touched.has(field)) return null;
    const err = errors[field];
    if (!err) return null;
    return (
      <div className="validation-hint">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <circle cx="6" cy="6" r="5.5" stroke="#DC2626" strokeWidth="1" />
          <path d="M6 3.5v3" stroke="#DC2626" strokeWidth="1.2" strokeLinecap="round" />
          <circle cx="6" cy="8.5" r="0.6" fill="#DC2626" />
        </svg>
        {err}
      </div>
    );
  };

  const fillDemo = () => {
    setPatient(getRandomPatient());
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <SectionHeader title="Patient Information" subtitle="Enter the patient's contact and shipping details" delay={0} />
        <button
          onClick={fillDemo}
          style={{
            width: 'auto',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 14px',
            borderRadius: radii.md,
            border: `1px dashed ${colors.accent[300]}`,
            background: colors.accent[50],
            color: colors.accent[700],
            fontSize: typography.fontSize.sm,
            fontWeight: typography.fontWeight.semibold,
            fontFamily: typography.fontFamily.body,
            cursor: 'pointer',
            transition: 'all 0.18s ease',
            marginTop: spacing[1],
            whiteSpace: 'nowrap',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = colors.accent[100];
            e.currentTarget.style.borderColor = colors.accent[400];
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = colors.accent[50];
            e.currentTarget.style.borderColor = colors.accent[300];
          }}
        >
          <span style={{ fontSize: '1rem' }}>⚡</span>
          Fill Demo Data
        </button>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: spacing[5],
          marginTop: spacing[6],
        }}
      >
        <FormField label="First Name *" delay={1} labelStyle={labelStyle}>
          <input className={fieldClass('firstName')} placeholder="Jane" value={patient.firstName} onChange={update('firstName')} onBlur={() => onBlur('firstName')} />
          {fieldHint('firstName')}
        </FormField>
        <FormField label="Last Name *" delay={2} labelStyle={labelStyle}>
          <input className={fieldClass('lastName')} placeholder="Doe" value={patient.lastName} onChange={update('lastName')} onBlur={() => onBlur('lastName')} />
          {fieldHint('lastName')}
        </FormField>
        <FormField label="Date of Birth" delay={3} labelStyle={labelStyle}>
          <input className="medflow-input" type="date" value={patient.dob} onChange={update('dob')} />
        </FormField>
        <FormField label="Phone" delay={4} labelStyle={labelStyle}>
          <input className={fieldClass('phone')} type="tel" placeholder="(555) 555-0123" value={patient.phone} onChange={update('phone')} onBlur={() => onBlur('phone')} />
          {fieldHint('phone')}
        </FormField>
        <FormField label="Email" delay={5} labelStyle={labelStyle} fullWidth>
          <input className={fieldClass('email')} type="email" placeholder="patient@email.com" value={patient.email} onChange={update('email')} onBlur={() => onBlur('email')} />
          {fieldHint('email')}
        </FormField>
      </div>

      <div style={{ marginTop: spacing[8] }}>
        <SectionHeader title="Shipping Address" subtitle="Where should the order be delivered?" delay={6} small />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing[5], marginTop: spacing[4] }}>
          <FormField label="Street Address" delay={7} labelStyle={labelStyle} fullWidth>
            <input className="medflow-input" placeholder="123 Main Street" value={patient.street} onChange={update('street')} />
          </FormField>
          <FormField label="City" delay={8} labelStyle={labelStyle}>
            <input className="medflow-input" placeholder="Miami" value={patient.city} onChange={update('city')} />
          </FormField>
          <FormField label="State" delay={9} labelStyle={labelStyle}>
            <input className="medflow-input" placeholder="FL" value={patient.state} onChange={update('state')} />
          </FormField>
          <FormField label="ZIP Code" delay={10} labelStyle={labelStyle}>
            <input className={fieldClass('zip')} placeholder="33133" value={patient.zip} onChange={update('zip')} onBlur={() => onBlur('zip')} />
            {fieldHint('zip')}
          </FormField>
        </div>
      </div>

      <div style={{ marginTop: spacing[8] }}>
        <SectionHeader title="Referral Information" subtitle="Optional referring provider details" delay={11} small />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing[5], marginTop: spacing[4] }}>
          <FormField label="Referring Therapist" delay={12} labelStyle={labelStyle}>
            <input className="medflow-input" placeholder="Dr. Smith" value={patient.referringTherapist} onChange={update('referringTherapist')} />
          </FormField>
          <FormField label="Referring Clinic" delay={13} labelStyle={labelStyle}>
            <input className="medflow-input" placeholder="Palm Beach Clinic" value={patient.referringClinic} onChange={update('referringClinic')} />
          </FormField>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// STEP 2 — Product Selection
// ═══════════════════════════════════════════════════════════════
function StepProducts({
  filteredProducts,
  selectedProducts,
  categoryFilter,
  setCategoryFilter,
  addProduct,
  removeProduct,
  updateQuantity,
  updateSize,
  attachMeasurementForm,
  removeMeasurementForm,
  labelStyle: _labelStyle,
}: {
  filteredProducts: Product[];
  selectedProducts: SelectedProduct[];
  categoryFilter: ProductCategory | 'All';
  setCategoryFilter: (c: ProductCategory | 'All') => void;
  addProduct: (p: Product) => void;
  removeProduct: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  updateSize: (id: string, size: string) => void;
  attachMeasurementForm: (productId: string, file: File) => void;
  removeMeasurementForm: (productId: string) => void;
  labelStyle: React.CSSProperties;
}) {
  const selectedIds = useMemo(() => new Set(selectedProducts.map(sp => sp.product.id)), [selectedProducts]);

  return (
    <div>
      <SectionHeader title="Select Products" subtitle="Browse the catalog and add items to this order" delay={0} />

      {/* Category chips */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: spacing[2],
          marginTop: spacing[5],
          marginBottom: spacing[5],
        }}
      >
        {(['All', ...productCategories] as const).map(cat => {
          const isActive = categoryFilter === cat;
          return (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat as ProductCategory | 'All')}
              style={{
                width: 'auto',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 14px',
                borderRadius: radii.full,
                border: isActive ? `1.5px solid ${colors.primary[500]}` : `1px solid ${colors.neutral[200]}`,
                background: isActive ? colors.primary[500] : colors.neutral[0],
                color: isActive ? '#FFFFFF' : colors.neutral[500],
                fontSize: typography.fontSize.sm,
                fontWeight: isActive ? typography.fontWeight.semibold : typography.fontWeight.medium,
                fontFamily: typography.fontFamily.body,
                cursor: 'pointer',
                transition: 'all 0.18s ease',
                whiteSpace: 'nowrap',
                boxShadow: isActive ? '0 2px 8px rgba(79, 106, 232, 0.25)' : 'none',
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Product grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing[3] }}>
        {filteredProducts.map((product, i) => {
          const vendor = getVendor(product.vendorId);
          const isSelected = selectedIds.has(product.id);
          return (
            <div
              key={product.id}
              className={`product-option ${isSelected ? 'selected' : ''} animate-fade-in-up delay-${Math.min(i + 1, 6)}`}
              onClick={() => !isSelected && addProduct(product)}
              style={{ position: 'relative' }}
            >
              {isSelected && (
                <div
                  style={{
                    position: 'absolute',
                    top: spacing[2],
                    right: spacing[2],
                    width: '20px',
                    height: '20px',
                    borderRadius: radii.full,
                    background: colors.primary[500],
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1,
                  }}
                >
                  <svg width="10" height="10" viewBox="0 0 14 14" fill="none">
                    <path d="M2.5 7L5.5 10L11.5 4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}
              <div style={{ display: 'flex', gap: spacing[3], alignItems: 'flex-start' }}>
                {product.imageUrl && (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: radii.md,
                      flexShrink: 0,
                      objectFit: 'cover',
                    }}
                  />
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontFamily: typography.fontFamily.display,
                  fontSize: typography.fontSize.base,
                  fontWeight: typography.fontWeight.semibold,
                  color: colors.neutral[900],
                  marginBottom: spacing[1],
                  paddingRight: spacing[6],
                }}
              >
                {product.name}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: spacing[3], marginBottom: spacing[1] }}>
                <span
                  style={{
                    fontFamily: typography.fontFamily.mono,
                    fontSize: typography.fontSize.xs,
                    color: colors.primary[500],
                    background: colors.primary[50],
                    padding: `2px ${spacing[2]}`,
                    borderRadius: radii.sm,
                    fontWeight: typography.fontWeight.medium,
                  }}
                >
                  {product.hcpcsCode}
                </span>
                <span
                  style={{
                    fontFamily: typography.fontFamily.body,
                    fontSize: typography.fontSize.xs,
                    color: colors.neutral[400],
                  }}
                >
                  {vendor?.name}
                </span>
              </div>
              <div
                style={{
                  fontFamily: typography.fontFamily.mono,
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeight.semibold,
                  color: colors.neutral[800],
                }}
              >
                {formatCurrency(product.unitCost)}
                <span style={{ fontWeight: typography.fontWeight.regular, color: colors.neutral[400], fontSize: typography.fontSize.xs }}> / unit</span>
              </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected products detail */}
      {selectedProducts.length > 0 && (
        <div style={{ marginTop: spacing[8] }}>
          <h3
            style={{
              fontFamily: typography.fontFamily.display,
              fontSize: typography.fontSize.lg,
              fontWeight: typography.fontWeight.semibold,
              color: colors.neutral[800],
              margin: `0 0 ${spacing[4]}`,
            }}
          >
            Selected Items ({selectedProducts.length})
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[3] }}>
            {selectedProducts.map(sp => {
              const vendor = getVendor(sp.product.vendorId);
              return (
                <div
                  key={sp.product.id}
                  className="animate-scale-in"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: spacing[4],
                    padding: spacing[4],
                    background: colors.surface.card,
                    borderRadius: radii.lg,
                    border: `1px solid ${colors.neutral[200]}`,
                    boxShadow: shadows.xs,
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontFamily: typography.fontFamily.display,
                        fontSize: typography.fontSize.base,
                        fontWeight: typography.fontWeight.semibold,
                        color: colors.neutral[900],
                        marginBottom: '2px',
                      }}
                    >
                      {sp.product.name}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2], flexWrap: 'wrap' }}>
                      <span
                        style={{
                          fontFamily: typography.fontFamily.mono,
                          fontSize: typography.fontSize.xs,
                          color: colors.primary[500],
                        }}
                      >
                        {sp.product.hcpcsCode}
                      </span>
                      <span style={{ color: colors.neutral[300] }}>|</span>
                      <span style={{ fontFamily: typography.fontFamily.body, fontSize: typography.fontSize.xs, color: colors.neutral[400] }}>
                        {vendor?.name}
                      </span>
                    </div>

                    {/* Measurement form upload + badges */}
                    <div style={{ display: 'flex', gap: spacing[2], marginTop: spacing[2], flexWrap: 'wrap', alignItems: 'center' }}>
                      {sp.product.requiresMeasurement && !sp.measurementForm && (
                        <label
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontFamily: typography.fontFamily.body,
                            fontSize: typography.fontSize.xs,
                            color: colors.primary[600],
                            cursor: 'pointer',
                            transition: transitions.fast,
                          }}
                          onMouseEnter={e => { e.currentTarget.style.color = colors.primary[700]; }}
                          onMouseLeave={e => { e.currentTarget.style.color = colors.primary[600]; }}
                        >
                          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                            <path d="M8 1v10M4 5l4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M2 11v2a2 2 0 002 2h8a2 2 0 002-2v-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          Upload measurement form
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png,.webp"
                            style={{ display: 'none' }}
                            onChange={e => {
                              const file = e.target.files?.[0];
                              if (file) attachMeasurementForm(sp.product.id, file);
                              e.target.value = '';
                            }}
                          />
                        </label>
                      )}
                      {sp.product.requiresMeasurement && sp.measurementForm && (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontFamily: typography.fontFamily.body,
                            fontSize: typography.fontSize.xs,
                            color: colors.success[600],
                            background: colors.success[50],
                            padding: `2px ${spacing[2]}`,
                            borderRadius: radii.md,
                          }}
                        >
                          <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                            <path d="M2.5 7L5.5 10.5L11.5 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          {sp.measurementForm.name.length > 20
                            ? sp.measurementForm.name.slice(0, 17) + '...'
                            : sp.measurementForm.name}
                          <button
                            type="button"
                            onClick={() => removeMeasurementForm(sp.product.id)}
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              color: colors.neutral[400],
                              padding: 0,
                              display: 'flex',
                              alignItems: 'center',
                              fontSize: '14px',
                              lineHeight: 1,
                            }}
                            onMouseEnter={e => { e.currentTarget.style.color = colors.neutral[600]; }}
                            onMouseLeave={e => { e.currentTarget.style.color = colors.neutral[400]; }}
                          >
                            ×
                          </button>
                        </span>
                      )}
                      {sp.product.requiresPriorAuth && (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontFamily: typography.fontFamily.body,
                            fontSize: typography.fontSize.xs,
                            fontWeight: typography.fontWeight.medium,
                            color: colors.warning[600],
                            background: colors.warning[50],
                            padding: `2px ${spacing[2]}`,
                            borderRadius: radii.full,
                          }}
                        >
                          Requires prior authorization
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Size selector */}
                  {sp.product.sizes && sp.product.sizes.length > 0 && (
                    <CustomSelect
                      value={sp.size ?? sp.product.sizes[0]}
                      onChange={val => updateSize(sp.product.id, val)}
                      options={sp.product.sizes.map(s => ({ value: s, label: s }))}
                      style={{ width: '80px' }}
                    />
                  )}

                  {/* Quantity */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0,
                      border: `1px solid ${colors.neutral[200]}`,
                      borderRadius: radii.md,
                      overflow: 'hidden',
                    }}
                  >
                    <button
                      onClick={() => updateQuantity(sp.product.id, -1)}
                      style={{
                        width: 'auto',
                        padding: `${spacing[1]} ${spacing[3]}`,
                        background: colors.neutral[50],
                        border: 'none',
                        cursor: 'pointer',
                        fontFamily: typography.fontFamily.body,
                        fontSize: typography.fontSize.md,
                        color: colors.neutral[600],
                        lineHeight: 1,
                      }}
                    >
                      -
                    </button>
                    <span
                      style={{
                        padding: `${spacing[1]} ${spacing[3]}`,
                        fontFamily: typography.fontFamily.mono,
                        fontSize: typography.fontSize.sm,
                        fontWeight: typography.fontWeight.semibold,
                        color: colors.neutral[900],
                        minWidth: '32px',
                        textAlign: 'center',
                      }}
                    >
                      {sp.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(sp.product.id, 1)}
                      style={{
                        width: 'auto',
                        padding: `${spacing[1]} ${spacing[3]}`,
                        background: colors.neutral[50],
                        border: 'none',
                        cursor: 'pointer',
                        fontFamily: typography.fontFamily.body,
                        fontSize: typography.fontSize.md,
                        color: colors.neutral[600],
                        lineHeight: 1,
                      }}
                    >
                      +
                    </button>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeProduct(sp.product.id)}
                    style={{
                      width: 'auto',
                      padding: spacing[1],
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '1.1rem',
                      color: colors.neutral[400],
                      borderRadius: radii.sm,
                      transition: transitions.fast,
                      lineHeight: 1,
                    }}
                    onMouseEnter={e => { e.currentTarget.style.color = colors.danger[500]; }}
                    onMouseLeave={e => { e.currentTarget.style.color = colors.neutral[400]; }}
                    title="Remove item"
                  >
                    &times;
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// STEP 3 — Billing & Insurance
// ═══════════════════════════════════════════════════════════════
function StepBilling({
  billing,
  setBilling,
  billingRows,
  totals,
  billingShimmer,
  labelStyle,
}: {
  billing: BillingInfo;
  setBilling: React.Dispatch<React.SetStateAction<BillingInfo>>;
  billingRows: Array<SelectedProduct & { billableAmount: number; vendorCost: number; margin: number; marginPercent: number; patientResponsibility: number; hasFeeSchedule: boolean }>;
  totals: { totalBillable: number; totalVendorCost: number; margin: number; marginPercent: number; patientOwes: number };
  billingShimmer: boolean;
  labelStyle: React.CSSProperties;
}) {
  return (
    <div>
      <SectionHeader title="Billing & Insurance" subtitle="Configure payment and see real-time cost calculations" delay={0} />

      {/* Self-pay toggle */}
      <div
        className="animate-fade-in-up delay-1"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: spacing[4],
          marginTop: spacing[6],
          padding: spacing[5],
          background: billing.isSelfPay ? colors.accent[50] : colors.neutral[50],
          borderRadius: radii.lg,
          border: `1px solid ${billing.isSelfPay ? colors.accent[200] : colors.neutral[200]}`,
          transition: transitions.default,
        }}
      >
        <button
          onClick={() => setBilling(prev => ({ ...prev, isSelfPay: !prev.isSelfPay }))}
          style={{
            width: 'auto',
            position: 'relative',
            display: 'inline-block',
            flexShrink: 0,
            height: '28px',
            padding: 0,
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
          }}
        >
          <div
            style={{
              width: '48px',
              height: '28px',
              borderRadius: radii.full,
              background: billing.isSelfPay ? colors.accent[500] : colors.neutral[300],
              transition: transitions.smooth,
              position: 'relative',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '3px',
                left: billing.isSelfPay ? '23px' : '3px',
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                background: '#FFFFFF',
                boxShadow: shadows.sm,
                transition: transitions.smooth,
              }}
            />
          </div>
        </button>
        <div>
          <div
            style={{
              fontFamily: typography.fontFamily.display,
              fontSize: typography.fontSize.base,
              fontWeight: typography.fontWeight.semibold,
              color: colors.neutral[900],
            }}
          >
            Self-Pay Patient
          </div>
          <div
            style={{
              fontFamily: typography.fontFamily.body,
              fontSize: typography.fontSize.xs,
              color: colors.neutral[500],
              marginTop: '2px',
            }}
          >
            {billing.isSelfPay ? 'Using MSRP pricing, no insurance claim' : 'Toggle on if patient is paying out of pocket'}
          </div>
        </div>
      </div>

      {/* Insurance fields */}
      {!billing.isSelfPay && (
        <div
          className="animate-fade-in-up"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: spacing[5],
            marginTop: spacing[6],
          }}
        >
          <FormField label="Insurance Provider *" delay={2} labelStyle={labelStyle} fullWidth>
            <CustomSelect
              value={billing.insuranceProviderId}
              onChange={val => setBilling(prev => ({ ...prev, insuranceProviderId: val }))}
              placeholder="Select provider..."
              options={insuranceProviders.map(ip => ({ value: ip.id, label: ip.name }))}
            />
          </FormField>
          <FormField label="Policy Number" delay={3} labelStyle={labelStyle}>
            <input
              className="medflow-input"
              placeholder="BCB-000000-A"
              value={billing.policyNumber}
              onChange={e => setBilling(prev => ({ ...prev, policyNumber: e.target.value }))}
              style={{ fontFamily: typography.fontFamily.mono }}
            />
          </FormField>
          <FormField label="Group Number" delay={4} labelStyle={labelStyle}>
            <input
              className="medflow-input"
              placeholder="GRP-0000"
              value={billing.groupNumber}
              onChange={e => setBilling(prev => ({ ...prev, groupNumber: e.target.value }))}
              style={{ fontFamily: typography.fontFamily.mono }}
            />
          </FormField>
        </div>
      )}

      {/* Billing table */}
      {billingRows.length > 0 && (
        <div style={{ marginTop: spacing[8] }}>
          <h3
            style={{
              fontFamily: typography.fontFamily.display,
              fontSize: typography.fontSize.lg,
              fontWeight: typography.fontWeight.semibold,
              color: colors.neutral[800],
              margin: `0 0 ${spacing[4]}`,
            }}
          >
            Cost Breakdown
          </h3>

          <div
            style={{
              borderRadius: radii.lg,
              border: `1px solid ${colors.neutral[200]}`,
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            {billingShimmer && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(90deg, transparent 0%, rgba(79,106,232,0.06) 50%, transparent 100%)',
                  backgroundSize: '400% 100%',
                  animation: 'shimmer 0.8s ease infinite',
                  zIndex: 1,
                  borderRadius: radii.lg,
                  pointerEvents: 'none',
                }}
              />
            )}
            <table className="medflow-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: colors.neutral[50] }}>
                  {['Product', 'HCPCS', 'Vendor Cost', 'Allowed Amt', 'Patient (20%)'].map(h => (
                    <th
                      key={h}
                      style={{
                        padding: `${spacing[3]} ${spacing[4]}`,
                        fontFamily: typography.fontFamily.body,
                        fontSize: typography.fontSize.xs,
                        fontWeight: typography.fontWeight.semibold,
                        color: colors.neutral[500],
                        textTransform: 'uppercase' as const,
                        letterSpacing: typography.letterSpacing.wider,
                        textAlign: h === 'Product' ? 'left' : 'right',
                        borderBottom: `1px solid ${colors.neutral[200]}`,
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {billingRows.map(row => (
                  <tr key={row.product.id}>
                    <td style={{ padding: `${spacing[3]} ${spacing[4]}`, fontFamily: typography.fontFamily.body, fontSize: typography.fontSize.sm, color: colors.neutral[800], fontWeight: typography.fontWeight.medium, borderBottom: `1px solid ${colors.neutral[100]}` }}>
                      {row.product.name}
                      {!row.hasFeeSchedule && (
                        <div style={{ fontFamily: typography.fontFamily.body, fontSize: typography.fontSize.xs, color: colors.warning[600], marginTop: '2px' }}>
                          No rate found, using MSRP
                        </div>
                      )}
                    </td>
                    <td style={{ padding: `${spacing[3]} ${spacing[4]}`, fontFamily: typography.fontFamily.mono, fontSize: typography.fontSize.xs, color: colors.neutral[500], textAlign: 'right', borderBottom: `1px solid ${colors.neutral[100]}` }}>
                      {row.product.hcpcsCode}
                    </td>
                    <td style={{ padding: `${spacing[3]} ${spacing[4]}`, fontFamily: typography.fontFamily.mono, fontSize: typography.fontSize.sm, color: colors.neutral[700], textAlign: 'right', borderBottom: `1px solid ${colors.neutral[100]}` }}>
                      {formatCurrency(row.vendorCost)}
                    </td>
                    <td style={{ padding: `${spacing[3]} ${spacing[4]}`, fontFamily: typography.fontFamily.mono, fontSize: typography.fontSize.sm, color: colors.neutral[800], fontWeight: typography.fontWeight.semibold, textAlign: 'right', borderBottom: `1px solid ${colors.neutral[100]}` }}>
                      {formatCurrency(row.billableAmount)}
                    </td>
                    <td style={{ padding: `${spacing[3]} ${spacing[4]}`, fontFamily: typography.fontFamily.mono, fontSize: typography.fontSize.sm, color: colors.accent[600], fontWeight: typography.fontWeight.semibold, textAlign: 'right', borderBottom: `1px solid ${colors.neutral[100]}` }}>
                      {formatCurrency(row.patientResponsibility)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr style={{ background: colors.neutral[50] }}>
                  <td
                    colSpan={2}
                    style={{
                      padding: `${spacing[4]} ${spacing[4]}`,
                      fontFamily: typography.fontFamily.display,
                      fontSize: typography.fontSize.sm,
                      fontWeight: typography.fontWeight.bold,
                      color: colors.neutral[800],
                    }}
                  >
                    Totals
                  </td>
                  <td style={{ padding: `${spacing[4]} ${spacing[4]}`, fontFamily: typography.fontFamily.mono, fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.bold, color: colors.neutral[700], textAlign: 'right' }}>
                    {formatCurrency(totals.totalVendorCost)}
                  </td>
                  <td style={{ padding: `${spacing[4]} ${spacing[4]}`, fontFamily: typography.fontFamily.mono, fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.bold, color: colors.neutral[900], textAlign: 'right' }}>
                    {formatCurrency(totals.totalBillable)}
                  </td>
                  <td style={{ padding: `${spacing[4]} ${spacing[4]}`, fontFamily: typography.fontFamily.mono, fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.bold, color: colors.accent[600], textAlign: 'right' }}>
                    {formatCurrency(totals.patientOwes)}
                  </td>
                </tr>
                <tr>
                  <td colSpan={5} style={{ padding: `${spacing[3]} ${spacing[4]}`, borderTop: `1px solid ${colors.neutral[200]}` }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: spacing[6] }}>
                      <span style={{ fontFamily: typography.fontFamily.body, fontSize: typography.fontSize.sm, color: colors.neutral[500] }}>
                        Margin:{' '}
                        <span style={{ fontFamily: typography.fontFamily.mono, fontWeight: typography.fontWeight.semibold, color: totals.margin >= 0 ? colors.success[600] : colors.danger[500] }}>
                          {formatCurrency(totals.margin)} ({totals.marginPercent.toFixed(1)}%)
                        </span>
                      </span>
                    </div>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// STEP 4 — Review & Submit
// ═══════════════════════════════════════════════════════════════
function StepReview({
  patient,
  selectedProducts,
  billing,
  selectedInsurance,
  totals,
  notes,
  setNotes,
}: {
  patient: PatientInfo;
  selectedProducts: SelectedProduct[];
  billing: BillingInfo;
  selectedInsurance: { id: string; name: string; shortName: string } | undefined;
  totals: { totalBillable: number; totalVendorCost: number; margin: number; marginPercent: number; patientOwes: number };
  notes: string;
  setNotes: (v: string) => void;
}) {
  const cardStyle: React.CSSProperties = {
    background: colors.surface.card,
    borderRadius: radii.xl,
    border: `1px solid ${colors.neutral[200]}`,
    padding: spacing[5],
    boxShadow: shadows.sm,
  };

  const sectionTitleStyle: React.CSSProperties = {
    fontFamily: typography.fontFamily.display,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral[800],
    marginBottom: spacing[4],
    paddingBottom: spacing[3],
    borderBottom: `1px solid ${colors.neutral[100]}`,
  };

  const rowStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    padding: `${spacing[1]} 0`,
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm,
  };

  return (
    <div>
      <SectionHeader title="Review Order" subtitle="Verify all details before submitting" delay={0} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[5], marginTop: spacing[6] }}>
        {/* Patient card */}
        <div className="animate-fade-in-up delay-1" style={cardStyle}>
          <div style={sectionTitleStyle}>Patient Information</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: `${spacing[5]} ${spacing[6]}` }}>
            {([
              ['Name', `${patient.firstName} ${patient.lastName}`],
              ['Date of Birth', patient.dob || '---'],
              ['Phone', patient.phone || '---'],
              ['Email', patient.email || '---'],
              ['Referring Therapist', patient.referringTherapist || '---'],
              ['Referring Clinic', patient.referringClinic || '---'],
            ] as const).map(([label, value]) => (
              <div key={label}>
                <div style={{
                  fontFamily: typography.fontFamily.body,
                  fontSize: '11px',
                  fontWeight: typography.fontWeight.medium,
                  color: colors.neutral[400],
                  textTransform: 'uppercase' as const,
                  letterSpacing: typography.letterSpacing.wider,
                  marginBottom: spacing[1],
                }}>{label}</div>
                <div style={{
                  fontFamily: typography.fontFamily.body,
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeight.semibold,
                  color: colors.neutral[800],
                  lineHeight: typography.lineHeight.normal,
                }}>{value}</div>
              </div>
            ))}
          </div>
          {(patient.street || patient.city) && (
            <div style={{ marginTop: spacing[5], paddingTop: spacing[4], borderTop: `1px solid ${colors.neutral[100]}` }}>
              <div style={{
                fontFamily: typography.fontFamily.body,
                fontSize: '11px',
                fontWeight: typography.fontWeight.medium,
                color: colors.neutral[400],
                textTransform: 'uppercase' as const,
                letterSpacing: typography.letterSpacing.wider,
                marginBottom: spacing[1],
              }}>Shipping Address</div>
              <div style={{
                fontFamily: typography.fontFamily.body,
                fontSize: typography.fontSize.sm,
                fontWeight: typography.fontWeight.semibold,
                color: colors.neutral[800],
              }}>
                {[patient.street, patient.city, patient.state, patient.zip].filter(Boolean).join(', ')}
              </div>
            </div>
          )}
        </div>

        {/* Products card */}
        <div className="animate-fade-in-up delay-2" style={cardStyle}>
          <div style={sectionTitleStyle}>Products ({selectedProducts.length})</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[3] }}>
            {selectedProducts.map(sp => (
              <div
                key={sp.product.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: `${spacing[2]} 0`,
                  borderBottom: `1px solid ${colors.neutral[100]}`,
                }}
              >
                <div>
                  <div style={{ fontFamily: typography.fontFamily.body, fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium, color: colors.neutral[800] }}>
                    {sp.product.name}
                  </div>
                  <div style={{ fontFamily: typography.fontFamily.mono, fontSize: typography.fontSize.xs, color: colors.neutral[400] }}>
                    {sp.product.hcpcsCode} {sp.size ? `| Size: ${sp.size}` : ''}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: typography.fontFamily.mono, fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold, color: colors.neutral[800] }}>
                    {sp.quantity} x {formatCurrency(sp.product.unitCost)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Billing card */}
        <div className="animate-fade-in-up delay-3" style={cardStyle}>
          <div style={sectionTitleStyle}>Billing Summary</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[2] }}>
            <div style={rowStyle}>
              <span style={{ color: colors.neutral[400] }}>Payment</span>
              <span style={{ color: colors.neutral[800], fontWeight: typography.fontWeight.medium }}>
                {billing.isSelfPay ? 'Self-Pay (MSRP)' : selectedInsurance?.name ?? '---'}
              </span>
            </div>
            <div style={rowStyle}>
              <span style={{ color: colors.neutral[400] }}>Total Billable</span>
              <span style={{ fontFamily: typography.fontFamily.mono, color: colors.neutral[800], fontWeight: typography.fontWeight.semibold }}>{formatCurrency(totals.totalBillable)}</span>
            </div>
            <div style={rowStyle}>
              <span style={{ color: colors.neutral[400] }}>Total Vendor Cost</span>
              <span style={{ fontFamily: typography.fontFamily.mono, color: colors.neutral[700] }}>{formatCurrency(totals.totalVendorCost)}</span>
            </div>
            <div style={rowStyle}>
              <span style={{ color: colors.neutral[400] }}>Margin</span>
              <span style={{ fontFamily: typography.fontFamily.mono, color: colors.success[600], fontWeight: typography.fontWeight.semibold }}>
                {formatCurrency(totals.margin)} ({totals.marginPercent.toFixed(1)}%)
              </span>
            </div>
            <div style={{ ...rowStyle, marginTop: spacing[2], paddingTop: spacing[3], borderTop: `1px solid ${colors.neutral[200]}` }}>
              <span style={{ fontFamily: typography.fontFamily.display, fontWeight: typography.fontWeight.bold, color: colors.neutral[900] }}>Patient Owes</span>
              <span style={{ fontFamily: typography.fontFamily.mono, fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.bold, color: colors.accent[600] }}>
                {formatCurrency(totals.patientOwes)}
              </span>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="animate-fade-in-up delay-4" style={cardStyle}>
          <div style={sectionTitleStyle}>Order Notes</div>
          <textarea
            className="medflow-input"
            placeholder="Add any special instructions or notes for this order..."
            rows={3}
            value={notes}
            onChange={e => setNotes(e.target.value)}
            style={{ resize: 'vertical' }}
          />
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// Summary Panel (Right Side)
// ═══════════════════════════════════════════════════════════════
function SummaryPanel({
  selectedProducts,
  totals,
  billing,
  selectedInsurance,
  hasRequiresPriorAuth,
}: {
  selectedProducts: SelectedProduct[];
  totals: { totalBillable: number; totalVendorCost: number; margin: number; marginPercent: number; patientOwes: number };
  billing: BillingInfo;
  selectedInsurance: { id: string; name: string; shortName: string } | undefined;
  hasRequiresPriorAuth: boolean;
}) {
  const rowStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: `${spacing[1]} 0`,
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm,
  };

  return (
    <div style={{ padding: spacing[5] }}>
      <h3
        style={{
          fontFamily: typography.fontFamily.display,
          fontSize: typography.fontSize.lg,
          fontWeight: typography.fontWeight.bold,
          color: colors.neutral[900],
          margin: `0 0 ${spacing[5]}`,
          letterSpacing: typography.letterSpacing.tight,
        }}
      >
        Order Summary
      </h3>

      {/* Line items */}
      {selectedProducts.length === 0 ? (
        <div
          style={{
            padding: spacing[8],
            textAlign: 'center',
            fontFamily: typography.fontFamily.body,
            fontSize: typography.fontSize.sm,
            color: colors.neutral[400],
          }}
        >
          No products selected yet
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[2] }}>
          {selectedProducts.map(sp => (
            <div key={sp.product.id} className="summary-value-animate" style={rowStyle}>
              <div style={{ flex: 1, minWidth: 0, marginRight: spacing[2] }}>
                <div
                  style={{
                    fontSize: typography.fontSize.sm,
                    fontWeight: typography.fontWeight.medium,
                    color: colors.neutral[700],
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {sp.product.name}
                </div>
                <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[400] }}>
                  {sp.quantity} x {formatCurrency(sp.product.unitCost)}
                </div>
              </div>
              <span
                style={{
                  fontFamily: typography.fontFamily.mono,
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeight.semibold,
                  color: colors.neutral[800],
                  flexShrink: 0,
                }}
              >
                {formatCurrency(sp.product.unitCost * sp.quantity)}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Divider */}
      <div style={{ height: '1px', background: colors.neutral[200], margin: `${spacing[4]} 0` }} />

      {/* Subtotals */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[2] }}>
        <div style={rowStyle}>
          <span style={{ color: colors.neutral[400] }}>Vendor Cost</span>
          <span className="summary-value-animate" style={{ fontFamily: typography.fontFamily.mono, color: colors.neutral[600], fontWeight: typography.fontWeight.medium }}>
            {formatCurrency(totals.totalVendorCost)}
          </span>
        </div>
        <div style={rowStyle}>
          <span style={{ color: colors.neutral[400] }}>Billable</span>
          <span className="summary-value-animate" style={{ fontFamily: typography.fontFamily.mono, color: colors.neutral[800], fontWeight: typography.fontWeight.semibold }}>
            {formatCurrency(totals.totalBillable)}
          </span>
        </div>
        <div style={rowStyle}>
          <span style={{ color: colors.neutral[400] }}>Margin</span>
          <span
            className="summary-value-animate"
            style={{
              fontFamily: typography.fontFamily.mono,
              fontWeight: typography.fontWeight.semibold,
              color: totals.margin >= 0 ? colors.success[600] : colors.danger[500],
            }}
          >
            {formatCurrency(totals.margin)} ({totals.marginPercent.toFixed(1)}%)
          </span>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: '1px', background: colors.neutral[200], margin: `${spacing[4]} 0` }} />

      {/* Patient owes */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span
          style={{
            fontFamily: typography.fontFamily.display,
            fontSize: typography.fontSize.base,
            fontWeight: typography.fontWeight.bold,
            color: colors.neutral[900],
          }}
        >
          Patient Owes
        </span>
        <span
          className="summary-value-animate"
          style={{
            fontFamily: typography.fontFamily.mono,
            fontSize: typography.fontSize.xl,
            fontWeight: typography.fontWeight.bold,
            color: colors.accent[600],
          }}
        >
          {formatCurrency(totals.patientOwes)}
        </span>
      </div>

      {/* Payment type */}
      <div
        style={{
          marginTop: spacing[3],
          fontFamily: typography.fontFamily.body,
          fontSize: typography.fontSize.xs,
          color: colors.neutral[400],
          textAlign: 'right',
        }}
      >
        {billing.isSelfPay ? 'Self-Pay (MSRP)' : selectedInsurance?.shortName ?? 'No insurance selected'}
      </div>

      {/* Prior auth warning */}
      {hasRequiresPriorAuth && (
        <div
          style={{
            marginTop: spacing[4],
            padding: `${spacing[3]} ${spacing[4]}`,
            background: colors.warning[50],
            borderRadius: radii.md,
            border: `1px solid ${colors.warning[100]}`,
            display: 'flex',
            alignItems: 'center',
            gap: spacing[2],
            fontFamily: typography.fontFamily.body,
            fontSize: typography.fontSize.xs,
            fontWeight: typography.fontWeight.medium,
            color: colors.warning[600],
          }}
        >
          <span style={{ fontSize: '0.9rem' }}>!</span>
          Items in this order require prior authorization
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// Success Screen
// ═══════════════════════════════════════════════════════════════
// ── Empathetic messages — remind the team why their work matters ──
const impactMessages = [
  {
    headline: 'You just made someone\'s recovery easier',
    body: 'The supplies you ordered will help {name} manage their condition with more comfort and dignity. That matters more than any spreadsheet.',
    icon: '💛',
  },
  {
    headline: 'This order is someone\'s fresh start',
    body: '{name} is counting on these supplies to move forward in their recovery journey. You just made that happen.',
    icon: '🌱',
  },
  {
    headline: 'Behind every order is a person healing',
    body: 'What you just sent isn\'t just products. It\'s relief, comfort, and hope for {name}. Thank you for caring about the details.',
    icon: '✨',
  },
  {
    headline: 'You\'re part of someone\'s care team',
    body: 'The supplies heading to {name} will support their daily wellbeing. Your accuracy and attention to detail make a real difference in their life.',
    icon: '🤝',
  },
  {
    headline: 'Someone will sleep better tonight',
    body: '{name}\'s order is on its way. The right supplies at the right time can change how someone experiences each day. You helped make that happen.',
    icon: '🌙',
  },
  {
    headline: 'Every order tells a story of care',
    body: 'Behind {name}\'s order is a therapist\'s recommendation, a patient\'s hope, and now your work making it real. That\'s something to be proud of.',
    icon: '💜',
  },
  {
    headline: 'You just bridged the gap between need and care',
    body: 'From the moment {name}\'s provider wrote this order to right now, you\'re the person who made sure it actually happened. That\'s powerful.',
    icon: '🌉',
  },
  {
    headline: 'Small action, big impact',
    body: 'For {name}, receiving these supplies means less pain, more independence, or simply a better day. Your work just made that possible.',
    icon: '🦋',
  },
];

function SuccessScreen({ orderId, patientName, productCount, selectedProducts, onBack }: { orderId: string; patientName: string; productCount: number; selectedProducts: SelectedProduct[]; onBack: () => void }) {
  const confettiColors = [colors.primary[400], colors.accent[400], colors.success[400], colors.primary[200], colors.accent[200], '#FBBF24', '#A78BFA', '#F472B6'];

  // Pick a random empathetic message (stable across re-renders)
  const [message] = useState(() => {
    const m = impactMessages[Math.floor(Math.random() * impactMessages.length)];
    return {
      ...m,
      body: m.body.replace(/\{name\}/g, patientName.trim() || 'your patient'),
    };
  });

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: `${spacing[10]} ${spacing[8]}`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Confetti particles — more of them, spread wider */}
      {Array.from({ length: 30 }).map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: `${-5 + Math.random() * 45}%`,
            left: `${5 + Math.random() * 90}%`,
            width: `${5 + Math.random() * 8}px`,
            height: `${5 + Math.random() * 8}px`,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            background: confettiColors[i % confettiColors.length],
            animation: `confettiDrop ${1.2 + Math.random() * 1.8}s ease-out ${Math.random() * 1}s forwards`,
            opacity: 0.85,
          }}
        />
      ))}

      {/* Heart/icon burst */}
      <div
        className="animate-success"
        style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${colors.success[400]}, ${colors.primary[400]})`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `0 12px 40px rgba(16, 185, 129, 0.3), 0 4px 16px rgba(79, 106, 232, 0.15)`,
          marginBottom: spacing[5],
          position: 'relative',
        }}
      >
        {/* Ripple rings */}
        <div style={{
          position: 'absolute', inset: '-8px', borderRadius: '50%',
          border: `2px solid ${colors.success[200]}`,
          animation: 'stepCompleteRing 0.8s ease-out 0.3s forwards', opacity: 0,
        }} />
        <div style={{
          position: 'absolute', inset: '-8px', borderRadius: '50%',
          border: `2px solid ${colors.primary[200]}`,
          animation: 'stepCompleteRing 0.8s ease-out 0.5s forwards', opacity: 0,
        }} />
        <svg width="38" height="38" viewBox="0 0 48 48" fill="none">
          <path
            d="M12 24L20 32L36 16"
            stroke="white"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ strokeDasharray: 40, strokeDashoffset: 40, animation: 'checkmark 0.6s ease 0.4s forwards' }}
          />
        </svg>
      </div>

      {/* Headline */}
      <h1
        className="animate-fade-in-up delay-2"
        style={{
          fontFamily: typography.fontFamily.display,
          fontSize: typography.fontSize['3xl'],
          fontWeight: typography.fontWeight.bold,
          color: colors.neutral[900],
          margin: 0,
          letterSpacing: typography.letterSpacing.tight,
          textAlign: 'center',
        }}
      >
        Order Submitted
      </h1>

      {/* Order ID pill */}
      <div
        className="animate-fade-in-up delay-3"
        style={{
          marginTop: spacing[3],
          padding: `${spacing[2]} ${spacing[5]}`,
          background: colors.neutral[50],
          borderRadius: radii.full,
          fontFamily: typography.fontFamily.mono,
          fontSize: typography.fontSize.base,
          fontWeight: typography.fontWeight.bold,
          color: colors.primary[600],
          letterSpacing: typography.letterSpacing.wide,
          border: `1px solid ${colors.neutral[150]}`,
        }}
      >
        {orderId} · {productCount} {productCount === 1 ? 'item' : 'items'}
      </div>

      {/* ── Empathetic impact message ── */}
      <div
        className="animate-fade-in-up delay-4"
        style={{
          marginTop: spacing[6],
          maxWidth: '480px',
          textAlign: 'center',
          padding: `${spacing[6]} ${spacing[6]}`,
          background: `linear-gradient(135deg, ${colors.primary[50]}, ${colors.success[50]}, ${colors.accent[50]})`,
          borderRadius: radii.xl,
          border: `1px solid ${colors.neutral[150]}`,
          position: 'relative',
        }}
      >
        <div style={{ fontSize: '2rem', marginBottom: spacing[3] }}>
          {message.icon}
        </div>
        <h2
          style={{
            fontFamily: typography.fontFamily.display,
            fontSize: typography.fontSize.lg,
            fontWeight: typography.fontWeight.bold,
            color: colors.neutral[800],
            margin: 0,
            lineHeight: typography.lineHeight.snug,
          }}
        >
          {message.headline}
        </h2>
        <p
          style={{
            fontFamily: typography.fontFamily.body,
            fontSize: typography.fontSize.base,
            color: colors.neutral[700],
            margin: `${spacing[3]} 0 0`,
            lineHeight: typography.lineHeight.relaxed,
          }}
        >
          {message.body}
        </p>
      </div>

      {/* ── Product showcase ── */}
      {selectedProducts.length > 0 && (
        <div
          className="animate-fade-in-up delay-5"
          style={{
            marginTop: spacing[6],
            width: '100%',
            maxWidth: '480px',
          }}
        >
          <div
            style={{
              fontFamily: typography.fontFamily.body,
              fontSize: typography.fontSize.xs,
              fontWeight: typography.fontWeight.medium,
              color: colors.neutral[400],
              textTransform: 'uppercase' as const,
              letterSpacing: typography.letterSpacing.wide,
              marginBottom: spacing[3],
              textAlign: 'center',
            }}
          >
            Items on their way
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: spacing[3],
            }}
          >
            {selectedProducts.map(({ product, quantity }) => (
              <div
                key={product.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: spacing[2],
                  padding: spacing[3],
                  background: colors.surface.card,
                  borderRadius: radii.lg,
                  border: `1px solid ${colors.neutral[100]}`,
                  boxShadow: shadows.sm,
                  width: '110px',
                  transition: transitions.default,
                }}
              >
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: radii.md,
                      objectFit: 'cover',
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: radii.md,
                      background: `linear-gradient(135deg, ${colors.primary[100]}, ${colors.accent[100]})`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.5rem',
                    }}
                  >
                    📦
                  </div>
                )}
                <div
                  style={{
                    fontFamily: typography.fontFamily.body,
                    fontSize: typography.fontSize.xs,
                    fontWeight: typography.fontWeight.medium,
                    color: colors.neutral[700],
                    textAlign: 'center',
                    lineHeight: typography.lineHeight.snug,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                  }}
                >
                  {product.name}
                </div>
                {quantity > 1 && (
                  <div
                    style={{
                      fontFamily: typography.fontFamily.mono,
                      fontSize: typography.fontSize.xs,
                      color: colors.primary[500],
                      background: colors.primary[50],
                      padding: `1px ${spacing[2]}`,
                      borderRadius: radii.full,
                      fontWeight: typography.fontWeight.medium,
                    }}
                  >
                    x{quantity}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div
        className="animate-fade-in-up delay-6"
        style={{
          display: 'flex',
          gap: spacing[3],
          marginTop: spacing[6],
        }}
      >
        <button
          onClick={onBack}
          style={{
            width: 'auto',
            padding: `${spacing[3]} ${spacing[6]}`,
            fontFamily: typography.fontFamily.body,
            fontSize: typography.fontSize.base,
            fontWeight: typography.fontWeight.medium,
            color: colors.neutral[600],
            background: colors.surface.card,
            border: `1px solid ${colors.neutral[200]}`,
            borderRadius: radii.lg,
            cursor: 'pointer',
            transition: transitions.default,
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = colors.neutral[300]; e.currentTarget.style.background = colors.neutral[50]; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = colors.neutral[200]; e.currentTarget.style.background = colors.surface.card; }}
        >
          Back to Dashboard
        </button>
        <button
          onClick={onBack}
          style={{
            width: 'auto',
            padding: `${spacing[3]} ${spacing[6]}`,
            fontFamily: typography.fontFamily.display,
            fontSize: typography.fontSize.base,
            fontWeight: typography.fontWeight.semibold,
            color: '#FFFFFF',
            background: colors.primary[500],
            border: 'none',
            borderRadius: radii.lg,
            cursor: 'pointer',
            transition: transitions.default,
            boxShadow: `0 2px 8px rgba(79, 106, 232, 0.25)`,
          }}
          onMouseEnter={e => { e.currentTarget.style.background = colors.primary[600]; }}
          onMouseLeave={e => { e.currentTarget.style.background = colors.primary[500]; }}
        >
          Start New Order
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// Custom Select dropdown
// ═══════════════════════════════════════════════════════════════
function CustomSelect({
  value,
  onChange,
  options,
  placeholder = 'Select...',
  style: styleProp,
}: {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  style?: React.CSSProperties;
}) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0, width: 0 });
  const selectedLabel = options.find(o => o.value === value)?.label;

  // Position the portal menu beneath the trigger
  useEffect(() => {
    if (!open || !triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setMenuPos({ top: rect.bottom + 4, left: rect.left, width: rect.width });
  }, [open]);

  // Close on outside click (check both trigger wrapper and portal menu)
  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        wrapperRef.current && !wrapperRef.current.contains(target) &&
        menuRef.current && !menuRef.current.contains(target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  // Close on scroll (parent containers)
  useEffect(() => {
    if (!open) return;
    const handleScroll = () => {
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        setMenuPos({ top: rect.bottom + 4, left: rect.left, width: rect.width });
      }
    };
    window.addEventListener('scroll', handleScroll, true);
    return () => window.removeEventListener('scroll', handleScroll, true);
  }, [open]);

  return (
    <div ref={wrapperRef} style={{ position: 'relative', ...styleProp }}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 14px',
          fontFamily: typography.fontFamily.body,
          fontSize: typography.fontSize.sm,
          color: selectedLabel ? colors.neutral[800] : colors.neutral[400],
          background: colors.surface.card,
          border: `1px solid ${open ? colors.primary[500] : colors.neutral[200]}`,
          borderRadius: radii.lg,
          cursor: 'pointer',
          transition: transitions.fast,
          boxShadow: open ? `0 0 0 3px ${colors.primary[50]}` : 'none',
          textAlign: 'left' as const,
        }}
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {selectedLabel || placeholder}
        </span>
        <svg
          width="12" height="8" viewBox="0 0 12 8" fill="none"
          style={{
            flexShrink: 0,
            marginLeft: spacing[2],
            transition: transitions.fast,
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        >
          <path d="M1 1.5L6 6.5L11 1.5" stroke={colors.neutral[400]} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && createPortal(
        <div
          ref={menuRef}
          style={{
            position: 'fixed',
            top: menuPos.top,
            left: menuPos.left,
            width: menuPos.width,
            zIndex: 9999,
            background: colors.surface.card,
            border: `1px solid ${colors.neutral[200]}`,
            borderRadius: radii.lg,
            boxShadow: shadows.lg,
            padding: spacing[1],
            maxHeight: '240px',
            overflowY: 'auto',
            animation: 'dropdownFadeIn 0.15s ease',
          }}
        >
          {options.map(opt => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => { onChange(opt.value); setOpen(false); }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing[2],
                  padding: `${spacing[2]} ${spacing[3]}`,
                  fontFamily: typography.fontFamily.body,
                  fontSize: typography.fontSize.sm,
                  fontWeight: isSelected ? typography.fontWeight.semibold : typography.fontWeight.regular,
                  color: isSelected ? colors.primary[600] : colors.neutral[700],
                  background: isSelected ? colors.primary[50] : 'transparent',
                  border: 'none',
                  borderRadius: radii.md,
                  cursor: 'pointer',
                  textAlign: 'left' as const,
                  transition: transitions.fast,
                }}
                onMouseEnter={e => {
                  if (!isSelected) {
                    e.currentTarget.style.background = colors.neutral[50];
                  }
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = isSelected ? colors.primary[50] : 'transparent';
                }}
              >
                {isSelected && (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
                    <path d="M2.5 7L5.5 10.5L11.5 3.5" stroke={colors.primary[500]} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
                <span style={{ marginLeft: isSelected ? 0 : '22px' }}>{opt.label}</span>
              </button>
            );
          })}
        </div>,
        document.body,
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// Shared UI primitives
// ═══════════════════════════════════════════════════════════════
function SectionHeader({ title, subtitle, delay, small }: { title: string; subtitle: string; delay: number; small?: boolean }) {
  return (
    <div className={`animate-fade-in-up delay-${Math.min(delay + 1, 6)}`}>
      <h2
        style={{
          fontFamily: typography.fontFamily.display,
          fontSize: small ? typography.fontSize.lg : typography.fontSize['2xl'],
          fontWeight: typography.fontWeight.bold,
          color: colors.neutral[900],
          margin: 0,
          letterSpacing: typography.letterSpacing.tight,
          lineHeight: typography.lineHeight.tight,
        }}
      >
        {title}
      </h2>
      <p
        style={{
          fontFamily: typography.fontFamily.body,
          fontSize: typography.fontSize.sm,
          color: colors.neutral[400],
          margin: `${spacing[1]} 0 0`,
          lineHeight: typography.lineHeight.normal,
        }}
      >
        {subtitle}
      </p>
    </div>
  );
}

function FormField({
  label,
  delay,
  labelStyle,
  fullWidth,
  children,
}: {
  label: string;
  delay: number;
  labelStyle: React.CSSProperties;
  fullWidth?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`animate-fade-in-up delay-${Math.min(delay, 6)}`}
      style={fullWidth ? { gridColumn: '1 / -1' } : undefined}
    >
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );
}
