'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronDown, ImagePlus, Loader2, Plus, Star, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetCategoriesQuery } from '@/store/api/categories-api';
import {
  useCreateProductMutation,
  useGetProductQuery,
  useUpdateProductMutation,
} from '@/store/api/products-api';
import { cn } from '@/lib/utils';

const MAX_IMAGES = 6;
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

const PRODUCT_TYPES = [
  { value: 'new', label: 'New', hint: 'Brand new or sealed' },
  { value: 'used', label: 'Used', hint: 'Pre-owned item' },
];

const USED_CONDITIONS = [
  { value: 'like_new', label: 'Like new' },
  { value: 'excellent', label: 'Excellent' },
  { value: 'good', label: 'Good' },
  { value: 'fair', label: 'Fair' },
];

// The API expects image URLs. Until the media upload endpoint exists, files are
// kept as data URLs so a listing can still be previewed and published in mock mode.
function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error ?? new Error('Could not read image'));
    reader.readAsDataURL(file);
  });
}

const fieldClass =
  'h-9 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:bg-input/30';

function Section({ title, description, children }) {
  return (
    <section className="rounded-xl border border-border bg-card p-4 md:p-5">
      <div className="mb-4 flex flex-col gap-0.5">
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </div>
      <div className="flex flex-col gap-4">{children}</div>
    </section>
  );
}

