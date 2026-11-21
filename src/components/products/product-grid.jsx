'use client';

import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Loader2, PackageSearch } from 'lucide-react';
import { ProductCard } from '@/components/products/product-card';
import { ProductSearch } from '@/components/shared/product-search';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetProductsQuery } from '@/store/api/products-api';
import {
  loadMore,
  resetFilters,
  selectProductFilters,
  setProductType,
} from '@/store/slices/product-filters-slice';
import { cn } from '@/lib/utils';

const TYPE_FILTERS = [
  { value: '', label: 'All products' },
  { value: 'new', label: 'New' },
  { value: 'used', label: 'Used' },
];

function CardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <Skeleton className="aspect-square rounded-none" />
      <div className="flex flex-col gap-2 p-3">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="mt-1 h-5 w-20" />
      </div>
    </div>
  );
}

function LoadingSpinner({ label }) {
  return (
    <span className="flex items-center justify-center">
      <Loader2 className="size-6 animate-spin text-muted-foreground" aria-hidden="true" />
      <span className="sr-only">{label}</span>
    </span>
  );
}

export function ProductGrid() {
  const dispatch = useDispatch();
  const { search, productType, limit } = useSelector(selectProductFilters);
  const sentinelRef = useRef(null);

  const { data, isLoading, isFetching, isError, refetch } = useGetProductsQuery({
    search,
    productType,
    limit,
  });

  const products = data?.data ?? [];
  const total = data?.total ?? 0;
  const hasMore = products.length < total;

  // Infinite scroll: fetch the next batch when the sentinel nears the viewport.
  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !hasMore || isLoading || isError) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !isFetching) {
          dispatch(loadMore());
        }
      },
      { rootMargin: '0px 0px 240px 0px' },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [dispatch, hasMore, isFetching, isLoading, isError]);

  return (
    <section className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="-mx-1 flex items-center gap-2 overflow-x-auto px-1 pb-1 md:overflow-visible md:pb-0">
          {TYPE_FILTERS.map((filter) => {
            const active = productType === filter.value;

            return (
              <button
                key={filter.label}
                type="button"
                onClick={() => dispatch(setProductType(filter.value))}
                aria-pressed={active}
                className={cn(
                  'h-9 shrink-0 rounded-full border px-3.5 text-xs font-medium transition-colors',
                  active
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground',
                )}
              >
                {filter.label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 md:hidden">
            <ProductSearch />
          </div>
          <p className="shrink-0 text-xs text-muted-foreground">
            {total} {total === 1 ? 'product' : 'products'}
          </p>
        </div>
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <CardSkeleton key={index} />
          ))}
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-border bg-card px-4 py-16 text-center">
          <p className="text-sm font-medium text-foreground">Could not load products</p>
          <p className="max-w-xs text-xs text-muted-foreground">
            Something went wrong while fetching the catalog. Try again.
          </p>
          <Button variant="outline" size="lg" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-border bg-card px-4 py-16 text-center">
          <div className="flex size-12 items-center justify-center rounded-xl bg-muted text-muted-foreground">
            <PackageSearch className="size-5" aria-hidden="true" />
          </div>
          <p className="text-sm font-medium text-foreground">No products found</p>
          <p className="max-w-xs text-xs text-muted-foreground">
            {search
              ? `Nothing matches “${search}”. Try a different name or brand.`
              : 'There are no products in this filter yet.'}
          </p>
          <Button variant="outline" size="lg" onClick={() => dispatch(resetFilters())}>
            Clear filters
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          <div
            ref={sentinelRef}
            aria-live="polite"
            className="flex h-12 items-center justify-center"
          >
            {hasMore &&
              (isFetching ? (
                <LoadingSpinner label="Loading more products" />
              ) : (
                <span className="text-xs text-muted-foreground">Scroll for more products</span>
              ))}
          </div>
        </>
      )}
    </section>
  );
}
