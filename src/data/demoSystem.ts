import type { SystemStatus, DashboardMetrics } from '../types';

export const systemStatus: SystemStatus = {
  gpuOnline: true,
  localModels: 3,
  networkBlocked: true,
  externalCalls: 0,
  sovereignMode: true,
  dnsBlocked: true,
  ntpBlocked: true,
  cloudAiCalls: 0,
};

export const dashboardMetrics: DashboardMetrics = {
  localModels: 3,
  activeTasks: 0,
  knowledgeSources: 4,
  externalCalls: 0,
  totalTasksRun: 3,
  totalDocuments: 124,
};
