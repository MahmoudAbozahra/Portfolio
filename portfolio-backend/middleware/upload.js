const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, uploadDir);
  },

  filename: (req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();

    const baseName = path
      .basename(file.originalname, extension)
      .replace(/[^a-zA-Z0-9-_]/g, '-')
      .slice(0, 50);

    const uniqueSuffix =
      `${Date.now()}-${Math.round(Math.random() * 1e9)}`;

    const prefix = file.fieldname === 'avatar' ? 'avatar' : 'project';

    callback(
      null,
      `${prefix}-${baseName || 'image'}-${uniqueSuffix}${extension}`
    );
  }
});

const fileFilter = (req, file, callback) => {
  const allowedMimeTypes = new Set([
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp'
  ]);

  const allowedExtensions = new Set([
    '.jpeg',
    '.jpg',
    '.png',
    '.gif',
    '.webp'
  ]);

  const extension = path.extname(file.originalname).toLowerCase();

  if (
    allowedMimeTypes.has(file.mimetype) &&
    allowedExtensions.has(extension)
  ) {
    return callback(null, true);
  }

  callback(
    new Error('Only jpeg, jpg, png, gif and webp images are allowed')
  );
};

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 10
  },
  fileFilter
});

module.exports = upload;
