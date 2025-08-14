const httpStatus = require('http-status');
const { Roznamcha } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a roznamcha entry
 * @param {Object} roznamchaBody
 * @returns {Promise<Roznamcha>}
 */
const createRoznamcha = async (roznamchaBody) => {
  return Roznamcha.create(roznamchaBody);
};

/**
 * Query for roznamcha entries
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryRoznamchas = async (filter, options) => {
  const roznamchas = await Roznamcha.paginate(filter, options);
  return roznamchas;
};

/**
 * Get roznamcha entry by id
 * @param {ObjectId} id
 * @returns {Promise<Roznamcha>}
 */
const getRoznamchaById = async (id) => {
  return Roznamcha.findById(id);
};

/**
 * Update roznamcha entry by id
 * @param {ObjectId} roznamchaId
 * @param {Object} updateBody
 * @returns {Promise<Roznamcha>}
 */
const updateRoznamchaById = async (roznamchaId, updateBody) => {
  const roznamcha = await getRoznamchaById(roznamchaId);
  if (!roznamcha) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Roznamcha entry not found');
  }
  Object.assign(roznamcha, updateBody);
  await roznamcha.save();
  return roznamcha;
};

/**
 * Delete roznamcha entry by id
 * @param {ObjectId} roznamchaId
 * @returns {Promise<Roznamcha>}
 */
const deleteRoznamchaById = async (roznamchaId) => {
  const roznamcha = await getRoznamchaById(roznamchaId);
  if (!roznamcha) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Roznamcha entry not found');
  }
  await roznamcha.deleteOne();
  return roznamcha;
};

module.exports = {
  createRoznamcha,
  queryRoznamchas,
  getRoznamchaById,
  updateRoznamchaById,
  deleteRoznamchaById,
};
