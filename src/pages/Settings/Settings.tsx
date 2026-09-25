import React from 'react';
import { Shield } from 'lucide-react';

const Settings: React.FC = () => {
  const sections = [
    {
      title: 'GENERAL',
      rows: [
        ['System Name', 'SOVRA (Sovereign On-Premise AI Workbench)'],
        ['Authentication', 'Internal Organisational Access (Air-Gapped)'],
        ['Release', 'SIH 2026 · PS 26117'],
        ['Host Environment', 'Local On-Premise Workstation'],
      ],
    },
    {
      title: 'WORKSPACE POLICY',
      rows: [
        ['Sovereign Mode', 'ON'],
        ['Local Storage', 'Enabled'],
        ['Cloud Telemetry', 'Disabled'],
        ['External API Endpoints', 'Blocked'],
      ],
    },
    {
      title: 'SECURITY',
      rows: [
        ['Network', 'Air-Gapped'],
        ['External DNS', 'Blocked'],
        ['NTP Time Sync', 'Blocked'],
        ['Sandboxing', 'Docker (--network=none)'],
      ],
    },
    {
      title: 'MODELS',
      rows: [
        ['Reasoning', 'Open-Weight Local'],
        ['Coding', 'Open-Weight Local'],
        ['Vision', 'Open-Weight Multimodal Local'],
        ['Vector Store', 'Local Embedded'],
      ],
    },
  ];

  return (
    <div className="chat-workspace">
      <div className="chat-workspace-card">
        <div className="chat-subbar">
          <div>
            <span className="chat-subbar-title">Settings</span>
            <span className="chat-subbar-sub">
              System configuration
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-main)', fontWeight: 600 }}>
            <Shield size={14} />
            <span>Local Policy Active</span>
          </div>
        </div>

        <div className="chat-workspace-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {sections.map(sec => (
            <div key={sec.title} className="data-table-container">
              <div style={{
                padding: '10px 16px', background: 'var(--bg-subtle)',
                borderBottom: '1px solid var(--border)', fontSize: 11,
                fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.06em'
              }}>
                {sec.title}
              </div>
              <table className="data-table">
                <tbody>
                  {sec.rows.map(([k, v]) => (
                    <tr key={k}>
                      <td style={{ width: '38%', color: 'var(--text-muted)', fontWeight: 500 }}>
                        {k}
                      </td>
                      <td style={{
                        fontWeight: 600, color: 'var(--text-main)',
                        fontFamily: 'var(--font-mono)', fontSize: 13
                      }}>
                        {v}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Settings;
