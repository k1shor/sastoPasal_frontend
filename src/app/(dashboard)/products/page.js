import Link from 'next/link';
import { Plus } from 'lucide-react';
import { ProductGrid } from '@/components/products/product-grid';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Products SastoPasal',
  description: 'Manage your product catalog and inventory across all channels.',
};

export default function ProductsPage() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-lg font-semibold text-foreground md:text-xl">Products</h1>
          <p className="text-sm text-muted-foreground">
            Browse your store catalog, search by name or brand, and check stock.
          </p>
        </div>

        <Button
          render={<Link href="/products/manage" />}
          nativeButton={false}
          size="lg"
          className="h-9 shrink-0 px-3.5"
        >
          <Plus className="size-4" aria-hidden="true" />
          Add product
        </Button>
      </div>

      <ProductGrid />
    </div>
  );
}
