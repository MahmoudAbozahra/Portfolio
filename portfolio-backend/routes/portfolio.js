const express = require('express');

const router = express.Router();

const Portfolio = require('../models/Portfolio');
const { requireAdmin } = require('../middleware/auth');

/* =========================
   GET COMPLETE PORTFOLIO
   ========================= */
router.get('/', async (req, res) => {
  try {
    let data = await Portfolio.findOne();

    if (!data) {
      const defaultData = require('../defaultData');
      data = await Portfolio.create(defaultData);
    }

    res.json(data);
  } catch (error) {
    console.error('GET portfolio error:', error);
    res.status(500).json({ error: error.message });
  }
});

/* =========================
   UPDATE COMPLETE PORTFOLIO
   Kept for existing admin sections
   ========================= */
router.put('/', requireAdmin, async (req, res) => {
  try {
    let data = await Portfolio.findOne();

    if (!data) {
      data = new Portfolio(req.body);
    } else {
      /*
       * Never overwrite the main MongoDB document _id.
       */
      const cleanBody = { ...req.body };
      delete cleanBody._id;
      delete cleanBody.__v;

      Object.assign(data, cleanBody);
    }

    await data.save();

    res.json(data);
  } catch (error) {
    console.error('PUT portfolio error:', error);
    res.status(500).json({ error: error.message });
  }
});

/* =========================
   UPDATE PERSONAL
   ========================= */
router.put('/personal', requireAdmin, async (req, res) => {
  try {
    let data = await Portfolio.findOne();

    if (!data) {
      data = new Portfolio({
        personal: req.body
      });
    } else {
      data.personal = req.body;
    }

    await data.save();

    res.json(data);
  } catch (error) {
    console.error('PUT personal error:', error);
    res.status(500).json({ error: error.message });
  }
});

/* =========================
   CREATE PROJECT
   MongoDB creates the subdocument _id
   ========================= */
router.post('/projects', requireAdmin, async (req, res) => {
  try {
    let data = await Portfolio.findOne();

    if (!data) {
      const defaultData = require('../defaultData');
      data = await Portfolio.create(defaultData);
    }

    const project = {
      title: req.body.title || '',
      type: req.body.type || '',
      summary: req.body.summary || '',
      details: Array.isArray(req.body.details)
        ? req.body.details
        : [],
      tags: Array.isArray(req.body.tags)
        ? req.body.tags
        : [],
      images: Array.isArray(req.body.images)
        ? req.body.images
        : []
    };

    data.projects.push(project);

    await data.save();

    const createdProject =
      data.projects[data.projects.length - 1];

    res.status(201).json({
      success: true,
      project: createdProject,
      portfolio: data
    });
  } catch (error) {
    console.error('POST project error:', error);
    res.status(500).json({ error: error.message });
  }
});

/* =========================
   UPDATE PROJECT
   ========================= */
router.put('/projects/:projectId', requireAdmin, async (req, res) => {
  try {
    const data = await Portfolio.findOne();

    if (!data) {
      return res.status(404).json({
        error: 'Portfolio not found'
      });
    }

    const project = data.projects.id(
      req.params.projectId
    );

    if (!project) {
      return res.status(404).json({
        error: 'Project not found'
      });
    }

    if (req.body.title !== undefined) {
      project.title = req.body.title;
    }

    if (req.body.type !== undefined) {
      project.type = req.body.type;
    }

    if (req.body.summary !== undefined) {
      project.summary = req.body.summary;
    }

    if (Array.isArray(req.body.details)) {
      project.details = req.body.details;
    }

    if (Array.isArray(req.body.tags)) {
      project.tags = req.body.tags;
    }

    if (Array.isArray(req.body.images)) {
      project.images = req.body.images;
    }

    await data.save();

    res.json({
      success: true,
      project,
      portfolio: data
    });
  } catch (error) {
    console.error('PUT project error:', error);

    if (error.name === 'CastError') {
      return res.status(400).json({
        error: 'Invalid project ID'
      });
    }

    res.status(500).json({ error: error.message });
  }
});

/* =========================
   DELETE PROJECT
   ========================= */
router.delete('/projects/:projectId', requireAdmin, async (req, res) => {
  try {
    const data = await Portfolio.findOne();

    if (!data) {
      return res.status(404).json({
        error: 'Portfolio not found'
      });
    }

    const project = data.projects.id(
      req.params.projectId
    );

    if (!project) {
      return res.status(404).json({
        error: 'Project not found'
      });
    }

    project.deleteOne();

    await data.save();

    res.json({
      success: true,
      portfolio: data
    });
  } catch (error) {
    console.error('DELETE project error:', error);

    if (error.name === 'CastError') {
      return res.status(400).json({
        error: 'Invalid project ID'
      });
    }

    res.status(500).json({ error: error.message });
  }
});

/* =========================
   RESET PORTFOLIO
   ========================= */
router.delete('/', requireAdmin, async (req, res) => {
  try {
    await Portfolio.deleteMany({});

    const defaultData = require('../defaultData');
    const data = await Portfolio.create(defaultData);

    res.json({
      success: true,
      portfolio: data
    });
  } catch (error) {
    console.error('RESET portfolio error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
