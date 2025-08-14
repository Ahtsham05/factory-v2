import { z } from 'zod';

export const roznamchaSchema = z.object({
  _id: z.string().optional(),
  id: z.string().optional(),
  description: z.string().min(1, { message: 'Description is required' }),
  transactionType: z.enum(['cashReceived', 'expenseVoucher']),
  status: z.enum(['pending', 'completed']).optional(),
  debit: z.number().min(0, { message: 'Debit must be positive' }).optional(),
  credit: z.number().min(0, { message: 'Credit must be positive' }).optional(),
  entryDate: z.string().optional(),
  referenceNumber: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const roznamchaListSchema = z.array(roznamchaSchema);

export type Roznamcha = z.infer<typeof roznamchaSchema>;
export type RoznamchaList = z.infer<typeof roznamchaListSchema>;
