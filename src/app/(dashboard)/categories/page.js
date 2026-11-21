import Link from 'next/link';
import { Plus } from 'lucide-react';
import { CategoryGrid } from '@/components/categories/category-grid';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Categories SastoPasal',
  description: 'Organize your product catalog with categories and subcategories.',
};

export default function CategoriesPage() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-lg font-semibold text-foreground md:text-xl">Categories</h1>
          <p className="text-sm text-muted-foreground">
            See how your catalog is organized and how many products sit in each category.
          </p>
        </div>

        <Button
          render={<Link href="/categories/manage" />}
          nativeButton={false}
          size="lg"
          className="h-9 shrink-0 px-3.5"
        >
          <Plus className="size-4" aria-hidden="true" />
          Add category
        </Button>
      </div>

      <CategoryGrid />
    </div>
  );
}
