import React, { useState } from 'react';
import type { AgentStep } from '../../types';
import { Check, Circle, AlertCircle, Loader, ChevronDown, ChevronRight } from 'lucide-react';

interface AgentTraceProps {
  steps: AgentStep[];
  isRunning: boolean;
}

const StepIcon: React.FC<{ status: AgentStep['status'] }> = ({ status }) => {
  switch (status) {
    case 'complete':
      return <Check size={13} strokeWidth={2.5} color="#15803D" />;
    case 'running':
      return <Loader size={13} strokeWidth={2.5} className="animate-spin" color="#111827" />;
    case 'failed':
      return <AlertCircle size={13} strokeWidth={2.5} color="#C94A4A" />;
    default:
      return <Circle size={13} strokeWidth={2} color="#9CA3AF" />;
  }
};

const AgentTrace: React.FC<AgentTraceProps> = ({ steps }) => {
  const [expandedDetails, setExpandedDetails] = useState<Record<string, boolean>>({});

  const toggleDetails = (id: string) => {
    setExpandedDetails(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const completedCount = steps.filter(s => s.status === 'complete').length;

  return (
    <div className="panel-section">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="panel-section-title">AGENT TRACE</span>
        <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--gray-500)', fontWeight: 600 }}>
          {completedCount}/{steps.length}
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {steps.length === 0 ? (
          <div style={{ padding: '16px 10px', textAlign: 'center', color: 'var(--gray-500)', fontSize: 11 }}>
            Run a task to stream agent execution steps.
          </div>
        ) : (
          steps.map((step) => {
            const isExpanded = !!expandedDetails[step.id];

            return (
              <div key={step.id} className={`trace-step-item ${step.status}`}>
                <div className="trace-step-icon">
                  <StepIcon status={step.status} />
                </div>
                <div className="trace-step-content">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="trace-step-label">{step.label}</span>
                    <button
                      onClick={() => toggleDetails(step.id)}
                      style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        fontSize: 10, color: 'var(--gray-500)', display: 'inline-flex',
                        alignItems: 'center', gap: 2, padding: 0
                      }}
                    >
                      {isExpanded ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
                      Details
                    </button>
                  </div>
                  <div className="trace-step-detail">{step.detail}</div>

                  {isExpanded && (
                    <div style={{
                      marginTop: 6, padding: '6px 8px', background: 'var(--gray-100)',
                      borderRadius: 3, fontSize: 10, fontFamily: 'var(--font-mono)',
                      color: 'var(--gray-700)', lineHeight: 1.4
                    }}>
                      <div>STATUS: {step.status.toUpperCase()}</div>
                      <div>TOOL_TYPE: {step.type}</div>
                      <div>NETWORK: LOCAL_LOOPBACK</div>
                      <div>ISOLATION: AIR_GAPPED_SANDBOX</div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default AgentTrace;
