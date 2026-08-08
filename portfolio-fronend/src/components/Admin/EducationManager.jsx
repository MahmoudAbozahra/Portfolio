import React, { useEffect, useState } from 'react';
import { useData } from '../../contexts/DataContext';

const EducationManager = () => {
  const { data, saveData } = useData();
  const [formData, setFormData] = useState(data?.education || {});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    setFormData(data?.education || {});
  }, [data?.education]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      await saveData({ ...data, education: formData });
      setMessage('✅ Education updated successfully.');
    } catch (error) {
      setMessage('❌ ' + (error.response?.data?.error || error.message));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-manager">
      <div className="admin-manager-heading">
        <p className="admin-eyebrow">Education</p>
        <h3>🎓 Education Details</h3>
      </div>

      {message && <div className="admin-message">{message}</div>}

      <form onSubmit={handleSubmit} className="admin-form">
        <div className="admin-form-grid">
          <label className="admin-field">
            <span>Degree</span>
            <input name="degree" value={formData.degree || ''} onChange={handleChange} />
          </label>
          <label className="admin-field">
            <span>Year</span>
            <input name="year" value={formData.year || ''} onChange={handleChange} />
          </label>
          <label className="admin-field">
            <span>Grade</span>
            <input name="grade" value={formData.grade || ''} onChange={handleChange} />
          </label>
        </div>

        <label className="admin-field">
          <span>Graduation Project</span>
          <textarea name="project" value={formData.project || ''} onChange={handleChange} rows={3} />
        </label>

        <label className="admin-field">
          <span>Training</span>
          <textarea name="training" value={formData.training || ''} onChange={handleChange} rows={3} />
        </label>

        <div className="form-actions">
          <button className="btn-submit" disabled={saving}>
            {saving ? 'Saving...' : 'Save Education'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EducationManager;
