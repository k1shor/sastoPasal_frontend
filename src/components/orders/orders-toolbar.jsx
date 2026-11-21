'use client';

import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { STATUS_TABS } from '@/components/orders/order-display';

export function OrdersToolbar({ counts, status, search, onStatusChange, onSearchChange }) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
      <div
        role="tablist"
        aria-label="Filter orders by status"
        className="flex w-full gap-1 overflow-x-auto rounded-full bg-muted p-1 [scrollbar-width:none] lg:mx-0 lg:w-auto [&::-webkit-scrollbar]:hidden"
      >
        {STATUS_TABS.map((tab) => {
          const active = status === tab.value;

          return (
            <button
              key={tab.value}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onStatusChange(tab.value)}
              className={cn(
                'flex shrink-0 cursor-pointer items-center gap-2 rounded-[22px] px-4 py-3 text-base font-semibold whitespace-nowrap transition-colors',
                active
                  ? 'bg-card text-primary shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {tab.label}
              <span className="text-sm font-normal">{counts[tab.value] ?? 0}</span>
            </button>
          );
        })}
      </div>

      <div className="relative w-full lg:w-64 lg:shrink-0">
        <Search
          className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search orders or products…"
          aria-label="Search orders"
          className="h-9 pl-8"
        />
      </div>
    </div>
  );
}
