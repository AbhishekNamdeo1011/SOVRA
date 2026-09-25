import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Shield, ArrowRight, Lock, CheckCircle, UserPlus,
  Copy, Check, Sparkles, UserCheck, Key, RefreshCw
} from 'lucide-react';
import type { User } from '../../types';

interface LoginProps {
  onLogin: (user: User) => void;
  initialMode?: 'login' | 'signup';
}

interface DemoProfile {
  id: string;
  name: string;
  workId: string;
  password: string;
  role: string;
  department: string;
  tag: string;
}

const DEMO_PROFILES: DemoProfile[] = [
  {
    id: 'lead',
    name: 'Dr. Vikram Malhotra',
    workId: 'EMP-8842',
    password: 'SovraAirGap#2026',
    role: 'Lead Operations Engineer',
    department: 'Heavy Industry & Refinery',
    tag: 'Operations',
  },
  {
    id: 'safety',
    name: 'Ananya Sharma',
    workId: 'EMP-1092',
    password: 'SovraSafe#2026',
    role: 'Plant Safety Inspector',
    department: 'Regulatory Compliance & Quality',
    tag: 'Compliance',
  },
  {
    id: 'admin',
    name: 'Rajesh Verma',
    workId: 'ADMIN-001',
    password: 'SovraRoot#2026',
    role: 'Sovereign Node Admin',
    department: 'Air-Gapped Systems & Security',
    tag: 'Admin',
  },
];

