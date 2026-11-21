import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { CategoryForm } from '@/components/categories/category-form';

export const metadata = {
  title: 'Manage category SastoPasal',
  description: 'Create a new category or update an existing one with a name, slug and image.',
};

export default async function ManageCategoryPage({ searchParams }) {
  const { id } = await searchParams;
  const categoryId = typeof id === 'string' && id ? id : undefined;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Link
          href="/categories"
          className="inline-flex w-fit items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronLeft className="size-3.5" aria-hidden="true" />
          Back to categories
        </Link>

        <div>
          <h1 className="text-lg font-semibold text-foreground md:text-xl">
            {categoryId ? 'Manage category' : 'Add category'}
          </h1>
          <p className="text-sm text-muted-foreground">
            {categoryId
              ? 'Update the name, slug, image and parent, then save your changes.'
              : 'Set a name, slug and image, then add it to your catalog.'}
          </p>
        </div>
      </div>

      <CategoryForm categoryId={categoryId} />
    </div>
  );
}
