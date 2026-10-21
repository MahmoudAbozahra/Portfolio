import React, { useState } from 'react';
import { FaArrowLeft, FaLock } from 'react-icons/fa';
import { useData } from '../../contexts/DataContext';
import { useLanguage } from '../../contexts/LanguageContext';

const AdminLogin = ({ setIsAdmin, setShowAdmin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useData();
  const { t } = useLanguage();

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    const result = await login(username, password);
    if (result.success) setIsAdmin(true);
    else setError(result.error || t('invalidLogin'));
    setLoading(false);
  };

  return (
    <section className="admin-login-screen" id="admin-login">
      <div className="admin-login-card">
        <button type="button" className="admin-login-back" onClick={() => setShowAdmin(false)}><FaArrowLeft /> Back to portfolio</button>
        <div className="admin-login-mark"><FaLock /></div>
        <p className="admin-eyebrow">Protected workspace</p>
        <h1>{t('adminLogin')}</h1>
        <p className="admin-login-copy">Sign in with your database-backed administrator or editor account.</p>
        <form onSubmit={submit} className="admin-login-form">
          <label>Email or username<input value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" required autoFocus /></label>
          <label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required /></label>
          {error && <div className="admin-notice error" role="alert">{error}</div>}
          <button className="admin-primary-action" disabled={loading}>{loading ? 'Signing in…' : t('login')}</button>
        </form>
      </div>
    </section>
  );
};

export default AdminLogin;
