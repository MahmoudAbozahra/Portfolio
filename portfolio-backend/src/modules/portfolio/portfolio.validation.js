const AppError = require('../../shared/errors/AppError');

const assertObject = (value, name = 'payload') => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new AppError(400, 'INVALID_PAYLOAD', `${name} must be an object`);
  }
};

const text = (value, max = 500) => {
  if (value === undefined) return undefined;
  if (typeof value !== 'string') throw new AppError(422, 'VALIDATION_ERROR', 'Text fields must be strings');
  return value.trim().slice(0, max);
};

const list = (value, maxItems = 50, maxLength = 500) => {
  if (value === undefined) return undefined;
  if (!Array.isArray(value) || value.length > maxItems) {
    throw new AppError(422, 'VALIDATION_ERROR', `Expected an array with at most ${maxItems} items`);
  }
  return value.map((item) => text(item, maxLength));
};

const url = (value) => {
  const cleaned = text(value, 2048);
  if (!cleaned || cleaned.startsWith('/uploads/')) return cleaned;
  try {
    const parsed = new URL(cleaned);
    if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error('protocol');
    return parsed.toString();
  } catch {
    throw new AppError(422, 'VALIDATION_ERROR', 'Links must use http or https');
  }
};

const sanitizePersonal = (value) => {
  assertObject(value, 'personal');
  return {
    name: text(value.name, 120),
    title: text(value.title, 120),
    email: text(value.email, 254),
    phone: text(value.phone, 40),
    location: text(value.location, 120),
    github: url(value.github),
    linkedin: url(value.linkedin),
    resumeUrl: url(value.resumeUrl),
    avatar: url(value.avatar),
    availability: text(value.availability, 600),
    summary: text(value.summary, 2500),
    keyStrengths: list(value.keyStrengths, 20, 160)
  };
};

const sanitizeProject = (value) => {
  assertObject(value, 'project');
  return {
    title: text(value.title, 180) || '',
    type: text(value.type, 100) || '',
    summary: text(value.summary, 1000) || '',
    details: list(value.details || [], 40, 1000),
    tags: list(value.tags || [], 30, 80),
    images: (value.images || []).map(url).slice(0, 30)
  };
};

const sanitizeExperience = (items) => {
  if (!Array.isArray(items) || items.length > 30) throw new AppError(422, 'VALIDATION_ERROR', 'Experience must be an array');
  return items.map((item) => {
    assertObject(item, 'experience item');
    return {
      title: text(item.title, 180), company: text(item.company, 180), period: text(item.period, 100),
      details: list(item.details || [], 50, 1000)
    };
  });
};

const sanitizeSkills = (value) => {
  assertObject(value, 'skills');
  const categories = value.technical?.categories || [];
  if (!Array.isArray(categories) || categories.length > 30) throw new AppError(422, 'VALIDATION_ERROR', 'Skill categories are invalid');
  return {
    technical: {
      title: text(value.technical?.title, 160),
      categories: categories.map((category) => ({ name: text(category.name, 120), items: list(category.items || [], 50, 120) }))
    },
    soft: { title: text(value.soft?.title, 160), items: list(value.soft?.items || [], 50, 120) },
    languages: {
      title: text(value.languages?.title, 160),
      items: (value.languages?.items || []).slice(0, 20).map((item) => ({ name: text(item.name, 80), level: text(item.level, 120) }))
    }
  };
};

const sanitizePortfolio = (value) => {
  assertObject(value);
  const result = {};
  if (value.personal !== undefined) result.personal = sanitizePersonal(value.personal);
  if (value.experience !== undefined) result.experience = sanitizeExperience(value.experience);
  if (value.projects !== undefined) {
    if (!Array.isArray(value.projects) || value.projects.length > 50) throw new AppError(422, 'VALIDATION_ERROR', 'Projects must be an array');
    result.projects = value.projects.map(sanitizeProject);
  }
  if (value.skills !== undefined) result.skills = sanitizeSkills(value.skills);
  if (value.education !== undefined) {
    assertObject(value.education, 'education');
    result.education = {
      degree: text(value.education.degree, 240), year: text(value.education.year, 80), grade: text(value.education.grade, 160),
      project: text(value.education.project, 500), training: text(value.education.training, 500)
    };
  }
  if (value.heroStats !== undefined) {
    if (!Array.isArray(value.heroStats) || value.heroStats.length > 12) throw new AppError(422, 'VALIDATION_ERROR', 'Hero statistics are invalid');
    result.heroStats = value.heroStats.map((item) => ({ value: text(item.value, 40), label: text(item.label, 120) }));
  }
  if (!Object.keys(result).length) throw new AppError(400, 'EMPTY_UPDATE', 'No supported portfolio fields were supplied');
  return result;
};

module.exports = { sanitizePersonal, sanitizePortfolio, sanitizeProject };
