import type { Conversation, ChatMessage } from '../types';

const STORAGE_KEY = 'sovra_conversations_v1';
const LEGACY_STORAGE_KEY = 'kavach_conversations_v1';

export function loadConversations(): Conversation[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!raw) {
      return []; // Clean empty start!
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveConversations(convs: Conversation[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(convs));
  } catch (e) {
    console.error('Failed to save conversations to localStorage', e);
  }
}

export function createConversation(title = 'New Conversation', presetKey?: Conversation['presetKey']): Conversation {
  const newConv: Conversation = {
    id: `conv-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    title,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    messages: [],
    presetKey: presetKey || 'custom',
  };

  const existing = loadConversations();
  const updated = [newConv, ...existing];
  saveConversations(updated);
  return newConv;
}

export function updateConversationTitle(id: string, newTitle: string): Conversation[] {
  const existing = loadConversations();
  const updated = existing.map(c => c.id === id ? { ...c, title: newTitle, updatedAt: new Date().toISOString() } : c);
  saveConversations(updated);
  return updated;
}

export function deleteConversation(id: string): Conversation[] {
  const existing = loadConversations();
  const updated = existing.filter(c => c.id !== id);
  saveConversations(updated);
  return updated;
}

export function addMessageToConversation(
  convId: string,
  message: Omit<ChatMessage, 'id' | 'timestamp'>
): { updatedConvs: Conversation[]; newMsg: ChatMessage } {
  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  const newMsg: ChatMessage = {
    ...message,
    id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    timestamp: timeStr,
  };

  const existing = loadConversations();
  const updated = existing.map(c => {
    if (c.id === convId) {
      let title = c.title;
      if ((title === 'New Conversation' || title === 'New Task' || title === 'Inspection Report' || title === 'P&ID Analysis' || title === 'Coding Task') && message.role === 'user') {
        title = message.content.slice(0, 30) + (message.content.length > 30 ? '…' : '');
      }

      return {
        ...c,
        title,
        updatedAt: now.toISOString(),
        messages: [...c.messages, newMsg],
      };
    }
    return c;
  });

  saveConversations(updated);
  return { updatedConvs: updated, newMsg };
}

export function updateMessageInConversation(
  convId: string,
  msgId: string,
  updates: Partial<ChatMessage>
): Conversation[] {
  const existing = loadConversations();
  const updated = existing.map(c => {
    if (c.id === convId) {
      return {
        ...c,
        updatedAt: new Date().toISOString(),
        messages: c.messages.map(m => m.id === msgId ? { ...m, ...updates } : m),
      };
    }
    return c;
  });

  saveConversations(updated);
  return updated;
}
