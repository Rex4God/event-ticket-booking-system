const { Sequelize } = require('sequelize');
const sequelize = require('../database/db');

const WaitingList = sequelize.define('waiting_list', {
  waitingId: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false,
    primaryKey: true,
    unique: true
  },
  eventId: {
    type: Sequelize.UUID,
    allowNull: false,
    references: {
      model: 'events',
      key: 'eventId'
    },
    onDelete: 'CASCADE'
  },
  userId: {
    type: Sequelize.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'userId'
    },
    onDelete: 'CASCADE'
  },
  position: {
    type: Sequelize.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  },

});

module.exports = WaitingList;
