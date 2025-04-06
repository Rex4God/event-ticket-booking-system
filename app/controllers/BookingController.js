const bookingService = require('../services/BookingService');
const response = require('../utils/responses');

exports.bookTicket = async (req, res) => {
  const { eventId, userId, num_tickets } = req.body;
  const {
    error,
    data,
    statusCode
  } = await bookingService.bookTicket(eventId, userId, num_tickets);

  if (error) return response.error(res, error, statusCode);

  return response.success(res, data, statusCode);
};

exports.cancelBooking = async (req, res) => {
  const { bookingId } = req.body;
  const {
    error,
    data,
    statusCode
  } = await bookingService.cancelBooking(bookingId);

  if (error) return response.error(res, error, statusCode);

  return response.success(res, data, statusCode);
};
