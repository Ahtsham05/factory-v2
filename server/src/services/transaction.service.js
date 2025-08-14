const httpStatus = require('http-status');
const { Transaction, Account, GeneralLedger, Voucher, Supplier } = require('../models');
const ApiError = require('../utils/ApiError');
const mongoose = require('mongoose');
/**
 * Create a transaction (cash received or expense voucher)
 * @param {Object} transactionBody
 * @returns {Promise<Transaction>}
 */
const createTransaction = async (transactionBody) => {
  const { account, amount, transactionType } = transactionBody;

  // Retrieve the associated supplier
  const supplierRecord = await Supplier.findById(account);
  if (!supplierRecord) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Supplier not found');
  }

  // Create the transaction record
  const transaction = await Transaction.create({...transactionBody, debit: transactionType === 'cashReceived' ? amount : 0, credit: transactionType === 'expenseVoucher' ? amount : 0});

  // Update supplier balance based on transaction type
  // if (transactionType === 'cashReceived') {
  //   supplierRecord.balance += amount;
  // } else if (transactionType === 'expenseVoucher') {
  //   supplierRecord.balance -= amount;
  // }

  // await supplierRecord.save();

  // // Create a general ledger entry
  // await GeneralLedger.create({
  //   account: supplierRecord._id,
  //   debit: transactionType === 'expenseVoucher' ? amount : 0,
  //   credit: transactionType === 'cashReceived' ? amount : 0,
  //   balance: supplierRecord.balance,
  //   description: transaction.description,
  // });

  return transaction;
};

/**
 * Create a voucher (expense)
 * @param {Object} voucherBody
 * @returns {Promise<Voucher>}
 */
const createVoucher = async (voucherBody) => {
  const { account, amount } = voucherBody;

  // Create the voucher record
  const voucher = await Voucher.create(voucherBody);

  // Update account balance for expense
  const accountRecord = await Account.findById(account);
  accountRecord.balance -= amount;

  await accountRecord.save();

  // Log the voucher in the general ledger
  await GeneralLedger.create({
    account: accountRecord._id,
    debit: amount,
    credit: 0,
    balance: accountRecord.balance,
    description: voucher.description,
  });

  return voucher;
};

/**
 * Query for transactions
 * @param {Object} filter
 * @param {Object} options
 * @returns {Promise<QueryResult>}
 */
const queryTransactions = async (filter, options) => {
   options.populate = 'account';
  const transactions = await Transaction.paginate(filter, options);
  return transactions;
};

const queryTransactionsByDate = async (filter) => {
  const transactions = await Transaction.find({
    transactionDate:{
      $gte: new Date(filter.startDate),
      $lte: new Date(filter.endDate),
    },
  });
  return transactions;
};

/**
 * Query for vouchers
 * @param {Object} filter
 * @param {Object} options
 * @returns {Promise<QueryResult>}
 */
const queryVouchers = async (filter, options) => {
  const vouchers = await Voucher.paginate(filter, options);
  return vouchers;
};

/**
 * Query for general ledger entries
 * @param {Object} filter
 * @param {Object} options
 * @returns {Promise<QueryResult>}
 */
const queryLedgerEntries = async (filter, options) => {
  const ledgerEntries = await GeneralLedger.paginate(filter, options);
  return ledgerEntries;
};


/**
 * Get a transaction by ID
 * @param {ObjectId} id
 * @returns {Promise<Transaction>}
 */
const getTransactionById = async (id) => {
  const transaction = await Transaction.findById(id).populate('account');
  if (!transaction) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Transaction not found');
  }
  return transaction;
}

const updateTransactionById = async (id, updateBody) => {
  const transaction = await getTransactionById(id);
  Object.assign(transaction, {...updateBody, debit: updateBody?.transactionType === 'cashReceived' ? updateBody?.amount : 0, credit: updateBody?.transactionType === 'expenseVoucher' ? updateBody?.amount : 0});
  await transaction.save();
  return transaction;
};

