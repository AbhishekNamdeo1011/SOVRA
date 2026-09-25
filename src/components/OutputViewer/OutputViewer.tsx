import React, { useState } from 'react';
import type { TaskOutput } from '../../types';
import { Eye, Download, FileText, Code, Package, X, Check } from 'lucide-react';
import { downloadFile, SAMPLE_DELIVERABLES } from '../../services/documentService';

interface OutputViewerProps {
  output?: TaskOutput;
}

const fileIcons: Record<string, React.ReactNode> = {
  docx: <FileText size={18} strokeWidth={2} />,
  zip: <Package size={18} strokeWidth={2} />,
  py: <Code size={18} strokeWidth={2} />,
  default: <FileText size={18} strokeWidth={2} />,
};

const OutputViewer: React.FC<OutputViewerProps> = ({ output }) => {
  const [showPreview, setShowPreview] = useState(false);
  const [downloadedNotice, setDownloadedNotice] = useState(false);

  if (!output || !output.name) return null;

  const previewText = SAMPLE_DELIVERABLES[output.name] || 'Generated local deliverable verified on-premise.';

  const handleDownload = () => {
    // Generate real file and trigger browser download
    const mimeMap: Record<string, string> = {
      docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      zip: 'application/zip',
      py: 'text/x-python',
      txt: 'text/plain',
    };

    downloadFile(output.name, previewText, mimeMap[output.type] || 'application/octet-stream');
    setDownloadedNotice(true);
    setTimeout(() => setDownloadedNotice(false), 3500);
  };

  return (
    <>
      <div className="deliverable-card">
        <div className="deliverable-left">
          <div style={{
            width: 38, height: 38, borderRadius: 4, background: 'var(--gray-100)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--navy)'
          }}>
            {fileIcons[output.type] || fileIcons.default}
          </div>
          <div>
            <div className="deliverable-title">{output.name}</div>
            <div className="deliverable-meta">
              <span className="tag tag-verified" style={{ fontSize: 9 }}>
                {output.status.toUpperCase()}
              </span>
              <span>·</span>
              <span style={{ color: 'var(--gray-600)' }}>
                {output.size || 'Local Storage'}
              </span>
              <span>·</span>
              <span style={{ color: 'var(--navy)', fontWeight: 600 }}>Zero External Calls</span>
            </div>
          </div>
        </div>

        <div className="deliverable-actions">
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setShowPreview(true)}
            aria-label="Preview deliverable"
          >
            <Eye size={12} strokeWidth={2} /> Preview
          </button>
          <button
            className="btn btn-primary btn-sm"
            onClick={handleDownload}
            aria-label="Download deliverable"
          >
            <Download size={12} strokeWidth={2} /> Download
          </button>
        </div>
      </div>

      {downloadedNotice && (
        <div style={{
          marginTop: 6, padding: '7px 12px', background: 'var(--gray-100)',
          borderRadius: 4, fontSize: 11, color: 'var(--navy)', display: 'flex',
          justifyContent: 'space-between', alignItems: 'center', border: '1px solid var(--gray-200)'
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Check size={12} color="#15803D" strokeWidth={2.5} />
            File downloaded from local storage directly to your machine.
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--success)', fontWeight: 700 }}>
            COMPLETED
          </span>
        </div>
      )}

      {/* Interactive In-App Preview Modal */}
      {showPreview && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(17, 24, 39, 0.45)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{
            width: '90%', maxWidth: 660, background: 'var(--white)',
            borderRadius: 4, border: '1px solid var(--gray-300)',
            boxShadow: '0 8px 30px rgba(0,0,0,0.12)', display: 'flex',
            flexDirection: 'column', maxHeight: '85vh', overflow: 'hidden'
          }}>
            <div style={{
              padding: '14px 18px', borderBottom: '1px solid var(--gray-200)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              background: 'var(--gray-50)'
            }}>
              <div>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--navy)' }}>
                  PREVIEW: {output.name}
                </span>
                <span className="tag tag-verified" style={{ marginLeft: 8, fontSize: 9 }}>
                  VERIFIED LOCAL
                </span>
              </div>
              <button
                onClick={() => setShowPreview(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-500)' }}
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ padding: 18, overflowY: 'auto', flex: 1, background: 'var(--white)' }}>
              <pre style={{
                fontFamily: output.type === 'zip' || output.type === 'py' ? 'var(--font-mono)' : 'var(--font-sans)',
                fontSize: 12, lineHeight: 1.6, whiteSpace: 'pre-wrap', color: 'var(--navy)',
                background: 'var(--gray-50)', padding: 16, borderRadius: 4, border: '1px solid var(--gray-200)'
              }}>
                {previewText}
              </pre>
            </div>

            <div style={{
              padding: '12px 18px', borderTop: '1px solid var(--gray-200)',
              background: 'var(--gray-50)', display: 'flex', justifyContent: 'flex-end', gap: 8
            }}>
              <button className="btn btn-secondary btn-sm" onClick={() => setShowPreview(false)}>
                Close
              </button>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => {
                  setShowPreview(false);
                  handleDownload();
                }}
              >
                <Download size={12} strokeWidth={2} /> Download Local Copy
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OutputViewer;
