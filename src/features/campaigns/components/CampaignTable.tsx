"use client";

import { useRouter } from "next/navigation";
import { MoreHorizontal, ArrowRight } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Campaign } from "@/features/campaigns/types";
import { cn } from "@/lib/utils";

interface CampaignTableProps {
  campaigns: Campaign[];
  onDelete: (id: string) => void;
}

function formatSpend(total: number): string {
  if (total >= 1000) return `$${(total / 1000).toFixed(1)}k`;
  return `$${total.toFixed(0)}`;
}

function formatGoal(goal: string | null | undefined): string {
  if (!goal) return "—";
  return goal.split("_").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

export function CampaignTable({ campaigns, onDelete }: CampaignTableProps) {
  const router = useRouter();

  return (
    <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-card overflow-hidden">
      <table className="w-full">
        {/* Header */}
        <thead className="bg-[hsl(var(--muted)/0.5)] border-b border-[hsl(var(--border))]">
          <tr>
            {[
              { label: "Campaign", cls: "" },
              { label: "Client", cls: "" },
              { label: "Platform", cls: "" },
              { label: "Status", cls: "" },
              { label: "Goal", cls: "hidden md:table-cell" },
              { label: "Deadline", cls: "hidden md:table-cell" },
              { label: "Spend", cls: "" },
              { label: "", cls: "" },
            ].map((h) => (
              <th
                key={h.label}
                className={cn(
                  "text-[10px] uppercase tracking-wider font-medium text-[hsl(var(--muted-foreground))] px-5 py-2.5 text-left",
                  h.cls,
                )}
              >
                {h.label}
              </th>
            ))}
          </tr>
        </thead>

        {/* Body */}
        <tbody>
          {campaigns.map((c) => {
            const totalSpend = c.metrics?.reduce((sum, m) => sum + (m.spend ?? 0), 0) ?? 0;
            const isPastDeadline =
              c.deadline &&
              new Date(c.deadline) < new Date() &&
              c.status !== "completed" &&
              c.status !== "archived";

            return (
              <tr
                key={c.id}
                onClick={() => router.push(`/campaigns/${c.id}`)}
                className="border-b border-[hsl(var(--border)/0.5)] hover:bg-[hsl(var(--muted)/0.4)] cursor-pointer transition-colors last:border-0"
              >
                {/* Campaign */}
                <td className="px-5 py-3 text-sm font-medium text-[hsl(var(--foreground))] max-w-[200px]">
                  <span className="truncate block">{c.name}</span>
                </td>

                {/* Client */}
                <td className="px-5 py-3 text-sm text-[hsl(var(--muted-foreground))] whitespace-nowrap">
                  {c.client?.name ?? "—"}
                </td>

                {/* Platform */}
                <td className="px-5 py-3 text-sm text-[hsl(var(--muted-foreground))] whitespace-nowrap">
                  {c.platform}
                </td>

                {/* Status */}
                <td className="px-5 py-3">
                  <span
                    className={cn(
                      "text-xs px-2.5 py-1 rounded-full font-medium border",
                      c.status === "active" &&
                        "bg-[hsl(var(--success-soft))] text-[hsl(var(--success))] border-[hsl(var(--success)/0.3)]",
                      c.status === "at_risk" &&
                        "bg-[hsl(var(--warning-soft))] text-[hsl(var(--warning-foreground))] border-[hsl(var(--warning)/0.3)]",
                      c.status === "completed" &&
                        "bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] border-[hsl(var(--border))]",
                      c.status === "archived" &&
                        "bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] border-[hsl(var(--border))]",
                      c.status === "planned" &&
                        "bg-[hsl(var(--brand-soft))] text-[hsl(var(--brand))] border-[hsl(var(--brand)/0.3)]",
                    )}
                  >
                    {c.status.replace("_", " ")}
                  </span>
                </td>

                {/* Goal */}
                <td className="hidden md:table-cell px-5 py-3 text-sm text-[hsl(var(--muted-foreground))] whitespace-nowrap">
                  {formatGoal(c.goal)}
                </td>

                {/* Deadline */}
                <td className="hidden md:table-cell px-5 py-3 text-sm whitespace-nowrap">
                  {c.deadline ? (
                    <span className={cn(isPastDeadline && "text-orange-600")}>
                      {new Date(c.deadline).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  ) : (
                    <span className="text-[hsl(var(--muted-foreground))]">—</span>
                  )}
                </td>

                {/* Spend */}
                <td className="px-5 py-3 text-sm text-[hsl(var(--muted-foreground))] whitespace-nowrap">
                  {totalSpend > 0 ? formatSpend(totalSpend) : "—"}
                </td>

                {/* Actions */}
                <td
                  className="px-5 py-3 text-right"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-foreground"
                      onClick={() => router.push(`/campaigns/${c.id}`)}
                    >
                      View <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => router.push(`/campaigns/${c.id}`)}
                        >
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => router.push(`/campaigns/${c.id}?edit=true`)}
                        >
                          Edit
                        </DropdownMenuItem>
                        {onDelete && (
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => onDelete(c.id)}
                          >
                            Delete
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
