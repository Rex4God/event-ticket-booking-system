const userService = require('../services/UserService');
const response = require('../utils/responses');

exports.createUser = async (req, res) => {
  const {
    error,
    data,
    statusCode
  } = await userService.createUser(req.body);

  if (error) return response.error(res, error, statusCode);

  return response.success(res, data, statusCode);
};

exports.login = async (req, res) => {
  const {
    error,
    data,
    statusCode,
  } = await userService.login(req.body);

  if (error) return response.error(res, error, statusCode);

  return response.success(res, data, statusCode);
};
