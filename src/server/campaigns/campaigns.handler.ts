import { createCampaignService } from './campaigns.service'

export async function handleCreateCampaign(body: any) {
  try {
    const campaign = await createCampaignService(body)

    return {
      status: 201,
      body: campaign,
    }
  } catch (error: any) {
    return {
      status: 400,
      body: {
        error: error.message || 'Something went wrong',
      },
    }
  }
}

import { getCampaignsService } from './campaigns.service'

export async function handleGetCampaigns() {
  try {
    const campaigns = await getCampaignsService()

    return {
      status: 200,
      body: campaigns,
    }
  } catch (error: any) {
    return {
      status: 500,
      body: { error: 'Failed to fetch campaigns' },
    }
  }
}