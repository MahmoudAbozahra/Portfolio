import React, { useRef, useState } from 'react';
import apiClient, { resolveMediaUrl } from '../../lib/apiClient';
import { FaTimes } from 'react-icons/fa';
import { useData } from '../../contexts/DataContext';
import SafeImage from '../common/SafeImage';


const UPLOAD_URL = '/upload';

const EMPTY_FORM = {
  title: '',
  type: '',
  summary: '',
  details: [],
  tags: [],
  images: []
};

const ProjectsManager = () => {
  const {
    data,
    fetchData,
    addProject,
    updateProject,
    deleteProject
  } = useData();

  const [editingProjectId, setEditingProjectId] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);

  const [detailInput, setDetailInput] = useState('');
  const [tagInput, setTagInput] = useState('');

  /*
   * New images are kept locally until the project has been saved.
   * This is essential because a new project has no MongoDB _id yet.
   */
  const [pendingFiles, setPendingFiles] = useState([]);
  const [pendingPreviews, setPendingPreviews] = useState([]);

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef(null);

  const projects = data?.projects || [];

  const getImageSrc = resolveMediaUrl;

  const clearPendingPreviews = () => {
    pendingPreviews.forEach((preview) => {
      if (preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview);
      }
    });
  };

  const resetForm = () => {
    clearPendingPreviews();

    setFormData(EMPTY_FORM);
    setDetailInput('');
    setTagInput('');
    setPendingFiles([]);
    setPendingPreviews([]);
    setEditingProjectId(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const uploadImagesToProject = async (projectId, files) => {
    if (!projectId || !files || files.length === 0) {
      return [];
    }

    const body = new FormData();

    files.forEach((file) => {
      body.append('images', file);
    });

    setUploading(true);

    try {
      const response = await apiClient.post(
        `${UPLOAD_URL}/project/${projectId}/images`,
        body,
        {
          headers: {
          }
        }
      );

      return response.data.images || [];
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.summary.trim()) {
      return;
    }

    setSaving(true);

    try {
      const payload = {
        title: formData.title.trim(),
        type: formData.type.trim(),
        summary: formData.summary.trim(),
        details: formData.details,
        tags: formData.tags,
        /*
         * Existing image URLs stay here.
         * New File objects are uploaded separately after saving.
         */
        images: formData.images
      };

      let savedProject;

      if (editingProjectId) {
        savedProject = await updateProject(
          editingProjectId,
          payload
        );
      } else {
        savedProject = await addProject(payload);
      }

      const savedProjectId = savedProject?._id;

      if (!savedProjectId) {
        throw new Error(
          'Project was saved but the server did not return a project _id.'
        );
      }

      if (pendingFiles.length > 0) {
        await uploadImagesToProject(
          savedProjectId,
          pendingFiles
        );
      }

      await fetchData();

      resetForm();
    } catch (error) {
      console.error('Project save error:', error);

      alert(
        'Error saving project: ' +
          (
            error.response?.data?.error ||
            error.message ||
            'Unknown error'
          )
      );
    } finally {
      setSaving(false);
    }
  };

  const handleImageSelection = (e) => {
    const selected = Array.from(e.target.files || []);

    if (selected.length === 0) {
      return;
    }

    const validFiles = [];

    for (const file of selected) {
      if (file.size > 5 * 1024 * 1024) {
        alert(
          `Image "${file.name}" is too large. Maximum size is 5MB.`
        );
        continue;
      }

      if (!file.type.startsWith('image/')) {
        alert(`"${file.name}" is not a valid image.`);
        continue;
      }

      validFiles.push(file);
    }

    if (validFiles.length === 0) {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    const availableSlots =
      10 -
      formData.images.length -
      pendingFiles.length;

    if (availableSlots <= 0) {
      alert('Maximum 10 images per project.');
      return;
    }

    const accepted = validFiles.slice(0, availableSlots);

    if (accepted.length < validFiles.length) {
      alert('Only the first available images were selected. Maximum is 10.');
    }

    const previews = accepted.map((file) =>
      URL.createObjectURL(file)
    );

    setPendingFiles((prev) => [
      ...prev,
      ...accepted
    ]);

    setPendingPreviews((prev) => [
      ...prev,
      ...previews
    ]);

    /*
     * Allow selecting the same file again later if needed.
     */
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeExistingImage = async (imageIndex) => {
    if (!editingProjectId) {
      setFormData((prev) => ({
        ...prev,
        images: prev.images.filter(
          (_, index) => index !== imageIndex
        )
      }));
      return;
    }

    try {
      await apiClient.delete(
        `${UPLOAD_URL}/project/${editingProjectId}/image/${imageIndex}`,
        {}
      );

      setFormData((prev) => ({
        ...prev,
        images: prev.images.filter(
          (_, index) => index !== imageIndex
        )
      }));

      await fetchData();
    } catch (error) {
      console.error('Delete image error:', error);

      alert(
        'Error deleting image: ' +
          (
            error.response?.data?.error ||
            error.message
          )
      );
    }
  };

  const removePendingImage = (pendingIndex) => {
    const preview = pendingPreviews[pendingIndex];

    if (preview?.startsWith('blob:')) {
      URL.revokeObjectURL(preview);
    }

    setPendingFiles((prev) =>
      prev.filter((_, index) => index !== pendingIndex)
    );

    setPendingPreviews((prev) =>
      prev.filter((_, index) => index !== pendingIndex)
    );
  };

  const handleEdit = (project) => {
    clearPendingPreviews();

    setEditingProjectId(project._id);

    setFormData({
      title: project.title || '',
      type: project.type || '',
      summary: project.summary || '',
      details: project.details || [],
      tags: project.tags || [],
      images: project.images || []
    });

    setPendingFiles([]);
    setPendingPreviews([]);
    setDetailInput('');
    setTagInput('');

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDeleteProject = async (projectId) => {
    const confirmed = window.confirm(
      'Delete this project?'
    );

    if (!confirmed) return;

    try {
      await deleteProject(projectId);

      if (editingProjectId === projectId) {
        resetForm();
      }
    } catch (error) {
      alert(
        'Error deleting project: ' +
          (
            error.response?.data?.error ||
            error.message
          )
      );
    }
  };

  const addDetail = () => {
    const value = detailInput.trim();

    if (!value) return;

    setFormData((prev) => ({
      ...prev,
      details: [...prev.details, value]
    }));

    setDetailInput('');
  };

  const removeDetail = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      details: prev.details.filter(
        (_, index) => index !== indexToRemove
      )
    }));
  };

  const addTag = () => {
    const value = tagInput.trim();

    if (!value || formData.tags.includes(value)) {
      return;
    }

    setFormData((prev) => ({
      ...prev,
      tags: [...prev.tags, value]
    }));

    setTagInput('');
  };

  const removeTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter(
        (tag) => tag !== tagToRemove
      )
    }));
  };

  const totalImageCount =
    formData.images.length +
    pendingFiles.length;

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="admin-form"
      >
        <h3>
          {editingProjectId
            ? '✏️ Edit Project'
            : '➕ Add New Project'}
        </h3>

        <input
          type="text"
          value={formData.title}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              title: e.target.value
            }))
          }
          placeholder="Project Title"
          required
        />

        <input
          type="text"
          value={formData.type}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              type: e.target.value
            }))
          }
          placeholder="Project Type (e.g., Work Project)"
        />

        <textarea
          value={formData.summary}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              summary: e.target.value
            }))
          }
          placeholder="Project Summary"
          required
        />

        <div>
          <label
            style={{
              display: 'block',
              marginBottom: '0.3rem',
              fontWeight: 600
            }}
          >
            Project Details
          </label>

          <div
            style={{
              display: 'flex',
              gap: '0.5rem',
              marginBottom: '0.5rem'
            }}
          >
            <input
              type="text"
              value={detailInput}
              onChange={(e) =>
                setDetailInput(e.target.value)
              }
              placeholder="Add detail point"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addDetail();
                }
              }}
            />

            <button
              type="button"
              onClick={addDetail}
              className="btn btn-secondary"
            >
              Add Detail
            </button>
          </div>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.5rem',
              marginBottom: '1rem'
            }}
          >
            {formData.details.map((detail, index) => (
              <span
                key={`${detail}-${index}`}
                className="chip"
                style={{ cursor: 'pointer' }}
                onClick={() => removeDetail(index)}
              >
                {detail} ✕
              </span>
            ))}
          </div>
        </div>

        <div>
          <label
            style={{
              display: 'block',
              marginBottom: '0.3rem',
              fontWeight: 600
            }}
          >
            Tags
          </label>

          <div
            style={{
              display: 'flex',
              gap: '0.5rem',
              marginBottom: '0.5rem'
            }}
          >
            <input
              type="text"
              value={tagInput}
              onChange={(e) =>
                setTagInput(e.target.value)
              }
              placeholder="Add tag"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addTag();
                }
              }}
            />

            <button
              type="button"
              onClick={addTag}
              className="btn btn-secondary"
            >
              Add Tag
            </button>
          </div>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.5rem',
              marginBottom: '1rem'
            }}
          >
            {formData.tags.map((tag) => (
              <span
                key={tag}
                className="chip"
                style={{ cursor: 'pointer' }}
                onClick={() => removeTag(tag)}
              >
                {tag} ✕
              </span>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label
            style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: 600
            }}
          >
            Project Images ({totalImageCount}/10)
          </label>

          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            multiple
            onChange={handleImageSelection}
          />

          <p
            style={{
              fontSize: '0.8rem',
              color: '#667085',
              marginTop: '0.4rem'
            }}
          >
            Images are uploaded after the project is saved.
            Maximum 5MB each, up to 10 images.
          </p>

          {(formData.images.length > 0 ||
            pendingPreviews.length > 0) && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  'repeat(auto-fill, minmax(100px, 1fr))',
                gap: '0.5rem',
                marginTop: '0.8rem'
              }}
            >
              {formData.images.map((image, index) => (
                <div
                  key={`existing-${image}-${index}`}
                  style={{
                    position: 'relative',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    overflow: 'hidden'
                  }}
                >
                  <SafeImage
                    src={getImageSrc(image)}
                    alt={`Existing ${index + 1}`}
                    style={{
                      width: '100%',
                      height: '80px',
                      objectFit: 'cover'
                    }}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      removeExistingImage(index)
                    }
                    aria-label="Remove image"
                    style={{
                      position: 'absolute',
                      top: 2,
                      right: 2,
                      background: 'rgba(220,53,69,0.92)',
                      color: '#fff',
                      border: 0,
                      borderRadius: '50%',
                      width: 24,
                      height: 24,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <FaTimes />
                  </button>
                </div>
              ))}

              {pendingPreviews.map((preview, index) => (
                <div
                  key={`pending-${preview}`}
                  style={{
                    position: 'relative',
                    border: '2px dashed #98a2b3',
                    borderRadius: '8px',
                    overflow: 'hidden'
                  }}
                >
                  <SafeImage
                    src={preview}
                    alt={`Pending ${index + 1}`}
                    style={{
                      width: '100%',
                      height: '80px',
                      objectFit: 'cover'
                    }}
                  />

                  <span
                    style={{
                      position: 'absolute',
                      left: 4,
                      bottom: 4,
                      background: 'rgba(0,0,0,0.65)',
                      color: '#fff',
                      borderRadius: 4,
                      padding: '2px 5px',
                      fontSize: '0.65rem'
                    }}
                  >
                    New
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      removePendingImage(index)
                    }
                    aria-label="Remove selected image"
                    style={{
                      position: 'absolute',
                      top: 2,
                      right: 2,
                      background: 'rgba(220,53,69,0.92)',
                      color: '#fff',
                      border: 0,
                      borderRadius: '50%',
                      width: 24,
                      height: 24,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
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
          <button
            type="submit"
            className="btn-submit"
            disabled={saving || uploading}
          >
            {saving || uploading
              ? 'Saving...'
              : editingProjectId
                ? 'Update'
                : 'Add'}
          </button>

          {editingProjectId && (
            <button
              type="button"
              className="btn-cancel"
              onClick={resetForm}
              disabled={saving || uploading}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div style={{ marginTop: '2rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>
          📋 Current Projects ({projects.length})
        </h3>

        {projects.length === 0 ? (
          <p style={{ color: '#767676' }}>
            No projects added yet.
          </p>
        ) : (
          projects.map((project) => (
            <div
              key={project._id}
              className="admin-item"
            >
              <div
                style={{
                  display: 'flex',
                  gap: '1rem',
                  alignItems: 'flex-start',
                  flexWrap: 'wrap'
                }}
              >
                {project.images?.length > 0 && (
                  <div
                    style={{
                      display: 'flex',
                      gap: '0.3rem',
                      flexWrap: 'wrap'
                    }}
                  >
                    {project.images
                      .slice(0, 3)
                      .map((image, index) => (
                        <SafeImage
                          key={`${image}-${index}`}
                          src={getImageSrc(image)}
                          alt={`${project.title} ${index + 1}`}
                          style={{
                            width: 60,
                            height: 60,
                            objectFit: 'cover',
                            borderRadius: 6
                          }}
                        />
                      ))}

                    {project.images.length > 3 && (
                      <span
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: '0 0.5rem',
                          color: '#888',
                          fontSize: '0.8rem'
                        }}
                      >
                        +{project.images.length - 3} more
                      </span>
                    )}
                  </div>
                )}

                <div style={{ flex: 1 }}>
                  <h4 style={{ marginBottom: '0.25rem' }}>
                    {project.title}
                  </h4>

                  <p
                    style={{
                      color: '#888',
                      fontSize: '0.85rem',
                      marginBottom: '0.5rem'
                    }}
                  >
                    {project.type}
                  </p>

                  <p
                    style={{
                      marginBottom: '0.5rem',
                      fontSize: '0.9rem'
                    }}
                  >
                    {project.summary}
                  </p>

                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '0.3rem',
                      marginBottom: '0.75rem'
                    }}
                  >
                    {project.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="chip"
                        style={{ fontSize: '0.75rem' }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <p
                    style={{
                      fontSize: '0.8rem',
                      color: '#888'
                    }}
                  >
                    📷 {project.images?.length || 0} images
                  </p>
                </div>
              </div>

              <div className="admin-item-actions">
                <button
                  type="button"
                  className="btn-edit"
                  onClick={() => handleEdit(project)}
                >
                  ✏️ Edit
                </button>

                <button
                  type="button"
                  className="btn-delete"
                  onClick={() =>
                    handleDeleteProject(project._id)
                  }
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProjectsManager;
