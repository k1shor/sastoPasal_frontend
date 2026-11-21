'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function OrdersPagination({ page, totalPages, onChange }) {
  return (
    <div className="flex items-center justify-between gap-2 border-t border-border px-3 py-4 sm:gap-3 sm:px-4">
      <Button
        variant="outline"
        size="lg"
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
        className="h-10 px-3 text-sm font-semibold shadow-sm sm:px-4"
      >
        <ChevronLeft aria-hidden="true" />
        Previous
      </Button>

      <span
        className="text-sm font-medium whitespace-nowrap text-muted-foreground tabular-nums"
        aria-live="polite"
      >
        Page <span className="font-semibold text-foreground">{page}</span> of {totalPages}
      </span>

      <Button
        variant="default"
        size="lg"
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Next page"
        className="h-10 px-4 text-sm font-semibold shadow-md ring-1 shadow-primary/25 ring-primary/20 transition-all hover:shadow-lg hover:shadow-primary/30 disabled:shadow-none disabled:ring-0"
      >
        Next
        <ChevronRight aria-hidden="true" />
      </Button>
    </div>
  );
}
