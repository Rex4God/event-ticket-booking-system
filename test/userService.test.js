"use strict";
const userService = require("../app/services/UserService");
const User = require("../app/models/User");
const userValidator = require("../app/validators/UserValidator");
const jwt = require('jsonwebtoken');

jest.mock("../app/models/User");
jest.mock("../app/validators/UserValidator");
jest.mock('jsonwebtoken');


describe('UserService', () => {
  afterEach(() => jest.clearAllMocks());

  describe('createUser', () => {
    it('should return validation error', async () => {
      userValidator.createUser.mockResolvedValue('Validation error');
      const result = await userService.createUser({});
      expect(result.error).toBe('Validation error');
    });

    it('should return conflict if user already exists', async () => {
      userValidator.createUser.mockResolvedValue(null);
      User.findOne.mockResolvedValue({});
      const result = await userService.createUser({ email: 'test@example.com' });
      expect(result.statusCode).toBe(409);
    });

    it('should create and return user data', async () => {
      const body = {
        firstName: 'Janelle', lastName: 'Precious', email: 'janelle@gmail.com',
        phoneNumber: '12345', password: 'pass'
      };
      userValidator.createUser.mockResolvedValue(null);
      User.findOne.mockResolvedValue(null);
      User.create.mockResolvedValue({ ...body, userId: 1 });
      const result = await userService.createUser(body);
      expect(result.statusCode).toBe(201);
      expect(result.data.user.email).toBe(body.email);
    });
  });

  describe('login', () => {
    it('should return validation error', async () => {
      userValidator.loginUser.mockResolvedValue('Validation error');
      const result = await userService.login({});
      expect(result.statusCode).toBe(422);
    });

    it('should return error if user not found', async () => {
      userValidator.loginUser.mockResolvedValue(null);
      User.findOne.mockResolvedValue(null);
      const result = await userService.login({ email: 'noonexist@gmail.com', password: 'Testable' });
      expect(result.statusCode).toBe(400);
    });

    it('should return error if password mismatch', async () => {
      userValidator.loginUser.mockResolvedValue(null);
      const mockUser = { comparePassword: jest.fn().mockResolvedValue(false) };
      User.findOne.mockResolvedValue(mockUser);
      const result = await userService.login({ email: 'test@gmail.com', password: 'bad' });
      expect(result.statusCode).toBe(400);
    });

    it('should return user and token on success', async () => {
      const user = {
        firstName: 'Janelle', lastName: 'Precious', email: 'janelle@gmail.com',
        phoneNumber: '07084176324', userId: 2, comparePassword: jest.fn().mockResolvedValue(true)
      };
      jwt.sign.mockReturnValue('mock-token');
      userValidator.loginUser.mockResolvedValue(null);
      User.findOne.mockResolvedValue(user);
      const result = await userService.login({ email: user.email, password: 'good' });
      expect(result.data.token).toBe('mock-token');
    });
  });
});