const Login: React.FC<LoginProps> = ({ onLogin, initialMode }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Mode follows the URL path if present, otherwise initialMode or 'login'
  const isSignupPath = location.pathname === '/signup' || initialMode === 'signup';
  const mode = isSignupPath ? 'signup' : 'login';

  // Login form state
  const [workId, setWorkId] = useState('EMP-8842');
  const [password, setPassword] = useState('SovraAirGap#2026');

  // Signup form state
  const [fullName, setFullName] = useState('Dr. Vikram Malhotra');
  const [signupWorkId, setSignupWorkId] = useState('EMP-8842');
  const [signupPassword, setSignupPassword] = useState('SovraAirGap#2026');
  const [confirmPassword, setConfirmPassword] = useState('SovraAirGap#2026');

  // Active demo persona selected in the quick-fill box
  const [selectedPersona, setSelectedPersona] = useState<DemoProfile>(DEMO_PROFILES[0]);

  // Feedback messages
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [lastRegisteredUser, setLastRegisteredUser] = useState<User | null>(null);

  // Copy feedback state tracking which key was copied
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [autofillToast, setAutofillToast] = useState<string | null>(null);

  // Sync mode with route if navigating
  const switchMode = (newMode: 'login' | 'signup') => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setAutofillToast(null);
    navigate(newMode === 'signup' ? '/signup' : '/login');
  };

  // Helper to copy to clipboard with instant feedback
  const handleCopy = (text: string, key: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => {
        setCopiedKey((prev) => (prev === key ? null : prev));
      }, 2000);
    }
  };

  // Helper to autofill the active form based on the selected demo profile
  const handleAutofill = (profile: DemoProfile) => {
    setSelectedPersona(profile);
    if (mode === 'login') {
      setWorkId(profile.workId);
      setPassword(profile.password);
      setAutofillToast(`✓ Form filled for ${profile.name} (${profile.workId})`);
    } else {
      setFullName(profile.name);
      setSignupWorkId(profile.workId);
      setSignupPassword(profile.password);
      setConfirmPassword(profile.password);
      setAutofillToast(`✓ Signup form populated with ${profile.name}'s demo data`);
    }
    setErrorMsg(null);
    setTimeout(() => {
      setAutofillToast(null);
    }, 4000);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const trimmedWorkId = workId.trim();
    if (!trimmedWorkId) {
      setErrorMsg('Please enter your Work ID.');
      return;
    }
    if (!password) {
      setErrorMsg('Please enter your password.');
      return;
    }

    // Match with demo profile for rich name/role metadata or default
    const matched = DEMO_PROFILES.find(p => p.workId.toLowerCase() === trimmedWorkId.toLowerCase());

    onLogin({
      workId: trimmedWorkId,
      name: matched?.name || (lastRegisteredUser?.workId === trimmedWorkId ? lastRegisteredUser.name : trimmedWorkId),
      role: matched?.role || 'Industrial Operations',
      department: matched?.department || 'On-Premise Workspace',
    });
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const trimmedName = fullName.trim();
    const trimmedWorkId = signupWorkId.trim();

    if (!trimmedName) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!trimmedWorkId) {
      setErrorMsg('Please enter your Work ID.');
      return;
    }
    if (!signupPassword) {
      setErrorMsg('Please enter a password.');
      return;
    }
    if (signupPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please verify and try again.');
      return;
    }

    const newUser: User = {
      workId: trimmedWorkId,
      name: trimmedName,
      role: 'Industrial Operations',
      department: 'On-Premise Workspace',
    };

    setLastRegisteredUser(newUser);
    setSuccessMsg(`Internal account registered for ${trimmedWorkId} (${trimmedName}). You can now sign in immediately.`);
    setWorkId(trimmedWorkId);
    setPassword(signupPassword);
  };

  return (
    <div className="login-screen">
      {/* Left Branding & Demo Access Overview */}
      <div className="login-left">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <Shield size={22} strokeWidth={2.2} color="rgba(255,255,255,0.6)" />
            <span style={{
              fontSize: 11,
              fontFamily: 'var(--font-mono)',
              letterSpacing: '0.08em',
              color: 'rgba(255,255,255,0.45)',
              textTransform: 'uppercase'
            }}>
              INTERNAL ACCESS · AIR-GAPPED
            </span>
          </div>

          <h1 className="login-brand-title">SOVRA</h1>
          <p className="login-brand-tagline">
            Sovereign On-Premise AI Workbench
          </p>

          <p className="login-brand-detail">
            Confidential local multi-model operations.
          </p>
          <p className="login-brand-detail" style={{ marginTop: 4 }}>
            Air-gapped hardware · Zero cloud telemetry.
          </p>

          {/* Left panel Demo Credentials Cards */}
          <div className="login-left-demo-section">
            <div className="login-left-demo-title">
              <Key size={13} color="#A48755" />
              <span>ON-PREMISE DEMO CREDENTIALS</span>
            </div>

            <div className="login-left-demo-cards">
              {DEMO_PROFILES.map(profile => {
                const isSelected = selectedPersona.id === profile.id;
                return (
                  <div
                    key={profile.id}
                    className="login-left-demo-item"
                    style={{
                      borderLeft: isSelected ? '3px solid #A48755' : '1px solid rgba(255,255,255,0.08)',
                      background: isSelected ? 'rgba(164, 135, 85, 0.12)' : 'rgba(0, 0, 0, 0.28)'
                    }}
                  >
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                        <span style={{ fontWeight: 600, color: '#FFFFFF', fontSize: 12 }}>
                          {profile.name}
                        </span>
                        <span style={{
                          fontSize: 9,
                          fontFamily: 'var(--font-mono)',
                          padding: '1px 5px',
                          borderRadius: 3,
                          background: 'rgba(255,255,255,0.1)',
                          color: 'rgba(255,255,255,0.7)'
                        }}>
                          {profile.tag}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>
                        <span>ID: <code style={{ color: '#E5E7EB', fontFamily: 'var(--font-mono)' }}>{profile.workId}</code></span>
                        <span>Pass: <code style={{ color: '#E5E7EB', fontFamily: 'var(--font-mono)' }}>{profile.password}</code></span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginLeft: 8 }}>
                      <button
                        type="button"
                        className="demo-copy-btn"
                        style={{ color: 'rgba(255,255,255,0.6)' }}
                        onClick={() => handleCopy(profile.workId, `left-id-${profile.id}`)}
                        title="Copy Work ID"
                      >
                        {copiedKey === `left-id-${profile.id}` ? (
                          <span style={{ color: '#34D399', display: 'flex', alignItems: 'center', gap: 2, fontSize: 10 }}>
                            <Check size={11} /> ID
                          </span>
                        ) : (
                          <span style={{ display: 'flex', alignItems: 'center', gap: 2, fontSize: 10 }}>
                            <Copy size={11} /> ID
                          </span>
                        )}
                      </button>

                      <button
                        type="button"
                        className="demo-copy-btn"
                        style={{ color: 'rgba(255,255,255,0.6)' }}
                        onClick={() => handleCopy(profile.password, `left-pwd-${profile.id}`)}
                        title="Copy Password"
                      >
                        {copiedKey === `left-pwd-${profile.id}` ? (
                          <span style={{ color: '#34D399', display: 'flex', alignItems: 'center', gap: 2, fontSize: 10 }}>
                            <Check size={11} /> Pass
                          </span>
                        ) : (
                          <span style={{ display: 'flex', alignItems: 'center', gap: 2, fontSize: 10 }}>
                            <Copy size={11} /> Pass
                          </span>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleAutofill(profile)}
                        style={{
                          background: 'rgba(164, 135, 85, 0.25)',
                          border: '1px solid rgba(164, 135, 85, 0.5)',
                          color: '#F3E8D6',
                          borderRadius: 4,
                          padding: '3px 7px',
                          fontSize: 10,
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 3
                        }}
                        title="Auto-fill into form"
                      >
                        <Sparkles size={10} />
                        <span>Use</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="login-footer-info">
          SIH 2026 · PS 26117 · SOVRA AIR-GAPPED WORKBENCH
        </div>
      </div>

      {/* Right Form Card */}
      <div className="login-right">
        <div className="login-card">
          {/* Navigation Tabs for switching between Sign In (/login) & Create Account (/signup) */}
          <div className="login-tabs">
            <button
              type="button"
              className={`login-tab-btn ${mode === 'login' ? 'active' : ''}`}
              onClick={() => switchMode('login')}
            >
              Sign In (/login)
            </button>
            <button
              type="button"
              className={`login-tab-btn ${mode === 'signup' ? 'active' : ''}`}
              onClick={() => switchMode('signup')}
            >
              Create Account (/signup)
            </button>
          </div>

          {/* Alert messages */}
          {errorMsg && (
            <div className="login-msg-banner error">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="login-msg-banner success">
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, marginBottom: 4 }}>
                <CheckCircle size={15} color="#A48755" />
                <span>Account Ready</span>
              </div>
              <div style={{ marginBottom: 10 }}>{successMsg}</div>

              {/* 1-Click login with newly registered account */}
              {lastRegisteredUser && (
                <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                  <button
                    type="button"
                    className="login-btn"
                    style={{ margin: 0, padding: '7px 12px', fontSize: 13, flex: 1 }}
                    onClick={() => {
                      onLogin(lastRegisteredUser);
                    }}
                  >
                    <UserCheck size={14} />
                    <span>Sign In As {lastRegisteredUser.name.split(' ')[0]}</span>
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    style={{ padding: '7px 10px', fontSize: 12 }}
                    onClick={() => switchMode('login')}
                  >
                    Go to Sign In
                  </button>
                </div>
              )}
            </div>
          )}

          {autofillToast && (
            <div className="login-msg-banner" style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', color: 'var(--text-main)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600 }}>
                <Check size={13} color="#10B981" />
                <span>{autofillToast}</span>
              </div>
            </div>
          )}

          {/* Interactive Demo Credentials Quick-Fill & Copy Box */}
          <div className="demo-box">
            <div className="demo-box-header">
              <div className="demo-box-title">
                <Sparkles size={12} />
                <span>Demo Credentials Screen</span>
              </div>
              <span className="demo-box-badge">Click to Copy / Auto-Fill</span>
            </div>

            {/* Persona Switcher Pills */}
            <div className="demo-persona-pills">
              {DEMO_PROFILES.map(p => (
                <button
                  key={p.id}
                  type="button"
                  className={`demo-persona-pill ${selectedPersona.id === p.id ? 'active' : ''}`}
                  onClick={() => setSelectedPersona(p)}
                >
                  {p.tag}: {p.workId}
                </button>
              ))}
            </div>

            {/* Copyable Credential Fields */}
            <div className="demo-fields-grid">
              {mode === 'signup' && (
                <div className="demo-field-row">
                  <span className="demo-field-label">Name:</span>
                  <span className="demo-field-val">{selectedPersona.name}</span>
                  <button
                    type="button"
                    className={`demo-copy-btn ${copiedKey === `name-${selectedPersona.id}` ? 'copied' : ''}`}
                    onClick={() => handleCopy(selectedPersona.name, `name-${selectedPersona.id}`)}
                    title="Copy full name"
                  >
                    {copiedKey === `name-${selectedPersona.id}` ? (
                      <>
                        <Check size={12} />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={12} />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              <div className="demo-field-row">
                <span className="demo-field-label">Work ID:</span>
                <span className="demo-field-val">{selectedPersona.workId}</span>
                <button
                  type="button"
                  className={`demo-copy-btn ${copiedKey === `id-${selectedPersona.id}` ? 'copied' : ''}`}
                  onClick={() => handleCopy(selectedPersona.workId, `id-${selectedPersona.id}`)}
                  title="Copy Work ID"
                >
                  {copiedKey === `id-${selectedPersona.id}` ? (
                    <>
                      <Check size={12} />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={12} />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              <div className="demo-field-row">
                <span className="demo-field-label">Password:</span>
                <span className="demo-field-val">{selectedPersona.password}</span>
                <button
                  type="button"
                  className={`demo-copy-btn ${copiedKey === `pwd-${selectedPersona.id}` ? 'copied' : ''}`}
                  onClick={() => handleCopy(selectedPersona.password, `pwd-${selectedPersona.id}`)}
                  title="Copy Password"
                >
                  {copiedKey === `pwd-${selectedPersona.id}` ? (
                    <>
                      <Check size={12} />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={12} />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* 1-Click Auto Fill Button */}
            <button
              type="button"
              className="demo-autofill-btn"
              onClick={() => handleAutofill(selectedPersona)}
              title="Instantly auto-fill these values into the form below"
            >
              <RefreshCw size={13} />
              <span>
                {mode === 'login'
                  ? `⚡ Auto-Fill Sign In (${selectedPersona.workId})`
                  : `⚡ Auto-Fill Signup (${selectedPersona.name})`}
              </span>
            </button>
          </div>

          {mode === 'login' ? (
            /* Sign In Form */
            <div>
              <h2 className="login-card-title">Sign In</h2>
              <p className="login-card-sub">Access your sovereign AI workspace</p>

              <form onSubmit={handleLoginSubmit}>
                <div className="login-form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label className="login-label">Work ID</label>
                    <button
                      type="button"
                      className="demo-copy-btn"
                      onClick={() => handleCopy(workId, 'input-workid')}
                      style={{ fontSize: 10 }}
                    >
                      {copiedKey === 'input-workid' ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <input
                    type="text"
                    className="login-input"
                    value={workId}
                    onChange={e => setWorkId(e.target.value)}
                    placeholder="Enter Work ID (e.g. EMP-8842)"
                    autoFocus
                    required
                  />
                </div>

                <div className="login-form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label className="login-label">Password</label>
                    <button
                      type="button"
                      className="demo-copy-btn"
                      onClick={() => handleCopy(password, 'input-password')}
                      style={{ fontSize: 10 }}
                    >
                      {copiedKey === 'input-password' ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <input
                    type="password"
                    className="login-input"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter Password"
                    required
                  />
                </div>

                <button type="submit" className="login-btn">
                  <span>LOGIN TO SOVRA</span>
                  <ArrowRight size={15} />
                </button>

                <p style={{
                  fontSize: 12,
                  color: 'var(--text-sub)',
                  marginTop: 10,
                  textAlign: 'center',
                  lineHeight: 1.4
                }}>
                  Access restricted to authorised organisational users.
                </p>
              </form>

              <div style={{ textAlign: 'center', marginTop: 16 }}>
                <button
                  type="button"
                  className="login-switch-link"
                  onClick={() => switchMode('signup')}
                >
                  Need an internal account? Create Account (/signup)
                </button>
              </div>

              <div className="login-helper-note">
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  fontWeight: 600,
                  color: 'var(--text-main)',
                  marginBottom: 2
                }}>
                  <Lock size={12} />
                  <span>ORGANISATIONAL AUTH</span>
                </div>
                <div>Local air-gapped authentication. No external credentials permitted.</div>
              </div>
            </div>
          ) : (
            /* Signup / Registration Form */
            <div>
              <h2 className="login-card-title">Create Account</h2>
              <p className="login-card-sub">Register internal organisation credentials</p>

              <form onSubmit={handleSignupSubmit}>
                <div className="login-form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label className="login-label">Full Name</label>
                    <button
                      type="button"
                      className="demo-copy-btn"
                      onClick={() => handleCopy(fullName, 'input-name')}
                      style={{ fontSize: 10 }}
                    >
                      {copiedKey === 'input-name' ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <input
                    type="text"
                    className="login-input"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="Enter Full Name"
                    autoFocus
                    required
                  />
                </div>

                <div className="login-form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label className="login-label">Work ID</label>
                    <button
                      type="button"
                      className="demo-copy-btn"
                      onClick={() => handleCopy(signupWorkId, 'input-signup-id')}
                      style={{ fontSize: 10 }}
                    >
                      {copiedKey === 'input-signup-id' ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <input
                    type="text"
                    className="login-input"
                    value={signupWorkId}
                    onChange={e => setSignupWorkId(e.target.value)}
                    placeholder="Enter Work ID (e.g. EMP-8842)"
                    required
                  />
                </div>

                <div className="login-form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label className="login-label">Password</label>
                    <button
                      type="button"
                      className="demo-copy-btn"
                      onClick={() => handleCopy(signupPassword, 'input-signup-pwd')}
                      style={{ fontSize: 10 }}
                    >
                      {copiedKey === 'input-signup-pwd' ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <input
                    type="password"
                    className="login-input"
                    value={signupPassword}
                    onChange={e => setSignupPassword(e.target.value)}
                    placeholder="Enter Password"
                    required
                  />
                </div>

                <div className="login-form-group">
                  <label className="login-label">Confirm Password</label>
                  <input
                    type="password"
                    className="login-input"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Confirm Password"
                    required
                  />
                </div>

                <button type="submit" className="login-btn">
                  <span>CREATE INTERNAL ACCOUNT</span>
                  <UserPlus size={15} />
                </button>

                <p style={{
                  fontSize: 12,
                  color: 'var(--text-sub)',
                  marginTop: 10,
                  textAlign: 'center',
                  lineHeight: 1.4
                }}>
                  Account access is managed strictly on-premise.
                </p>
              </form>

              <div style={{ textAlign: 'center', marginTop: 16 }}>
                <button
                  type="button"
                  className="login-switch-link"
                  onClick={() => switchMode('login')}
                >
                  Already have an account? Sign In (/login)
                </button>
              </div>

              <div className="login-helper-note">
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  fontWeight: 600,
                  color: 'var(--text-main)',
                  marginBottom: 2
                }}>
                  <Shield size={12} />
                  <span>INTERNAL IDENTITY STORE</span>
                </div>
                <div>User credentials remain on-premise. Zero cloud synchronization.</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
