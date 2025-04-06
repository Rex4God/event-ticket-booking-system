const { Sequelize } = require('sequelize');
const sequelize = require('../database/db');
const { BOOKING_STATUS } = require('../utils/constant');
const { PAYMENT_STATUS } = require('../utils/constant');

const Booking = sequelize.define('bookings', {
  bookingId: {
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
  num_tickets: {
    type: Sequelize.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  },
  total_price: {
    type: Sequelize.FLOAT,
    allowNull: false
  },
  payment_status: {
    type: Sequelize.ENUM(
      PAYMENT_STATUS.PENDING,
      PAYMENT_STATUS.PAID,
      PAYMENT_STATUS.FAILED
    ),
    validate: { isIn: [Object.values(PAYMENT_STATUS)] },
    allowNull: false,
    defaultValue: PAYMENT_STATUS.PENDING
  },
  booking_status: {
    type: Sequelize.ENUM(
      BOOKING_STATUS.CONFIRMED,
      BOOKING_STATUS.CANCELED,
      BOOKING_STATUS.EXPIRED
    ),
    validate: { isIn: [Object.values(BOOKING_STATUS)] },
    allowNull: false,
    defaultValue: BOOKING_STATUS.CONFIRMED
  },
  expires_at: {
    type: Sequelize.DATE,
    allowNull: true
  }
}, {
  timestamps: true
});

module.exports = Booking;
