import React, { useRef } from 'react';
import type { DocumentItem } from '../../types';
import { FileText, Image as ImageIcon, Code, UploadCloud, HardDrive } from 'lucide-react';

interface DocumentsProps {
  documents: DocumentItem[];
  onUpload: (files: File[]) => void;
}

const typeIcons: Record<string, React.ReactNode> = {
  pdf: <FileText size={16} strokeWidth={2} />,
  png: <ImageIcon size={16} strokeWidth={2} />,
  py: <Code size={16} strokeWidth={2} />,
  docx: <FileText size={16} strokeWidth={2} />,
  default: <FileText size={16} strokeWidth={2} />,
};

const Documents: React.FC<DocumentsProps> = ({ documents, onUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    onUpload(Array.from(e.target.files));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="chat-workspace">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        multiple
        style={{ display: 'none' }}
        accept=".pdf,.docx,.xlsx,.pptx,.png,.jpg,.jpeg,.txt,.csv,.py,.js,.cpp"
      />

      <div className="chat-workspace-card">
        <div className="chat-subbar">
          <div>
            <span className="chat-subbar-title">Documents</span>
            <span className="chat-subbar-sub">
              Local on-premise storage
            </span>
          </div>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => fileInputRef.current?.click()}
          >
            <UploadCloud size={14} />
            <span>Upload File</span>
          </button>
        </div>

        <div className="chat-workspace-body">
        {documents.length === 0 ? (
          <div style={{
            background: 'var(--bg-surface)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)', padding: 48, textAlign: 'center',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12
          }}>
            <HardDrive size={32} color="var(--text-sub)" />
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)' }}>
              No documents
            </div>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', maxWidth: 440, lineHeight: 1.5 }}>
              Files you attach during conversations or upload directly will appear here.
            </p>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => fileInputRef.current?.click()}
              style={{ marginTop: 8 }}
            >
              Upload File
            </button>
          </div>
        ) : (
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Location</th>
                  <th>Updated</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc) => (
                  <tr key={doc.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ color: 'var(--text-muted)' }}>
                          {typeIcons[doc.type.toLowerCase()] || typeIcons.default}
                        </span>
                        <span style={{ fontWeight: 600 }}>{doc.name}</span>
                      </div>
                    </td>
                    <td>
                      <span className="tag tag-monochrome">{doc.type.toUpperCase()}</span>
                    </td>
                    <td>
                      <span className="tag tag-monochrome">{doc.status}</span>
                    </td>
                    <td>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600 }}>{doc.location}</span>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>
                      {doc.updated}
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

export default Documents;
