const { StatusCodes } = require('http-status-codes');
const { Op } = require('sequelize');
const Booking = require('../models/Booking');
const Event = require('../models/Event');
const Wait = require('../models/WaitingList');
const sequelize = require('../database/db');
const { logger } = require('../utils/logger');
const { BOOKING_STATUS, PAYMENT_STATUS } = require('../utils/constant');

exports.bookTicket = async (eventId, userId, num_tickets) => {
  try {
    return await sequelize.transaction(async (t) => {
      const event = await Event.findByPk(eventId, { transaction: t });

      if (!event) {
        return {
          error: 'Oops! This event does not exist or has been deleted.',
          statusCode: StatusCodes.NOT_FOUND,
        };
      }

      const existingBooking = await Booking.findOne({
        where: {
          userId,
          eventId
        },
        transaction: t,
      });
      if (existingBooking) {
        return {
          error: 'You have already booked a ticket for this event.',
          statusCode: StatusCodes.CONFLICT,
        };
      }

      if (event.availableTickets < num_tickets) {
        const position = (await Wait.count({ where: { eventId }, transaction: t })) + 1;
        await Wait.create({
          eventId,
          userId,
          position
        }, { transaction: t });
        logger.info(`User ${userId} added to waiting list for event ${eventId} at position ${position}`);

        return {
          data: {
            message: 'No tickets available. Added to waiting list',
            position
          },
          statusCode: StatusCodes.OK,
        };
      }

      const total_price = event.price * num_tickets;
      const payment_status = PAYMENT_STATUS.PENDING;
      const booking_status = BOOKING_STATUS.CONFIRMED;
      const expires_at = new Date(Date.now() + 24 * 60 * 60 * 1000);

      const booking = await Booking.create(
        {
          eventId,
          userId,
          num_tickets,
          total_price,
          payment_status,
          booking_status,
          expires_at,
        },
        { transaction: t }
      );

      event.availableTickets -= num_tickets;
      await event.save({ transaction: t });
      logger.info(`Ticket booked for user ${userId} for event ${eventId}`);

      return {
        data: {
          booking_status,
          bookingId: booking.bookingId
        },
        statusCode: StatusCodes.CREATED,
      };
    });
  } catch (e) {
    logger.log({
      level: 'error',
      message: 'An unknown error occurred while trying to book ticket. Please try again later',
      error: e,
    });
    return {
      error: e.message,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    };
  }
};

exports.cancelBooking = async (bookingId) => {
  try {
    return await sequelize.transaction(async (t) => {
      const booking = await Booking.findByPk(bookingId, { transaction: t });

      if (!booking) {
        return {
          error: 'Oops! This booking does not exist or has been deleted.',
          statusCode: StatusCodes.NOT_FOUND,
        };
      }

      const event = await Event.findByPk(booking.eventId, { transaction: t });

      if (!event) {
        return {
          error: 'Associated event does not exist or has been deleted.',
          statusCode: StatusCodes.NOT_FOUND,
        };
      }

      const numTickets = booking.num_tickets;

      const waitingUser = await Wait.findOne({
        where: { eventId: booking.eventId },
        order: [['position', 'ASC']],
        transaction: t,
      });

      if (waitingUser) {
        const total_price = event.price * numTickets;
        const payment_status = PAYMENT_STATUS.PENDING;
        const booking_status = BOOKING_STATUS.CONFIRMED;
        const expires_at = new Date(Date.now() + 24 * 60 * 60 * 1000);

        const waitingUserExistingBooking = await Booking.findOne({
          where: {
            userId: waitingUser.userId,
            eventId: booking.eventId
          },
          transaction: t,
        });

        if (waitingUserExistingBooking) {
          return {
            error: 'Waiting user already has a booking for this event.',
            statusCode: StatusCodes.CONFLICT,
          };
        }

        const newBooking = await Booking.create(
          {
            eventId: booking.eventId,
            userId: waitingUser.userId,
            num_tickets: numTickets,
            total_price,
            payment_status,
            booking_status,
            expires_at,
          },
          { transaction: t }
        );

        const waitingPosition = waitingUser.position;
        await waitingUser.destroy({ transaction: t });

        await Wait.update({ position: sequelize.literal('position - 1') },
          {
            where: {
              eventId: booking.eventId,
              position: { [Op.gt]: waitingPosition }
            },
            transaction: t,
          });

        await booking.destroy({ transaction: t });
        logger.info(`Booking ${bookingId} cancelled, ticket assigned to ${waitingUser.userId}`);

        return {
          data: {
            booking_status: BOOKING_STATUS.CANCELED,
            message: 'Booking cancelled, ticket assigned to waiting user',
            assignedTo: waitingUser.userId,
            newBookingId: newBooking.bookingId,
          },
          statusCode: StatusCodes.OK,
        };
      }
      event.availableTickets += numTickets;
      await event.save({ transaction: t });

      await booking.destroy({ transaction: t });
      logger.info(`Booking ${bookingId} cancelled, ticket returned to pool`);

      return {
        data: {
          booking_status: BOOKING_STATUS.CANCELED,
          message: 'Booking cancelled, ticket returned to pool',
        },
        statusCode: StatusCodes.OK,
      };
    });
  } catch (e) {
    logger.log({
      level: 'error',
      message: 'An unknown has occurred while trying to cancel booking. Please try again later',
      error: e,
    });
    return {
      error: e.message,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    };
  }
};
