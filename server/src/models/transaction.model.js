const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const TransactionSchema = new mongoose.Schema({
  account: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true }, // Account associated with the transaction
  amount: { type: Number, required: true },
  transactionType: { type: String, enum: ['cashReceived', 'expenseVoucher'], required: true }, // Cash received or Expense Voucher
  transactionDate: { type: Date, default: Date.now },
  description: { type: String }, // Optional description for the transaction
  status: { type: String, enum: ['pending', 'completed'], default: 'pending' }, // Transaction status
  transactionId: { type: String }, // Optional transaction ID
  price: { type: Number }, // Price of the transaction
  qty: { type: Number }, // Quantity involved in the transaction
  debit: { type: Number }, // Debit amount for the transaction
  credit: { type: Number }, // Credit amount for the transaction
}, {
  timestamps: true,
});

// Add plugin that converts mongoose to JSON
TransactionSchema.plugin(toJSON);
TransactionSchema.plugin(paginate);

const Transaction = mongoose.model('Transaction', TransactionSchema);

module.exports = Transaction;
