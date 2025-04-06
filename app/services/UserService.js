const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const userValidator = require('../validators/UserValidator');
const { logger } = require('../utils/logger');

exports.createUser = async (body) => {
  try {
    const validatorError = await userValidator.createUser(body);

    if (validatorError) {
      return {
        error: validatorError,
        statusCode: StatusCodes.UNPROCESSABLE_ENTITY
      };
    }

    const { email } = body;

    const alreadyExistsUser = await User.findOne({
      where: { email }
    });

    if (alreadyExistsUser) {
      return {
        error: 'User already exist in the database',
        statusCode: StatusCodes.CONFLICT
      };
    }

    const user = await User.create({
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      phoneNumber: body.phoneNumber,
      password: body.password
    });

    return {
      data: {
        user: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          userId: user.userId
        }
      },
      statusCode: StatusCodes.CREATED
    };
  } catch (e) {
    logger.log({
      level: 'error',
      message: 'Error occurred while trying to create a user. Please try again later',
      error: e
    });
    return {
      error: e.message,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR
    };
  }
};

exports.login = async (body) => {
  try {
    const validatorError = await userValidator.loginUser(body);

    if (validatorError) {
      return {
        error: validatorError,
        statusCode: StatusCodes.UNPROCESSABLE_ENTITY
      };
    }

    const { email, password } = body;

    if (!email || !password) {
      return {
        error: 'Please provide your email and password',
        statusCode: StatusCodes.UNPROCESSABLE_ENTITY
      };
    }

    const user = await User.findOne({
      where: { email }
    });

    if (!user) {
      return {
        error: 'Invalid Credential',
        statusCode: StatusCodes.BAD_REQUEST
      };
    }

    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
      return {
        error: 'Invalid Credential',
        statusCode: StatusCodes.BAD_REQUEST
      };
    }

    const token = jwt.sign(
      { userId: user.userId },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_LIFETIME,
        algorithm: 'HS256'
      }
    );

    return {
      data: {
        user: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          userId: user.userId
        },
        token
      },
      statusCode: StatusCodes.OK
    };
  } catch (e) {
    logger.log({
      level: 'error',
      message: 'Error occurred while trying to logging a user. Please try again later',
      error: e
    });
    return {
      error: e.message,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR
    };
  }
};
