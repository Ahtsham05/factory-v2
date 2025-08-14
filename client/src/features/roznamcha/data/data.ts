import {
  IconCash,
  IconReceiptTax,
} from '@tabler/icons-react'

export const statusTypes = new Map<any, string>([
  ['pending', 'bg-yellow-100/30 text-yellow-900 dark:text-yellow-200 border-yellow-200'],
  ['completed', 'bg-green-100/30 text-green-900 dark:text-green-200 border-green-200'],
])

export const transactionTypes = [
  {
    label: 'Cash Received',
    value: 'cashReceived',
    icon: IconCash,
  },
  {
    label: 'Expense Voucher',
    value: 'expenseVoucher',
    icon: IconReceiptTax,
  },
] as const
