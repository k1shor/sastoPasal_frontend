import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { ProductForm } from '@/components/products/product-form';

export const metadata = {
  title: 'Manage product SastoPasal',
  description: 'Add a new listing or update an existing one with photos, pricing and stock.',
};

export default async function ManageProductPage({ searchParams }) {
  const { id } = await searchParams;
  const productId = typeof id === 'string' && id ? id : undefined;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Link
          href="/products"
          className="inline-flex w-fit items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronLeft className="size-3.5" aria-hidden="true" />
          Back to products
        </Link>

        <div>
          <h1 className="text-lg font-semibold text-foreground md:text-xl">
            {productId ? 'Manage product' : 'Add product'}
          </h1>
          <p className="text-sm text-muted-foreground">
            {productId
              ? 'Update photos, pricing and stock, then save your changes.'
              : 'Add photos, set the price and stock, then publish it to your store.'}
          </p>
        </div>
      </div>

      <ProductForm productId={productId} />
    </div>
  );
}
