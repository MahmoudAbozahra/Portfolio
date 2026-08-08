import React, { useEffect, useState } from 'react';
import { useData } from '../../contexts/DataContext';

const ContactManager = () => {
  const { data, updatePersonal } = useData();
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    location: '',
    github: '',
    linkedin: '',
    availability: ''
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const personal = data?.personal || {};
    setFormData({
      email: personal.email || '',
      phone: personal.phone || '',
      location: personal.location || '',
      github: personal.github || '',
      linkedin: personal.linkedin || '',
      availability: personal.availability || ''
    });
  }, [data?.personal]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      await updatePersonal({ ...data.personal, ...formData });
      setMessage('✅ Contact information updated successfully.');
    } catch (error) {
      setMessage('❌ ' + (error.response?.data?.error || error.message));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-manager">
      <div className="admin-manager-heading">
        <p className="admin-eyebrow">Contact</p>
        <h3>📬 Contact Information</h3>
      </div>

      {message && <div className="admin-message">{message}</div>}

      <form onSubmit={handleSubmit} className="admin-form">
        <div className="admin-form-grid">
          {[
            ['email', 'Email', 'email'],
            ['phone', 'Phone', 'text'],
            ['location', 'Location', 'text'],
            ['github', 'GitHub', 'url'],
            ['linkedin', 'LinkedIn', 'url']
          ].map(([name, label, type]) => (
            <label className="admin-field" key={name}>
              <span>{label}</span>
              <input
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleChange}
              />
            </label>
          ))}
        </div>

        <label className="admin-field">
          <span>Availability / Contact Message</span>
          <textarea
            name="availability"
            value={formData.availability}
            onChange={handleChange}
            rows={4}
          />
        </label>

        <div className="form-actions">
          <button className="btn-submit" disabled={saving}>
            {saving ? 'Saving...' : 'Save Contact'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContactManager;
