"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Pencil,
  Plus,
  MoreHorizontal,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { EditClientForm } from "@/features/clients/components/EditClientForm";
import { Client, Campaign } from "@/features/clients/types";
import { Insight } from "@/features/campaigns/types";
import { useClientMutations } from "@/features/clients/hooks/useClients";
import { cn } from "@/lib/utils";

interface ClientDetailProps {
  client: Client;
  insights: Insight[];
  initialEdit?: boolean;
  onEditSuccess?: () => void;
}

const statusStyles = {
  active: "bg-green-50 text-green-700 border-green-200",
  inactive: "bg-zinc-100 text-zinc-500 border-zinc-200",
};

const campaignStatusStyles: Record<string, string> = {
  planned: "bg-blue-50 text-blue-700 border-blue-200",
  active: "bg-green-50 text-green-700 border-green-200",
  at_risk: "bg-orange-50 text-orange-700 border-orange-200",
  completed: "bg-zinc-100 text-zinc-500 border-zinc-200",
  archived: "bg-zinc-100 text-zinc-400 border-zinc-200",
};

const campaignStatusLabel: Record<string, string> = {
  planned: "Planned",
  active: "Active",
  at_risk: "At Risk",
  completed: "Completed",
  archived: "Archived",
};

function relativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const s = Math.floor(diff / 1000);
  if (s < 60) return "Just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  const mo = Math.floor(d / 30);
  if (mo < 12) return `${mo}mo ago`;
  return `${Math.floor(mo / 12)}y ago`;
}

function CampaignTableHeader() {
  return (
    <div
      className="grid gap-4 px-4 py-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider border-b border-border"
      style={{ gridTemplateColumns: "2fr 1fr 1fr" }}
    >
      <span>Campaign</span>
      <span>Platform</span>
      <span>Status</span>
    </div>
  );
}

function CampaignRow({ campaign }: { campaign: Campaign }) {
  const router = useRouter();
  return (
    <div
      className="grid gap-4 px-4 py-3 items-center hover:bg-muted/40 cursor-pointer transition-colors"
      style={{ gridTemplateColumns: "2fr 1fr 1fr" }}
      onClick={() => router.push(`/campaigns/${campaign.id}`)}
    >
      <span className="text-sm font-medium truncate">{campaign.name}</span>
      <span className="text-sm text-muted-foreground">{campaign.platform}</span>
      <span
        className={cn(
          "text-xs px-2.5 py-1 rounded-full font-medium border w-fit",
          campaignStatusStyles[campaign.status] ?? campaignStatusStyles.planned,
        )}
      >
        {campaignStatusLabel[campaign.status] ?? campaign.status}
      </span>
    </div>
  );
}

