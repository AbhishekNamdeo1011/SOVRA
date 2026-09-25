// ============================================================
// SOVRA — Sovereign On-Premise API Service Layer
// Clean service abstraction for Node.js / FastAPI integration
// ============================================================

import type {
  Task, Model, KnowledgeSource, AuditLog, AgentStep,
  Conversation, FileAttachment
} from '../types';
import { demoTasks, inspectionSteps, codingSteps, visionSteps } from '../data/demoTasks';
import { demoModels } from '../data/demoModels';
import { demoKnowledgeSources } from '../data/demoKnowledge';
import { demoLogs } from '../data/demoLogs';
import { demoDocuments } from '../data/demoDocuments';
import {
  loadConversations, createConversation, deleteConversation
} from './conversationService';
import { planExecution } from './agentService';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

// ================= CONVERSATIONS =================
// GET /api/conversations
export async function getConversations(): Promise<Conversation[]> {
  await delay(60);
  return loadConversations();
}

// POST /api/conversations
export async function postConversation(title?: string): Promise<Conversation> {
  await delay(80);
  return createConversation(title);
}

// DELETE /api/conversations/:id
export async function deleteConversationApi(id: string): Promise<Conversation[]> {
  await delay(60);
  return deleteConversation(id);
}

// ================= DOCUMENTS =================
// GET /api/documents
export async function getDocuments(): Promise<FileAttachment[]> {
  await delay(60);
  return demoDocuments;
}

// POST /api/documents
export async function postDocument(file: FileAttachment): Promise<FileAttachment> {
  await delay(120);
  return { ...file, status: 'ready', location: 'local' };
}

// ================= AI ABSTRACTIONS =================
// POST /ai/analyze & /ai/route
export async function postAiAnalyze(prompt: string, attachments: FileAttachment[] = []) {
  await delay(150);
  return planExecution(prompt, attachments);
}

// ================= TASKS & AGENT RUNS =================
// GET /api/tasks / GET /api/agent/runs
export async function fetchAgentRuns(): Promise<Task[]> {
  await delay(60);
  return demoTasks;
}

// POST /api/tasks
export async function createTask(taskType: string): Promise<Task> {
  await delay(150);
  const base = demoTasks.find(t => t.type === taskType) || demoTasks[0];
  return { ...base, id: `task-${Date.now()}`, status: 'idle', steps: getStepsForType(taskType) };
}

function getStepsForType(type: string): AgentStep[] {
  if (type === 'coding') return codingSteps.map(s => ({ ...s, status: 'pending' as const }));
  if (type === 'vision') return visionSteps.map(s => ({ ...s, status: 'pending' as const }));
  return inspectionSteps.map(s => ({ ...s, status: 'pending' as const }));
}

// GET /api/models
export async function fetchModels(): Promise<Model[]> {
  await delay(60);
  return demoModels;
}

// GET /api/knowledge
export async function fetchKnowledge(): Promise<KnowledgeSource[]> {
  await delay(60);
  return demoKnowledgeSources;
}

// GET /api/audit
export async function fetchAuditLogs(): Promise<AuditLog[]> {
  await delay(60);
  return demoLogs;
}
