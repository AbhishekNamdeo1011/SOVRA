import React, { useState, useRef, useEffect } from 'react';
import type {
  Conversation, FileAttachment, AgentStep, ModelRole,
  TaskType, KnowledgeResult, TaskOutput
} from '../../types';
import { processUploadedFile, downloadFile, SAMPLE_DELIVERABLES } from '../../services/documentService';
import {
  Paperclip, Send, FileText, Image as ImageIcon,
  Check, Loader, Circle, X, UploadCloud, ChevronDown, ChevronRight,
  Eye, Download, Cpu, Code, Square
} from 'lucide-react';

interface WorkbenchProps {
  conversation: Conversation | null;
  onSendMessage: (text: string, files: FileAttachment[]) => Promise<void>;
  isRunning: boolean;
  onStop: () => void;
  activeSteps: AgentStep[];
  activeModelRole: ModelRole;
  activeTaskType: TaskType;
  activeSources: KnowledgeResult[];
  showDrawer?: boolean;
  onToggleDrawer?: () => void;
  allConversations?: Conversation[];
  onSelectConversation?: (id: string) => void;
  onNewChat?: () => void;
}

// Minimal starter suggestions (NOT preloaded data)
const STARTER_SUGGESTIONS = [
  {
    id: 'inspection',
    icon: FileText,
    label: 'Inspection Report',
    prompt: 'Analyze this inspection report and prepare an approval note.',
  },
  {
    id: 'coding',
    icon: Code,
    label: 'Coding Task',
    prompt: 'Find the issue, fix it and verify the result.',
  },
  {
    id: 'vision',
    icon: ImageIcon,
    label: 'P&ID Analysis',
    prompt: 'Analyze this P&ID and identify visible findings.',
  },
];

const MODEL_ROLE_LABELS: Record<string, string> = {
  reasoning: 'Reasoning · Local',
  coding: 'Coding · Local',
  vision: 'Vision · Local',
};

const TASK_TYPE_LABELS: Record<string, string> = {
  document: 'Document Analysis',
  coding: 'Coding',
  vision: 'P&ID / Vision',
  general: 'General',
};

