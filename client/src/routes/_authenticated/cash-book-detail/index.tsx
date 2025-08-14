import { createFileRoute } from '@tanstack/react-router'
import CashBookDetail from '@/features/cash-book-detail'

export const Route = createFileRoute('/_authenticated/cash-book-detail/')({
  component: CashBookDetail,
})
