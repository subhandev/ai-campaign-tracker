import CampaignTableClient from '@/features/campaigns/components/CampaignTableClient'
import { listCampaigns } from '@/server/campaigns/campaigns.service'

export default async function DashboardPage() {
  const { campaigns } = await listCampaigns("workspace-id") // replace later

  return <CampaignTableClient campaigns={campaigns} />
}