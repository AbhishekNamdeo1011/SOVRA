import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import type { Conversation, User } from '../../types';
import {
  MessageSquare, FileText, Database, GitBranch,
  Cpu, Shield, Settings, Search, Plus,
  Sun, Moon, PanelLeftClose, Trash2, Edit2, Check, X, LogOut, RotateCcw
} from 'lucide-react';

interface SidebarProps {
  conversations: Conversation[];
  activeId: string | null;
  onSelectConversation: (id: string) => void;
  onNewChat: () => void;
  onRenameConversation: (id: string, newTitle: string) => void;
  onDeleteConversation: (id: string) => void;
  user: User | null;
  onSignOut: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: (t: 'light' | 'dark') => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  onResetSession?: () => void;
}

const navPrimary = [
  { path: '/workbench', icon: MessageSquare, label: 'Chats' },
  { path: '/documents', icon: FileText, label: 'Documents' },
  { path: '/knowledge', icon: Database, label: 'Knowledge' },
  { path: '/runs', icon: GitBranch, label: 'Agent Runs' },
];

const navSecondary = [
  { path: '/models', icon: Cpu, label: 'Models' },
  { path: '/audit', icon: Shield, label: 'Audit' },
];

const Sidebar: React.FC<SidebarProps> = ({
  conversations,
  activeId,
  onSelectConversation,
  onNewChat,
  onRenameConversation,
  onDeleteConversation,
  user,
  onSignOut,
  theme,
  onToggleTheme,
  isOpenMobile = false,
  onCloseMobile,
  onResetSession,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const isWorkbench = location.pathname === '/' || location.pathname === '/workbench';

  const filteredConversations = conversations.filter(c =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const today = new Date().toDateString();
  const todayConvs = filteredConversations.filter(c => {
    const d = new Date(c.createdAt || c.updatedAt || Date.now()).toDateString();
    return d === today;
  });
  const earlierConvs = filteredConversations.filter(c => {
    const d = new Date(c.createdAt || c.updatedAt || Date.now()).toDateString();
    return d !== today;
  });

  const handleNav = (path: string) => {
    navigate(path);
    if (onCloseMobile) onCloseMobile();
  };

  const handleStartRename = (e: React.MouseEvent, c: Conversation) => {
    e.stopPropagation();
    setEditingId(c.id);
    setEditTitle(c.title);
  };

  const handleSaveRename = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (editTitle.trim()) {
      onRenameConversation(id, editTitle.trim());
    }
    setEditingId(null);
  };

  const handleCancelRename = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(null);
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    onDeleteConversation(id);
  };

  const renderConversationItem = (conv: Conversation) => {
    const isActive = isWorkbench && conv.id === activeId;
    const isEditing = editingId === conv.id;

    return (
      <div
        key={conv.id}
        className={`sidebar-history-item ${isActive ? 'active' : ''}`}
        onClick={() => {
          if (!isWorkbench) navigate('/workbench');
          onSelectConversation(conv.id);
          if (onCloseMobile) onCloseMobile();
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }}>
          <MessageSquare size={13} color="var(--text-sub)" style={{ flexShrink: 0 }} />

          {isEditing ? (
            <input
              type="text"
              value={editTitle}
              onChange={e => setEditTitle(e.target.value)}
              onClick={e => e.stopPropagation()}
              onKeyDown={e => {
                if (e.key === 'Enter') handleSaveRename(e as any, conv.id);
                if (e.key === 'Escape') handleCancelRename(e as any);
              }}
              autoFocus
              className="sidebar-edit-input"
            />
          ) : (
            <span className="sidebar-conv-title">
              {conv.title}
            </span>
          )}
        </div>

        <div className="sidebar-item-actions">
          {isEditing ? (
            <>
              <button
                onClick={e => handleSaveRename(e, conv.id)}
                className="icon-action-btn"
                title="Save title"
              >
                <Check size={12} strokeWidth={2.5} />
              </button>
              <button
                onClick={handleCancelRename}
                className="icon-action-btn"
                title="Cancel"
              >
                <X size={12} strokeWidth={2} />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={e => handleStartRename(e, conv)}
                className="icon-action-btn"
                title="Rename chat"
              >
                <Edit2 size={11} />
              </button>
              <button
                onClick={e => handleDelete(e, conv.id)}
                className="icon-action-btn"
                title="Delete chat"
              >
                <Trash2 size={11} />
              </button>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="sidebar-mobile-backdrop"
          onClick={onCloseMobile}
        />
      )}

      <aside className={`sidebar ${isOpenMobile ? 'mobile-open' : ''}`}>
        {/* Brand Header */}
        <div className="sidebar-header">
          <div className="sidebar-logo-group" onClick={() => handleNav('/workbench')} style={{ cursor: 'pointer' }}>
            <div className="sidebar-brand-mark">
              <Shield size={18} strokeWidth={2.2} />
            </div>
            <div className="sidebar-brand-title">SOVRA</div>
          </div>

          <button
            className="sidebar-collapse-btn"
            title="Close sidebar"
            onClick={onCloseMobile}
          >
            <PanelLeftClose size={16} />
          </button>
        </div>

        {/* + New Chat */}
        <div style={{ padding: '0 14px 10px 14px' }}>
          <button
            className="btn btn-primary"
            onClick={() => {
              if (!isWorkbench) navigate('/workbench');
              onNewChat();
              if (onCloseMobile) onCloseMobile();
            }}
            style={{ width: '100%', padding: '8px 12px', fontSize: '13px', fontWeight: 600, justifyContent: 'flex-start' }}
          >
            <Plus size={15} strokeWidth={2.5} />
            <span>New Chat</span>
          </button>
        </div>

        {/* Search */}
        <div className="sidebar-search-box">
          <div className="sidebar-search-inner">
            <Search size={13} color="var(--text-sub)" />
            <input
              type="text"
              className="sidebar-search-input"
              placeholder="Search chats…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            <span className="sidebar-shortcut-pill">⌘K</span>
          </div>
        </div>

        {/* Navigation */}
        <div className="sidebar-nav">
          {navPrimary.map(({ path, icon: Icon, label }) => {
            const isActive = (path === '/workbench' && isWorkbench) || location.pathname === path;
            return (
              <button
                key={path}
                className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                onClick={() => handleNav(path)}
              >
                <div className="sidebar-nav-left">
                  <Icon size={15} />
                  <span>{label}</span>
                </div>
              </button>
            );
          })}

          <div className="sidebar-divider" />

          {navSecondary.map(({ path, icon: Icon, label }) => {
            const isActive = location.pathname === path;
            return (
              <button
                key={path}
                className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                onClick={() => handleNav(path)}
              >
                <div className="sidebar-nav-left">
                  <Icon size={15} />
                  <span>{label}</span>
                </div>
              </button>
            );
          })}

          {/* Chat History */}
          <div className="sidebar-history-container">
            {conversations.length === 0 ? (
              <div style={{ padding: '14px 12px', fontSize: 12, color: 'var(--text-sub)', fontStyle: 'italic' }}>
                No previous conversations
              </div>
            ) : (
              <>
                {todayConvs.length > 0 && (
                  <div style={{ marginTop: 8 }}>
                    <div className="sidebar-section-divider">Today</div>
                    {todayConvs.map(renderConversationItem)}
                  </div>
                )}

                {earlierConvs.length > 0 && (
                  <div style={{ marginTop: 8 }}>
                    <div className="sidebar-section-divider">Earlier</div>
                    {earlierConvs.map(renderConversationItem)}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="sidebar-footer">
          <button
            className={`sidebar-nav-item ${location.pathname === '/settings' ? 'active' : ''}`}
            onClick={() => handleNav('/settings')}
            style={{ marginBottom: 4 }}
          >
            <div className="sidebar-nav-left">
              <Settings size={15} />
              <span>Settings</span>
            </div>
          </button>

          {/* Reset Session */}
          {onResetSession && (
            <button
              className="sidebar-nav-item"
              onClick={onResetSession}
              style={{ color: 'var(--text-sub)' }}
            >
              <div className="sidebar-nav-left">
                <RotateCcw size={14} />
                <span>Reset Session</span>
              </div>
            </button>
          )}

          {/* Theme Toggle */}
          <div className="theme-switch-pill" style={{ marginBottom: 6 }}>
            <button
              className={`theme-switch-btn ${theme === 'light' ? 'active' : ''}`}
              onClick={() => onToggleTheme('light')}
            >
              <Sun size={12} />
              <span>Light</span>
            </button>
            <button
              className={`theme-switch-btn ${theme === 'dark' ? 'active' : ''}`}
              onClick={() => onToggleTheme('dark')}
            >
              <Moon size={12} />
              <span>Dark</span>
            </button>
          </div>

          {/* User Card */}
          <div className="sidebar-user-card">
            <div className="sidebar-user-avatar">
              {user?.name ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'U'}
            </div>
            <div className="sidebar-user-info" style={{ flex: 1, minWidth: 0 }}>
              <span className="sidebar-user-name" style={{ textTransform: 'uppercase', letterSpacing: '0.02em' }}>
                {user?.name || 'ABHISHEK NAMDEO'}
              </span>
              <span className="sidebar-user-sub" style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}>
                WORK ID: {user?.workId || 'EMP-4092'}
              </span>
            </div>
            <button
              onClick={onSignOut}
              className="icon-action-btn"
              title="Sign out"
              style={{ color: 'var(--text-sub)' }}
            >
              <LogOut size={14} />
            </button>
          </div>
          <div style={{ padding: '2px 8px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 10, color: 'var(--text-sub)', fontFamily: 'var(--font-mono)', letterSpacing: '0.05em' }}>
              INTERNAL ACCESS
            </span>
            <span style={{ fontSize: 10, color: 'var(--text-sub)' }}>
              ORGANISATIONAL AUTH
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
