import React, { useState, useRef } from 'react';
import { useData } from '../../contexts/DataContext';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;
const PersonalInfoManager = () => {
  const { data, updatePersonal } = useData();
  const [formData, setFormData] = useState(data?.personal || {});
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleKeyStrengthsChange = (e) => {
    const lines = e.target.value.split('\n').filter(line => line.trim() !== '');
    setFormData(prev => ({ ...prev, keyStrengths: lines }));
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ text: '❌ Image size must be less than 5MB', type: 'error' });
      return;
    }
    const formDataUpload = new FormData();
    formDataUpload.append('avatar', file);
    try {
      setUploading(true);
      const token = localStorage.getItem('adminToken');
      const res = await axios.post(`${API_BASE_URL}/api/upload/avatar`, formDataUpload, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      if (res.data.success) {
        setFormData(prev => ({ ...prev, avatar: res.data.avatarUrl }));
        setMessage({ text: '✅ Avatar uploaded successfully!', type: 'success' });
      }
    } catch (err) {
      setMessage({ text: '❌ Upload failed: ' + err.message, type: 'error' });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ text: '', type: '' });
    try {
      await updatePersonal(formData);
      setMessage({ text: '✅ Personal info updated successfully!', type: 'success' });
    } catch (error) {
      setMessage({ text: '❌ Error updating personal info: ' + error.message, type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <h3 style={{ marginBottom: '1rem' }}>👤 Personal Information</h3>

      {message.text && (
        <div
          style={{
            padding: '0.8rem 1rem',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            background: message.type === 'success' ? 'rgba(40,167,69,0.1)' : 'rgba(220,53,69,0.1)',
            color: message.type === 'success' ? '#28a745' : '#dc3545',
            border: `1px solid ${message.type === 'success' ? '#28a745' : '#dc3545'}`
          }}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="admin-form">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <input
            type="text"
            name="name"
            value={formData.name || ''}
            onChange={handleChange}
            placeholder="Full Name"
            required
          />
          <input
            type="text"
            name="title"
            value={formData.title || ''}
            onChange={handleChange}
            placeholder="Job Title"
            required
          />
          <input
            type="email"
            name="email"
            value={formData.email || ''}
            onChange={handleChange}
            placeholder="Email"
            required
          />
          <input
            type="text"
            name="phone"
            value={formData.phone || ''}
            onChange={handleChange}
            placeholder="Phone"
            required
          />
          <input
            type="text"
            name="location"
            value={formData.location || ''}
            onChange={handleChange}
            placeholder="Location"
            required
          />
          <input
            type="url"
            name="github"
            value={formData.github || ''}
            onChange={handleChange}
            placeholder="GitHub URL"
          />
          <input
            type="url"
            name="linkedin"
            value={formData.linkedin || ''}
            onChange={handleChange}
            placeholder="LinkedIn URL"
          />
          <input
            type="url"
            name="resumeUrl"
            value={formData.resumeUrl || ''}
            onChange={handleChange}
            placeholder="Resume URL"
          />
        </div>

        {/* رفع الصورة الشخصية */}
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: '600' }}>
            Profile Avatar (upload from device)
          </label>
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleAvatarUpload}
            disabled={uploading}
          />
          {uploading && <span style={{ marginLeft: '0.5rem' }}>⏳ Uploading...</span>}
          {formData.avatar && (
            <div style={{ marginTop: '0.5rem' }}>
              <img
                src={`${API_BASE_URL}${formData.avatar}`}
                alt="Avatar preview"
                style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #ddd' }}
                onError={(e) => {
                  e.target.src = 'https://ui-avatars.com/api/?name=Mahmoud+Abozahra&size=80&background=1a1a1a&color=fff';
                }}
              />
            </div>
          )}
          <p style={{ fontSize: '0.8rem', color: '#888', marginTop: '0.3rem' }}>
            يمكنك رفع صورة من جهازك (حد أقصى 5 ميجابايت)
          </p>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: '600' }}>
            Key Strengths (أدخل كل نقطة في سطر منفصل)
          </label>
          <textarea
            value={formData.keyStrengths ? formData.keyStrengths.join('\n') : ''}
            onChange={handleKeyStrengthsChange}
            placeholder="Django REST Framework&#10;PostgreSQL/Oracle integration"
            rows="4"
            style={{
              width: '100%',
              padding: '0.8rem 1rem',
              border: '1px solid #ddd',
              borderRadius: '10px',
              fontSize: '0.95rem',
              fontFamily: 'inherit',
              resize: 'vertical'
            }}
          />
        </div>

        <textarea
          name="summary"
          value={formData.summary || ''}
          onChange={handleChange}
          placeholder="Professional Summary"
          rows="4"
          required
        />

        <textarea
          name="availability"
          value={formData.availability || ''}
          onChange={handleChange}
          placeholder="Availability Message"
          rows="2"
        />

        <div className="form-actions">
          <button type="submit" className="btn-submit" disabled={isSaving}>
            {isSaving ? '⏳ Saving...' : '💾 Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PersonalInfoManager;