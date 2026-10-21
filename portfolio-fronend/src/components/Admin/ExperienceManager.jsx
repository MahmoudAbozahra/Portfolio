import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';

const emptyExperience = { title: '', company: '', period: '', details: [] };

const ExperienceManager = () => {
  const { data, addExperience, updateExperience, deleteExperience } = useData();
  const [editingIndex, setEditingIndex] = useState(null);
  const [form, setForm] = useState(emptyExperience);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState(null);
  const experienceItems = Array.isArray(data?.experience) ? data.experience : [];

  const submit = async (event) => {
    event.preventDefault();
    const payload = { ...form, details: form.details.filter(Boolean) };
    setBusy(true);
    setNotice(null);
    try {
      if (editingIndex === null) await addExperience(payload);
      else await updateExperience(editingIndex, payload);
      setForm(emptyExperience);
      setEditingIndex(null);
      setNotice({ type: 'success', text: 'Experience saved successfully.' });
    } catch (error) {
      setNotice({ type: 'error', text: error.response?.data?.error || error.message });
    } finally { setBusy(false); }
  };

  const edit = (item, index) => {
    setForm({ title: item?.title || '', company: item?.company || '', period: item?.period || '', details: Array.isArray(item?.details) ? item.details : [] });
    setEditingIndex(index);
  };

  return (
    <section className="admin-workspace">
      <div className="admin-content-heading"><div><p className="admin-eyebrow">Career timeline</p><h2>Experience</h2></div><p>Keep each role concise and focused on measurable responsibilities and outcomes.</p></div>
      {notice && <div className={`admin-notice ${notice.type}`} role="status">{notice.text}</div>}
      <form onSubmit={submit} className="admin-form admin-glass-panel">
        <div className="admin-form-grid">
          <label className="admin-field"><span>Role title</span><input required value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} /></label>
          <label className="admin-field"><span>Company</span><input required value={form.company} onChange={(event) => setForm({ ...form, company: event.target.value })} /></label>
          <label className="admin-field admin-field-wide"><span>Period</span><input required value={form.period} onChange={(event) => setForm({ ...form, period: event.target.value })} placeholder="Apr 2025 – Present" /></label>
        </div>
        <label className="admin-field"><span>Achievements, one per line</span><textarea rows="7" value={form.details.join('\n')} onChange={(event) => setForm({ ...form, details: event.target.value.split('\n') })} /></label>
        <div className="form-actions"><button className="btn-submit" disabled={busy}>{busy ? 'Saving…' : editingIndex === null ? 'Add experience' : 'Update experience'}</button>{editingIndex !== null && <button type="button" className="btn-cancel" onClick={() => { setForm(emptyExperience); setEditingIndex(null); }}>Cancel</button>}</div>
      </form>
      <div className="admin-collection"><div className="admin-collection-heading"><h3>Published experience</h3><span>{experienceItems.length} entries</span></div>{experienceItems.length === 0 ? <div className="admin-empty">No experience entries yet.</div> : experienceItems.map((item, index) => <article className="admin-item" key={`${item.title}-${item.period}`}><div><p className="card-label">{item.period}</p><h4>{item.title}</h4><p>{item.company}</p><small>{item.details?.length || 0} achievement points</small></div><div className="admin-item-actions"><button className="btn-edit" onClick={() => edit(item, index)}>Edit</button><button className="btn-delete" onClick={() => window.confirm('Delete this experience entry?') && deleteExperience(index)}>Delete</button></div></article>)}</div>
    </section>
  );
};

export default ExperienceManager;
