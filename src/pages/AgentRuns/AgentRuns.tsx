import React from 'react';
import type { AgentRunRecord } from '../../types';
import { GitBranch } from 'lucide-react';

interface AgentRunsProps {
  runs: AgentRunRecord[];
}

const AgentRuns: React.FC<AgentRunsProps> = ({ runs }) => {
  return (
    <div className="chat-workspace">
      <div className="chat-workspace-card">
        <div className="chat-subbar">
          <div>
            <span className="chat-subbar-title">Agent Runs</span>
            <span className="chat-subbar-sub">
              Session execution history
            </span>
          </div>
        </div>

        <div className="chat-workspace-body">
          {runs.length === 0 ? (
            <div style={{
              background: 'var(--bg-surface)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)', padding: 48, textAlign: 'center',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12
            }}>
              <GitBranch size={32} color="var(--text-sub)" />
              <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)' }}>
                No agent runs in this session
              </div>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', maxWidth: 440, lineHeight: 1.5 }}>
                Execution metrics will appear here after you run a task.
              </p>
            </div>
          ) : (
            <div className="data-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Task</th>
                    <th>Type</th>
                    <th>Route</th>
                    <th>Status</th>
                    <th>Duration</th>
                    <th>External Calls</th>
                  </tr>
                </thead>
                <tbody>
                  {runs.map((r) => (
                    <tr key={r.id}>
                      <td style={{ fontWeight: 600 }}>{r.task}</td>
                      <td>
                        <span className="tag tag-monochrome">{r.type.toUpperCase()}</span>
                      </td>
                      <td>
                        <span style={{ fontSize: 13, fontWeight: 500, textTransform: 'capitalize' }}>
                          {r.route}
                        </span>
                      </td>
                      <td>
                        <span className="tag tag-monochrome">{r.status.toUpperCase()}</span>
                      </td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-muted)' }}>
                        {r.duration}
                      </td>
                      <td>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700 }}>
                          {r.externalCalls}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgentRuns;
