const express = require('express');
const { v2: cloudinary } = require('cloudinary');

const router = express.Router();
const upload = require('../middleware/upload');
const Portfolio = require('../models/Portfolio');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

const uploadBufferToCloudinary = (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'image',
        ...options
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    stream.end(buffer);
  });
};

const getCloudinaryPublicIdFromUrl = (url) => {
  if (!url || !url.includes('res.cloudinary.com')) return null;

  try {
    const cleanUrl = url.split('?')[0];
    const marker = '/upload/';
    const markerIndex = cleanUrl.indexOf(marker);

    if (markerIndex === -1) return null;

    let afterUpload = cleanUrl.slice(markerIndex + marker.length);
    afterUpload = afterUpload.replace(/^v\d+\//, '');
    return afterUpload.replace(/\.[^/.]+$/, '');
  } catch {
    return null;
  }
};

const deleteCloudinaryImage = async (url) => {
  const publicId = getCloudinaryPublicIdFromUrl(url);
  if (!publicId) return;

  try {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: 'image',
      invalidate: true
    });
  } catch (error) {
    console.warn('Cloudinary delete warning:', error.message);
  }
};

router.post('/avatar', upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const data = await Portfolio.findOne();

    if (!data) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }

    if (data.personal?.avatar) {
      await deleteCloudinaryImage(data.personal.avatar);
    }

    const result = await uploadBufferToCloudinary(req.file.buffer, {
      folder: 'portfolio/avatar',
      public_id: 'profile',
      overwrite: true,
      transformation: [
        {
          width: 800,
          height: 800,
          crop: 'limit',
          quality: 'auto',
          fetch_format: 'auto'
        }
      ]
    });

    data.personal.avatar = result.secure_url;
    await data.save();

    res.json({
      success: true,
      avatarUrl: result.secure_url,
      publicId: result.public_id
    });
  } catch (error) {
    console.error('Avatar upload error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/project/:projectId/images', upload.array('images', 10), async (req, res) => {
  try {
    const { projectId } = req.params;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const data = await Portfolio.findOne();

    if (!data) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }

    const project = data.projects.id(projectId);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const uploadedResults = [];

    for (const file of req.files) {
      const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;

      const result = await uploadBufferToCloudinary(file.buffer, {
        folder: `portfolio/projects/${projectId}`,
        public_id: uniqueName,
        transformation: [
          {
            width: 1800,
            height: 1800,
            crop: 'limit',
            quality: 'auto',
            fetch_format: 'auto'
          }
        ]
      });

      uploadedResults.push(result);
    }

    const imageUrls = uploadedResults.map((result) => result.secure_url);

    project.images.push(...imageUrls);
    await data.save();

    res.json({
      success: true,
      projectId: project._id,
      images: imageUrls,
      project
    });
  } catch (error) {
    console.error('Project image upload error:', error);

    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid project ID' });
    }

    res.status(500).json({ error: error.message });
  }
});

router.delete('/project/:projectId/image/:imageIndex', async (req, res) => {
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

    if (!Number.isInteger(index) || index < 0 || index >= project.images.length) {
      return res.status(404).json({ error: 'Image not found' });
    }

    const imageUrl = project.images[index];

    await deleteCloudinaryImage(imageUrl);

    project.images.splice(index, 1);
    await data.save();

    res.json({
      success: true,
      project
    });
  } catch (error) {
    console.error('Delete project image error:', error);

    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid project ID' });
    }

    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
