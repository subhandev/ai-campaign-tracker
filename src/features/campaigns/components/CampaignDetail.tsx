"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, MoreHorizontal, Sparkles, Calendar, Target, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Campaign, CampaignStatus } from "@/features/campaigns/types";
import { useCampaignMutations } from "@/features/campaigns/hooks/useCampaigns";
import { cn } from "@/lib/utils";

interface CampaignDetailProps {
  campaign: Campaign;
}

const statusStyles: Record<CampaignStatus, string> = {
  planned:   "bg-blue-50 text-blue-700 border-blue-200",
  active:    "bg-green-50 text-green-700 border-green-200",
  at_risk:   "bg-orange-50 text-orange-700 border-orange-200",
  completed: "bg-zinc-100 text-zinc-500 border-zinc-200",
  archived:  "bg-zinc-100 text-zinc-400 border-zinc-200",
};

const statusLabel: Record<CampaignStatus, string> = {
  planned:   "Planned",
  active:    "Active",
  at_risk:   "At Risk",
  completed: "Completed",
  archived:  "Archived",
};

export function CampaignDetail({ campaign }: CampaignDetailProps) {
  const router = useRouter();
  const { remove, loading } = useCampaignMutations();
  const [activeTab, setActiveTab] = useState("overview");

  const handleDelete = async () => {
    await remove(campaign.id);
    router.push("/campaigns");
  };

  return (
    <div className="space-y-6 max-w-6xl">

      {/* Back */}
      <button
        onClick={() => router.push("/campaigns")}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group w-fit"
      >
        <span className="flex items-center justify-center h-7 w-7 rounded-md border border-border bg-card group-hover:bg-muted transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" />
        </span>
        Back to Campaigns
      </button>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight">
              {campaign.name}
            </h1>
            <span
              className={cn(
                "text-xs px-2.5 py-1 rounded-full font-medium border",
                statusStyles[campaign.status]
              )}
            >
              {statusLabel[campaign.status]}
            </span>
          </div>

          {/* Meta row */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {campaign.client && (
              <div className="flex items-center gap-1.5">
                <div className="h-4 w-4 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[9px] font-bold">
                  {campaign.client.name[0]}
                </div>
                <span>{campaign.client.name}</span>
              </div>
            )}
            {campaign.platform && (
              <div className="flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5" />
                <span>{campaign.platform}</span>
              </div>
            )}
            {campaign.deadline && (
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                <span>
                  Due{" "}
                  {new Date(campaign.deadline).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
            )}
            {campaign.goal && (
              <div className="flex items-center gap-1.5">
                <Target className="h-3.5 w-3.5" />
                <span>{campaign.goal}</span>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline">
            <Sparkles className="h-4 w-4 mr-1.5" />
            Generate AI Report
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => router.push(`/campaigns/${campaign.id}?edit=true`)}
              >
                Edit Campaign
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={handleDelete}
                disabled={loading}
              >
                Delete Campaign
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Campaign Info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="rounded-xl border border-border bg-card p-6 space-y-4 shadow-sm">
                <h2 className="text-sm font-semibold">Campaign Information</h2>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                      Client
                    </p>
                    <p className="font-medium">{campaign.client?.name ?? "—"}</p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                      Platform
                    </p>
                    <p className="font-medium">{campaign.platform}</p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                      Start Date
                    </p>
                    <p className="font-medium">
                      {campaign.startDate
                        ? new Date(campaign.startDate).toLocaleDateString("en-US", {
                            month: "short", day: "numeric", year: "numeric",
                          })
                        : "—"}
                    </p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                      End Date
                    </p>
                    <p className="font-medium">
                      {campaign.endDate
                        ? new Date(campaign.endDate).toLocaleDateString("en-US", {
                            month: "short", day: "numeric", year: "numeric",
                          })
                        : "—"}
                    </p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                      Deadline
                    </p>
                    <p className="font-medium">
                      {campaign.deadline
                        ? new Date(campaign.deadline).toLocaleDateString("en-US", {
                            month: "short", day: "numeric", year: "numeric",
                          })
                        : "—"}
                    </p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                      Goal
                    </p>
                    <p className="font-medium">{campaign.goal ?? "—"}</p>
                  </div>
                </div>

                {campaign.description && (
                  <div className="pt-2 border-t border-border space-y-1">
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                      Description
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {campaign.description}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* AI Insights Panel */}
            <div className="space-y-3">
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 shadow-sm p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <h2 className="text-sm font-semibold">AI Insights</h2>
                  <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-medium">
                    Beta
                  </span>
                </div>

                {campaign.insights && campaign.insights.length > 0 ? (
                  <div className="space-y-3">
                    {(campaign.insights as any[]).map((insight) => (
                      <div
                        key={insight.id}
                        className="p-3 rounded-lg border border-border bg-background text-sm space-y-1"
                      >
                        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                          {insight.type}
                        </p>
                        <p className="text-sm leading-relaxed">{insight.content}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-center gap-3 py-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Sparkles className="h-5 w-5 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">No insights yet</p>
                      <p className="text-xs text-muted-foreground">
                        Generate AI insights to get performance analysis and recommendations.
                      </p>
                    </div>
                    <Button size="sm" variant="outline" className="w-full">
                      <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                      Generate Insights
                    </Button>
                  </div>
                )}
              </div>
            </div>

          </div>
        </TabsContent>

        {/* Tasks Tab */}
        <TabsContent value="tasks" className="mt-6">
          <div className="flex flex-col items-center justify-center py-16 text-center border rounded-lg bg-muted/20">
            <p className="text-sm text-muted-foreground">Tasks coming soon</p>
          </div>
        </TabsContent>

        {/* Notes Tab */}
        <TabsContent value="notes" className="mt-6">
          <div className="flex flex-col items-center justify-center py-16 text-center border rounded-lg bg-muted/20">
            <p className="text-sm text-muted-foreground">Notes coming soon</p>
          </div>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="mt-6">
          <div className="flex flex-col items-center justify-center py-16 text-center border rounded-lg bg-muted/20">
            <p className="text-sm text-muted-foreground">Reports coming soon</p>
          </div>
        </TabsContent>

      </Tabs>
    </div>
  );
}