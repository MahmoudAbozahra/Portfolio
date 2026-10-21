const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      default: ''
    },
    type: {
      type: String,
      trim: true,
      default: ''
    },
    summary: {
      type: String,
      trim: true,
      default: ''
    },
    details: {
      type: [String],
      default: []
    },
    tags: {
      type: [String],
      default: []
    },
    images: {
      type: [String],
      default: []
    }
  },
  {
    /*
     * Keep the MongoDB-generated _id for each project.
     * This _id is now the single project identifier used
     * by the admin and upload routes.
     */
    _id: true
  }
);

const ExperienceSchema = new mongoose.Schema({
  title: String,
  company: String,
  period: String,
  details: [String]
});

const SkillCategorySchema = new mongoose.Schema({
  name: String,
  items: [String]
});

const SkillsSchema = new mongoose.Schema({
  technical: {
    title: String,
    categories: [SkillCategorySchema]
  },
  soft: {
    title: String,
    items: [String]
  },
  languages: {
    title: String,
    items: [
      {
        name: String,
        level: String
      }
    ]
  }
});

const PortfolioSchema = new mongoose.Schema({
  personal: {
    name: String,
    title: String,
    email: String,
    phone: String,
    location: String,
    github: String,
    linkedin: String,
    resumeUrl: String,
    avatar: String,
    availability: String,
    summary: String,
    keyStrengths: [String]
  },

  experience: {
    type: [ExperienceSchema],
    default: []
  },

  projects: {
    type: [ProjectSchema],
    default: []
  },

  skills: SkillsSchema,

  education: {
    degree: String,
    year: String,
    grade: String,
    project: String,
    training: String
  },

  heroStats: [
    {
      value: String,
      label: String
    }
  ]
}, { timestamps: true, optimisticConcurrency: true });

module.exports =
  mongoose.model('Portfolio', PortfolioSchema);
