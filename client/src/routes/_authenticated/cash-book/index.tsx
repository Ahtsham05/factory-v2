import { createFileRoute } from '@tanstack/react-router'
import CashBook from '@/features/cash-book'

export const Route = createFileRoute('/_authenticated/cash-book/')({
  component: CashBook,
})
