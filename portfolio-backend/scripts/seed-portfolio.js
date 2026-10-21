const mongoose = require('mongoose');
require('dotenv').config();
const Portfolio = require('../models/Portfolio');
const defaultData = require('../defaultData');

async function seed() {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is required');
  await mongoose.connect(process.env.MONGODB_URI);
  const result = await Portfolio.updateOne({}, { $setOnInsert: defaultData }, { upsert: true });
  console.log(result.upsertedCount ? 'Portfolio seeded' : 'Portfolio already exists; no changes made');
}

seed().then(() => mongoose.disconnect()).catch(async (error) => {
  console.error('Portfolio seed failed:', error.message);
  await mongoose.disconnect();
  process.exitCode = 1;
});
