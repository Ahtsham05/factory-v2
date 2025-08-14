const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const transactionValidation = require('../../validations/transaction.validation');
const transactionController = require('../../controllers/transaction.controller');

const router = express.Router();

router
  .route('/')
  .post(auth('manageTransactions'), validate(transactionValidation.createTransaction), transactionController.createTransaction)
  .get(auth('getTransactions'), validate(transactionValidation.getTransactions), transactionController.getTransactions);

router
  .route('/cashbook')
  .get(auth('getTransactions'), transactionController.getTodayAndPreviousBalance);

router
  .route('/party-detail')
  .get(auth('getTransactions'), transactionController.getAllSupplierBalances);

router
 .route('/party-ledger')
 .get(auth('getTransactions'), validate(transactionValidation.getAccountTransactionsWithPreviousBalance), transactionController.getAccountTransactionsWithPreviousBalance);

router
  .route('/:transactionId')
  .get(auth('getTransaction'), validate(transactionValidation.getTransaction), transactionController.getTransaction)
  .patch(auth('manageTransactions'), validate(transactionValidation.updateTransaction), transactionController.updateTransaction)
  .delete(auth('manageTransactions'), validate(transactionValidation.deleteTransaction), transactionController.deleteTransaction);

router
  .route('/vouchers')
  .post(auth('manageVouchers'), validate(transactionValidation.createVoucher), transactionController.createVoucher)
  .get(auth('getVouchers'), validate(transactionValidation.getVouchers), transactionController.getVouchers);

router
  .route('/ledger')
  .get(auth('getTransaction'), validate(transactionValidation.getLedgerEntries), transactionController.getLedgerEntries);

router 
  .route('/date')
  .get(auth('getLedger'), validate(transactionValidation.getTransactionsByDate), transactionController.getTransactionsByDate);



module.exports = router;
