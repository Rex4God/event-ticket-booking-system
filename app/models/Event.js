const { Sequelize } = require('sequelize');
const dayjs = require('dayjs');
const sequelize = require('../database/db');
const { EVENT_STATUS } = require('../utils/constant');

const Event = sequelize.define('events', {
  eventId: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false,
    primaryKey: true,
    unique: true
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: { len: [3, 100] }
  },
  eventImage: {
    type: Sequelize.STRING,
    allowNull: true,
    validate: {
      isUrl: true,
    },
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: { len: [3, 255] }
  },
  eventDate: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW,
    validate: {
      isDate: true,
      isAfter: {
        args: dayjs().format('YYYY-MM-DD'),
        msg: 'Event date must be in the future.'
      }
    }
  },
  eventTime: {
    type: Sequelize.TIME,
    allowNull: false,
    validate: {
      is: {
        args: /^\d{2}:\d{2}:\d{2}$/,
        msg: 'Event time must be in the format HH:mm:ss.'
      }
    }
  },
  price: {
    type: Sequelize.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00,
    validate: { isDecimal: true, min: 0.00 }
  },
  totalTickets: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  availableTickets: {
    type: Sequelize.INTEGER,
    allowNull: false,
    validate: {
      min: 0,
      max(value) {
        if (value > this.totalTickets) {
          throw new Error('Available tickets cannot exceed total tickets.');
        }
      }
    }
  },
  location: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: { len: [3, 100] }
  },
  status: {
    type: Sequelize.ENUM(
      EVENT_STATUS.SCHEDULED,
      EVENT_STATUS.ONGOING,
      EVENT_STATUS.COMPLETED,
      EVENT_STATUS.CANCELED
    ),
    validate: { isIn: [Object.values(EVENT_STATUS)] },
    allowNull: false,
    defaultValue: EVENT_STATUS.SCHEDULED
  }
}, { timestamps: true });

module.exports = Event;
