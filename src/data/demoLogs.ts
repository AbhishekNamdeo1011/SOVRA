import type { AuditLog } from '../types';

export const demoLogs: AuditLog[] = [
  { id: 'log-1', timestamp: '14:32:01', task: 'Inspection Report', service: 'OCR', action: 'Processed', network: 'LOCAL', status: 'success' },
  { id: 'log-2', timestamp: '14:32:08', task: 'Inspection Report', service: 'RAG', action: 'Retrieved', network: 'LOCAL', status: 'success' },
  { id: 'log-3', timestamp: '14:32:18', task: 'Inspection Report', service: 'LLM', action: 'Completed', network: 'LOCAL', status: 'success' },
  { id: 'log-4', timestamp: '14:32:27', task: 'Inspection Report', service: 'DOCX', action: 'Generated', network: 'LOCAL', status: 'success' },
  { id: 'log-5', timestamp: '14:35:14', task: 'Code Fix', service: 'LLM', action: 'Analyzed', network: 'LOCAL', status: 'success' },
  { id: 'log-6', timestamp: '14:35:21', task: 'Code Fix', service: 'Sandbox', action: 'Executed', network: 'LOCAL', status: 'success' },
  { id: 'log-7', timestamp: '14:35:29', task: 'Code Fix', service: 'Tests', action: 'Passed', network: 'LOCAL', status: 'success' },
  { id: 'log-8', timestamp: '14:35:38', task: 'Code Fix', service: 'LLM', action: 'Verified', network: 'LOCAL', status: 'success' },
  { id: 'log-9', timestamp: '14:41:05', task: 'P&ID Analysis', service: 'OCR', action: 'Extracted', network: 'LOCAL', status: 'success' },
  { id: 'log-10', timestamp: '14:41:12', task: 'P&ID Analysis', service: 'Vision LLM', action: 'Analyzed', network: 'LOCAL', status: 'success' },
  { id: 'log-11', timestamp: '14:41:19', task: 'P&ID Analysis', service: 'RAG', action: 'Retrieved', network: 'LOCAL', status: 'success' },
  { id: 'log-12', timestamp: '14:41:28', task: 'P&ID Analysis', service: 'Report', action: 'Generated', network: 'LOCAL', status: 'success' },
];
