import React from 'react';
import type { AuditEntry } from '../../types';
import { Lock } from 'lucide-react';

interface AuditLogsProps {
  logs: AuditEntry[];
}

const AuditLogs: React.FC<AuditLogsProps> = ({ logs }) => {
  return (
    <div className="chat-workspace">
      <div className="chat-workspace-card">
        <div className="chat-subbar">
          <div>
            <span className="chat-subbar-title">Audit Log</span>
            <span className="chat-subbar-sub">
              Session activity trail
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-main)', fontWeight: 600 }}>
            <Lock size={14} />
            <span>External Calls: 0</span>
          </div>
        </div>

        <div className="chat-workspace-body">
          {/* Summary Cards */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14,
            marginBottom: 20
          }}>
            <div style={{ padding: '14px 18px', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: 22, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-main)' }}>
                0
              </div>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-sub)', textTransform: 'uppercase', marginTop: 4 }}>
                External Calls
              </div>
            </div>

            <div style={{ padding: '14px 18px', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: 22, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-main)' }}>
                AIR-GAPPED
              </div>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-sub)', textTransform: 'uppercase', marginTop: 4 }}>
                Network
              </div>
            </div>

            <div style={{ padding: '14px 18px', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: 22, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-main)' }}>
                {logs.length}
              </div>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-sub)', textTransform: 'uppercase', marginTop: 4 }}>
                Operations
              </div>
            </div>
          </div>

          {/* Audit Table */}
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Task</th>
                  <th>Action</th>
                  <th>Network</th>
                </tr>
              </thead>
              <tbody>
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-sub)', padding: 36 }}>
                      No session activity yet. Operations will appear here as you use the workbench.
                    </td>
                  </tr>
                ) : (
                  logs.map((entry) => (
                    <tr key={entry.id}>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-muted)' }}>
                        {entry.time}
                      </td>
                      <td style={{ fontWeight: 600 }}>
                        {entry.task}
                      </td>
                      <td style={{ color: 'var(--text-main)' }}>
                        {entry.action}
                      </td>
                      <td>
                        <span className="tag tag-monochrome" style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                          {entry.network}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditLogs;
