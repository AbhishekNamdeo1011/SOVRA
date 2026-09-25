export type TaskType = 'document' | 'coding' | 'vision' | 'general';
export type TaskStatus = 'idle' | 'running' | 'complete' | 'failed' | 'verified';
export type ModelRole = 'reasoning' | 'coding' | 'vision';
export type StepStatus = 'pending' | 'running' | 'complete' | 'failed';
export type DocumentStatus = 'scanned' | 'generated' | 'indexed' | 'verified' | 'ready';

export interface User {
  workId: string;
  name: string;
  role: string;
  department: string;
}

export interface AgentStep {
  id: string;
  type: 'plan' | 'call_tool' | 'observe' | 'iterate' | 'verify';
  label: string;
  detail: string;
  status: StepStatus;
  durationMs?: number;
}

export interface Task {
  id: string;
  name: string;
  type: TaskType;
  status: TaskStatus;
  modelRoute: ModelRole;
  startedAt?: string;
  completedAt?: string;
  durationMs?: number;
  externalCalls: number;
  steps: AgentStep[];
  attachedFile?: FileAttachment;
  output?: TaskOutput;
}

export interface FileAttachment {
  id: string;
  name: string;
  type: string;
  pages?: number;
  size?: string;
  sizeBytes?: number;
  status: DocumentStatus;
  location: 'local';
  classification: 'scanned' | 'uploaded' | 'generated';
  previewUrl?: string; // Data URL for image thumbnail
  contentSnippet?: string; // Text preview snippet
  fileRef?: File; // Reference to actual browser File object if available
}

export interface TaskOutput {
  id: string;
  name: string;
  type: string;
  status: 'generating' | 'verified' | 'ready';
  location: 'local';
  size?: string;
  downloadData?: string | Blob;
}

export interface KnowledgeResult {
  sourceId: string;
  title: string;
  snippet: string;
  score: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  attachments?: FileAttachment[];
  taskType?: TaskType;
  modelRole?: ModelRole;
  isComplexTask?: boolean;
  steps?: AgentStep[];
  output?: TaskOutput;
  sources?: KnowledgeResult[];
  isStreaming?: boolean;
  activeStepLabel?: string;
  activeStepNumber?: number;
  totalSteps?: number;
}

export interface Conversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
  presetKey?: 'document' | 'coding' | 'vision' | 'custom';
}

export interface DocumentItem {
  id: string;
  name: string;
  type: string;
  status: 'Scanned' | 'Generated' | 'Uploaded' | 'Verified' | 'Ready';
  location: 'Local';
  updated: string;
  size?: string;
  previewUrl?: string;
}

export interface AgentRunRecord {
  id: string;
  task: string;
  type: string;
  route: string;
  status: string;
  duration: string;
  externalCalls: number;
  timestamp: string;
}

export interface AuditEntry {
  id: string;
  time: string;
  task: string;
  action: string;
  network: 'LOCAL';
}

export interface Model {
  id: string;
  role: ModelRole;
  status: 'online' | 'offline' | 'loading';
  location: 'local';
  quantization?: string;
  contextLength?: number;
}

export interface KnowledgeSource {
  id: string;
  name: string;
  category: 'sop' | 'manual' | 'report' | 'correspondence';
  documents: number;
  chunks: number;
  status: 'indexed' | 'indexing';
  location: 'local';
}

export interface AuditLog {
  id: string;
  timestamp: string;
  task: string;
  service: string;
  action: string;
  network: 'LOCAL' | 'EXTERNAL';
  status: 'success' | 'error';
}

export interface SystemStatus {
  gpuOnline: boolean;
  localModels: number;
  networkBlocked: boolean;
  externalCalls: number;
  sovereignMode: boolean;
  dnsBlocked: boolean;
  ntpBlocked: boolean;
  cloudAiCalls: number;
}

export interface DashboardMetrics {
  localModels: number;
  activeTasks: number;
  knowledgeSources: number;
  externalCalls: number;
  totalTasksRun: number;
  totalDocuments: number;
}