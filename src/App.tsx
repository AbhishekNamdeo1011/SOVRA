import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import type {
  User, Conversation, DocumentItem, AgentRunRecord, AuditEntry,
  KnowledgeSource, FileAttachment, AgentStep, ModelRole, TaskType, KnowledgeResult
} from './types';
import { planExecution } from './services/agentService';
import { processUploadedFile } from './services/documentService';
import Login from './components/Login/Login';
import Topbar from './components/Topbar/Topbar';
import Sidebar from './components/Sidebar/Sidebar';
import Workbench from './pages/Workbench/Workbench';
import Documents from './pages/Documents/Documents';
import KnowledgeBase from './pages/KnowledgeBase/KnowledgeBase';
import AgentRuns from './pages/AgentRuns/AgentRuns';
import Models from './pages/Models/Models';
import AuditLogs from './pages/AuditLogs/AuditLogs';
import Settings from './pages/Settings/Settings';

const sampleKnowledgeData: KnowledgeSource[] = [
  { id: 'ks-1', name: 'SOP-204: Pressure Vessel Clearance Standard', category: 'sop', documents: 14, chunks: 520, status: 'indexed', location: 'local' },
  { id: 'ks-2', name: 'SOP-117: Deficiency Classification Matrix', category: 'sop', documents: 8, chunks: 310, status: 'indexed', location: 'local' },
  { id: 'ks-3', name: 'MAN-PID-01: Engineering P&ID Symbology Manual', category: 'manual', documents: 22, chunks: 840, status: 'indexed', location: 'local' },
  { id: 'ks-4', name: 'DEV-STD-01: Isolated Sandbox Execution Guidelines', category: 'report', documents: 6, chunks: 180, status: 'indexed', location: 'local' },
];

