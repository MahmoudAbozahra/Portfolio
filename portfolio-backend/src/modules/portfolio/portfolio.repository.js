const Portfolio = require('./portfolio.model');

module.exports = {
  findOne() {
    return Portfolio.findOne();
  },
  async create(data) {
    return Portfolio.create(data);
  },
  async resetWith(data) {
    const current = await Portfolio.findOne();
    if (current) {
      current.set(data);
      return current.save();
    }
    return Portfolio.create(data);
  }
};
