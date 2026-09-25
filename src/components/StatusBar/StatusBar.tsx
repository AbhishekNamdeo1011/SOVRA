import React from 'react';
import { ShieldCheck } from 'lucide-react';

const StatusBar: React.FC = () => {
  return (
    <div className="statusbar">
      <span className="statusbar-item">
        <span className="status-dot online" />
        GPU: ONLINE
      </span>
      <span className="statusbar-sep">|</span>
      <span className="statusbar-item">
        MODELS: 3 ACTIVE
      </span>
      <span className="statusbar-sep">|</span>
      <span className="statusbar-item alert">
        EXT NETWORK: BLOCKED
      </span>
      <span className="statusbar-sep">|</span>
      <span className="statusbar-item alert">
        DNS: BLOCKED
      </span>
      <span className="statusbar-sep">|</span>
      <span className="statusbar-item alert">
        NTP: BLOCKED
      </span>
      <span className="statusbar-sep">|</span>
      <span className="statusbar-item">
        CLOUD AI CALLS: 0
      </span>

      <div className="statusbar-sovereign">
        <ShieldCheck size={12} strokeWidth={2.5} />
        SOVEREIGN MODE: ON
      </div>
    </div>
  );
};

export default StatusBar;