const AppContent: React.FC = () => {
  // Authentication — starts logged OUT
  const [user, setUser] = useState<User | null>(null);

  // Theme
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Core state — ALL EMPTY on startup
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [agentRuns, setAgentRuns] = useState<AgentRunRecord[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([]);
  const [knowledgeSources, setKnowledgeSources] = useState<KnowledgeSource[]>([]);

  // Execution state
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [showDrawer, setShowDrawer] = useState<boolean>(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [activeSteps, setActiveSteps] = useState<AgentStep[]>([]);
  const [activeModelRole, setActiveModelRole] = useState<ModelRole>('reasoning');
  const [activeTaskType, setActiveTaskType] = useState<TaskType>('document');
  const [activeSources, setActiveSources] = useState<KnowledgeResult[]>([]);

  const navigate = useNavigate();

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login initialMode="login" onLogin={(u) => { setUser(u); navigate('/workbench'); }} />} />
        <Route path="/signup" element={<Login initialMode="signup" onLogin={(u) => { setUser(u); navigate('/workbench'); }} />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  const activeConversation = conversations.find(c => c.id === activeId) || null;

  // Reset Session — clears everything back to empty
  const handleResetSession = () => {
    setConversations([]);
    setActiveId(null);
    setDocuments([]);
    setAgentRuns([]);
    setAuditLogs([]);
    setKnowledgeSources([]);
    setActiveSteps([]);
    setShowDrawer(false);
    setIsRunning(false);
    setActiveSources([]);
  };

  // New Chat
  const handleNewChat = () => {
    const newConv: Conversation = {
      id: `conv-${Date.now()}`,
      title: 'New Conversation',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [],
    };
    setConversations(prev => [newConv, ...prev]);
    setActiveId(newConv.id);
    setActiveSteps([]);
    setShowDrawer(false);
  };

  const handleSelectConversation = (id: string) => {
    setActiveId(id);
    const conv = conversations.find(c => c.id === id);
    if (conv) {
      const lastAi = [...conv.messages].reverse().find(m => m.role === 'assistant' && m.steps);
      if (lastAi && lastAi.steps) {
        setActiveSteps(lastAi.steps);
        setActiveModelRole(lastAi.modelRole || 'reasoning');
        setActiveTaskType(lastAi.taskType || 'document');
        setActiveSources(lastAi.sources || []);
      } else {
        setActiveSteps([]);
        setActiveSources([]);
      }
    }
  };

  const handleRename = (id: string, newTitle: string) => {
    setConversations(prev => prev.map(c => c.id === id ? { ...c, title: newTitle } : c));
  };

  const handleDelete = (id: string) => {
    setConversations(prev => {
      const updated = prev.filter(c => c.id !== id);
      if (activeId === id) {
        setActiveId(updated.length > 0 ? updated[0].id : null);
      }
      return updated;
    });
  };

  const handleIndexSampleKnowledge = () => {
    setKnowledgeSources(sampleKnowledgeData);
    const nowTime = new Date().toLocaleTimeString();
    setAuditLogs(prev => [
      ...prev,
      { id: `aud-${Date.now()}`, time: nowTime, task: 'Knowledge Ingestion', action: 'Indexed 4 local SOP documents', network: 'LOCAL' }
    ]);
  };

  const handleUploadFromDocPage = async (files: File[]) => {
    const processed = await Promise.all(files.map(f => processUploadedFile(f)));
    const nowTime = new Date().toLocaleTimeString();

    processed.forEach(p => {
      setDocuments(prev => [
        ...prev,
        {
          id: p.id,
          name: p.name,
          type: p.type.toUpperCase(),
          status: 'Uploaded',
          location: 'Local',
          updated: 'Just now',
          size: p.size,
          previewUrl: p.previewUrl,
        }
      ]);

      setAuditLogs(prev => [
        ...prev,
        { id: `aud-${Date.now()}-${p.id}`, time: nowTime, task: p.name, action: 'Uploaded to local storage', network: 'LOCAL' }
      ]);
    });
  };

  // Main Send Message Handler
  const handleSendMessage = async (text: string, files: FileAttachment[]) => {
    if (isRunning) return;

    let currentConvId = activeId;
    if (!currentConvId || !conversations.some(c => c.id === currentConvId)) {
      const newConv: Conversation = {
        id: `conv-${Date.now()}`,
        title: text ? (text.slice(0, 28) + (text.length > 28 ? '…' : '')) : (files[0]?.name || 'New Task'),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messages: [],
      };
      setConversations(prev => [newConv, ...prev]);
      setActiveId(newConv.id);
      currentConvId = newConv.id;
    }

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    // Add uploaded files to documents
    files.forEach(f => {
      setDocuments(prev => {
        if (prev.some(d => d.name === f.name)) return prev;
        return [
          ...prev,
          {
            id: f.id,
            name: f.name,
            type: f.type.toUpperCase(),
            status: f.classification === 'scanned' ? 'Scanned' : 'Uploaded',
            location: 'Local',
            updated: 'Just now',
            size: f.size,
            previewUrl: f.previewUrl,
          }
        ];
      });

      setAuditLogs(prev => [
        ...prev,
        { id: `aud-${Date.now()}-${f.id}`, time: timeStr, task: f.name, action: 'File ingested locally', network: 'LOCAL' }
      ]);
    });

    const userMsg = {
      id: `msg-${Date.now()}-u`,
      role: 'user' as const,
      content: text || 'Please analyze the attached file.',
      timestamp: timeStr,
      attachments: files,
    };

    setConversations(prev => prev.map(c => {
      if (c.id === currentConvId) {
        let title = c.title;
        if (title === 'New Conversation' || title === 'New Task') {
          title = text ? (text.slice(0, 28) + (text.length > 28 ? '…' : '')) : (files[0]?.name || 'Task Execution');
        }
        return {
          ...c,
          title,
          updatedAt: now.toISOString(),
          messages: [...c.messages, userMsg],
        };
      }
      return c;
    }));

    const plan = planExecution(text, files);
    setActiveModelRole(plan.modelRole);
    setActiveTaskType(plan.taskType);
    setActiveSources(plan.sources);

    if (!plan.isComplexTask) {
      await new Promise(r => setTimeout(r, 600));
      const aiSimpleMsg = {
        id: `msg-${Date.now()}-a`,
        role: 'assistant' as const,
        content: plan.completionText,
        timestamp: timeStr,
        isComplexTask: false,
      };

      setConversations(prev => prev.map(c =>
        c.id === currentConvId ? { ...c, messages: [...c.messages, aiSimpleMsg] } : c
      ));
      return;
    }

    setIsRunning(true);
    setShowDrawer(true);
    const initialSteps: AgentStep[] = plan.steps.map(s => ({ ...s, status: 'pending' }));
    setActiveSteps(initialSteps);

    const aiTaskMsgId = `msg-${Date.now()}-a`;
    const aiInitialMsg = {
      id: aiTaskMsgId,
      role: 'assistant' as const,
      content: '',
      timestamp: timeStr,
      taskType: plan.taskType,
      modelRole: plan.modelRole,
      isComplexTask: true,
      isStreaming: true,
      steps: initialSteps,
      activeStepNumber: 1,
      totalSteps: plan.steps.length,
      activeStepLabel: plan.steps[0]?.label || 'Analyzing task…',
      sources: plan.sources,
    };

    setConversations(prev => prev.map(c =>
      c.id === currentConvId ? { ...c, messages: [...c.messages, aiInitialMsg] } : c
    ));

    setAuditLogs(prev => [
      ...prev,
      { id: `aud-${Date.now()}-route`, time: timeStr, task: files[0]?.name || 'Task', action: `Routed to Local ${plan.modelRole.toUpperCase()} model`, network: 'LOCAL' }
    ]);

    const startTime = Date.now();
    let currentSteps = [...initialSteps];
    for (let i = 0; i < plan.steps.length; i++) {
      currentSteps = currentSteps.map((s, idx) => {
        if (idx < i) return { ...s, status: 'complete' };
        if (idx === i) return { ...s, status: 'running' };
        return { ...s, status: 'pending' };
      });
      setActiveSteps([...currentSteps]);

      setConversations(prev => prev.map(c => {
        if (c.id === currentConvId) {
          return {
            ...c,
            messages: c.messages.map(m => m.id === aiTaskMsgId ? {
              ...m,
              steps: [...currentSteps],
              activeStepNumber: i + 1,
              activeStepLabel: `${plan.steps[i].label}: ${plan.steps[i].detail}`,
            } : m)
          };
        }
        return c;
      }));

      if (i === 1) {
        setAuditLogs(prev => [
          ...prev,
          { id: `aud-${Date.now()}-step1`, time: timeStr, task: files[0]?.name || 'Task', action: plan.taskType === 'coding' ? 'Sandbox container mounted' : 'OCR processed', network: 'LOCAL' }
        ]);
      } else if (i === 2) {
        setAuditLogs(prev => [
          ...prev,
          { id: `aud-${Date.now()}-step2`, time: timeStr, task: files[0]?.name || 'Task', action: 'Knowledge retrieval completed', network: 'LOCAL' }
        ]);
      }

      // Deterministic delay per step (total 8-15 seconds)
      const stepDelay = 1200 + Math.floor(Math.random() * 600);
      await new Promise(r => setTimeout(r, stepDelay));
    }

    const durationMs = Date.now() - startTime;
    const durationStr = `00:${String(Math.floor(durationMs / 1000)).padStart(2, '0')}`;
    currentSteps = currentSteps.map(s => ({ ...s, status: 'complete' }));
    setActiveSteps([...currentSteps]);

    if (plan.output && plan.output.name) {
      setDocuments(prev => [
        ...prev,
        {
          id: plan.output.id,
          name: plan.output.name,
          type: plan.output.type.toUpperCase(),
          status: 'Generated',
          location: 'Local',
          updated: 'Just now',
          size: plan.output.size,
        }
      ]);

      setAuditLogs(prev => [
        ...prev,
        { id: `aud-${Date.now()}-out`, time: timeStr, task: plan.output.name, action: 'Deliverable generated locally', network: 'LOCAL' }
      ]);
    }

    setAgentRuns(prev => [
      ...prev,
      {
        id: `run-${Date.now()}`,
        task: files[0]?.name ? `${files[0].name} Analysis` : 'Task Execution',
        type: plan.taskType,
        route: plan.modelRole,
        status: 'verified',
        duration: durationStr,
        externalCalls: 0,
        timestamp: timeStr,
      }
    ]);

    setConversations(prev => prev.map(c => {
      if (c.id === currentConvId) {
        return {
          ...c,
          messages: c.messages.map(m => m.id === aiTaskMsgId ? {
            ...m,
            content: plan.completionText,
            isStreaming: false,
            steps: [...currentSteps],
            output: plan.output,
          } : m)
        };
      }
      return c;
    }));

    setIsRunning(false);
  };

  const handleStop = () => {
    setIsRunning(false);
  };

  return (
    <div className="app-shell">
      <Sidebar
        conversations={conversations}
        activeId={activeId}
        onSelectConversation={handleSelectConversation}
        onNewChat={handleNewChat}
        onRenameConversation={handleRename}
        onDeleteConversation={handleDelete}
        user={user}
        onSignOut={() => {
          setUser(null);
          navigate('/login');
        }}
        theme={theme}
        onToggleTheme={setTheme}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        onResetSession={handleResetSession}
      />

      <div className="main-wrapper">
        <Topbar
          currentTitle={activeConversation?.title}
          showDrawer={showDrawer}
          onToggleDrawer={() => setShowDrawer(!showDrawer)}
          hasActiveTask={activeSteps.length > 0}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          userName={user.name}
          user={user}
        />

        <div style={{ flex: 1, overflow: 'hidden', display: 'flex' }}>
          <Routes>
            <Route path="/login" element={<Navigate to="/workbench" replace />} />
            <Route path="/signup" element={<Navigate to="/workbench" replace />} />
            <Route
              path="/"
              element={
                <Workbench
                  conversation={activeConversation}
                  onSendMessage={handleSendMessage}
                  isRunning={isRunning}
                  onStop={handleStop}
                  activeSteps={activeSteps}
                  activeModelRole={activeModelRole}
                  activeTaskType={activeTaskType}
                  activeSources={activeSources}
                  showDrawer={showDrawer}
                  onToggleDrawer={() => setShowDrawer(!showDrawer)}
                  allConversations={conversations}
                  onSelectConversation={handleSelectConversation}
                  onNewChat={handleNewChat}
                />
              }
            />
            <Route
              path="/workbench"
              element={
                <Workbench
                  conversation={activeConversation}
                  onSendMessage={handleSendMessage}
                  isRunning={isRunning}
                  onStop={handleStop}
                  activeSteps={activeSteps}
                  activeModelRole={activeModelRole}
                  activeTaskType={activeTaskType}
                  activeSources={activeSources}
                  showDrawer={showDrawer}
                  onToggleDrawer={() => setShowDrawer(!showDrawer)}
                  allConversations={conversations}
                  onSelectConversation={handleSelectConversation}
                  onNewChat={handleNewChat}
                />
              }
            />
            <Route
              path="/documents"
              element={
                <Documents
                  documents={documents}
                  onUpload={handleUploadFromDocPage}
                />
              }
            />
            <Route
              path="/knowledge"
              element={
                <KnowledgeBase
                  sources={knowledgeSources}
                  onIndexSampleKnowledge={handleIndexSampleKnowledge}
                />
              }
            />
            <Route
              path="/runs"
              element={
                <AgentRuns
                  runs={agentRuns}
                />
              }
            />
            <Route path="/models" element={<Models />} />
            <Route
              path="/audit"
              element={
                <AuditLogs
                  logs={auditLogs}
                />
              }
            />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/workbench" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default App;
