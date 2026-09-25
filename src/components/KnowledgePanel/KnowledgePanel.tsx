import React from 'react';
import { FileText } from 'lucide-react';
import type { KnowledgeResult } from '../../types';

interface KnowledgePanelProps {
  results: KnowledgeResult[];
  retrieved: boolean;
}

const KnowledgePanel: React.FC<KnowledgePanelProps> = ({ results, retrieved }) => {
  return (
    <div className="panel-section">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="panel-section-title">RETRIEVED SOURCES</span>
        {retrieved && (
          <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--success)', fontWeight: 600 }}>
            {results.length} INDEXED
          </span>
        )}
      </div>

      {!retrieved ? (
        <div style={{
          padding: '14px 10px', textAlign: 'center', color: 'var(--gray-400)',
          fontSize: 11, background: 'var(--gray-50)', border: '1px solid var(--gray-100)',
          borderRadius: 4
        }}>
          No sources retrieved yet.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {results.map((r) => (
            <div
              key={r.sourceId}
              style={{
                padding: '8px 10px', background: 'var(--gray-50)',
                border: '1px solid var(--gray-200)', borderRadius: 4
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--navy)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <FileText size={11} strokeWidth={2} />
                  {r.title}
                </span>
                <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--gray-500)' }}>
                  match: {Math.round(r.score * 100)}%
                </span>
              </div>
              <div style={{ fontSize: 11, color: 'var(--gray-600)', marginTop: 3 }}>
                {r.snippet}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default KnowledgePanel;
