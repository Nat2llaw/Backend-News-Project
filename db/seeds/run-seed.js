const devData = require('../data/development-data/index.js');
const seed = require('./seed.js');
const db = require('../connection');

const runSeed = () => {
  return seed(devData).then(() => db.end());
};

runSeed();
