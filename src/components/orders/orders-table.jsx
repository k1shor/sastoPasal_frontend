'use client';

import { useMemo, useState } from 'react';
import { ClipboardList, SearchX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGetOrdersQuery } from '@/store/api/orders-api';
import { countOrdersByStatus, filterOrders } from '@/components/orders/order-display';
import { OrderRow } from '@/components/orders/order-row';
import { OrderTableHead } from '@/components/orders/order-table-head';
import { OrdersPagination } from '@/components/orders/orders-pagination';
import { OrdersTableSkeleton } from '@/components/orders/orders-table-skeleton';
import { OrdersToolbar } from '@/components/orders/orders-toolbar';

const PER_PAGE = 5;

function OrdersErrorState({ onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-border bg-card px-4 py-16 text-center">
      <p className="text-sm font-medium text-foreground">Could not load orders</p>
      <p className="max-w-xs text-xs text-muted-foreground">
        Something went wrong while fetching your orders. Try again.
      </p>
      <Button variant="outline" size="lg" onClick={onRetry}>
        Retry
      </Button>
    </div>
  );
}

function OrdersEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-border bg-card px-4 py-16 text-center">
      <div className="flex size-12 items-center justify-center rounded-xl bg-muted text-muted-foreground">
        <ClipboardList className="size-5" aria-hidden="true" />
      </div>
      <p className="text-sm font-medium text-foreground">No orders yet</p>
      <p className="max-w-xs text-xs text-muted-foreground">
        New orders will show up here as soon as customers place them.
      </p>
    </div>
  );
}

function OrdersNoResults({ onClear }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 border-t border-border px-4 py-16 text-center">
      <div className="mb-1 flex size-20 items-center justify-center rounded-2xl bg-muted">
        <SearchX className="size-9 text-muted-foreground/50" aria-hidden="true" />
      </div>
      <p className="text-sm font-medium text-foreground">No data available</p>
      <p className="max-w-xs text-xs text-muted-foreground">
        No orders match this search or status filter. Try another term.
      </p>
      <Button variant="outline" onClick={onClear}>
        Clear filters
      </Button>
    </div>
  );
}

export function OrdersTable() {
  const { data, isLoading, isError, refetch } = useGetOrdersQuery();
  const orders = useMemo(() => data?.data ?? [], [data]);

  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => filterOrders(orders, status, search), [orders, status, search]);
  const counts = useMemo(() => countOrdersByStatus(orders), [orders]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PER_PAGE;
  const visible = filtered.slice(start, start + PER_PAGE);

  const changeStatus = (value) => {
    setStatus(value);
    setPage(1);
  };

  const changeSearch = (value) => {
    setSearch(value);
    setPage(1);
  };

  const clearFilters = () => {
    setSearch('');
    setStatus('all');
    setPage(1);
  };

  if (isLoading) return <OrdersTableSkeleton />;
  if (isError) return <OrdersErrorState onRetry={refetch} />;
  if (orders.length === 0) return <OrdersEmptyState />;

  return (
    <section className="flex flex-col gap-4">
      <OrdersToolbar
        counts={counts}
        status={status}
        search={search}
        onStatusChange={changeStatus}
        onSearchChange={changeSearch}
      />

      <div className="overflow-hidden rounded-sm border border-border bg-card">
        <table className="w-full text-sm">
          <OrderTableHead />
          {visible.length > 0 && (
            <tbody>
              {visible.map((order) => (
                <OrderRow key={order._id} order={order} />
              ))}
            </tbody>
          )}
        </table>

        {filtered.length === 0 && <OrdersNoResults onClear={clearFilters} />}

        <OrdersPagination page={currentPage} totalPages={totalPages} onChange={setPage} />
      </div>
    </section>
  );
}