export function ClientDetail({
  client,
  insights,
  initialEdit = false,
  onEditSuccess,
}: ClientDetailProps) {
  const router = useRouter();
  const { remove, loading } = useClientMutations();
  const [activeTab, setActiveTab] = useState<
    "overview" | "campaigns" | "notes"
  >("overview");
  const [isEditing, setIsEditing] = useState(initialEdit);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const campaigns = client.campaigns ?? [];

  const handleDelete = async () => {
    await remove(client.id);
    router.push("/clients");
  };

  const handleEditSuccess = () => {
    setIsEditing(false);
    onEditSuccess?.();
    router.refresh();
  };

  const initials = client.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const activeCampaigns = campaigns.filter((c) => c.status === "active").length;

  const lastActivityDate =
    campaigns.length > 0
      ? [...campaigns].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )[0].createdAt
      : client.createdAt;

  const stats = [
    { label: "Total Campaigns", value: campaigns.length, valueClass: "" },
    { label: "Active", value: activeCampaigns, valueClass: "text-green-700" },
    {
      label: "AI Insights",
      value: insights.length,
      valueClass: "text-primary",
    },
    {
      label: "Last Activity",
      value: relativeTime(lastActivityDate),
      valueClass: "",
    },
  ];

  const tabs = [
    { key: "overview" as const, label: "Overview" },
    { key: "campaigns" as const, label: `Campaigns (${campaigns.length})` },
    { key: "notes" as const, label: "Notes" },
  ];

  return (
    <div className="space-y-6">
      <ConfirmModal
        open={showDeleteConfirm}
        title="Delete client?"
        description={`This will permanently delete "${client.name}" and all associated data. This action cannot be undone.`}
        confirmLabel="Delete Client"
        loading={loading}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />

      {/* Back */}
      <button
        onClick={() => router.push("/clients")}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group w-fit"
      >
        <span className="flex items-center justify-center h-7 w-7 rounded-md border border-border bg-card group-hover:bg-muted transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" />
        </span>
        Back to Clients
      </button>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center text-lg font-bold shrink-0">
            {initials}
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-2xl font-semibold tracking-tight">
                {client.name}
              </h1>
              <span
                className={cn(
                  "text-xs px-2.5 py-1 rounded-full font-medium border",
                  statusStyles[client.status as keyof typeof statusStyles] ??
                    statusStyles.inactive,
                )}
              >
                {client.status}
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground flex-wrap">
              {client.industry && (
                <span className="text-xs bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded-full">
                  {client.industry}
                </span>
              )}
              {client.email && <span>{client.email}</span>}
              <span>
                Added{" "}
                {new Date(client.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsEditing((e) => !e)}
          >
            <Pencil className="h-3.5 w-3.5 mr-1.5" />
            {isEditing ? "Cancel" : "Edit"}
          </Button>
          <Button
            size="sm"
            onClick={() => router.push(`/campaigns/new?clientId=${client.id}`)}
          >
            <Plus className="h-4 w-4 mr-1" />
            New Campaign
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => setShowDeleteConfirm(true)}
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Edit Form */}
      {isEditing && (
        <EditClientForm
          client={client}
          onSuccess={handleEditSuccess}
          onCancel={() => setIsEditing(false)}
        />
      )}

      {!isEditing && (
        <>
          {/* Stats Row */}
          <div className="grid grid-cols-4 gap-3">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-border bg-card shadow-sm p-4 space-y-1"
              >
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <p
                  className={cn(
                    "text-2xl font-semibold tracking-tight",
                    stat.valueClass,
                  )}
                >
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          {/* Custom Tab Bar */}
          <div className="border-b border-border flex gap-6">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  "pb-3 text-sm transition-colors",
                  activeTab === tab.key
                    ? "border-b-2 border-primary text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-[3fr_2fr] gap-3 items-start">
              {/* Left: Campaigns + AI Insights */}
              <div className="space-y-3">
                <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                    <h2 className="text-sm font-semibold">Campaigns</h2>
                    {campaigns.length > 5 && (
                      <button
                        onClick={() => setActiveTab("campaigns")}
                        className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                      >
                        View All
                      </button>
                    )}
                  </div>
                  {campaigns.length > 0 ? (
                    <>
                      <CampaignTableHeader />
                      <div className="divide-y divide-border">
                        {campaigns.slice(0, 5).map((c) => (
                          <CampaignRow key={c.id} campaign={c} />
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-10 gap-2">
                      <p className="text-sm text-muted-foreground">
                        No campaigns yet
                      </p>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          router.push(`/campaigns/new?clientId=${client.id}`)
                        }
                      >
                        <Plus className="h-3.5 w-3.5 mr-1" />
                        Create Campaign
                      </Button>
                    </div>
                  )}
                </div>

                {insights.length > 0 && (
                  <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
                    <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
                      <Sparkles className="h-4 w-4 text-primary" />
                      <h2 className="text-sm font-semibold">AI Insights</h2>
                    </div>
                    <div className="divide-y divide-border">
                      {insights.slice(0, 3).map((insight) => (
                        <div key={insight.id} className="px-4 py-3 space-y-1">
                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                            {insight.type}
                          </p>
                          <p className="text-sm leading-relaxed">
                            {insight.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right: Client Info */}
              <div className="rounded-xl border border-border bg-card shadow-sm p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold">Client Information</h2>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Edit
                  </button>
                </div>
                <div className="space-y-3 text-sm">
                  {[
                    { label: "Company / Brand", value: client.company },
                    { label: "Industry", value: client.industry },
                    { label: "Email", value: client.email },
                    { label: "Phone", value: client.phone },
                    { label: "Website", value: client.website },
                    {
                      label: "Added On",
                      value: new Date(client.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        },
                      ),
                    },
                  ].map((item) => (
                    <div key={item.label} className="space-y-0.5">
                      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                        {item.label}
                      </p>
                      <p className="font-medium">{item.value || "—"}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Campaigns Tab */}
          {activeTab === "campaigns" && (
            <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
              {campaigns.length > 0 ? (
                <>
                  <CampaignTableHeader />
                  <div className="divide-y divide-border">
                    {campaigns.map((c) => (
                      <CampaignRow key={c.id} campaign={c} />
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 gap-2">
                  <p className="text-sm text-muted-foreground">
                    No campaigns yet
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      router.push(`/campaigns/new?clientId=${client.id}`)
                    }
                  >
                    <Plus className="h-3.5 w-3.5 mr-1" />
                    Create Campaign
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Notes Tab */}
          {activeTab === "notes" && (
            <div className="rounded-xl border border-border bg-card shadow-sm p-6 space-y-2 max-w-2xl">
              <h2 className="text-sm font-semibold">Notes</h2>
              {client.notes ? (
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {client.notes}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No notes added.{" "}
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-primary hover:underline"
                  >
                    Add notes
                  </button>
                </p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
