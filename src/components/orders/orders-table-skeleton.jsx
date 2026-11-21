import { Skeleton } from '@/components/ui/skeleton';
import { OrderTableHead } from '@/components/orders/order-table-head';

export function OrdersTableSkeleton() {
  return (
    <div className="flex flex-col gap-4" role="status" aria-label="Loading orders">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <Skeleton className="h-10 w-full rounded-full lg:h-9 lg:w-[420px]" />
        <Skeleton className="h-9 w-full rounded-lg lg:w-64" />
      </div>

      <div className="overflow-hidden rounded-sm border border-border bg-card">
        <table className="w-full">
          <OrderTableHead />
          <tbody>
            {Array.from({ length: 5 }).map((_, row) => (
              <tr key={row} className="border-t border-border">
                <td className="px-2 py-3 sm:px-4">
                  <Skeleton className="h-4 w-14" />
                  <Skeleton className="mt-2 h-3 w-16" />
                </td>
                <td className="px-2 py-3 sm:px-4">
                  <div className="flex items-center gap-2 sm:gap-2.5">
                    <Skeleton className="size-8 shrink-0 rounded-full sm:size-9" />
                    <div className="min-w-0">
                      <Skeleton className="h-4 w-24 sm:w-40" />
                      <Skeleton className="mt-2 h-3 w-20" />
                    </div>
                  </div>
                </td>
                <td className="hidden px-4 py-3 md:table-cell">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="mt-2 h-3 w-32" />
                </td>
                <td className="hidden px-4 py-3 lg:table-cell">
                  <Skeleton className="h-4 w-12" />
                </td>
                <td className="px-2 py-3 sm:px-4">
                  <Skeleton className="ml-auto h-4 w-16" />
                </td>
                <td className="hidden px-4 py-3 xl:table-cell">
                  <Skeleton className="h-4 w-32" />
                </td>
                <td className="px-2 py-3 sm:px-4">
                  <Skeleton className="ml-auto h-4 w-16" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex items-center justify-between gap-2 border-t border-border px-3 py-4 sm:gap-3 sm:px-4">
          <Skeleton className="h-10 w-24 rounded-lg" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-20 rounded-lg" />
        </div>
      </div>
      <span className="sr-only">Loading orders…</span>
    </div>
  );
}
