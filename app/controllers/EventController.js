const eventService = require('../services/EventService');
const response = require('../utils/responses');

exports.createEvent = async (req, res) => {
  const {
    error,
    statusCode,
    data
  } = await eventService.createEvent(req.body);

  if (error) return response.error(res, error, statusCode);

  return response.success(res, data, statusCode);
};

exports.getEventStatus = async (req, res) => {
  const {
    error,
    statusCode,
    data
  } = await eventService.getEventStatus(req.params.eventId);

  if (error) return response.error(res, error, statusCode);

  return response.success(res, data, statusCode);
};
