import React, { useEffect, useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createUser, listUsers, resetUserPassword, revokeUserSessions, updateUser } from '../../features/auth/authApi';
import { useData } from '../../contexts/DataContext';

const emptyForm = { username: '', email: '', password: '', role: 'editor' };
const errorText = (error) => error.response?.data?.error || error.message || 'Request failed';

const UsersManager = () => {
  const { user: currentUser, refreshSession } = useData();
  const queryClient = useQueryClient();
  const [form, setForm] = useState(emptyForm);
  const [resetTarget, setResetTarget] = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [editForm, setEditForm] = useState({ username: '', email: '' });
  const [temporaryPassword, setTemporaryPassword] = useState('');
  const [notice, setNotice] = useState(null);
  const dialogRef = useRef(null);
  const resetOpenerRef = useRef(null);
  const usersQuery = useQuery({ queryKey: ['users'], queryFn: listUsers });
  const refresh = () => queryClient.invalidateQueries({ queryKey: ['users'] });
  const mutationOptions = (success) => ({ onSuccess: () => { refresh(); setNotice({ type: 'success', text: success }); }, onError: (error) => setNotice({ type: 'error', text: errorText(error) }) });
  const createMutation = useMutation({ mutationFn: createUser, ...mutationOptions('User created successfully.') });
  const updateMutation = useMutation({ mutationFn: updateUser, ...mutationOptions('User permissions updated.') });
  const revokeMutation = useMutation({ mutationFn: revokeUserSessions, ...mutationOptions('Active sessions revoked.') });
  const resetMutation = useMutation({
    mutationFn: resetUserPassword,
    ...mutationOptions('Password changed and active sessions revoked.'),
    onSuccess: () => { refresh(); setResetTarget(null); setTemporaryPassword(''); setNotice({ type: 'success', text: 'Password changed and active sessions revoked.' }); }
  });

  useEffect(() => {
    if (!resetTarget && !editTarget) return undefined;
    const keydown = (event) => {
      if (event.key === 'Escape') { setResetTarget(null); setEditTarget(null); }
      if (event.key === 'Tab') {
        const controls = dialogRef.current?.querySelectorAll('input, button');
        if (!controls?.length) return;
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', keydown);
    return () => { document.removeEventListener('keydown', keydown); window.requestAnimationFrame(() => resetOpenerRef.current?.focus()); };
  }, [resetTarget, editTarget]);

  const submit = async (event) => {
    event.preventDefault();
    setNotice(null);
    await createMutation.mutateAsync(form).then(() => setForm(emptyForm)).catch(() => {});
  };

  return (
    <section className="admin-workspace" aria-labelledby="users-heading">
      <div className="admin-content-heading"><div><p className="admin-eyebrow">Access control</p><h2 id="users-heading">Users & roles</h2></div><p>Create real database users, assign permissions, and revoke sessions.</p></div>
      {notice && <div className={`admin-notice ${notice.type}`} role="status">{notice.text}</div>}
      <div className="user-management-grid">
        <form className="admin-form-card" onSubmit={submit}>
          <h3>Create user</h3>
          <label>Username<input value={form.username} onChange={(event) => setForm({ ...form, username: event.target.value })} required minLength={3} maxLength={40} /></label>
          <label>Email<input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required /></label>
          <label>Initial password<input type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required minLength={12} autoComplete="new-password" /><small>12+ characters with uppercase, lowercase, and a number.</small></label>
          <label>Role<select value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })}><option value="editor">Editor</option><option value="admin">Administrator</option></select></label>
          <button className="admin-primary-action" disabled={createMutation.isPending}>{createMutation.isPending ? 'Creating…' : 'Create user'}</button>
        </form>

        <div className="users-list-card">
          <div className="users-list-head"><h3>Team access</h3><span>{usersQuery.data?.length || 0} users</span></div>
          {usersQuery.isPending && <div className="admin-empty">Loading users…</div>}
          {usersQuery.isError && <div className="admin-empty error">{errorText(usersQuery.error)}</div>}
          {usersQuery.data?.map((member) => {
            const isSelf = String(member._id) === String(currentUser?.id);
            return (
              <article className={`user-row ${member.active ? '' : 'inactive'}`} key={member._id}>
                <div className="user-avatar">{member.username.slice(0, 2).toUpperCase()}</div>
                <div className="user-identity"><strong>{member.username}{isSelf && <em>You</em>}</strong><span>{member.email}</span><small>{member.lastLogin ? `Last login ${new Date(member.lastLogin).toLocaleDateString()}` : 'Never signed in'}</small></div>
                <label className="compact-field"><span>Role</span><select value={member.role} disabled={isSelf || updateMutation.isPending} onChange={(event) => updateMutation.mutate({ id: member._id, role: event.target.value })}><option value="editor">Editor</option><option value="admin">Admin</option></select></label>
                <div className="user-actions">
                  <button onClick={(event) => { resetOpenerRef.current = event.currentTarget; setEditForm({ username: member.username, email: member.email }); setEditTarget(member); }}>Edit details</button>
                  <button disabled={isSelf || updateMutation.isPending} onClick={() => updateMutation.mutate({ id: member._id, active: !member.active })}>{member.active ? 'Deactivate' : 'Activate'}</button>
                  <button disabled={isSelf} onClick={(event) => { resetOpenerRef.current = event.currentTarget; setResetTarget(member); }}>Reset password</button>
                  <button disabled={isSelf || revokeMutation.isPending} onClick={() => window.confirm(`Revoke every session for ${member.username}?`) && revokeMutation.mutate(member._id)}>Revoke sessions</button>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {resetTarget && <div className="admin-dialog-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setResetTarget(null)}><form ref={dialogRef} className="admin-dialog" role="dialog" aria-modal="true" aria-labelledby="reset-password-title" onSubmit={(event) => { event.preventDefault(); resetMutation.mutate({ id: resetTarget._id, password: temporaryPassword }); }}><p className="admin-eyebrow">Security action</p><h3 id="reset-password-title">Reset {resetTarget.username}’s password</h3><p>This immediately revokes all of the user’s active sessions.</p><label>Temporary password<input autoFocus type="password" minLength={12} required value={temporaryPassword} onChange={(event) => setTemporaryPassword(event.target.value)} /></label><div className="dialog-actions"><button type="button" onClick={() => setResetTarget(null)}>Cancel</button><button className="admin-primary-action" disabled={resetMutation.isPending}>Reset password</button></div></form></div>}
      {editTarget && <div className="admin-dialog-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setEditTarget(null)}><form ref={dialogRef} className="admin-dialog" role="dialog" aria-modal="true" aria-labelledby="edit-user-title" onSubmit={async (event) => { event.preventDefault(); await updateMutation.mutateAsync({ id: editTarget._id, ...editForm }).then(async () => { if (String(editTarget._id) === String(currentUser?.id)) await refreshSession(); setEditTarget(null); }).catch(() => {}); }}><p className="admin-eyebrow">User identity</p><h3 id="edit-user-title">Edit user details</h3><label>Username<input autoFocus minLength={3} maxLength={40} required value={editForm.username} onChange={(event) => setEditForm({ ...editForm, username: event.target.value })} /></label><label>Email<input type="email" required value={editForm.email} onChange={(event) => setEditForm({ ...editForm, email: event.target.value })} /></label><div className="dialog-actions"><button type="button" onClick={() => setEditTarget(null)}>Cancel</button><button className="admin-primary-action" disabled={updateMutation.isPending}>Save details</button></div></form></div>}
    </section>
  );
};

export default UsersManager;
