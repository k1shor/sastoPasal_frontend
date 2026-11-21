'use client';

import { Search, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { Input } from '@/components/ui/input';
import { selectSearch, setSearch } from '@/store/slices/product-filters-slice';
import { cn } from '@/lib/utils';

export function ProductSearch({ className, placeholder = 'Search products or brands…' }) {
  const dispatch = useDispatch();
  const search = useSelector(selectSearch);

  return (
    <div className={cn('relative w-full', className)}>
      <Search
        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
      <Input
        type="search"
        value={search}
        onChange={(event) => dispatch(setSearch(event.target.value))}
        placeholder={placeholder}
        aria-label="Search products"
        className="h-9 rounded-full bg-muted/60 pr-9 pl-9 text-sm focus-visible:bg-background md:text-sm [&::-webkit-search-cancel-button]:hidden"
      />
      {search && (
        <button
          type="button"
          onClick={() => dispatch(setSearch(''))}
          aria-label="Clear search"
          className="absolute top-1/2 right-2 flex size-6 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <X className="size-3.5" />
        </button>
      )}
    </div>
  );
}