const getTodayAndPreviousBalance = async (date) => {
    // Use provided date or default to today
    // console.log("date", date)
  let today;
  if (date) {
    today = new Date(date);
  } else {
    today = new Date();
  }
  today.setHours(0, 0, 0, 0);

  // 1. Previous balance (before today)
  const previousAgg = await Transaction.aggregate([
    {
      $match: {
        transactionDate: { $lt: today }
      }
    },
    {
      $group: {
        _id: null,
        totalCredit: { $sum: "$credit" },
        totalDebit: { $sum: "$debit" }
      }
    }
  ]);
  const previousBalance = (previousAgg[0]?.totalDebit || 0) - (previousAgg[0]?.totalCredit || 0);

  // 2. Today's transactions
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const todayTransactions = await Transaction.find({
    transactionDate: {
      $gte: today,
      $lt: tomorrow
    }
  }).populate('account');

  return {
    previousBalance,
    todayTransactions
  };
};

const getAccountTransactionsWithPreviousBalance = async ({ accountId, startDate, endDate }) => {
  // 1. Previous balance before startDate
// console.log({ accountId, startDate, endDate });

// Convert accountId to ObjectId if it's a string
  const accountObjectId = typeof accountId === 'string' ? mongoose.Types.ObjectId(accountId) : accountId;


  const previousAgg = await Transaction.aggregate([
    {
      $match: {
        account: accountObjectId,
        transactionDate: { $lt: new Date(startDate) }
      }
    },
    {
      $group: {
        _id: null,
        totalCredit: { $sum: "$credit" },
        totalDebit: { $sum: "$debit" }
      }
    }
  ]);
  console.log()
  const previousBalance = (previousAgg[0]?.totalDebit || 0) - (previousAgg[0]?.totalCredit || 0);

  // 2. Transactions in date range
  const transactions = await Transaction.find({
    account: accountObjectId,
    transactionDate: {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    }
  }).populate('account');

  return {
    previousBalance,
    transactions,
    account: await Supplier.findById(accountObjectId)
  };
};

const getAllSupplierBalances = async () => {
  // Get all suppliers
  // const suppliers = await Supplier.find();
  const suppliers = await Supplier.find({ name: { $ne: "Account" } });

  // Aggregate transactions to get total debit and credit for each supplier
  const balances = await Transaction.aggregate([
    {
      $group: {
        _id: "$account", // account is the supplier's ObjectId
        totalCredit: { $sum: "$credit" },
        totalDebit: { $sum: "$debit" }
      }
    }
  ]);

  // Map balances by supplier id for quick lookup
  const balanceMap = {};
  balances.forEach(b => {
    balanceMap[b._id.toString()] = {
      totalDebit: b.totalDebit || 0,
      totalCredit: b.totalCredit || 0,
      balance: (b.totalDebit || 0) - (b.totalCredit || 0)
    };
  });

  // Combine supplier info with their balance, totalDebit, and totalCredit
  const supplierBalances = suppliers.map(supplier => {
    const bal = balanceMap[supplier._id.toString()] || { totalDebit: 0, totalCredit: 0, balance: 0 };
    let status = "settled";
    if (bal.balance < 0) status = "receivable";
    else if (bal.balance > 0) status = "payable";
    return {
      _id: supplier._id,
      name: supplier.name,
      totalDebit: bal.totalDebit,
      totalCredit: bal.totalCredit,
      balance: bal.balance,
      status
    };
  });

  return supplierBalances;
};

module.exports = {
  createTransaction,
  createVoucher,
  queryTransactions,
  queryVouchers,
  queryLedgerEntries,
  queryTransactionsByDate,
  getTransactionById,
  updateTransactionById,
  getTodayAndPreviousBalance,
  getAccountTransactionsWithPreviousBalance,
  getAllSupplierBalances
};