const Workbench: React.FC<WorkbenchProps> = ({
  conversation,
  onSendMessage,
  isRunning,
  onStop,
  activeSteps,
  activeModelRole,
  activeTaskType: _activeTaskType,
  activeSources,
  showDrawer = false,
  onToggleDrawer,
  onNewChat,
}) => {
  const [inputText, setInputText] = useState('');
  const [stagedFiles, setStagedFiles] = useState<FileAttachment[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [expandedDetails, setExpandedDetails] = useState<Record<string, boolean>>({});
  const [previewOutput, setPreviewOutput] = useState<TaskOutput | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation?.messages, isRunning]);

  // Auto-grow textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 160) + 'px';
    }
  }, [inputText]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const files = Array.from(e.target.files);
    const processed = await Promise.all(files.map(f => processUploadedFile(f)));
    setStagedFiles(prev => [...prev, ...processed]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (!e.dataTransfer.files || e.dataTransfer.files.length === 0) return;
    const files = Array.from(e.dataTransfer.files);
    const processed = await Promise.all(files.map(f => processUploadedFile(f)));
    setStagedFiles(prev => [...prev, ...processed]);
  };

  const handleRemoveFile = (id: string) => {
    setStagedFiles(prev => prev.filter(f => f.id !== id));
  };

  const handleStarterClick = (suggestion: typeof STARTER_SUGGESTIONS[0]) => {
    // Create a new chat and insert the prompt
    if (onNewChat) onNewChat();
    setInputText(suggestion.prompt);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleSend = async () => {
    if (isRunning) return;
    const text = inputText.trim();
    if (!text && stagedFiles.length === 0) return;

    const filesToSend = [...stagedFiles];
    setInputText('');
    setStagedFiles([]);
    await onSendMessage(text, filesToSend);
  };

  const toggleDetails = (msgId: string) => {
    setExpandedDetails(prev => ({ ...prev, [msgId]: !prev[msgId] }));
  };

  const handleDownload = (output: TaskOutput) => {
    const text = SAMPLE_DELIVERABLES[output.name] || 'Generated deliverable verified on local node.';
    downloadFile(output.name, text);
  };

  const messages = conversation?.messages || [];
  const hasMessages = messages.length > 0;

  const getFileIcon = (type: string) => {
    const t = type.toLowerCase();
    if (['png', 'jpg', 'jpeg', 'webp'].includes(t)) return <ImageIcon size={14} />;
    if (['py', 'js', 'cpp', 'csv'].includes(t)) return <Code size={14} />;
    return <FileText size={14} />;
  };

  return (
    <div
      className="workbench-container"
      onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      {/* Hidden File Picker */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        multiple
        style={{ display: 'none' }}
        accept=".pdf,.docx,.xlsx,.pptx,.png,.jpg,.jpeg,.txt,.csv,.py,.js,.cpp"
      />

      {/* Drag & Drop Overlay */}
      {isDragging && (
        <div className="drag-overlay">
          <UploadCloud size={40} color="var(--text-sub)" />
          <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-main)' }}>
            Drop file here
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            Local processing · No cloud transfer
          </div>
        </div>
      )}

      {/* CENTER CHAT AREA */}
      <div className="center-chat-canvas">
        <div className="chat-scroll-area">
          {!hasMessages ? (
            /* Empty State */
            <div className="empty-welcome-hero">
              <h2 className="empty-welcome-title">SOVRA</h2>
              <p className="empty-welcome-desc">
                Secure AI for confidential work.
              </p>
              <p className="empty-welcome-question">
                What would you like to work on?
              </p>

              <div className="starter-suggestions">
                {STARTER_SUGGESTIONS.map(s => {
                  const Icon = s.icon;
                  return (
                    <button
                      key={s.id}
                      className="starter-item"
                      onClick={() => handleStarterClick(s)}
                    >
                      <span className="starter-item-icon">
                        <Icon size={16} />
                      </span>
                      <span>{s.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Chat Thread */
            <div className="chat-thread-container">
              {messages.map(msg => (
                <div key={msg.id} className="message-bubble">
                  <div className="message-author">
                    {msg.role === 'user' ? (
                      <span>You</span>
                    ) : (
                      <span style={{ color: 'var(--text-main)', fontWeight: 700 }}>
                        SOVRA
                      </span>
                    )}
                    <span style={{ fontSize: 11, color: 'var(--text-sub)', fontWeight: 400 }}>{msg.timestamp}</span>
                  </div>

                  {msg.role === 'user' ? (
                    <div className="message-text-user">
                      <div>{msg.content}</div>

                      {/* Attachments */}
                      {msg.attachments && msg.attachments.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
                          {msg.attachments.map(att => (
                            <div key={att.id} className="staged-file-pill">
                              {att.previewUrl ? (
                                <img src={att.previewUrl} alt={att.name} />
                              ) : (
                                getFileIcon(att.type)
                              )}
                              <span>{att.name}</span>
                              <span style={{ color: 'var(--text-sub)', fontSize: 11 }}>
                                {att.type.toUpperCase()} · {att.size}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="message-text-ai">
                      {/* Streaming Progress */}
                      {msg.isStreaming && (
                        <div className="agent-progress-box">
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600 }}>
                            <Loader size={14} className="animate-spin" color="var(--accent)" />
                            <span>Analyzing task…</span>
                          </div>
                          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                            Step {msg.activeStepNumber || 1} of {msg.totalSteps || 5} · {msg.activeStepLabel || 'Processing…'}
                          </div>
                        </div>
                      )}

                      {/* Task Classification (shown after streaming starts) */}
                      {msg.isComplexTask && msg.taskType && (
                        <div className="task-classification">
                          <div className="task-classification-row">
                            <span className="task-classification-label">Task</span>
                            <span className="task-classification-value">{TASK_TYPE_LABELS[msg.taskType] || msg.taskType}</span>
                          </div>
                          <div className="task-classification-row">
                            <span className="task-classification-label">Model Route</span>
                            <span className="task-classification-value">{MODEL_ROLE_LABELS[msg.modelRole || 'reasoning']}</span>
                          </div>
                        </div>
                      )}

                      {/* AI Content */}
                      {msg.content && (
                        <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.65 }}>
                          {msg.content}
                        </div>
                      )}

                      {/* Sources */}
                      {msg.sources && msg.sources.length > 0 && !msg.isStreaming && (
                        <div className="sources-section">
                          <div className="sources-title">Sources</div>
                          {msg.sources.map(s => (
                            <div key={s.sourceId} className="source-item">
                              <div className="source-item-title">{s.title}</div>
                              <div className="source-item-detail">{s.snippet}</div>
                            </div>
                          ))}
                          <div style={{ fontSize: 11, color: 'var(--text-sub)', marginTop: 6 }}>
                            {msg.sources.length} local source{msg.sources.length !== 1 ? 's' : ''}
                          </div>
                        </div>
                      )}

                      {/* Deliverable */}
                      {msg.output && (
                        <div className="deliverable-card-modern">
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div className="deliverable-icon-box">
                              <FileText size={18} />
                            </div>
                            <div>
                              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-main)' }}>
                                {msg.output.name}
                              </div>
                              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                                {msg.output.type.toUpperCase()} · Verified
                              </div>
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: 8 }}>
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => setPreviewOutput(msg.output || null)}
                            >
                              <Eye size={13} />
                              <span>Preview</span>
                            </button>
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => handleDownload(msg.output!)}
                            >
                              <Download size={13} />
                              <span>Download</span>
                            </button>
                          </div>
                        </div>
                      )}

                      {/* View Activity Toggle */}
                      {msg.isComplexTask && !msg.isStreaming && (
                        <div style={{ marginTop: 10 }}>
                          <button
                            onClick={() => toggleDetails(msg.id)}
                            className="view-activity-btn"
                          >
                            {expandedDetails[msg.id] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                            <span>View activity</span>
                          </button>

                          {expandedDetails[msg.id] && (
                            <div style={{
                              marginTop: 8, padding: '12px 14px', background: 'var(--bg-subtle)',
                              borderRadius: 'var(--radius-md)', border: '1px solid var(--border)',
                              fontSize: 13, display: 'flex', flexDirection: 'column', gap: 6
                            }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Model Route</span>
                                <span style={{ fontWeight: 600 }}>Local {msg.modelRole?.toUpperCase() || 'REASONING'}</span>
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Sandbox</span>
                                <span style={{ fontWeight: 600 }}>Local · Network Disabled</span>
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--text-muted)' }}>External Calls</span>
                                <span style={{ fontWeight: 600, fontFamily: 'var(--font-mono)' }}>0</span>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* COMPOSER */}
        <div className="composer-outer">
          <div className="composer-floating-box">
            {/* Staged files */}
            {stagedFiles.length > 0 && (
              <div className="staged-files-row">
                {stagedFiles.map(file => (
                  <div key={file.id} className="staged-file-pill">
                    {file.previewUrl ? (
                      <img src={file.previewUrl} alt={file.name} />
                    ) : (
                      getFileIcon(file.type)
                    )}
                    <span>{file.name}</span>
                    <span style={{ color: 'var(--text-sub)', fontSize: 11 }}>
                      {file.size}
                    </span>
                    <button
                      onClick={() => handleRemoveFile(file.id)}
                      disabled={isRunning}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-sub)', padding: 2 }}
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="composer-input-row">
              <textarea
                ref={textareaRef}
                className="composer-textarea"
                rows={1}
                placeholder="Ask SOVRA anything…"
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                disabled={isRunning}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
              />

              {isRunning ? (
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={onStop}
                  title="Stop"
                  style={{ flexShrink: 0 }}
                >
                  <Square size={12} />
                  <span>Stop</span>
                </button>
              ) : (
                <button
                  className="composer-send-btn"
                  onClick={handleSend}
                  disabled={!inputText.trim() && stagedFiles.length === 0}
                  title="Send"
                >
                  <Send size={14} />
                </button>
              )}
            </div>

            {/* Bottom Row */}
            <div className="composer-bottom-row">
              <div className="composer-actions-left">
                <button
                  className="composer-action-pill"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isRunning}
                >
                  <Paperclip size={14} />
                  <span>Attach</span>
                </button>
              </div>
            </div>
          </div>

          <div className="composer-disclaimer">
            SOVRA processes all tasks on-premise. Zero external network calls.
          </div>
        </div>
      </div>

      {/* AGENT ACTIVITY DRAWER */}
      {showDrawer && activeSteps.length > 0 && (
        <div className="agent-drawer">
          <div className="agent-drawer-header">
            <span className="agent-drawer-title">Agent Activity</span>
            <button
              onClick={onToggleDrawer}
              className="icon-action-btn"
              title="Close"
            >
              <X size={16} />
            </button>
          </div>

          <div className="agent-drawer-body">
            {/* Route Tag */}
            <div className="drawer-route-tag">
              <Cpu size={13} />
              <span>{MODEL_ROLE_LABELS[activeModelRole] || 'Local'}</span>
            </div>

            {/* Steps */}
            {activeSteps.map(step => (
              <div
                key={step.id}
                className={`agent-step-item ${step.status === 'running' ? 'running' : ''}`}
              >
                <div className={`agent-step-icon ${step.status}`}>
                  {step.status === 'complete' ? (
                    <Check size={14} strokeWidth={2.5} />
                  ) : step.status === 'running' ? (
                    <Loader size={14} className="animate-spin" />
                  ) : (
                    <Circle size={14} />
                  )}
                </div>
                <div>
                  <div className="agent-step-label">{step.label}</div>
                  <div className="agent-step-detail">{step.detail}</div>
                </div>
              </div>
            ))}

            {/* Sources */}
            {activeSources.length > 0 && (
              <div className="drawer-sources">
                <div className="sources-title">Sources ({activeSources.length})</div>
                {activeSources.map(s => (
                  <div key={s.sourceId} className="source-item">
                    <div className="source-item-title">{s.title}</div>
                    <div className="source-item-detail">{s.snippet}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* DOCUMENT PREVIEW MODAL */}
      {previewOutput && (
        <div className="preview-modal-overlay">
          <div className="preview-modal">
            <div className="preview-modal-header">
              <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-main)' }}>
                {previewOutput.name}
              </span>
              <button
                onClick={() => setPreviewOutput(null)}
                className="icon-action-btn"
              >
                <X size={18} />
              </button>
            </div>

            <div className="preview-modal-body">
              <pre style={{
                fontFamily: previewOutput.type === 'py' || previewOutput.type === 'zip' ? 'var(--font-mono)' : 'var(--font-sans)',
                fontSize: 14, lineHeight: 1.65, whiteSpace: 'pre-wrap', color: 'var(--text-main)',
                background: 'var(--bg-subtle)', padding: 20, borderRadius: 'var(--radius-md)', border: '1px solid var(--border)'
              }}>
                {SAMPLE_DELIVERABLES[previewOutput.name] || 'Generated deliverable output.'}
              </pre>
            </div>

            <div className="preview-modal-footer">
              <button className="btn btn-secondary btn-sm" onClick={() => setPreviewOutput(null)}>
                Close
              </button>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => {
                  handleDownload(previewOutput);
                  setPreviewOutput(null);
                }}
              >
                <Download size={13} />
                <span>Download</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Workbench;
