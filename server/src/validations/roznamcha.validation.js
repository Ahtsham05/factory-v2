const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createRoznamcha = {
  body: Joi.object().keys({
    description: Joi.string().required(),
    transactionType: Joi.string().valid('cashReceived', 'expenseVoucher').required(),
    status: Joi.string().valid('pending', 'completed').optional(),
    debit: Joi.number().min(0).optional(),
    credit: Joi.number().min(0).optional(),
    entryDate: Joi.date().optional(),
    referenceNumber: Joi.string().optional(),
  }),
};

const getRoznamchas = {
  query: Joi.object().keys({
    description: Joi.string(),
    transactionType: Joi.string(),
    status: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    search: Joi.string(),
    fieldName: Joi.string(),
    date: Joi.date(),
  }),
};

const getRoznamcha = {
  params: Joi.object().keys({
    roznamchaId: Joi.string().custom(objectId),
  }),
};

const updateRoznamcha = {
  params: Joi.object().keys({
    roznamchaId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      description: Joi.string().optional(),
      transactionType: Joi.string().valid('cashReceived', 'expenseVoucher').optional(),
      status: Joi.string().valid('pending', 'completed').optional(),
      debit: Joi.number().min(0).optional(),
      credit: Joi.number().min(0).optional(),
      entryDate: Joi.date().optional(),
      referenceNumber: Joi.string().optional(),
    })
    .min(1),
};

const deleteRoznamcha = {
  params: Joi.object().keys({
    roznamchaId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createRoznamcha,
  getRoznamchas,
  getRoznamcha,
  updateRoznamcha,
  deleteRoznamcha,
};
