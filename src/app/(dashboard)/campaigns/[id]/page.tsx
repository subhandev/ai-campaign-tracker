"use client";

import { use } from "react";
import { CampaignDetail } from "@/features/campaigns/components/CampaignDetail";
import { useCampaign } from "@/features/campaigns/hooks/useCampaigns";

export default function CampaignDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { campaign, loading, error } = useCampaign(id);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <p className="text-sm text-muted-foreground">Loading campaign...</p>
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <p className="text-sm text-destructive">
          {error ?? "Campaign not found"}
        </p>
      </div>
    );
  }

  return <CampaignDetail campaign={campaign} />;
}