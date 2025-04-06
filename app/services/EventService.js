const { StatusCodes } = require('http-status-codes');
const Event = require('../models/Event');
const Wait = require('../models/WaitingList');
const { logger } = require('../utils/logger');
const eventValidator = require('../validators/EventValidator');

exports.createEvent = async (body) => {
  try {
    const validatorError = await eventValidator.createEvent(body);

    if (validatorError) {
      return {
        error: validatorError,
        statusCode: StatusCodes.UNPROCESSABLE_ENTITY
      };
    }

    const event = await Event.create({
      title: body.title,
      eventImage: body.eventImage,
      description: body.description,
      eventDate: body.eventDate,
      eventTime: body.eventTime,
      price: body.price,
      totalTickets: body.totalTickets,
      availableTickets: body.availableTickets,
      location: body.location,
      status: body.status
    });

    return {
      data: event,
      statusCode: StatusCodes.CREATED
    };
  } catch (e) {
    logger.log({
      level: 'error',
      message: 'Error occurred while trying to create event. Please try again later',
      error: e
    });
    return {
      error: e.message,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    };
  }
};

exports.getEventStatus = async (eventId) => {
  try {
    const event = await Event.findByPk(eventId);

    if (!event) {
      return {
        error: 'Oops! This event  does not exist or has been deleted.',
        statusCode: StatusCodes.NOT_FOUND
      };
    }

    const waitingListCount = await Wait.count({
      where: { eventId }
    });

    if (!waitingListCount) {
      return {
        error: 'Oops! This event does not have any waiting list.',
        statusCode: StatusCodes.NOT_FOUND
      };
    }

    return {
      data: {
        availableTickets: event.availableTickets,
        waitingListCount,
      },
      statusCode: StatusCodes.OK
    };
  } catch (e) {
    logger.log({
      level: 'error',
      message: 'Error occurred while trying to get event status. Please try again later',
      error: e
    });
    return {
      error: e.message,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    };
  }
};
