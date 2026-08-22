import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { useLanguage } from '../../contexts/LanguageContext';

const AdminLogin = ({ setIsAdmin, setShowAdmin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useData();
  const { t } = useLanguage();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(username, password);

    if (result.success) {
      setIsAdmin(true);
      setShowAdmin(false);
    } else {
      setError(result.error || t('invalidLogin'));
    }

    setLoading(false);
  };

  const handleBack = () => {
    setShowAdmin(false);
  };

  return (
    <section className="section" id="admin-login">
      <div className="panel admin-login-panel" style={{ maxWidth: '420px', margin: '0 auto', padding: '2.5rem', textAlign: 'center' }}>
        <button
          type="button"
          onClick={handleBack}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '1rem',
            cursor: 'pointer',
            color: '#666',
            marginBottom: '1.5rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => { e.target.style.background = 'rgba(0,0,0,0.05)'; }}
          onMouseLeave={(e) => { e.target.style.background = 'transparent'; }}
        >
          ← {t('backToHome')}
        </button>

        <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>{t('adminLogin')}</h2>
        <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '2rem' }}>
          {t('adminLoginHint')}
        </p>

        <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: '600', fontSize: '0.9rem' }}>
              {t('usernameOrEmail')}
            </label>
            <input
              type="text"
              placeholder={t('usernameOrEmailPlaceholder')}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
              style={{
                width: '100%',
                padding: '0.8rem 1rem',
                border: '1px solid #ddd',
                borderRadius: '10px',
                fontSize: '1rem',
                transition: 'border-color 0.3s ease',
                background: '#f8f9fa'
              }}
              onFocus={(e) => { e.target.style.borderColor = '#1a1a1a'; e.target.style.background = '#ffffff'; }}
              onBlur={(e) => { e.target.style.borderColor = '#ddd'; e.target.style.background = '#f8f9fa'; }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: '600', fontSize: '0.9rem' }}>
              {t('password')}
            </label>
            <input
              type="password"
              placeholder={t('passwordPlaceholder')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              style={{
                width: '100%',
                padding: '0.8rem 1rem',
                border: '1px solid #ddd',
                borderRadius: '10px',
                fontSize: '1rem',
                transition: 'border-color 0.3s ease',
                background: '#f8f9fa'
              }}
              onFocus={(e) => { e.target.style.borderColor = '#1a1a1a'; e.target.style.background = '#ffffff'; }}
              onBlur={(e) => { e.target.style.borderColor = '#ddd'; e.target.style.background = '#f8f9fa'; }}
            />
          </div>

          {error && (
            <p style={{
              color: '#dc3545',
              marginBottom: '1rem',
              textAlign: 'center',
              padding: '0.5rem',
              background: 'rgba(220,53,69,0.1)',
              borderRadius: '8px'
            }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.9rem',
              background: '#1a1a1a',
              color: '#ffffff',
              border: 'none',
              borderRadius: '10px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.background = '#333';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.15)';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.background = '#1a1a1a';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }
            }}
          >
            {loading ? t('loggingIn') : t('login')}
          </button>
        </form>
      </div>
    </section>
  );
};

export default AdminLogin;
