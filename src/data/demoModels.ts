import type { Model } from '../types';

export const demoModels: Model[] = [
  {
    id: 'model-reasoning',
    role: 'reasoning',
    status: 'online',
    location: 'local',
    quantization: 'Q4_K_M',
    contextLength: 32768,
  },
  {
    id: 'model-coding',
    role: 'coding',
    status: 'online',
    location: 'local',
    quantization: 'Q4_K_M',
    contextLength: 16384,
  },
  {
    id: 'model-vision',
    role: 'vision',
    status: 'online',
    location: 'local',
    quantization: 'Q5_K_M',
    contextLength: 8192,
  },
];
