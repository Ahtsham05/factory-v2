const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const RoznamchaSchema = new mongoose.Schema({
  description: { type: String, required: true }, // Description of the journal entry
  transactionType: { type: String, enum: ['cashReceived', 'expenseVoucher'], required: true }, // Cash received or Expense Voucher
  status: { type: String, enum: ['pending', 'completed'], default: 'pending' }, // Entry status
  debit: { type: Number, default: 0 }, // Debit amount
  credit: { type: Number, default: 0 }, // Credit amount
  entryDate: { type: Date, default: Date.now }, // Date of the journal entry
  referenceNumber: { type: String }, // Optional reference number
}, {
  timestamps: true,
});

// Add plugin that converts mongoose to JSON
RoznamchaSchema.plugin(toJSON);
RoznamchaSchema.plugin(paginate);

const Roznamcha = mongoose.model('Roznamcha', RoznamchaSchema);

module.exports = Roznamcha;
