"use strict"
const eventService = require("../app/services/EventService");
const Event = require("../app/models/Event");
const Wait = require("../app/models/WaitingList");
const eventValidator = require("../app/validators/EventValidator");

jest.mock("../app/models/Event");
jest.mock("../app/models/WaitingList")
jest.mock("../app/validators/EventValidator");

describe('EventService', () => {
  afterEach(() => jest.clearAllMocks());

  describe('createEvent', () => {
    it('should return validation error', async () => {
      eventValidator.createEvent.mockResolvedValue('Invalid');
      const result = await eventService.createEvent({});
      expect(result.error).toBe('Invalid');
    });

    it('should create and return event', async () => {
      const body = { title: 'Concert' };
      eventValidator.createEvent.mockResolvedValue(null);
      Event.create.mockResolvedValue(body);
      const result = await eventService.createEvent(body);
      expect(result.statusCode).toBe(201);
    });
  });

  describe('getEventStatus', () => {
    it('should return error if event not found', async () => {
      Event.findByPk.mockResolvedValue(null);
      const result = await eventService.getEventStatus(1);
      expect(result.statusCode).toBe(404);
    });

    it('should return error if waiting list empty', async () => {
      Event.findByPk.mockResolvedValue({ availableTickets: 0 });
      Wait.count.mockResolvedValue(0);
      const result = await eventService.getEventStatus(1);
      expect(result.statusCode).toBe(404);
    });

    it('should return event status', async () => {
      Event.findByPk.mockResolvedValue({ availableTickets: 5 });
      Wait.count.mockResolvedValue(10);
      const result = await eventService.getEventStatus(1);
      expect(result.data.waitingListCount).toBe(10);
    });
  });
});