function Field({ label, htmlFor, hint, error, required, action, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between gap-2">
        <label htmlFor={htmlFor} className="text-xs font-medium text-foreground">
          {label}
          {required && (
            <span className="ml-0.5 text-destructive" aria-hidden="true">
              *
            </span>
          )}
        </label>
        {action}
      </div>
      {children}
      {error ? (
        <p className="text-xs text-destructive">{error}</p>
      ) : hint ? (
        <p className="text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}

function Select({ className, children, ...props }) {
  return (
    <div className="relative">
      <select className={cn(fieldClass, 'appearance-none pr-8', className)} {...props}>
        {children}
      </select>
      <ChevronDown
        className="pointer-events-none absolute top-1/2 right-2.5 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
    </div>
  );
}

function FormSkeleton() {
  return (
    <div
      className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_340px]"
      role="status"
      aria-label="Loading product"
    >
      <div className="flex min-w-0 flex-col gap-5">
        <div className="rounded-xl border border-border bg-card p-4 md:p-5">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="mt-2 h-3 w-56" />
          <Skeleton className="mt-4 h-28 w-full rounded-xl" />
          <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="aspect-square rounded-lg" />
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 md:p-5">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="mt-2 h-3 w-48" />
          <Skeleton className="mt-4 h-9 w-full" />
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
          </div>
          <Skeleton className="mt-4 h-24 w-full rounded-lg" />
        </div>

        <div className="rounded-xl border border-border bg-card p-4 md:p-5">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="mt-2 h-3 w-44" />
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
          </div>
        </div>
      </div>

      <aside className="flex min-w-0 flex-col gap-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <Skeleton className="h-4 w-28" />
          <div className="mt-3 flex gap-3">
            <Skeleton className="size-16 shrink-0 rounded-lg" />
            <div className="min-w-0 flex-1">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="mt-2 h-3 w-2/3" />
              <Skeleton className="mt-2 h-4 w-20" />
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-2 border-t border-border pt-3">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-full" />
          </div>
        </div>

        <Skeleton className="h-[74px] w-full rounded-xl" />
        <Skeleton className="h-10 w-full rounded-lg" />
        <Skeleton className="h-10 w-full rounded-lg" />
        <Skeleton className="h-3 w-4/5" />
      </aside>
      <span className="sr-only">Loading product…</span>
    </div>
  );
}

export function ProductForm({ productId }) {
  const isEditing = Boolean(productId);
  const router = useRouter();
  const fileInputRef = useRef(null);
  const dragDepth = useRef(0);
  const prefilledId = useRef(null);

  const { data: categoriesData, isLoading: isLoadingCategories } = useGetCategoriesQuery();
  const {
    data: productData,
    isLoading: isLoadingProduct,
    isError: isProductError,
  } = useGetProductQuery(productId, { skip: !productId });
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const isSubmitting = isCreating || isUpdating;
  const categories = categoriesData?.data ?? [];

  const [images, setImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [imageError, setImageError] = useState('');
  const [formError, setFormError] = useState('');
  const [errors, setErrors] = useState({});
  const [fields, setFields] = useState({
    name: '',
    brand: '',
    category: '',
    description: '',
    price: '',
    stock: '',
    productType: 'new',
    usedCondition: '',
    productAge: '',
    defects: '',
    isAvailable: true,
  });

  const isUsed = fields.productType === 'used';

  // Fill the form once with the product being edited.
  useEffect(() => {
    const product = productData?.data;
    if (!product || prefilledId.current === product._id) return;
    prefilledId.current = product._id;

    setFields({
      name: product.name ?? '',
      brand: product.brand ?? '',
      category: product.category ?? '',
      description: product.description ?? '',
      price: product.price != null ? String(product.price) : '',
      stock: product.stock != null ? String(product.stock) : '',
      productType: product.productType === 'used' ? 'used' : 'new',
      usedCondition: product.usedCondition ?? '',
      productAge: product.productAge ?? '',
      defects: product.defects ?? '',
      isAvailable: product.isAvailable ?? true,
    });

    const saved = (product.images?.length ? product.images : [product.image]).filter(Boolean);
    setImages(
      saved.slice(0, MAX_IMAGES).map((url, index) => ({
        id: `saved-${index}`,
        name: `Saved photo ${index + 1}`,
        url,
      })),
    );
  }, [productData]);

  function setField(key, value) {
    setFields((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  async function addFiles(fileList) {
    const files = Array.from(fileList ?? []).filter((file) => file.type.startsWith('image/'));
    if (!files.length) {
      setImageError('Only image files can be added.');
      return;
    }

    const remaining = MAX_IMAGES - images.length;
    if (remaining <= 0) {
      setImageError(`You can add up to ${MAX_IMAGES} photos.`);
      return;
    }

    const tooLarge = files.find((file) => file.size > MAX_IMAGE_BYTES);
    if (tooLarge) {
      setImageError(`“${tooLarge.name}” is larger than 5 MB.`);
      return;
    }

    const accepted = files.slice(0, remaining);
    setImageError(
      files.length > remaining ? `Only ${remaining} more photo(s) could be added.` : '',
    );

    const next = await Promise.all(
      accepted.map(async (file) => ({
        id: `${file.name}-${file.size}-${Math.random().toString(36).slice(2, 8)}`,
        name: file.name,
        url: await readFileAsDataUrl(file),
      })),
    );

    setImages((prev) => [...prev, ...next]);
  }

  function removeImage(id) {
    setImages((prev) => prev.filter((image) => image.id !== id));
    setImageError('');
  }

  function makePrimary(id) {
    setImages((prev) => {
      const chosen = prev.find((image) => image.id === id);
      return chosen ? [chosen, ...prev.filter((image) => image.id !== id)] : prev;
    });
  }

  function handleDragEnter(event) {
    event.preventDefault();
    dragDepth.current += 1;
    setIsDragging(true);
  }

  function handleDragLeave(event) {
    event.preventDefault();
    dragDepth.current = Math.max(0, dragDepth.current - 1);
    if (dragDepth.current === 0) setIsDragging(false);
  }

  function handleDrop(event) {
    event.preventDefault();
    dragDepth.current = 0;
    setIsDragging(false);
    addFiles(event.dataTransfer?.files);
  }

  function validate() {
    const next = {};
    if (!fields.name.trim()) next.name = 'Give this product a name.';
    if (!fields.description.trim()) next.description = 'Add a short description.';

    const price = Number(fields.price);
    if (fields.price.trim() === '' || Number.isNaN(price) || price < 0) {
      next.price = 'Enter a valid price in NPR.';
    }

    const stock = Number(fields.stock);
    if (fields.stock.trim() !== '' && (Number.isNaN(stock) || stock < 0)) {
      next.stock = 'Stock cannot be negative.';
    }

    return next;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError('');

    const nextErrors = validate();
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    const imageUrls = images.map((image) => image.url);

    try {
      const payload = {
        name: fields.name.trim(),
        description: fields.description.trim(),
        price: Number(fields.price),
        category: fields.category || undefined,
        brand: fields.brand.trim(),
        images: imageUrls,
        image: imageUrls[0] ?? '',
        stock: fields.stock.trim() === '' ? 0 : Number(fields.stock),
        productType: fields.productType,
        usedCondition: isUsed ? fields.usedCondition : '',
        productAge: isUsed ? fields.productAge.trim() : '',
        defects: isUsed ? fields.defects.trim() : '',
        isAvailable: fields.isAvailable,
      };

      if (productId) {
        await updateProduct({ id: productId, ...payload }).unwrap();
      } else {
        await createProduct(payload).unwrap();
      }

      router.push('/products');
    } catch (error) {
      setFormError(
        error?.data?.message ??
          (productId
            ? 'Could not save this product. Please try again.'
            : 'Could not publish this product. Please try again.'),
      );
    }
  }

  if (isEditing && isLoadingProduct) {
    return <FormSkeleton />;
  }

  if (isEditing && isProductError) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-border bg-card px-4 py-16 text-center">
        <p className="text-sm font-medium text-foreground">Could not load this product</p>
        <p className="max-w-xs text-xs text-muted-foreground">
          The product may have been removed. Go back to the catalog and try again.
        </p>
        <Button variant="outline" size="lg" render={<Link href="/products" />} nativeButton={false}>
          Back to products
        </Button>
      </div>
    );
  }

  const priceLabel =
    Number(fields.price) >= 0 && fields.price.trim() !== ''
      ? `Rs. ${Number(fields.price).toLocaleString('en-IN')}`
      : 'Rs. 0';
  const categoryName = categories.find((category) => category._id === fields.category)?.name;

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_340px]"
    >
      <div className="flex min-w-0 flex-col gap-5">
        <Section title="Photos" description="The first photo is the cover shown in your catalog.">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            onDragEnter={handleDragEnter}
            onDragOver={(event) => event.preventDefault()}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              'flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-4 py-8 text-center transition-colors',
              isDragging
                ? 'border-primary bg-primary/5'
                : 'border-border bg-muted/30 hover:border-primary/50 hover:bg-muted/60',
            )}
          >
            <span className="flex size-10 items-center justify-center rounded-full bg-background text-muted-foreground">
              <ImagePlus className="size-5" aria-hidden="true" />
            </span>
            <span className="text-sm font-medium text-foreground">
              Drag photos here, or click to browse
            </span>
            <span className="text-xs text-muted-foreground">
              JPG, PNG or WebP · up to 5 MB each · max {MAX_IMAGES} photos
            </span>
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="sr-only"
            onChange={(event) => {
              addFiles(event.target.files);
              event.target.value = '';
            }}
          />

          {images.length > 0 && (
            <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {images.map((image, index) => (
                <li
                  key={image.id}
                  className="relative overflow-hidden rounded-lg border border-border bg-muted"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image.url}
                    alt={image.name}
                    className="aspect-square w-full object-cover"
                  />

                  {index === 0 ? (
                    <span className="absolute top-1 left-1 rounded-full bg-foreground/80 px-1.5 py-0.5 text-[10px] font-semibold text-background">
                      Cover
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => makePrimary(image.id)}
                      aria-label={`Use ${image.name} as the cover photo`}
                      className="absolute top-1 left-1 rounded-full bg-background/90 p-1 text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <Star className="size-3" aria-hidden="true" />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => removeImage(image.id)}
                    aria-label={`Remove ${image.name}`}
                    className="absolute top-1 right-1 rounded-full bg-background/90 p-1 text-muted-foreground transition-colors hover:text-destructive"
                  >
                    <X className="size-3" aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ul>
          )}

          {imageError && <p className="text-xs text-destructive">{imageError}</p>}
        </Section>

        <Section title="Product details" description="What customers see on the product page.">
          <Field label="Product name" htmlFor="name" required error={errors.name}>
            <Input
              id="name"
              value={fields.name}
              onChange={(event) => setField('name', event.target.value)}
              placeholder="e.g. Mansuli Basmati Rice (25kg Bag)"
              className="h-9"
              aria-invalid={Boolean(errors.name)}
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Brand" htmlFor="brand" hint="Leave empty for unbranded items.">
              <Input
                id="brand"
                value={fields.brand}
                onChange={(event) => setField('brand', event.target.value)}
                placeholder="e.g. Mansuli"
                className="h-9"
              />
            </Field>

            <Field
              label="Category"
              htmlFor="category"
              hint={isLoadingCategories ? 'Loading categories…' : undefined}
              action={
                <Link
                  href="/categories/manage"
                  target="_blank"
                  rel="noopener"
                  className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                >
                  <Plus className="size-3" aria-hidden="true" />
                  Add category
                </Link>
              }
            >
              <Select
                id="category"
                value={fields.category}
                onChange={(event) => setField('category', event.target.value)}
                disabled={isLoadingCategories}
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </Select>
            </Field>
          </div>

          <Field
            label="Description"
            htmlFor="description"
            required
            error={errors.description}
            hint="Condition, size, what's in the box — anything a buyer should know."
          >
            <textarea
              id="description"
              rows={4}
              value={fields.description}
              onChange={(event) => setField('description', event.target.value)}
              placeholder="Describe the product in a few sentences…"
              aria-invalid={Boolean(errors.description)}
              className={cn(fieldClass, 'min-h-24 resize-y py-2')}
            />
          </Field>
        </Section>

        <Section title="Pricing & inventory" description="Prices are in Nepali rupees (NPR).">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Price"
              htmlFor="price"
              required
              error={errors.price}
              hint="Selling price per unit."
            >
              <div className="relative">
                <span className="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-sm text-muted-foreground">
                  Rs.
                </span>
                <Input
                  id="price"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="1"
                  value={fields.price}
                  onChange={(event) => setField('price', event.target.value)}
                  placeholder="0"
                  aria-invalid={Boolean(errors.price)}
                  className="h-9 pl-9"
                />
              </div>
            </Field>

            <Field
              label="Stock"
              htmlFor="stock"
              error={errors.stock}
              hint="How many units you have."
            >
              <Input
                id="stock"
                type="number"
                inputMode="numeric"
                min="0"
                step="1"
                value={fields.stock}
                onChange={(event) => setField('stock', event.target.value)}
                placeholder="0"
                aria-invalid={Boolean(errors.stock)}
                className="h-9"
              />
            </Field>
          </div>
        </Section>

        <Section
          title="Type & condition"
          description="Used items need a condition and, ideally, known defects."
        >
          <div className="grid grid-cols-2 gap-2">
            {PRODUCT_TYPES.map((type) => {
              const active = fields.productType === type.value;

              return (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setField('productType', type.value)}
                  aria-pressed={active}
                  className={cn(
                    'flex flex-col items-start gap-0.5 rounded-lg border px-3 py-2.5 text-left transition-colors',
                    active
                      ? 'border-primary bg-primary/5'
                      : 'border-border bg-background hover:bg-muted',
                  )}
                >
                  <span className="text-sm font-medium text-foreground">{type.label}</span>
                  <span className="text-[11px] text-muted-foreground">{type.hint}</span>
                </button>
              );
            })}
          </div>

          {isUsed && (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Condition" htmlFor="usedCondition">
                <Select
                  id="usedCondition"
                  value={fields.usedCondition}
                  onChange={(event) => setField('usedCondition', event.target.value)}
                >
                  <option value="">Select a condition</option>
                  {USED_CONDITIONS.map((condition) => (
                    <option key={condition.value} value={condition.value}>
                      {condition.label}
                    </option>
                  ))}
                </Select>
              </Field>

              <Field label="Product age" htmlFor="productAge" hint="e.g. 1 year 4 months">
                <Input
                  id="productAge"
                  value={fields.productAge}
                  onChange={(event) => setField('productAge', event.target.value)}
                  placeholder="1 year 4 months"
                  className="h-9"
                />
              </Field>

              <div className="sm:col-span-2">
                <Field
                  label="Defects"
                  htmlFor="defects"
                  hint="Buyers can see this, so be specific."
                >
                  <textarea
                    id="defects"
                    rows={3}
                    value={fields.defects}
                    onChange={(event) => setField('defects', event.target.value)}
                    placeholder="e.g. Minor scuff on the bottom-left corner."
                    className={cn(fieldClass, 'min-h-20 resize-y py-2')}
                  />
                </Field>
              </div>
            </div>
          )}
        </Section>
      </div>

      <aside className="flex min-w-0 flex-col gap-4 lg:sticky lg:top-20">
        <div className="rounded-xl border border-border bg-card p-4">
          <h2 className="text-sm font-semibold text-foreground">Listing preview</h2>

          <div className="mt-3 flex gap-3">
            <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-muted text-muted-foreground">
              {images[0] ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={images[0].url} alt={images[0].name} className="size-full object-cover" />
              ) : (
                <ImagePlus className="size-5" aria-hidden="true" />
              )}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">
                {fields.name.trim() || 'Product name'}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {categoryName || 'No category'} · {isUsed ? 'Used' : 'New'}
              </p>
              <p className="mt-1 text-sm font-semibold text-foreground">{priceLabel}</p>
            </div>
          </div>

          <dl className="mt-4 flex flex-col gap-2 border-t border-border pt-3 text-xs">
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Stock</dt>
              <dd className="font-medium text-foreground">
                {fields.stock.trim() === '' ? '0 units' : `${fields.stock} units`}
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Photos</dt>
              <dd className="font-medium text-foreground">
                {images.length} / {MAX_IMAGES}
              </dd>
            </div>
          </dl>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold text-foreground">Available for sale</p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                Hide it from customers without deleting it.
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={fields.isAvailable}
              aria-label="Available for sale"
              onClick={() => setField('isAvailable', !fields.isAvailable)}
              className={cn(
                'relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition-colors',
                fields.isAvailable ? 'bg-primary' : 'bg-input',
              )}
            >
              <span
                className={cn(
                  'absolute top-0.5 left-0.5 size-5 rounded-full bg-background shadow-sm transition-transform',
                  fields.isAvailable && 'translate-x-5',
                )}
              />
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {formError && <p className="text-xs text-destructive">{formError}</p>}

          <Button type="submit" size="lg" className="h-10 w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              <Plus className="size-4" aria-hidden="true" />
            )}
            {isSubmitting
              ? isEditing
                ? 'Saving…'
                : 'Publishing…'
              : isEditing
                ? 'Save changes'
                : 'Publish product'}
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="h-10 w-full"
            render={<Link href="/products" />}
            nativeButton={false}
          >
            Cancel
          </Button>
        </div>

        <p className="text-[11px] text-muted-foreground">
          {isEditing
            ? 'Changes are saved to this listing on your vendor account, Himalayan Mart.'
            : 'This listing is created under your vendor account, Himalayan Mart.'}
        </p>
      </aside>
    </form>
  );
}
