import { createFileRoute } from '@tanstack/react-router'
import RoznamchaPage from '@/features/roznamcha'

export const Route = createFileRoute('/_authenticated/roznamcha/')({
  component: RoznamchaPage,
})
