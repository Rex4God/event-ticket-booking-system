const Joi = require('joi');
const { isEmpty } = require('lodash');

const dataToBeRemovedArray = ['', null, undefined];

/**
 * @param {object} value
 * @returns {object}
 */
function removeFieldsWithEmptyValue(value) {
  if (typeof value !== 'object' || value === null) return value;

  const result = Array.isArray(value) ? [] : {};

  Object.entries(value).forEach(([key, val]) => {
    if (dataToBeRemovedArray.includes(val)) return;

    if (Array.isArray(val)) {
      result[key] = val.map(removeFieldsWithEmptyValue);
    } else if (typeof val === 'object' && val !== null) {
      result[key] = removeFieldsWithEmptyValue(val);
    } else {
      result[key] = val;
    }
  });

  return result;
}

exports.removeFieldsWithEmptyValue = removeFieldsWithEmptyValue;
exports.isEmpty = isEmpty;

exports.validate = (schema, payload) => {
  schema = Joi.object(schema);
  const { error } = schema.validate(payload, {
    allowUnknown: true,
  });

  if (error) return error.details[0].message.replace(/['"]/g, '');

  return null;
};
