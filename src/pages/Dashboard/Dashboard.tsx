import React from 'react';
import { dashboardMetrics } from '../../data/demoSystem';
import { demoTasks } from '../../data/demoTasks';
import { ShieldCheck, Cpu } from 'lucide-react';

const Dashboard: React.FC = () => {
  const metrics = [
    { label: 'LOCAL MODELS', value: dashboardMetrics.localModels },
    { label: 'ACTIVE TASKS', value: dashboardMetrics.activeTasks },
    { label: 'KNOWLEDGE SOURCES', value: dashboardMetrics.knowledgeSources },
    { label: 'EXTERNAL CALLS', value: '0', isRed: true },
  ];

  const statusItems = [
    { label: 'GPU Accelerator', value: 'ONLINE', ok: true },
    { label: 'Reasoning Model', value: 'ONLINE', ok: true },
    { label: 'Coding Model', value: 'ONLINE', ok: true },
    { label: 'Vision Model', value: 'ONLINE', ok: true },
    { label: 'Local OCR Engine', value: 'ONLINE', ok: true },
    { label: 'Local Vector Store', value: 'INDEXED', ok: true },
    { label: 'External Network Socket', value: 'BLOCKED', isBlocked: true },
    { label: 'External DNS', value: 'BLOCKED', isBlocked: true },
    { label: 'Cloud AI Telemetry', value: '0 CALLS', isBlocked: true },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <div className="page-title">DASHBOARD</div>
          <div className="page-subtitle">Operational status & local infrastructure health</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 600, color: 'var(--navy)' }}>
          <ShieldCheck size={14} color="#15803D" />
          <span>AIR-GAP INTEGRITY VERIFIED</span>
        </div>
      </div>

      <div className="page-body" style={{ flexDirection: 'column', gap: 16 }}>
        {/* Metric cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {metrics.map(m => (
            <div
              key={m.label}
              style={{
                background: 'var(--white)', border: '1px solid var(--gray-200)',
                borderRadius: 4, padding: '14px 16px'
              }}
            >
              <div style={{
                fontSize: 22, fontWeight: 700, fontFamily: 'var(--font-mono)',
                color: m.isRed ? 'var(--red)' : 'var(--navy)'
              }}>
                {m.value}
              </div>
              <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 4 }}>
                {m.label}
              </div>
            </div>
          ))}
        </div>

        {/* Two-column layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 16 }}>
          {/* Recent Runs */}
          <div className="data-table-container">
            <div style={{
              padding: '10px 14px', background: 'var(--gray-50)',
              borderBottom: '1px solid var(--gray-200)', fontSize: 11,
              fontWeight: 700, color: 'var(--navy)', letterSpacing: '0.04em'
            }}>
              RECENT RUNS
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Ext</th>
                </tr>
              </thead>
              <tbody>
                {demoTasks.map(task => (
                  <tr key={task.id}>
                    <td style={{ fontWeight: 600 }}>{task.name}</td>
                    <td><span className="tag tag-local">{task.type.toUpperCase()}</span></td>
                    <td>
                      <span className={`tag ${task.status === 'verified' ? 'tag-verified' : 'tag-ready'}`}>
                        {task.status.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--red)', fontWeight: 700 }}>0</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* System Status */}
          <div className="data-table-container">
            <div style={{
              padding: '10px 14px', background: 'var(--gray-50)',
              borderBottom: '1px solid var(--gray-200)', fontSize: 11,
              fontWeight: 700, color: 'var(--navy)', letterSpacing: '0.04em',
              display: 'flex', alignItems: 'center', gap: 6
            }}>
              <Cpu size={12} strokeWidth={2} />
              SYSTEM STATUS
            </div>
            <table className="data-table">
              <tbody>
                {statusItems.map(item => (
                  <tr key={item.label}>
                    <td style={{ color: 'var(--gray-700)', fontSize: 12 }}>{item.label}</td>
                    <td style={{ textAlign: 'right' }}>
                      <span className={`tag ${item.isBlocked ? 'tag-danger' : 'tag-verified'}`} style={{ fontSize: 9 }}>
                        {item.value}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
