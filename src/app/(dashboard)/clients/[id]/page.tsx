"use client";

import { use, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ClientDetail } from "@/features/clients/components/ClientDetail";
import { ClientDetailSkeleton } from "@/features/clients/components/ClientDetailSkeleton";
import { useClient } from "@/features/clients/hooks/useClients";
import { Insight } from "@/features/campaigns/types";

export default function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const searchParams = useSearchParams();
  const initialEdit = searchParams.get("edit") === "true";
  const { client, loading, error, refresh } = useClient(id);

  const [insights, setInsights] = useState<Insight[]>([]);
  const [insightsLoading, setInsightsLoading] = useState(true);

  useEffect(() => {
    if (!client?.campaigns?.length) {
      setInsightsLoading(false);
      return;
    }

    async function loadInsights() {
      setInsightsLoading(true);
      try {
        const results = await Promise.all(
          (client!.campaigns ?? []).map((c) =>
            fetch(`/api/campaigns/${c.id}/insights`).then((r) => r.json())
          )
        );
        setInsights(results.flatMap((r) => r.insights ?? []));
      } finally {
        setInsightsLoading(false);
      }
    }

    loadInsights();
  }, [client]);

  if (loading || insightsLoading) return <ClientDetailSkeleton />;

  if (error || !client) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <p className="text-sm text-destructive">{error ?? "Client not found"}</p>
      </div>
    );
  }

  return (
    <ClientDetail
      client={client}
      insights={insights}
      initialEdit={initialEdit}
      onEditSuccess={refresh}
    />
  );
}
