import { createFileRoute } from '@tanstack/react-router'
import PartyDetail from '@/features/party-detail'

export const Route = createFileRoute('/_authenticated/party-detail/')({
  component: PartyDetail,
})
