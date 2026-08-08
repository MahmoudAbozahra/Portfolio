import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';

const ExperienceManager = () => {
  const { data, addExperience, updateExperience, deleteExperience } = useData();
  const [editingIndex, setEditingIndex] = useState(null);
  const [formData, setFormData] = useState('');

  // التأكد من أن data.experience هي array من النصوص
  const experienceItems = data.experience || [];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.trim()) {
      if (editingIndex !== null) {
        updateExperience(editingIndex, formData);
        setEditingIndex(null);
      } else {
        addExperience(formData);
      }
      setFormData('');
    }
  };

  const handleEdit = (index) => {
    const item = experienceItems[index];
    // إذا كان العنصر كائن، خذ النص منه
    if (typeof item === 'object' && item !== null) {
      setFormData(item.text || item.details || JSON.stringify(item));
    } else {
      setFormData(item || '');
    }
    setEditingIndex(index);
  };

  const handleCancel = () => {
    setFormData('');
    setEditingIndex(null);
  };

  // دالة للحصول على النص من العنصر
  const getItemText = (item) => {
    if (typeof item === 'string') return item;
    if (typeof item === 'object' && item !== null) {
      return item.text || item.details || item.title || JSON.stringify(item);
    }
    return String(item);
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="admin-form">
        <h3>{editingIndex !== null ? '✏️ Edit Experience' : '➕ Add New Experience'}</h3>
        <textarea
          value={formData}
          onChange={(e) => setFormData(e.target.value)}
          placeholder="Enter experience description..."
          required
          rows="4"
        />
        <div className="form-actions">
          <button type="submit" className="btn-submit">
            {editingIndex !== null ? 'Update' : 'Add'}
          </button>
          {editingIndex !== null && (
            <button type="button" className="btn-cancel" onClick={handleCancel}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <div style={{ marginTop: '2rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>📋 Current Experiences ({experienceItems.length})</h3>
        {experienceItems.length === 0 ? (
          <p style={{ color: '#767676' }}>No experiences added yet.</p>
        ) : (
          experienceItems.map((item, index) => (
            <div key={index} className="admin-item">
              <p>{getItemText(item)}</p>
              <div className="admin-item-actions">
                <button className="btn-edit" onClick={() => handleEdit(index)}>✏️ Edit</button>
                <button className="btn-delete" onClick={() => deleteExperience(index)}>🗑️ Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ExperienceManager;