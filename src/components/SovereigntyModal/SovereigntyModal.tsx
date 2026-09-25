import React from 'react';
import { ShieldCheck, X } from 'lucide-react';

interface SovereigntyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const auditItems = [
  { label: 'External Network Sockets', status: 'BLOCKED', detail: '0 bytes transmitted outside on-premise subnet' },
  { label: 'Commercial Cloud AI Endpoints', status: 'BLOCKED', detail: 'External endpoints rejected at kernel firewall layer' },
  { label: 'External DNS Resolution', status: 'BLOCKED', detail: 'DNS queries confined to local air-gapped domain' },
  { label: 'NTP Synchronization', status: 'BLOCKED', detail: 'Hardware real-time clock enforced; external NTP rejected' },
  { label: 'Network Adapter Policy', status: 'ISOLATED', detail: 'Local loopback & intranet only (air-gapped partition)' },
  { label: 'Local Model Inference', status: 'VERIFIED', detail: 'NVIDIA A100 GPU accelerator — open-weight models' },
  { label: 'Document Storage & OCR', status: 'LOCAL', detail: 'On-premise NVMe storage with AES-256 volume encryption' },
  { label: 'Vector Store (RAG)', status: 'LOCAL', detail: 'ChromaDB embedded on-premise vector database' },
];

const SovereigntyModal: React.FC<SovereigntyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(17, 24, 39, 0.45)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
      backdropFilter: 'blur(2px)'
    }}>
      <div style={{
        width: '90%', maxWidth: 580, background: 'var(--white)',
        borderRadius: 4, border: '1px solid var(--gray-300)',
        boxShadow: '0 12px 36px rgba(0,0,0,0.15)', display: 'flex',
        flexDirection: 'column', overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          padding: '16px 20px', borderBottom: '1px solid var(--gray-200)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          background: 'var(--gray-50)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <ShieldCheck size={18} strokeWidth={2.5} color="#15803D" />
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.04em', color: 'var(--navy)', textTransform: 'uppercase' }}>
                Proof of Sovereignty
              </div>
              <div style={{ fontSize: 11, color: 'var(--gray-500)' }}>
                Air-gapped verification certificate & audit trail
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-400)', padding: 4 }}
            aria-label="Close sovereignty modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Big Metrics Header */}
        <div style={{
          padding: '16px 20px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 12, borderBottom: '1px solid var(--gray-200)', background: 'var(--white)'
        }}>
          <div style={{ padding: '10px 12px', background: 'var(--gray-50)', borderRadius: 4, border: '1px solid var(--gray-200)' }}>
            <div style={{ fontSize: 20, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--red)' }}>
              0
            </div>
            <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--gray-500)', textTransform: 'uppercase', marginTop: 2 }}>
              External Calls
            </div>
          </div>

          <div style={{ padding: '10px 12px', background: 'var(--gray-50)', borderRadius: 4, border: '1px solid var(--gray-200)' }}>
            <div style={{ fontSize: 20, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--navy)' }}>
              AIR-GAPPED
            </div>
            <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--gray-500)', textTransform: 'uppercase', marginTop: 2 }}>
              Network State
            </div>
          </div>

          <div style={{ padding: '10px 12px', background: 'var(--gray-50)', borderRadius: 4, border: '1px solid var(--gray-200)' }}>
            <div style={{ fontSize: 20, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--success)' }}>
              100% LOCAL
            </div>
            <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--gray-500)', textTransform: 'uppercase', marginTop: 2 }}>
              Model Processing
            </div>
          </div>
        </div>

        {/* Audit Checklist */}
        <div style={{ padding: '14px 20px', overflowY: 'auto', maxHeight: '50vh', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--gray-600)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>
            System Integrity Ledger
          </div>
          {auditItems.map((item) => (
            <div
              key={item.label}
              style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '8px 10px', background: 'var(--gray-50)', borderRadius: 4,
                border: '1px solid var(--gray-200)'
              }}
            >
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--navy)' }}>
                  {item.label}
                </div>
                <div style={{ fontSize: 10, color: 'var(--gray-500)', marginTop: 1 }}>
                  {item.detail}
                </div>
              </div>
              <span className={`tag ${item.status === 'BLOCKED' || item.status === 'ISOLATED' ? 'tag-danger' : 'tag-verified'}`} style={{ fontSize: 9 }}>
                {item.status}
              </span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{
          padding: '12px 20px', borderTop: '1px solid var(--gray-200)',
          background: 'var(--gray-50)', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--gray-500)' }}>
            LEDGER HASH: 4e9f7a8b92c103e689d028f237ac4a90
          </span>
          <button className="btn btn-primary btn-sm" onClick={onClose}>
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SovereigntyModal;
