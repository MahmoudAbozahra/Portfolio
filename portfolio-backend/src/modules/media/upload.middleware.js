const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { imageSize } = require('image-size');
const env = require('../../config/env');
const AppError = require('../../shared/errors/AppError');

fs.mkdirSync(env.uploadsDir, { recursive: true });

const allowedTypes = new Set(['jpg', 'png', 'gif', 'webp']);
const storage = multer.diskStorage({
  destination: env.uploadsDir,
  filename(req, file, callback) {
    const prefix = file.fieldname === 'avatar' ? 'avatar' : 'project';
    const extension = path.extname(file.originalname).toLowerCase().replace(/[^.a-z0-9]/g, '').slice(0, 6);
    callback(null, `${prefix}-${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: env.maxImageBytes, files: env.maxImageCount },
  fileFilter(req, file, callback) {
    callback(null, file.mimetype.startsWith('image/'));
  }
});

const validateFile = (file) => {
  try {
    const buffer = fs.readFileSync(file.path);
    const dimensions = imageSize(buffer);
    const megapixels = (dimensions.width * dimensions.height) / 1_000_000;
    if (!allowedTypes.has(dimensions.type) || dimensions.width < 32 || dimensions.height < 32 || dimensions.width > 8000 || dimensions.height > 8000 || megapixels > 25) {
      throw new Error('Unsupported image dimensions or content');
    }
    const canonicalExtension = dimensions.type === 'jpg' ? '.jpg' : `.${dimensions.type}`;
    if (path.extname(file.path).toLowerCase() !== canonicalExtension) {
      const renamedPath = `${file.path.slice(0, -path.extname(file.path).length)}${canonicalExtension}`;
      fs.renameSync(file.path, renamedPath);
      file.path = renamedPath;
      file.filename = path.basename(renamedPath);
    }
    return file;
  } catch {
    try { fs.unlinkSync(file.path); } catch {}
    throw new AppError(422, 'INVALID_IMAGE_CONTENT', 'Uploaded file is not a supported, safe image');
  }
};

module.exports = { upload, validateFile };
