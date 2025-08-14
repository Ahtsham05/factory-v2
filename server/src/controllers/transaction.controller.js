const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { transactionService } = require('../services');
const pick = require('../utils/pick');

const createTransaction = catchAsync(async (req, res) => {
  const transaction = await transactionService.createTransaction(req.body);
  res.status(httpStatus.CREATED).send(transaction);
});

const createVoucher = catchAsync(async (req, res) => {
  const voucher = await transactionService.createVoucher(req.body);
  res.status(httpStatus.CREATED).send(voucher);
});

const getTransactions = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['transactionType', 'account', 'transactionId']);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'search', 'fieldName']);
  const result = await transactionService.queryTransactions(filter, options);
  res.send(result);
});

const updateTransaction = catchAsync(async (req, res) => {
  const transaction = await transactionService.updateTransactionById(req.params.transactionId, req.body);
  res.send(transaction);
});

const getTransaction = catchAsync(async (req, res) => {
  const transaction = await transactionService.getTransactionById(req.params.transactionId);
  if (!transaction) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Transaction not found');
  }
  res.send(transaction);
});

const getVouchers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['expenseType']);
  const options = pick(req.query, ['limit', 'page', 'sortBy']);
  const result = await transactionService.queryVouchers(filter, options);
  res.send(result);
});

const getLedgerEntries = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['account']);
  const options = pick(req.query, ['limit', 'page', 'sortBy']);
  const result = await transactionService.queryLedgerEntries(filter, options);
  res.send(result);
});

const getTransactionsByDate = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['startDate', 'endDate']);
  const result = await transactionService.queryTransactionsByDate(filter);
  res.send(result);
});

const deleteTransaction = catchAsync(async (req, res) => {
  const transaction = await transactionService.getTransactionById(req.params.transactionId);
  if (!transaction) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Transaction not found');
  }
  await transaction.remove();
  // res.status(httpStatus.NO_CONTENT).send();
  res.status(200).send({success: true, message: 'Transaction deleted successfully'});
});

const getTodayAndPreviousBalance = async (req, res) => {
  const { date } = req.query; // date is optional
  const result = await transactionService.getTodayAndPreviousBalance(date);
  res.json(result);
};

const getAllSupplierBalances = catchAsync(async (req, res) => {
  const result = await transactionService.getAllSupplierBalances();
  res.send(result);
})

// get All transactions of a particular account from a specific date range from start date to end date and also give all previous balance of account
const getAccountTransactionsWithPreviousBalance = catchAsync(async (req, res) => {
  const result = await transactionService.getAccountTransactionsWithPreviousBalance(req.query);
  res.send(result);
})

module.exports = {
  createTransaction,
  createVoucher,
  getTransactions,
  getVouchers,
  getLedgerEntries,
  getTransactionsByDate,
  getTransaction,
  updateTransaction,
  deleteTransaction,
  getTodayAndPreviousBalance,
  getAccountTransactionsWithPreviousBalance,
  getAllSupplierBalances
};
