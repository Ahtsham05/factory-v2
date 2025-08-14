import { z } from 'zod';

export const transactionSchema = z.object({
  _id: z.string().optional(),
  id: z.string().optional(), // Assuming 'id' is a string, adjust if it's a different type
  account: z.object({
    _id: z.string().optional(),
    id: z.string().optional(), // Assuming 'id' is a string, adjust if it's a different type
    name: z.string().optional(),
  }),
  amount: z.number().min(0, { message: 'Amount must be positive' }),
  transactionType: z.enum(['cashReceived', 'expenseVoucher']),
  transactionDate: z.string().optional(),
  description: z.string().optional(),
  transactionId: z.string().optional(),
  status: z.enum(['pending', 'completed']).optional(),
  debit: z.number().optional(),
  credit: z.number().optional(),
  qty: z.number().optional(),
  price: z.number().optional(),
});

export const transactionListSchema = z.array(transactionSchema);

export type Transaction = z.infer<typeof transactionSchema>;
export type User = z.infer<typeof transactionSchema>;
export type Supplier = z.infer<typeof transactionSchema>; // Assuming Supplier has the same structure as Transaction
export type TransactionList = z.infer<typeof transactionListSchema>;
