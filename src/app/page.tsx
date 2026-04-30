import { AppLayout } from '@/features/app-shell/AppLayout'
import { CampaignTable } from '@/features/campaigns/components/CampaignTable'

export default function Home() {
  return (
    <AppLayout>
      <CampaignTable />
    </AppLayout>
  )
}