import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function CampaignTableSkeleton() {
  return (
    <Table>
      <TableHeader>
        <TableRow className="border-border">
          {["Campaign", "Client", "Platform", "Status", "Deadline", ""].map((h, i) => (
            <TableHead key={i}>
              <Skeleton className="h-3 w-20" />
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>

      <TableBody>
        {Array.from({ length: 6 }).map((_, i) => (
          <TableRow key={i} className="border-border">

            {/* Campaign */}
            <TableCell>
              <div className="space-y-1">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-56" />
              </div>
            </TableCell>

            {/* Client */}
            <TableCell>
              <div className="space-y-1">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-16 rounded-full" />
              </div>
            </TableCell>

            {/* Platform */}
            <TableCell>
              <Skeleton className="h-4 w-20" />
            </TableCell>

            {/* Status */}
            <TableCell>
              <Skeleton className="h-5 w-20 rounded-full" />
            </TableCell>

            {/* Deadline */}
            <TableCell>
              <Skeleton className="h-4 w-24" />
            </TableCell>

            {/* Actions */}
            <TableCell className="text-right">
              <div className="flex items-center justify-end gap-2">
                <Skeleton className="h-8 w-14" />
                <Skeleton className="h-8 w-8 rounded-md" />
              </div>
            </TableCell>

          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}