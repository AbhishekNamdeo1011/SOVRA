import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';

const NetworkMonitor: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="panel-section">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="panel-section-title">SOVEREIGNTY</span>
        <span style={{ fontSize: 9, fontWeight: 700, color: 'var(--red)', letterSpacing: '0.04em' }}>
          LOCAL ONLY
        </span>
      </div>

      <div
        className="sovereignty-card"
        onClick={() => navigate('/audit')}
        style={{ cursor: 'pointer' }}
        title="Click to view detailed audit logs"
      >
        <div className="sovereignty-row">
          <span style={{ color: 'var(--gray-600)' }}>External Calls</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--red)' }}>
            0
          </span>
        </div>

        <div className="sovereignty-row">
          <span style={{ color: 'var(--gray-600)' }}>Cloud AI</span>
          <span className="tag tag-danger" style={{ fontSize: 9 }}>
            BLOCKED
          </span>
        </div>

        <div className="sovereignty-row">
          <span style={{ color: 'var(--gray-600)' }}>Network</span>
          <span className="tag tag-danger" style={{ fontSize: 9 }}>
            AIR-GAPPED
          </span>
        </div>

        <div style={{
          marginTop: 8, display: 'flex', alignItems: 'center', gap: 5,
          fontSize: 10, color: 'var(--gray-500)', lineHeight: 1.3
        }}>
          <Shield size={11} strokeWidth={2} color="#C94A4A" />
          <span>All model inference & data storage strictly on-premise.</span>
        </div>
      </div>
    </div>
  );
};

export default NetworkMonitor;
