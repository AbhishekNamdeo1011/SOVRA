import type { KnowledgeSource } from '../types';

export const demoKnowledgeSources: KnowledgeSource[] = [
  { id: 'ks-1', name: 'Standard Operating Procedures', category: 'sop', documents: 47, chunks: 1840, status: 'indexed', location: 'local' },
  { id: 'ks-2', name: 'Equipment Manuals', category: 'manual', documents: 31, chunks: 1420, status: 'indexed', location: 'local' },
  { id: 'ks-3', name: 'Inspection Reports Archive', category: 'report', documents: 38, chunks: 1240, status: 'indexed', location: 'local' },
  { id: 'ks-4', name: 'Internal Correspondence', category: 'correspondence', documents: 8, chunks: 320, status: 'indexed', location: 'local' },
];
