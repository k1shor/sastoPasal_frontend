import Image from 'next/image';
import Link from 'next/link';
import { ImageOff } from 'lucide-react';
import { cn } from '@/lib/utils';

// The product model has no low-stock threshold, so the UI uses one constant.
const LOW_STOCK_THRESHOLD = 10;

const CONDITION_LABELS = {
  like_new: 'Like new',
  excellent: 'Excellent',
  good: 'Good',
  fair: 'Fair',
};

function stockState(product) {
  if (product.stock === 0) return 'out';
  if (product.stock <= LOW_STOCK_THRESHOLD) return 'low';
  return 'in';
}

function StockBadge({ state, stock }) {
  const styles = {
    in: { label: 'In stock', className: 'bg-success/10 text-success' },
    low: { label: `Low · ${stock}`, className: 'bg-warning/15 text-warning-foreground' },
    out: { label: 'Out of stock', className: 'bg-destructive/10 text-destructive' },
  }[state];

  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[11px] font-medium whitespace-nowrap',
        styles.className,
      )}
    >
      {styles.label}
    </span>
  );
}

export function ProductCard({ product }) {
  const src = product.image || product.images?.[0] || '';
  const state = stockState(product);
  const isUsed = product.productType === 'used';
  const condition = CONDITION_LABELS[product.usedCondition];
  const unavailable = !product.isAvailable;

  return (
    <Link
      href={`/products/manage?id=${product._id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card outline-none transition-shadow hover:shadow-md focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        {src ? (
          <Image
            src={src}
            alt={product.name}
            fill
            sizes="(min-width: 1280px) 22vw, (min-width: 768px) 30vw, 45vw"
            className={cn(
              'object-cover transition-transform duration-300 group-hover:scale-105',
              unavailable && 'opacity-60 grayscale',
            )}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            <ImageOff className="size-6" aria-hidden="true" />
          </div>
        )}

        {(isUsed || unavailable) && (
          <div className="absolute top-2 left-2 flex flex-col items-start gap-1">
            {isUsed && (
              <span className="rounded-full bg-foreground/80 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-background uppercase backdrop-blur-sm">
                Used{condition ? ` · ${condition}` : ''}
              </span>
            )}
            {unavailable && (
              <span className="rounded-full bg-background/90 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">
                Unavailable
              </span>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1 p-3">
        {product.brand && (
          <p className="truncate text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
            {product.brand}
          </p>
        )}

        <h3 className="line-clamp-2 text-sm leading-snug font-medium text-foreground">
          {product.name}
        </h3>

        <div className="mt-auto flex flex-col items-start gap-1.5 pt-2 lg:flex-row lg:items-center lg:justify-between">
          <span className="text-sm font-semibold whitespace-nowrap text-foreground sm:text-base">
            Rs. {product.price.toLocaleString('en-IN')}
          </span>
          <StockBadge state={state} stock={product.stock} />
        </div>
      </div>
    </Link>
  );
}
