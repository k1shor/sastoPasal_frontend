import Image from 'next/image';
import Link from 'next/link';
import { FolderTree } from 'lucide-react';
import { cn } from '@/lib/utils';

function ActiveBadge({ isActive }) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[11px] font-medium whitespace-nowrap',
        isActive ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground',
      )}
    >
      {isActive ? 'Active' : 'Inactive'}
    </span>
  );
}

export function CategoryCard({ category, parentName }) {
  return (
    <Link
      href={`/categories/manage?id=${category._id}`}
      className="flex flex-col gap-3 rounded-xl border border-border bg-card p-3 outline-none transition-shadow hover:shadow-md focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <div className="flex items-start gap-3">
        <div className="relative size-14 shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
          {category.image ? (
            <Image
              src={category.image}
              alt={category.name}
              fill
              sizes="56px"
              className={cn('object-cover', !category.isActive && 'opacity-60 grayscale')}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
              <FolderTree className="size-5" aria-hidden="true" />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="truncate text-sm font-semibold text-foreground">{category.name}</h3>
            <ActiveBadge isActive={category.isActive} />
          </div>
          <p className="truncate text-[11px] text-muted-foreground">/{category.slug}</p>
          {parentName && (
            <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
              Subcategory of {parentName}
            </p>
          )}
        </div>
      </div>

      <p className="line-clamp-2 min-h-8 text-xs text-muted-foreground">
        {category.description || 'No description yet.'}
      </p>

      <div className="flex items-center justify-between border-t border-border pt-2.5 text-xs">
        <span className="text-muted-foreground">Products</span>
        <span className="font-medium text-foreground">{category.productCount ?? 0}</span>
      </div>
    </Link>
  );
}
