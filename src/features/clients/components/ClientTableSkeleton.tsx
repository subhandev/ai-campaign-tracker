import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

export function ClientTableSkeleton() {
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
        {Array.from({ length: 6 }).map((_, i) => (
          <TableRow key={i} className="border-border">
            {/* Client: avatar circle + name bar */}
            <TableCell>
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                <Skeleton className="h-4 w-36" />
              </div>
            </TableCell>

            {/* Industry: pill-width text bar */}
            <TableCell>
              <Skeleton className="h-4 w-20" />
            </TableCell>

            {/* Campaigns: short number bar */}
            <TableCell>
              <Skeleton className="h-4 w-8" />
            </TableCell>

            {/* Status: pill shape */}
            <TableCell>
              <Skeleton className="h-6 w-16 rounded-full" />
            </TableCell>

            {/* Actions: small bar right-aligned */}
            <TableCell className="text-right">
              <Skeleton className="h-4 w-12 ml-auto" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
