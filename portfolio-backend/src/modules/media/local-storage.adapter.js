const fs = require('fs');
const path = require('path');
const env = require('../../config/env');

const resolveManagedPath = (filename) => {
  const resolved = path.resolve(env.uploadsDir, path.basename(filename));
  if (path.dirname(resolved) !== env.uploadsDir) throw new Error('Unsafe media path');
  return resolved;
};

const remove = (urlOrFile) => {
  if (!urlOrFile) return;
  const filename = urlOrFile.startsWith('/uploads/') ? path.basename(urlOrFile) : path.basename(urlOrFile);
  const target = resolveManagedPath(filename);
  if (fs.existsSync(target)) fs.unlinkSync(target);
};

module.exports = { remove, publicUrl: (filename) => `/uploads/${path.basename(filename)}` };
