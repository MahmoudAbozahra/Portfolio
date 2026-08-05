import React, { useState, useRef } from 'react';
import { useData } from '../../contexts/DataContext';
import { FaTimes } from 'react-icons/fa';

const ProjectsManager = () => {
  const { data, addProject, updateProject, deleteProject } = useData();
  const [editingIndex, setEditingIndex] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    summary: '',
    details: [],
    tags: [],
    images: []
  });
  const [detailInput, setDetailInput] = useState('');
  const [tagInput, setTagInput] = useState('');
  const fileInputRef = useRef(null);

  const projects = data.projects || [];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.title && formData.summary) {
      const projectData = {
        ...formData,
        id: Date.now()
      };
      if (editingIndex !== null) {
        updateProject(editingIndex, projectData);
        setEditingIndex(null);
      } else {
        addProject(projectData);
      }
      setFormData({ title: '', type: '', summary: '', details: [], tags: [], images: [] });
      setDetailInput('');
      setTagInput('');
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleImageUpload = (e) => {
    const files = e.target.files;
    if (files) {
      const newImages = [];
      let loadedCount = 0;
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.size > 5 * 1024 * 1024) {
          alert(`Image "${file.name}" is too large (max 5MB)`);
          continue;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
          newImages.push(reader.result);
          loadedCount++;
          if (loadedCount === files.length - (files.length - newImages.length)) {
            setFormData(prev => ({
              ...prev,
              images: [...prev.images, ...newImages]
            }));
          }
        };
        reader.readAsDataURL(file);
      }
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeImage = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== indexToRemove)
    }));
  };

  const handleEdit = (index) => {
    const project = projects[index];
    setFormData({
      title: project.title || '',
      type: project.type || '',
      summary: project.summary || '',
      details: project.details || [],
      tags: project.tags || [],
      images: project.images || []
    });
    setDetailInput('');
    setTagInput('');
    setEditingIndex(index);
  };

  const handleCancel = () => {
    setFormData({ title: '', type: '', summary: '', details: [], tags: [], images: [] });
    setDetailInput('');
    setTagInput('');
    setEditingIndex(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const addDetail = () => {
    if (detailInput.trim()) {
      setFormData(prev => ({
        ...prev,
        details: [...prev.details, detailInput.trim()]
      }));
      setDetailInput('');
    }
  };

  const removeDetail = (index) => {
    setFormData(prev => ({
      ...prev,
      details: prev.details.filter((_, i) => i !== index)
    }));
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="admin-form">
        <h3>{editingIndex !== null ? '✏️ Edit Project' : '➕ Add New Project'}</h3>
        
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          placeholder="Project Title"
          required
        />
        
        <input
          type="text"
          value={formData.type}
          onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
          placeholder="Project Type (e.g., Work Project)"
        />
        
        <textarea
          value={formData.summary}
          onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value }))}
          placeholder="Project Summary"
          required
        />

        <div>
          <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: '600' }}>Project Details</label>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <input
              type="text"
              value={detailInput}
              onChange={(e) => setDetailInput(e.target.value)}
              placeholder="Add detail point"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addDetail())}
            />
            <button type="button" onClick={addDetail} className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }}>
              Add Detail
            </button>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
            {formData.details.map((detail, i) => (
              <span key={i} className="chip" style={{ cursor: 'pointer' }} onClick={() => removeDetail(i)}>
                {detail} ✕
              </span>
            ))}
          </div>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: '600' }}>Tags</label>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="Add tag"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
            />
            <button type="button" onClick={addTag} className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }}>
              Add Tag
            </button>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
            {formData.tags.map((tag) => (
              <span key={tag} className="chip" style={{ cursor: 'pointer' }} onClick={() => removeTag(tag)}>
                {tag} ✕
              </span>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
            Project Images ({formData.images.length})
          </label>
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            style={{ marginBottom: '0.5rem' }}
          />
          <p style={{ fontSize: '0.8rem', color: '#888' }}>Max size: 5MB each. Supported: JPG, PNG, GIF. Select multiple images.</p>
          
          {/* Image Preview Grid */}
          {formData.images.length > 0 && (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
              gap: '0.5rem',
              marginTop: '0.5rem'
            }}>
              {formData.images.map((img, idx) => (
                <div key={idx} style={{ position: 'relative', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
                  <img src={img} alt={`Preview ${idx + 1}`} style={{ width: '100%', height: '80px', objectFit: 'cover' }} />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    style={{
                      position: 'absolute',
                      top: '2px',
                      right: '2px',
                      background: 'rgba(220,53,69,0.9)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: '22px',
                      height: '22px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px'
                    }}
                  >
                    <FaTimes />
                  </button>
                </div>
              ))}
            </div>
          )}
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
        <h3 style={{ marginBottom: '1rem' }}>📋 Current Projects ({projects.length})</h3>
        {projects.length === 0 ? (
          <p style={{ color: '#767676' }}>No projects added yet.</p>
        ) : (
          projects.map((project, index) => (
            <div key={index} className="admin-item">
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                {/* Image thumbnails */}
                {project.images && project.images.length > 0 && (
                  <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                    {project.images.slice(0, 3).map((img, idx) => (
                      <img 
                        key={idx} 
                        src={img} 
                        alt={`${project.title} ${idx + 1}`} 
                        style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '6px' }} 
                      />
                    ))}
                    {project.images.length > 3 && (
                      <span style={{ display: 'flex', alignItems: 'center', padding: '0 0.5rem', color: '#888', fontSize: '0.8rem' }}>
                        +{project.images.length - 3} more
                      </span>
                    )}
                  </div>
                )}
                <div style={{ flex: 1 }}>
                  <h4 style={{ marginBottom: '0.25rem' }}>{project.title}</h4>
                  <p style={{ color: '#888', fontSize: '0.85rem', marginBottom: '0.5rem' }}>{project.type}</p>
                  <p style={{ marginBottom: '0.5rem', fontSize: '0.9rem' }}>{project.summary}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginBottom: '0.75rem' }}>
                    {project.tags && project.tags.map((tag) => (
                      <span key={tag} className="chip" style={{ fontSize: '0.75rem' }}>{tag}</span>
                    ))}
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#888' }}>
                    📷 {project.images ? project.images.length : 0} images
                  </p>
                </div>
              </div>
              <div className="admin-item-actions">
                <button className="btn-edit" onClick={() => handleEdit(index)}>✏️ Edit</button>
                <button className="btn-delete" onClick={() => deleteProject(index)}>🗑️ Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProjectsManager;