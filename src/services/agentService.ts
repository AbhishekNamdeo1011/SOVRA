import type { TaskType, ModelRole, AgentStep, TaskOutput, KnowledgeResult, FileAttachment } from '../types';

export interface AgentExecutionPlan {
  isComplexTask: boolean;
  taskType: TaskType;
  modelRole: ModelRole;
  steps: AgentStep[];
  sources: KnowledgeResult[];
  output: TaskOutput;
  completionText: string;
}

/**
 * Analyzes the user's prompt and attachments to determine routing and workflow complexity.
 */
export function planExecution(
  prompt: string,
  attachments: FileAttachment[] = []
): AgentExecutionPlan {
  const lower = prompt.toLowerCase();
  const file = attachments[0];
  const fileExt = file?.type.toLowerCase() || '';

  // Check if it's a simple informational query
  const isSimpleQuery =
    attachments.length === 0 &&
    (lower.startsWith('what is') ||
     lower.startsWith('who is') ||
     lower.startsWith('explain') ||
     lower.startsWith('how does') ||
     lower.includes('hello') ||
     lower.includes('help') ||
     prompt.trim().length < 25);

  if (isSimpleQuery) {
    return {
      isComplexTask: false,
      taskType: 'general',
      modelRole: 'reasoning',
      steps: [],
      sources: [],
      output: { id: '', name: '', type: '', status: 'ready', location: 'local' },
      completionText: generateSimpleAnswer(prompt),
    };
  }

  // Coding task detection
  if (fileExt === 'py' || fileExt === 'js' || fileExt === 'cpp' || lower.includes('python') || lower.includes('code') || lower.includes('bug') || lower.includes('function') || lower.includes('test')) {
    return {
      isComplexTask: true,
      taskType: 'coding',
      modelRole: 'coding',
      steps: [
        { id: 'c1', type: 'plan', label: 'PLAN', detail: 'Analyze code syntax, logic constraints, and failure modes', status: 'pending' },
        { id: 'c2', type: 'call_tool', label: 'STATIC ANALYSIS', detail: 'Check logic against DEV-STD-01 security rules', status: 'pending' },
        { id: 'c3', type: 'call_tool', label: 'DOCKER SANDBOX', detail: 'Mount isolated container with network socket disabled', status: 'pending' },
        { id: 'c4', type: 'call_tool', label: 'RUN TESTS', detail: 'Execute test suite assertions (4/4 tests)', status: 'pending' },
        { id: 'c5', type: 'verify', label: 'VERIFY', detail: 'Package tested artifact and sign verification hash', status: 'pending' },
      ],
      sources: [
        { sourceId: 'std-dev-01', title: 'DEV-STD-01: Python Coding Standards', snippet: 'Strict prohibition of raw socket creation and unbuffered file descriptor leakages.', score: 0.93 },
        { sourceId: 'std-test-02', title: 'TEST-STD-02: Isolated Runner Specs', snippet: 'Container runner requires memory ceiling limit of 512MB and read-only root mount.', score: 0.87 },
      ],
      output: {
        id: `out-code-${Date.now()}`,
        name: 'verified_code.zip',
        type: 'zip',
        status: 'verified',
        location: 'local',
        size: '28 KB',
      },
      completionText: 'Python code corrected and verified. All 4 unit tests executed successfully inside an isolated Docker sandbox with zero network access. Output archive is ready for deployment.',
    };
  }

  // Vision / P&ID task detection
  if (fileExt === 'png' || fileExt === 'jpg' || fileExt === 'jpeg' || lower.includes('p&id') || lower.includes('pid') || lower.includes('diagram') || lower.includes('valve') || lower.includes('image') || lower.includes('blueprint')) {
    return {
      isComplexTask: true,
      taskType: 'vision',
      modelRole: 'vision',
      steps: [
        { id: 'v1', type: 'plan', label: 'PLAN', detail: 'Parse high-resolution diagram raster layers', status: 'pending' },
        { id: 'v2', type: 'call_tool', label: 'MULTIMODAL OCR', detail: 'Identify alphanumeric instrument tags and valve symbols', status: 'pending' },
        { id: 'v3', type: 'call_tool', label: 'KNOWLEDGE SEARCH', detail: 'Cross-reference MAN-PID-01 equipment standard', status: 'pending' },
        { id: 'v4', type: 'observe', label: 'OBSERVE', detail: '3 discrepancies flagged against engineering manual', status: 'pending' },
        { id: 'v5', type: 'verify', label: 'VERIFY', detail: 'Compile finding report and generate coordinate stamps', status: 'pending' },
      ],
      sources: [
        { sourceId: 'man-pid-01', title: 'MAN-PID-01: P&ID Symbols Manual', snippet: 'Standardized valve symbology: Normally Open vs. Normally Closed designations.', score: 0.95 },
        { sourceId: 'tag-ref-04', title: 'TAG-REF-04: Instrument Numbering', snippet: 'Flow indicator controller prefixing rules for secondary bypass lines.', score: 0.85 },
      ],
      output: {
        id: `out-vis-${Date.now()}`,
        name: 'pid_findings.docx',
        type: 'docx',
        status: 'verified',
        location: 'local',
        size: '86 KB',
      },
      completionText: 'P&ID scan analyzed via local vision multimodal model. 3 discrepancies detected (Valve V-14 status mismatch, FIC-203 tag illegibility, bypass line arrow) and verified against MAN-PID-01.',
    };
  }

  // Default: Document analysis & approval note (Primary demo)
  return {
    isComplexTask: true,
    taskType: 'document',
    modelRole: 'reasoning',
    steps: [
      { id: 'd1', type: 'plan', label: 'PLAN', detail: 'Deconstruct document hierarchy and target findings', status: 'pending' },
      { id: 'd2', type: 'call_tool', label: 'LOCAL OCR', detail: 'Process scanned document pages via local OCR engine', status: 'pending' },
      { id: 'd3', type: 'call_tool', label: 'KNOWLEDGE SEARCH', detail: 'Retrieve SOP-204 and SOP-117 from on-premise vector store', status: 'pending' },
      { id: 'd4', type: 'observe', label: 'OBSERVE', detail: 'Extract 3 critical findings against regulatory thresholds', status: 'pending' },
      { id: 'd5', type: 'iterate', label: 'SYNTHESIZE', detail: 'Draft formal approval note referencing matched clauses', status: 'pending' },
      { id: 'd6', type: 'verify', label: 'VERIFY', detail: 'Audit delivery format and confirm 0 external network requests', status: 'pending' },
    ],
    sources: [
      { sourceId: 'sop-204', title: 'SOP-204: Inspection Clearance', snippet: 'Prescribes mandatory sign-off criteria for pressure vessel ultrasonic testing.', score: 0.94 },
      { sourceId: 'sop-117', title: 'SOP-117: Deficiency Classification', snippet: 'Defines Class-B insulation tolerance thresholds and remediation steps.', score: 0.88 },
      { sourceId: 'rep-2022', title: 'REP-2022-07: Prior Vessel Baseline', snippet: 'Historical baseline comparison for ultrasonic thickness degradation curve.', score: 0.79 },
    ],
    output: {
      id: `out-doc-${Date.now()}`,
      name: 'approval_note.docx',
      type: 'docx',
      status: 'verified',
      location: 'local',
      size: '142 KB',
    },
    completionText: 'Approval note is ready. All pages were parsed via local OCR and verified against SOP-204 and SOP-117. Zero external network calls were made.',
  };
}

function generateSimpleAnswer(prompt: string): string {
  const lower = prompt.toLowerCase();
  if (lower.includes('sop-204') || lower.includes('sop 204')) {
    return 'SOP-204 defines the standard operating procedure for clearance and sign-off on pressure vessel inspections across refinery units. It establishes ultrasonic wall-thickness tolerances, gasket replacement intervals, and mandatory sign-off authority hierarchies.';
  }
  if (lower.includes('air gap') || lower.includes('sovereign')) {
    return 'SOVRA operates strictly air-gapped on your organization’s private hardware. All model weights (Reasoning, Coding, Vision), vector stores (ChromaDB), OCR engines, and document generation tools run locally with zero external network calls.';
  }
  if (lower.includes('model') || lower.includes('weights')) {
    return 'SOVRA utilizes local open-weight models quantized in GGUF/AWQ formats: a 7B/8B Reasoning LLM, a Coder LLM, and a Multimodal Vision model. Tasks are automatically routed to the appropriate local capability.';
  }
  return `Understood. I am running as your sovereign on-premise assistant on local node 192.168.1.10 with network air-gapping enabled. You can attach documents, request code fixes, or inspect P&ID schematics, and all processing will remain confidential and on-premise.`;
}
