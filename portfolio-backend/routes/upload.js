const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

const upload = require('../middleware/upload');
const Portfolio = require('../models/Portfolio');

const uploadsDir = path.join(__dirname, '../uploads');

const deleteLocalImage = (imageUrl) => {
  if (!imageUrl || !imageUrl.startsWith('/uploads/')) {
    return;
  }

  const filename = path.basename(imageUrl);
  const filePath = path.join(uploadsDir, filename);

  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.warn('Could not delete local image:', error.message);
  }
};

const removeUploadedFiles = (files = []) => {
  files.forEach((file) => {
    try {
      if (file?.path && fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
    } catch (error) {
      console.warn('Could not remove uploaded file:', error.message);
    }
  });
};

router.post('/avatar', upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const data = await Portfolio.findOne();

    if (!data) {
      removeUploadedFiles([req.file]);
      return res.status(404).json({ error: 'Portfolio not found' });
    }

    const oldAvatar = data.personal?.avatar;
    const imageUrl = `/uploads/${req.file.filename}`;

    data.personal.avatar = imageUrl;
    await data.save();

    if (oldAvatar && oldAvatar !== imageUrl) {
      deleteLocalImage(oldAvatar);
    }

    return res.json({
      success: true,
      avatarUrl: imageUrl
    });
  } catch (error) {
    if (req.file) {
      removeUploadedFiles([req.file]);
    }

    console.error('Avatar upload error:', error);

    return res.status(500).json({
      error: error.message
    });
  }
});

router.post(
  '/project/:projectId/images',
  upload.array('images', 10),
  async (req, res) => {
    try {
      const { projectId } = req.params;

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'No files uploaded' });
      }

      const data = await Portfolio.findOne();

      if (!data) {
        removeUploadedFiles(req.files);
        return res.status(404).json({ error: 'Portfolio not found' });
      }

      const project = data.projects.id(projectId);

      if (!project) {
        removeUploadedFiles(req.files);
        return res.status(404).json({ error: 'Project not found' });
      }

      const imageUrls = req.files.map(
        (file) => `/uploads/${file.filename}`
      );

      project.images.push(...imageUrls);
      await data.save();

      return res.json({
        success: true,
        projectId: project._id,
        images: imageUrls,
        project
      });
    } catch (error) {
      removeUploadedFiles(req.files || []);

      console.error('Project image upload error:', error);

      if (error.name === 'CastError') {
        return res.status(400).json({ error: 'Invalid project ID' });
      }

      return res.status(500).json({
        error: error.message
      });
    }
  }
);

router.delete(
  '/project/:projectId/image/:imageIndex',
  async (req, res) => {
    try {
      const { projectId, imageIndex } = req.params;

      const data = await Portfolio.findOne();

      if (!data) {
        return res.status(404).json({ error: 'Portfolio not found' });
      }

      const project = data.projects.id(projectId);

      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }

      const index = Number(imageIndex);

      if (
        !Number.isInteger(index) ||
        index < 0 ||
        index >= project.images.length
      ) {
        return res.status(404).json({ error: 'Image not found' });
      }

      const imageUrl = project.images[index];

      project.images.splice(index, 1);
      await data.save();

      deleteLocalImage(imageUrl);

      return res.json({
        success: true,
        project
      });
    } catch (error) {
      console.error('Delete project image error:', error);

      if (error.name === 'CastError') {
        return res.status(400).json({ error: 'Invalid project ID' });
      }

      return res.status(500).json({
        error: error.message
      });
    }
  }
);

module.exports = router;
