"use client";

import { useRouter } from "next/navigation";
import { MoreHorizontal, ArrowRight } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Campaign, CampaignStatus } from "@/features/campaigns/types";
import { cn } from "@/lib/utils";

interface CampaignTableProps {
  campaigns: Campaign[];
  onDelete: (id: string) => void;
}

const statusStyles: Record<CampaignStatus, string> = {
  planned: "bg-blue-50 text-blue-700 border-blue-200",
  active: "bg-green-50 text-green-700 border-green-200",
  at_risk: "bg-orange-50 text-orange-700 border-orange-200",
  completed: "bg-zinc-100 text-zinc-500 border-zinc-200",
  archived: "bg-zinc-100 text-zinc-400 border-zinc-200",
};

const statusLabel: Record<CampaignStatus, string> = {
  planned: "Planned",
  active: "Active",
  at_risk: "At Risk",
  completed: "Completed",
  archived: "Archived",
};

export function CampaignTable({ campaigns, onDelete }: CampaignTableProps) {
  const router = useRouter();

  return (
    <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-card overflow-hidden">
      <table className="w-full">
        {/* Header */}
        <thead className="bg-[hsl(var(--muted)/0.5)] border-b border-[hsl(var(--border))]">
          <tr>
            {["Campaign", "Client", "Platform", "Due", "Status", ""].map(
              (h) => (
                <th
                  key={h}
                  className="text-[10px] uppercase tracking-wider font-medium text-[hsl(var(--muted-foreground))] px-5 py-2.5 text-left"
                >
                  {h}
                </th>
              ),
            )}
          </tr>
        </thead>

        {/* Body */}
        <tbody>
          {campaigns.map((c) => (
            <tr
              key={c.id}
              onClick={() => router.push(`/campaigns/${c.id}`)}
              className="border-b border-[hsl(var(--border)/0.5)] hover:bg-[hsl(var(--muted)/0.4)] cursor-pointer transition-colors last:border-0"
            >
              {/* Campaign */}
              <td className="px-5 py-3 text-sm font-medium text-[hsl(var(--foreground))] max-w-[240px]">
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

              {/* Due */}
              <td className="px-5 py-3 text-sm text-[hsl(var(--muted-foreground))] whitespace-nowrap">
                {c.deadline
                  ? new Date(c.deadline).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  : "—"}
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
                        onClick={() =>
                          router.push(`/campaigns/${c.id}?edit=true`)
                        }
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
          ))}
        </tbody>
      </table>
    </div>
  );
}
