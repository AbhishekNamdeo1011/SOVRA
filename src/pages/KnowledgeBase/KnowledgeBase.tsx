import React from 'react';
import type { KnowledgeSource } from '../../types';
import { BookOpen, FileText, Folder, Mail, Database, Plus } from 'lucide-react';

interface KnowledgeBaseProps {
  sources: KnowledgeSource[];
  onIndexSampleKnowledge: () => void;
}

const catIcons: Record<string, React.ReactNode> = {
  sop: <BookOpen size={15} strokeWidth={2} />,
  manual: <FileText size={15} strokeWidth={2} />,
  report: <Folder size={15} strokeWidth={2} />,
  correspondence: <Mail size={15} strokeWidth={2} />,
};

const KnowledgeBase: React.FC<KnowledgeBaseProps> = ({ sources, onIndexSampleKnowledge }) => {
  return (
    <div className="chat-workspace">
      <div className="chat-workspace-card">
        <div className="chat-subbar">
          <div>
            <span className="chat-subbar-title">Knowledge</span>
            <span className="chat-subbar-sub">
              Local reference documents
            </span>
          </div>
          {sources.length === 0 ? (
            <button className="btn btn-secondary btn-sm" onClick={onIndexSampleKnowledge}>
              <Plus size={13} />
              <span>Load Demo Knowledge</span>
            </button>
          ) : (
            <button className="btn btn-secondary btn-sm" onClick={() => {}}>
              <Plus size={13} />
              <span>Add Documents</span>
            </button>
          )}
        </div>

        <div className="chat-workspace-body">
        {sources.length === 0 ? (
          <div style={{
            background: 'var(--bg-surface)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)', padding: 48, textAlign: 'center',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12
          }}>
            <Database size={32} color="var(--text-sub)" />
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)' }}>
              No local knowledge sources
            </div>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', maxWidth: 440, lineHeight: 1.5 }}>
              Add SOPs, manuals, reports, or correspondence to enable local knowledge retrieval during tasks.
            </p>
            <div style={{ display: 'flex', gap: 8, marginTop: 8, fontSize: 12, color: 'var(--text-sub)' }}>
              <span>SOPs</span><span>·</span>
              <span>Manuals</span><span>·</span>
              <span>Reports</span><span>·</span>
              <span>Correspondence</span>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={onIndexSampleKnowledge} style={{ marginTop: 8 }}>
              Load Demo Knowledge
            </button>
          </div>
        ) : (
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Documents</th>
                  <th>Location</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {sources.map((src) => (
                  <tr key={src.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ color: 'var(--text-muted)' }}>
                          {catIcons[src.category] || <FileText size={15} />}
                        </span>
                        <span style={{ fontWeight: 600 }}>{src.name}</span>
                      </div>
                    </td>
                    <td>
                      <span className="tag tag-monochrome">{src.category.toUpperCase()}</span>
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>
                      {src.documents}
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600 }}>
                      Local
                    </td>
                    <td>
                      <span className="tag tag-monochrome">INDEXED</span>
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

export default KnowledgeBase;
