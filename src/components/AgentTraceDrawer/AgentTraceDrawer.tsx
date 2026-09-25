import React from 'react';
import type { AgentStep, KnowledgeResult, ModelRole, TaskType } from '../../types';
import { Check, Loader, Circle, X, Cpu, FileText } from 'lucide-react';

interface AgentTraceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  steps: AgentStep[];
  isRunning?: boolean;
  taskType: TaskType;
  modelRole: ModelRole;
  taskName?: string;
  sources: KnowledgeResult[];
}

const roleLabels: Record<ModelRole, string> = {
  reasoning: 'Reasoning',
  coding: 'Coding',
  vision: 'Vision',
};

const taskTypeLabels: Record<TaskType, string> = {
  document: 'Document Analysis',
  coding: 'Code Verification',
  vision: 'Schematic / Vision',
  general: 'General Query',
};

const AgentTraceDrawer: React.FC<AgentTraceDrawerProps> = ({
  isOpen,
  onClose,
  steps,
  taskType,
  modelRole,
  taskName,
  sources,
}) => {
  if (!isOpen) return null;

  return (
    <aside className="agent-drawer">
      {/* Drawer Header */}
      <div className="agent-drawer-header">
        <span className="agent-drawer-title">
          Execution Context {taskName ? `· ${taskName}` : ''}
        </span>
        <button
          onClick={onClose}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--slate)' }}
          title="Close Drawer"
        >
          <X size={16} />
        </button>
      </div>

      <div className="agent-drawer-body">
        {/* Section 1: Agent Trace */}
        <div>
          <div className="drawer-section-title">AGENT TRACE</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {steps.length === 0 ? (
              <div style={{ fontSize: 13, color: 'var(--slate)', fontStyle: 'italic', padding: '12px 0' }}>
                Run a multi-step task to observe agent steps.
              </div>
            ) : (
              steps.map((step) => {
                const isComplete = step.status === 'complete';
                const isCurrent = step.status === 'running';

                return (
                  <div
                    key={step.id}
                    style={{
                      display: 'flex', alignItems: 'flex-start', gap: 10,
                      padding: '8px 10px', background: 'var(--offwhite)',
                      border: '1px solid var(--border)', borderRadius: 'var(--radius)'
                    }}
                  >
                    <div style={{ marginTop: 2, flexShrink: 0 }}>
                      {isComplete ? (
                        <Check size={14} strokeWidth={2.5} color="var(--charcoal)" />
                      ) : isCurrent ? (
                        <Loader size={14} className="animate-spin" color="var(--charcoal)" />
                      ) : (
                        <Circle size={14} color="var(--slate-light)" />
                      )}
                    </div>
                    <div>
                      <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--charcoal)', textTransform: 'uppercase' }}>
                        {step.label}
                      </div>
                      <div style={{ fontSize: 13, color: 'var(--slate-dark)', marginTop: 2 }}>
                        {step.detail}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Section 2: Model Router */}
        <div>
          <div className="drawer-section-title">MODEL ROUTER</div>
          <div style={{
            padding: '12px 14px', background: 'var(--offwhite)',
            border: '1px solid var(--border)', borderRadius: 'var(--radius)',
            display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--slate)' }}>Task:</span>
              <span style={{ fontWeight: 600, color: 'var(--charcoal)' }}>{taskTypeLabels[taskType]}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--slate)' }}>Selected:</span>
              <span style={{ fontWeight: 700, color: 'var(--charcoal)', display: 'flex', alignItems: 'center', gap: 4 }}>
                <Cpu size={13} />
                {roleLabels[modelRole]}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--slate)' }}>Mode:</span>
              <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--charcoal)' }}>LOCAL</span>
            </div>
          </div>
        </div>

        {/* Section 3: Knowledge Sources */}
        {sources && sources.length > 0 && (
          <div>
            <div className="drawer-section-title">SOURCES ({sources.length} LOCAL)</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {sources.map(src => (
                <div
                  key={src.sourceId}
                  style={{
                    padding: '8px 10px', background: 'var(--offwhite)',
                    border: '1px solid var(--border)', borderRadius: 'var(--radius)',
                    fontSize: 13
                  }}
                >
                  <div style={{ fontWeight: 600, color: 'var(--charcoal)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <FileText size={13} />
                    <span>{src.title}</span>
                  </div>
                  <div style={{ fontSize: 12.5, color: 'var(--slate)', marginTop: 3 }}>
                    {src.snippet}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 4: Security & Isolation */}
        <div>
          <div className="drawer-section-title">SECURITY & ISOLATION</div>
          <div style={{
            padding: '10px 12px', background: 'var(--offwhite)',
            border: '1px solid var(--border)', borderRadius: 'var(--radius)',
            fontSize: 12.5, color: 'var(--charcoal)', display: 'flex',
            flexDirection: 'column', gap: 4
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--slate)' }}>External Calls</span>
              <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>0</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--slate)' }}>Network</span>
              <span style={{ fontWeight: 600 }}>AIR-GAPPED</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--slate)' }}>Cloud AI</span>
              <span style={{ fontWeight: 600 }}>BLOCKED</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default AgentTraceDrawer;
