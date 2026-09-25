import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Shield, Lock, Wifi, X, ShieldCheck, Menu } from 'lucide-react';

import type { User } from '../../types';

interface TopbarProps {
  currentTitle?: string;
  showDrawer?: boolean;
  onToggleDrawer?: () => void;
  hasActiveTask?: boolean;
  onToggleMobileSidebar?: () => void;
  userName?: string;
  user?: User | null;
}

const pageTitles: Record<string, string> = {
  '/workbench': 'Workbench',
  '/': 'Workbench',
  '/documents': 'Documents',
  '/knowledge': 'Knowledge',
  '/runs': 'Agent Runs',
  '/models': 'Models',
  '/audit': 'Audit',
  '/settings': 'Settings',
};

const Topbar: React.FC<TopbarProps> = ({
  showDrawer = false,
  onToggleDrawer,
  hasActiveTask = false,
  onToggleMobileSidebar,
  userName = '',
  user = null,
}) => {
  const location = useLocation();
  const [showProofModal, setShowProofModal] = useState(false);

  const title = pageTitles[location.pathname] || 'Workbench';
  const isWorkbench = location.pathname === '/' || location.pathname === '/workbench';

  const effectiveName = user?.name || userName || 'User';
  const initials = effectiveName
    ? effectiveName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U';

  return (
    <>
      <header className="topbar">
        <div className="topbar-left">
          <button
            className="topbar-mobile-menu-btn"
            onClick={onToggleMobileSidebar}
            title="Open navigation menu"
          >
            <Menu size={18} />
          </button>

          <h1 className="topbar-title">{title}</h1>
        </div>

        <div className="topbar-actions">
          {/* Desktop Security Indicators */}
          <div className="desktop-status-group">
            <div
              className="monochrome-status-badge sovereign-pill clickable"
              onClick={() => setShowProofModal(true)}
              title="Click to view Proof of Sovereignty"
            >
              <Shield size={12} strokeWidth={2.2} />
              <span>SOVEREIGN MODE: ON</span>
            </div>

            <div
              className="monochrome-status-badge clickable"
              onClick={() => setShowProofModal(true)}
              title="Zero external calls"
            >
              <Lock size={11} strokeWidth={2.2} />
              <span>EXTERNAL CALLS: <strong style={{ color: 'var(--text-main)' }}>0</strong></span>
            </div>

            <div
              className="monochrome-status-badge clickable"
              onClick={() => setShowProofModal(true)}
              title="Air-gapped network"
            >
              <Wifi size={12} strokeWidth={2.2} />
              <span>AIR-GAPPED</span>
            </div>

            <div
              className="monochrome-status-badge"
              title="Authentication: Internal Organisational Access"
            >
              <Shield size={11} strokeWidth={2.2} />
              <span>INTERNAL ACCESS</span>
            </div>
          </div>

          {/* Compact Mobile Badge */}
          <div
            className="monochrome-status-badge mobile-status-badge clickable"
            onClick={() => setShowProofModal(true)}
            title="Sovereign On-Premise Mode"
          >
            <Shield size={12} strokeWidth={2.2} />
            <span>SOVEREIGN</span>
          </div>

          {/* Agent Activity Toggle */}
          {isWorkbench && hasActiveTask && onToggleDrawer && (
            <button
              className="btn btn-secondary btn-sm"
              onClick={onToggleDrawer}
              title={showDrawer ? 'Close Agent Activity' : 'View Agent Activity'}
            >
              <span className="trace-btn-label">{showDrawer ? 'Close Activity' : 'Agent Activity'}</span>
            </button>
          )}

          {/* Proof of Sovereignty */}
          <button
            className="topbar-icon-btn"
            onClick={() => setShowProofModal(true)}
            title="Proof of Sovereignty"
          >
            <ShieldCheck size={16} />
          </button>

          {/* User Avatar */}
          <div
            className="topbar-user-avatar"
            title={user ? `${user.name} · WORK ID: ${user.workId} · INTERNAL ACCESS` : (effectiveName + ' · INTERNAL ACCESS')}
          >
            {initials}
          </div>
        </div>
      </header>

      {/* PROOF OF SOVEREIGNTY MODAL */}
      {showProofModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(32, 37, 43, 0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: '16px'
        }}>
          <div style={{
            background: 'var(--bg-surface)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)', width: '100%', maxWidth: 480,
            padding: '20px 22px', boxShadow: 'var(--shadow-lg)',
            maxHeight: '90vh', overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, borderBottom: '1px solid var(--border)', paddingBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <ShieldCheck size={18} color="var(--text-main)" />
                <h3 style={{ fontSize: 15, fontWeight: 700 }}>
                  PROOF OF SOVEREIGNTY
                </h3>
              </div>
              <button
                onClick={() => setShowProofModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
              <div className="proof-row">
                <span className="proof-label">External Calls</span>
                <span className="proof-value mono">0</span>
              </div>
              <div className="proof-row">
                <span className="proof-label">Cloud AI</span>
                <span className="proof-value mono">0</span>
              </div>
              <div className="proof-row">
                <span className="proof-label">Network</span>
                <span className="proof-value badge">AIR-GAPPED</span>
              </div>
              <div className="proof-row">
                <span className="proof-label">DNS Resolution</span>
                <span className="proof-value badge">BLOCKED</span>
              </div>
              <div className="proof-row">
                <span className="proof-label">NTP Network Sync</span>
                <span className="proof-value badge">BLOCKED</span>
              </div>
              <div className="proof-row">
                <span className="proof-label">AI Processing</span>
                <span className="proof-value mono">LOCAL GPU</span>
              </div>
            </div>

            <div style={{ marginTop: 18, paddingTop: 14, borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
              <span style={{ fontSize: 11, color: 'var(--text-sub)' }}>
                Demo status · Prototype simulation
              </span>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setShowProofModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Topbar;
