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
import { Client } from "@/features/clients/types";
import { cn } from "@/lib/utils";

interface ClientTableProps {
  clients: Client[];
  onDelete: (id: string) => void;
}

export function ClientTable({ clients, onDelete }: ClientTableProps) {
  const router = useRouter();

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent border-border">
          <TableHead className="text-xs uppercase tracking-wide text-muted-foreground font-medium">
            Client
          </TableHead>
          <TableHead className="text-xs uppercase tracking-wide text-muted-foreground font-medium">
            Industry
          </TableHead>
          <TableHead className="text-xs uppercase tracking-wide text-muted-foreground font-medium">
            Campaigns
          </TableHead>
          <TableHead className="text-xs uppercase tracking-wide text-muted-foreground font-medium">
            Status
          </TableHead>
          <TableHead />
        </TableRow>
      </TableHeader>
      <TableBody>
        {clients.map((client) => (
          <TableRow
            key={client.id}
            className="hover:bg-muted/40 cursor-pointer border-border transition-colors"
            onClick={() => router.push(`/clients/${client.id}`)}
          >
            {/* Client */}
            <TableCell>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold">
                  {client.name[0].toUpperCase()}
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-sm font-medium">{client.name}</span>
                  {client.email && (
                    <span className="text-xs text-muted-foreground">
                      {client.email}
                    </span>
                  )}
                </div>
              </div>
            </TableCell>

            {/* Industry */}
            <TableCell>
              {client.industry ? (
                <span className="text-xs bg-muted text-muted-foreground px-2.5 py-1 rounded-full font-medium">
                  {client.industry}
                </span>
              ) : (
                <span className="text-muted-foreground text-sm">—</span>
              )}
            </TableCell>

            {/* Campaigns */}
            <TableCell>
              <span className="text-sm text-muted-foreground">
                {(client as any)._count?.campaigns ?? 0}
              </span>
            </TableCell>

            {/* Status */}
            <TableCell>
              <span
                className={cn(
                  "text-xs px-2.5 py-1 rounded-full font-medium border",
                  client.status === "active"
                    ? "bg-green-50 text-green-700 border-green-200"
                    : "bg-zinc-100 text-zinc-500 border-zinc-200"
                )}
              >
                {client.status}
              </span>
            </TableCell>

            {/* Actions */}
            <TableCell
              className="text-right"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-end gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground"
                  onClick={() => router.push(`/clients/${client.id}`)}
                >
                  View <ArrowRight className="ml-1 h-3 w-3" />
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => router.push(`/clients/${client.id}`)}
                    >
                      View
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        router.push(`/clients/${client.id}?edit=true`)
                      }
                    >
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => onDelete(client.id)}
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}