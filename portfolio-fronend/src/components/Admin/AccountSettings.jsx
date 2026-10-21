import React, { useState } from 'react';
import { changePassword, revokeOtherSessions } from '../../features/auth/authApi';
import { useData } from '../../contexts/DataContext';

const AccountSettings = () => {
  const { user } = useData();
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState(null);
  const submit = async (event) => {
    event.preventDefault();
    if (form.newPassword !== form.confirmPassword) return setNotice({ type: 'error', text: 'New passwords do not match.' });
    setBusy(true);
    try {
      await changePassword({ currentPassword: form.currentPassword, newPassword: form.newPassword });
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setNotice({ type: 'success', text: 'Password changed. Other sessions were revoked.' });
    } catch (error) { setNotice({ type: 'error', text: error.response?.data?.error || error.message }); }
    finally { setBusy(false); }
  };
  const revoke = async () => {
    setBusy(true);
    try { const result = await revokeOtherSessions(); setNotice({ type: 'success', text: `${result.revoked} other session${result.revoked === 1 ? '' : 's'} revoked.` }); }
    catch (error) { setNotice({ type: 'error', text: error.response?.data?.error || error.message }); }
    finally { setBusy(false); }
  };
  return (
    <section className="admin-workspace">
      <div className="admin-content-heading"><div><p className="admin-eyebrow">Your account</p><h2>Account settings</h2></div><p>Manage your password and active browser sessions.</p></div>
      {notice && <div className={`admin-notice ${notice.type}`} role="status">{notice.text}</div>}
      <div className="account-grid">
        <div className="admin-form-card account-summary"><div className="account-monogram">{user?.username?.slice(0, 2).toUpperCase()}</div><div><h3>{user?.username}</h3><p>{user?.email}</p><span>{user?.role}</span></div></div>
        <form className="admin-form-card" onSubmit={submit}><h3>Change password</h3><label>Current password<input type="password" autoComplete="current-password" required value={form.currentPassword} onChange={(event) => setForm({ ...form, currentPassword: event.target.value })} /></label><label>New password<input type="password" autoComplete="new-password" required minLength={12} value={form.newPassword} onChange={(event) => setForm({ ...form, newPassword: event.target.value })} /></label><label>Confirm new password<input type="password" autoComplete="new-password" required minLength={12} value={form.confirmPassword} onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })} /></label><button className="admin-primary-action" disabled={busy}>Update password</button></form>
        <div className="admin-form-card session-card"><h3>Active sessions</h3><p>Sign out every other browser or device while keeping this session active.</p><button onClick={revoke} disabled={busy}>Revoke other sessions</button></div>
      </div>
    </section>
  );
};

export default AccountSettings;
