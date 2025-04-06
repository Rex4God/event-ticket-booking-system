const bookingService = require("../app/services/BookingService");
const Event = require("../app/models/Event");
const Booking = require("../app/models/Booking");
const Wait = require("../app/models/WaitingList");
const sequelize = require("../app/database/db");



jest.mock("../app/models/Event", () => ({
  findByPk: jest.fn(),
}));
jest.mock("../app/models/Booking", () => ({
  findOne: jest.fn(), 
  create: jest.fn(),
  findByPk: jest.fn(),
}));
jest.mock("../app/models/WaitingList", () => ({
  findOne: jest.fn(),
  count: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
}));
jest.mock("../app/database/db", () => ({
  transaction: jest.fn(),
}));


sequelize.transaction.mockImplementation((fn) => fn({ transaction: true }));

describe("BookingService", () => {
  afterEach(() => jest.clearAllMocks());

  describe("bookTicket", () => {
    it("should return error if event not found", async () => {
      Event.findByPk.mockResolvedValue(null);
      const res = await bookingService.bookTicket(1, 2, 1);
      expect(res.statusCode).toBe(404);
    });

    it("should create booking if tickets are available", async () => {
      Event.findByPk.mockResolvedValue({
        price: 100,
        availableTickets: 5,
        save: jest.fn().mockResolvedValue(true),
      });
      Booking.findOne.mockResolvedValue(null); 
      Booking.create.mockResolvedValue({ bookingId: 1 });
      const res = await bookingService.bookTicket(1, 2, 2);
      expect(res.statusCode).toBe(201);
    });

    it("should add to waiting list if no tickets", async () => {
      Event.findByPk.mockResolvedValue({
        price: 100, 
        availableTickets: 0,
      });
      Booking.findOne.mockResolvedValue(null);
      Wait.count.mockResolvedValue(3);
      Wait.create.mockResolvedValue({});
      const res = await bookingService.bookTicket(1, 2, 2);
      expect(res.statusCode).toBe(200);
    });
  });

  describe("cancelBooking", () => {
    it("should return error if booking not found", async () => {
      Booking.findByPk.mockResolvedValue(null);
      const res = await bookingService.cancelBooking(1);
      expect(res.statusCode).toBe(404);
    });

    it("should assign ticket to next in waiting list", async () => {
      Booking.findByPk.mockResolvedValue({
        destroy: jest.fn().mockResolvedValue(true),
        eventId: 1,
        num_tickets: 2,
      });
      Event.findByPk.mockResolvedValue({ price: 100 });
      Wait.findOne.mockResolvedValue({
        userId: 3,
        position: 1,
        destroy: jest.fn().mockResolvedValue(true),
      });
      Booking.findOne.mockResolvedValue(null);
      Booking.create.mockResolvedValue({ bookingId: 2 });
      Wait.update.mockResolvedValue([1]); 
      const res = await bookingService.cancelBooking(1);
    });

    it("should return ticket to pool if no waiting user", async () => {
      Booking.findByPk.mockResolvedValue({
        destroy: jest.fn().mockResolvedValue(true),
        eventId: 1,
        num_tickets: 1,
      });
      Event.findByPk.mockResolvedValue({
        save: jest.fn().mockResolvedValue(true),
      });
      Wait.findOne.mockResolvedValue(null);
      const res = await bookingService.cancelBooking(1);
      expect(res.data.message).toMatch(/ticket returned/);
    });
  });
});