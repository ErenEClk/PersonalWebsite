"use client";

import { useState } from 'react';
import { useLanguage } from '../app/contexts/LanguageContext';

export default function SecureDownload() {
  const { t } = useLanguage();
  const [status, setStatus] = useState<'initial' | 'asking' | 'ready'>('initial');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleInitialClick = () => {
    setStatus('asking');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(false);

    try {
      const res = await fetch('/api/verify-download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (data.success) {
        setStatus('ready');
      } else {
        setError(true);
      }
    } catch (err) {
      setError(true);
    }
  };

  // Basit inline stiller
  const containerStyle = {
    padding: '1rem',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '8px',
    marginTop: '1rem',
    border: '1px solid rgba(255, 255, 255, 0.1)'
  };

  const buttonStyle = {
    padding: '0.5rem 1rem',
    backgroundColor: '#0070f3',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'background 0.2s'
  };

  const inputStyle = {
    padding: '0.5rem',
    borderRadius: '4px',
    border: '1px solid #ccc',
    marginRight: '0.5rem',
    color: 'black'
  };

  if (status === 'initial') {
    return (
      <div style={containerStyle}>
        <h3 style={{ marginBottom: '0.5rem' }}>{t('download.gridnode')}</h3>
        <button 
          onClick={handleInitialClick}
          style={buttonStyle}
        >
          🔒 {t('click.to.download')}
        </button>
      </div>
    );
  }

  if (status === 'asking') {
    return (
      <div style={containerStyle}>
        <h3 style={{ marginBottom: '0.5rem' }}>{t('password.required')}</h3>
        <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem', opacity: 0.8 }}>
          {t('enter.password')}
        </p>
        <form onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t('password.placeholder')}
            style={inputStyle}
            autoFocus
          />
          <button type="submit" style={buttonStyle}>
            {t('submit')}
          </button>
        </form>
        {error && (
          <p style={{ color: '#ff4444', marginTop: '0.5rem', fontSize: '0.9rem' }}>
            {t('wrong.password')}
          </p>
        )}
      </div>
    );
  }

  if (status === 'ready') {
    return (
      <div style={containerStyle}>
        <h3 style={{ marginBottom: '0.5rem', color: '#4caf50' }}>✅ {t('download.ready')}</h3>
        <a 
          href="/GridNode_TestPack.zip" 
          download
          style={{ ...buttonStyle, textDecoration: 'none', display: 'inline-block', backgroundColor: '#28a745' }}
        >
          ⬇️ {t('click.to.download')}
        </a>
      </div>
    );
  }

  return null;
}

