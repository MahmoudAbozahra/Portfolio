import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';

const SkillsManager = () => {
  const { data, addSkill, updateSkill, deleteSkill } = useData();
  const [editingIndex, setEditingIndex] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    items: []
  });
  const [itemInput, setItemInput] = useState('');

  const skillCategories = data.skills?.technical?.categories || [];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.items.length > 0) {
      if (editingIndex !== null) {
        updateSkill(editingIndex, formData);
        setEditingIndex(null);
      } else {
        addSkill(formData);
      }
      setFormData({ name: '', items: [] });
      setItemInput('');
    }
  };

  const handleEdit = (index) => {
    const category = skillCategories[index];
    setFormData({
      name: category.name || category.title || '',
      items: category.items || []
    });
    setItemInput('');
    setEditingIndex(index);
  };

  const handleCancel = () => {
    setFormData({ name: '', items: [] });
    setItemInput('');
    setEditingIndex(null);
  };

  const addItem = () => {
    if (itemInput.trim() && !formData.items.includes(itemInput.trim())) {
      setFormData(prev => ({
        ...prev,
        items: [...prev.items, itemInput.trim()]
      }));
      setItemInput('');
    }
  };

  const removeItem = (itemToRemove) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter(item => item !== itemToRemove)
    }));
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="admin-form">
        <h3>{editingIndex !== null ? '✏️ Edit Skill Group' : '➕ Add New Skill Group'}</h3>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          placeholder="Skill Group Title (e.g., Backend)"
          required
        />
        <div>
          <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: '600' }}>Skills</label>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <input
              type="text"
              value={itemInput}
              onChange={(e) => setItemInput(e.target.value)}
              placeholder="Add skill item"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem())}
            />
            <button type="button" onClick={addItem} className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }}>
              Add Skill
            </button>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {formData.items.map((item) => (
              <span key={item} className="chip" style={{ cursor: 'pointer' }} onClick={() => removeItem(item)}>
                {item} ✕
              </span>
            ))}
          </div>
        </div>
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
        <h3 style={{ marginBottom: '1rem' }}>📋 Current Skill Groups ({skillCategories.length})</h3>
        {skillCategories.length === 0 ? (
          <p style={{ color: '#767676' }}>No skill groups added yet.</p>
        ) : (
          skillCategories.map((group, index) => (
            <div key={index} className="admin-item">
              <h4 style={{ marginBottom: '0.5rem' }}>{group.name || group.title}</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginBottom: '0.75rem' }}>
                {(group.items || []).map((item) => (
                  <span key={item} className="chip" style={{ fontSize: '0.85rem' }}>{item}</span>
                ))}
              </div>
              <div className="admin-item-actions">
                <button className="btn-edit" onClick={() => handleEdit(index)}>✏️ Edit</button>
                <button className="btn-delete" onClick={() => deleteSkill(index)}>🗑️ Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SkillsManager;
