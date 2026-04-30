export async function getCampaigns() {
  const res = await fetch('/api/campaigns')

  if (!res.ok) {
    throw new Error('Failed to fetch campaigns')
  }

  return res.json()
}