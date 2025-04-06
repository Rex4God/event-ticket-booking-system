const Joi = require('joi');
const { validate } = require('../utils/helpers');

exports.createUser = async (body) => {
  const schema = {
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    phoneNumber: Joi.string().required(),
    password: Joi.string().min(8).max(15).required()
  };
  return validate(schema, body);
};

exports.loginUser = async (body) => {
  const schema = {
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(15).required()
  };

  return validate(schema, body);
};
