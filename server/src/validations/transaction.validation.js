const Joi = require('joi');

const createTransaction = {
  body: Joi.object().keys({
    account: Joi.string().required(),
    amount: Joi.number().required(),
    transactionType: Joi.string().valid('cashReceived', 'expenseVoucher').required(),
    transactionDate: Joi.date().optional(),
    description: Joi.string().optional(),
    status: Joi.string().valid('pending', 'completed').optional(),
    transactionId: Joi.string().optional(),
    price: Joi.number().optional(),
    qty: Joi.number().optional(),
    debit: Joi.number().optional(),
    credit: Joi.number().optional(),
  }),
};

const getTransactionsByDate = {
  query: Joi.object().keys({
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
  }),
};

const getTransactions = {
  query: Joi.object().keys({
    account: Joi.string(),
    transactionType: Joi.string().valid('cashReceived', 'expenseVoucher'),
    status: Joi.string().valid('pending', 'completed'),
    limit: Joi.number(),
    page: Joi.number(),
    sortBy: Joi.string(),
    search: Joi.string(),
    fieldName: Joi.string(),
    populate: Joi.string().optional(),
    transactionDate: Joi.date().optional(),
    transactionId: Joi.string().optional(),
  }),
};

const getTransaction = {
  params: Joi.object().keys({
    transactionId: Joi.string().required(),
  }),
};

const getTodayAndPreviousBalance = {}

const updateTransaction = {
  params: Joi.object().keys({
    transactionId: Joi.string().required(),
  }),
  body: Joi.object().keys({
    _id: Joi.string(),
    account: Joi.string(),
    amount: Joi.number(),
    transactionType: Joi.string().valid('cashReceived', 'expenseVoucher'),
    transactionDate: Joi.date(),
    description: Joi.string(),
    status: Joi.string().valid('pending', 'completed'),
    transactionId: Joi.string().allow('', null).optional(),
    price: Joi.number(),
    qty: Joi.number(),
    debit: Joi.number(),
    credit: Joi.number(),
  }),
};

const deleteTransaction = {
  params: Joi.object().keys({
    transactionId: Joi.string().required(),
  }),
};

const getAccountTransactionsWithPreviousBalance = {
  query: Joi.object().keys({
    accountId: Joi.string().required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
  })
}

module.exports = {
  createTransaction,
  getTransactions,
  getTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactionsByDate,
  getTodayAndPreviousBalance,
  getAccountTransactionsWithPreviousBalance
};