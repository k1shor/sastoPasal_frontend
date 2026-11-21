'use client';

import { FolderSearch } from 'lucide-react';
import { CategoryCard } from '@/components/categories/category-card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetCategoriesQuery } from '@/store/api/categories-api';

function CardSkeleton() {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-3">
      <div className="flex items-start gap-3">
        <Skeleton className="size-14 shrink-0 rounded-lg" />
        <div className="flex-1">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="mt-2 h-3 w-1/2" />
        </div>
      </div>
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-4/5" />
      <Skeleton className="h-6 w-full" />
    </div>
  );
}

export function CategoryGrid() {
  const { data, isLoading, isError, refetch } = useGetCategoriesQuery();

  const categories = data?.data ?? [];
  const namesById = Object.fromEntries(categories.map((category) => [category._id, category.name]));
  const totalProducts = categories.reduce((sum, category) => sum + (category.productCount ?? 0), 0);

  if (isLoading) {
    return (
      <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <CardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-border bg-card px-4 py-16 text-center">
        <p className="text-sm font-medium text-foreground">Could not load categories</p>
        <p className="max-w-xs text-xs text-muted-foreground">
          Something went wrong while fetching your categories. Try again.
        </p>
        <Button variant="outline" size="lg" onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-border bg-card px-4 py-16 text-center">
        <div className="flex size-12 items-center justify-center rounded-xl bg-muted text-muted-foreground">
          <FolderSearch className="size-5" aria-hidden="true" />
        </div>
        <p className="text-sm font-medium text-foreground">No categories yet</p>
        <p className="max-w-xs text-xs text-muted-foreground">
          Categories will appear here once they are added to your store.
        </p>
      </div>
    );
  }

  return (
    <section className="flex flex-col gap-3">
      <p className="text-xs text-muted-foreground">
        {categories.length} {categories.length === 1 ? 'category' : 'categories'} · {totalProducts}{' '}
        {totalProducts === 1 ? 'product' : 'products'}
      </p>

      <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
        {categories.map((category) => (
          <CategoryCard
            key={category._id}
            category={category}
            parentName={category.parent ? namesById[category.parent] : undefined}
          />
        ))}
      </div>
    </section>
  );
}
