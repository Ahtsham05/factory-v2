const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { roznamchaService } = require('../services');

const createRoznamcha = catchAsync(async (req, res) => {
  const roznamcha = await roznamchaService.createRoznamcha(req.body);
  res.status(httpStatus.CREATED).send(roznamcha);
});

const getRoznamchas = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['description', 'status', 'transactionType']);
  const options = pick(req.query, ['sortBy', 'limit', 'page', 'search', 'fieldName']);
  
  // Handle date filtering
  if (req.query.date) {
    const selectedDate = new Date(req.query.date);
    const startOfDay = new Date(selectedDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(selectedDate.setHours(23, 59, 59, 999));
    
    filter.entryDate = {
      $gte: startOfDay,
      $lte: endOfDay
    };
  }
  
  const result = await roznamchaService.queryRoznamchas(filter, options);
  res.send(result);
});

const getRoznamcha = catchAsync(async (req, res) => {
  const roznamcha = await roznamchaService.getRoznamchaById(req.params.roznamchaId);
  if (!roznamcha) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Roznamcha entry not found');
  }
  res.send(roznamcha);
});

const updateRoznamcha = catchAsync(async (req, res) => {
  const roznamcha = await roznamchaService.updateRoznamchaById(req.params.roznamchaId, req.body);
  res.send(roznamcha);
});

const deleteRoznamcha = catchAsync(async (req, res) => {
  await roznamchaService.deleteRoznamchaById(req.params.roznamchaId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createRoznamcha,
  getRoznamchas,
  getRoznamcha,
  updateRoznamcha,
  deleteRoznamcha,
};
