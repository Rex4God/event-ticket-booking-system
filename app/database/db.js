const { Sequelize } = require('sequelize');
const { logger } = require('../utils/logger');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: 'localhost',
    dialect: 'mysql',
  }
);

sequelize.sync();

(async () => {
  try {
    await sequelize.authenticate();
    logger.log({
      level: 'info',
      message: 'Connection to the database has been established successfully.'
    });
  } catch (error) {
    logger.log({
      level: 'error',
      message: 'Unable to connect to the database:',
      error
    });
  }
})();

module.exports = sequelize;
