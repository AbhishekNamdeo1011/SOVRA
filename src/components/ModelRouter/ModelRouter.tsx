import React from 'react';
import type { TaskType, ModelRole } from '../../types';
import { Cpu } from 'lucide-react';

interface ModelRouterProps {
  taskName?: string;
  taskType: TaskType;
  routed: ModelRole;
}

const roleNames: Record<ModelRole, string> = {
  reasoning: 'Reasoning',
  coding: 'Coding',
  vision: 'Vision',
};

const ModelRouter: React.FC<ModelRouterProps> = ({
  taskName = 'Inspection Report',
  taskType,
  routed,
}) => {
  return (
    <div className="panel-section">
      <span className="panel-section-title">MODEL ROUTER</span>
      
      <div className="router-card">
        <div className="router-row">
          <span className="router-label">Task</span>
          <span className="router-val">{taskName}</span>
        </div>

        <div className="router-row">
          <span className="router-label">Type</span>
          <span className="router-val" style={{ textTransform: 'capitalize' }}>{taskType}</span>
        </div>

        <div className="router-row">
          <span className="router-label">Routed To</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span className="router-val" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Cpu size={12} strokeWidth={2} />
              {roleNames[routed]}
            </span>
            <span className="tag tag-local" style={{ fontSize: 9 }}>LOCAL</span>
          </div>
        </div>

        <div style={{ marginTop: 8, fontSize: 10, color: 'var(--gray-500)', lineHeight: 1.4 }}>
          System automatically selected the appropriate local model.
        </div>
      </div>
    </div>
  );
};

export default ModelRouter;
