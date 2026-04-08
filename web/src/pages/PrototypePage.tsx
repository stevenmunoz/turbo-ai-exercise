import { useState, useCallback } from 'react';
import { AppShell } from '../prototype/AppShell';
import { DashboardView } from '../prototype/DashboardView';
import { NewOrderView } from '../prototype/NewOrderView';
import { TopNav } from '../shared/TopNav';

type View = 'dashboard' | 'new-order' | 'orders' | 'products' | 'fee-schedules' | 'vendors';

export function PrototypePage() {
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  const showToast = useCallback((message: string, type: 'success' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }, []);

  const handleNavigate = useCallback((view: View) => {
    setActiveView(view);
  }, []);

  const handleNewOrder = useCallback(() => {
    setActiveView('new-order');
  }, []);

  const handleOrderCreated = useCallback((_orderId: string) => {
    // Don't navigate away — let NewOrderView show its own success screen
  }, []);

  const handleViewOrder = useCallback((_orderId: string) => {
    // In a full app this would navigate to order detail
    showToast('Order detail view — coming in Sprint 2', 'info');
  }, [showToast]);

  return (
    <>
      <TopNav />
      <AppShell activeView={activeView} onNavigate={handleNavigate}>
        {activeView === 'dashboard' && (
          <DashboardView onNewOrder={handleNewOrder} onViewOrder={handleViewOrder} />
        )}
        {activeView === 'new-order' && (
          <NewOrderView
            onBack={() => setActiveView('dashboard')}
            onOrderCreated={handleOrderCreated}
          />
        )}
        {activeView !== 'dashboard' && activeView !== 'new-order' && (
          <PlaceholderView title={viewTitles[activeView] || activeView} onBack={() => setActiveView('dashboard')} />
        )}
      </AppShell>

      {/* Toast notification */}
      {toast && (
        <div
          className="medflow-toast"
          style={{
            backgroundColor: toast.type === 'success' ? '#ECFDF5' : '#EEF2FF',
            color: toast.type === 'success' ? '#047857' : '#3B52CC',
            border: `1px solid ${toast.type === 'success' ? '#A7F3D0' : '#C7D2FE'}`,
          }}
        >
          <span>{toast.type === 'success' ? '✓' : 'ℹ'}</span>
          {toast.message}
        </div>
      )}
    </>
  );
}

const viewTitles: Record<string, string> = {
  orders: 'All Orders',
  products: 'Product Catalog',
  'fee-schedules': 'Fee Schedules',
  vendors: 'Vendor Directory',
  approvals: 'Pending Approvals',
  invoices: 'Invoices',
  pod: 'Proof of Delivery',
};

function PlaceholderView({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <div style={{ padding: '48px 40px' }}>
      <button
        onClick={onBack}
        style={{
          width: 'auto',
          background: 'none',
          border: 'none',
          color: '#4F6AE8',
          fontSize: '0.875rem',
          fontWeight: 500,
          cursor: 'pointer',
          padding: 0,
          marginBottom: '16px',
          fontFamily: "'Inter', system-ui, sans-serif",
        }}
      >
        ← Back to Dashboard
      </button>
      <div
        className="animate-fade-in-up"
        style={{
          background: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid #E5E7EB',
          padding: '64px',
          textAlign: 'center',
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        }}
      >
        <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>🚧</div>
        <h2 style={{
          fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
          fontSize: '1.5rem',
          fontWeight: 700,
          color: '#111827',
          margin: '0 0 8px',
        }}>
          {title}
        </h2>
        <p style={{
          fontSize: '0.875rem',
          color: '#6B7280',
          margin: 0,
        }}>
          This section is planned for Sprint 2. The dashboard and order creation flow are fully functional.
        </p>
      </div>
    </div>
  );
}
