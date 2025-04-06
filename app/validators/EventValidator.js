const Joi = require('joi');
const dayjs = require('dayjs');
const { validate } = require('../utils/helpers');
const { EVENT_STATUS } = require('../utils/constant');

exports.createEvent = async (body) => {
  const schema = {
    title: Joi.string().min(3).max(100).required(),
    eventImage: Joi.string().custom((value, helpers) => {
      if (!/^https?:\/\/.+\.(jpg|jpeg|png|gif)$/.test(value)) {
        return helpers.error('any.invalid');
      }
      return value;
    }).optional(),
    description: Joi.string().min(3).max(255).required(),
    eventDate: Joi.string().custom((value, helpers) => {
      if (!dayjs(value, 'YYYY-MM-DD', true).isValid()) {
        return helpers.error('any.invalid');
      }
      return value;
    }).required(),
    eventTime: Joi.string().pattern(/^\d{2}:\d{2}:\d{2}$/).required(),
    price: Joi.number().min(0).required(),
    totalTickets: Joi.number().min(1).required(),
    availableTickets: Joi.number().min(0).required(),
    location: Joi.string().min(3).max(100).required(),
    status: Joi.string().valid(...Object.values(EVENT_STATUS)).default(EVENT_STATUS.SCHEDULED)
  };
  return validate(schema, body);
};
