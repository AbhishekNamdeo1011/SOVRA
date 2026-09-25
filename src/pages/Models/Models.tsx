import React from 'react';
import { Cpu, Plus } from 'lucide-react';

const installedModels = [
  { role: 'Coding', status: 'Online', location: 'Local' },
  { role: 'Reasoning', status: 'Online', location: 'Local' },
  { role: 'Vision', status: 'Online', location: 'Local' },
];

const Models: React.FC = () => {
  return (
    <div className="chat-workspace">
      <div className="chat-workspace-card">
        <div className="chat-subbar">
          <div>
            <span className="chat-subbar-title">Model Registry</span>
            <span className="chat-subbar-sub">
              Local open-weight models
            </span>
          </div>
          <button className="btn btn-secondary btn-sm">
            <Plus size={13} />
            <span>Add Model</span>
          </button>
        </div>

        <div className="chat-workspace-body">
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Location</th>
                </tr>
              </thead>
              <tbody>
                {installedModels.map((m) => (
                  <tr key={m.role}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Cpu size={15} color="var(--accent)" />
                        <span style={{ fontWeight: 600 }}>{m.role}</span>
                      </div>
                    </td>
                    <td>
                      <span className="tag tag-monochrome">{m.status}</span>
                    </td>
                    <td>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600 }}>{m.location}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{
            marginTop: 18, padding: '14px 16px', background: 'var(--bg-subtle)',
            border: '1px solid var(--border)', borderRadius: 'var(--radius-md)',
            fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5
          }}>
            Tasks are automatically routed to the appropriate local model based on workload type (reasoning, coding, or vision).
          </div>
        </div>
      </div>
    </div>
  );
};

export default Models;
