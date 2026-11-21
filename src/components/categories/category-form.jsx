'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronDown, ImagePlus, Loader2, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  useCreateCategoryMutation,
  useGetCategoriesQuery,
  useGetCategoryQuery,
  useUpdateCategoryMutation,
} from '@/store/api/categories-api';
import { cn } from '@/lib/utils';

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// The API expects an image URL. Until the media upload endpoint exists, files are
// kept as data URLs so a category can still be previewed and saved in mock mode.
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

function Field({ label, htmlFor, hint, error, required, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-xs font-medium text-foreground">
        {label}
        {required && (
          <span className="ml-0.5 text-destructive" aria-hidden="true">
            *
          </span>
        )}
      </label>
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
      aria-label="Loading category"
    >
      <div className="flex min-w-0 flex-col gap-5">
        <div className="rounded-xl border border-border bg-card p-4 md:p-5">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="mt-2 h-3 w-52" />
          <Skeleton className="mt-4 h-32 w-full rounded-xl" />
        </div>

        <div className="rounded-xl border border-border bg-card p-4 md:p-5">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="mt-2 h-3 w-48" />
          <Skeleton className="mt-4 h-9 w-full" />
          <Skeleton className="mt-4 h-9 w-full" />
          <Skeleton className="mt-4 h-24 w-full rounded-lg" />
          <Skeleton className="mt-4 h-9 w-full" />
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
            </div>
          </div>
        </div>
        <Skeleton className="h-[74px] w-full rounded-xl" />
        <Skeleton className="h-10 w-full rounded-lg" />
        <Skeleton className="h-10 w-full rounded-lg" />
        <Skeleton className="h-3 w-4/5" />
      </aside>
      <span className="sr-only">Loading category…</span>
    </div>
  );
}

export function CategoryForm({ categoryId }) {
  const isEditing = Boolean(categoryId);
  const router = useRouter();
  const fileInputRef = useRef(null);
  const prefilledId = useRef(null);

  const { data: categoriesData } = useGetCategoriesQuery();
  const {
    data: categoryData,
    isLoading: isLoadingCategory,
    isError: isCategoryError,
  } = useGetCategoryQuery(categoryId, { skip: !categoryId });
  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();
  const isSubmitting = isCreating || isUpdating;

  const categories = categoriesData?.data ?? [];

  const [image, setImage] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [imageError, setImageError] = useState('');
  const [slugEdited, setSlugEdited] = useState(false);
  const [formError, setFormError] = useState('');
  const [errors, setErrors] = useState({});
  const [fields, setFields] = useState({
    name: '',
    slug: '',
    description: '',
    parent: '',
    isActive: true,
  });

  // Fill the form once with the category being edited.
  useEffect(() => {
    const category = categoryData?.data;
    if (!category || prefilledId.current === category._id) return;
    prefilledId.current = category._id;

    setFields({
      name: category.name ?? '',
      slug: category.slug ?? '',
      description: category.description ?? '',
      parent: category.parent ?? '',
      isActive: category.isActive ?? true,
    });
    setImage(category.image ?? '');
    setSlugEdited(true);
  }, [categoryData]);

  function setField(key, value) {
    setFields((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  function handleNameChange(value) {
    setFields((prev) => ({
      ...prev,
      name: value,
      slug: slugEdited ? prev.slug : slugify(value),
    }));
    setErrors((prev) => {
      if (!prev.name && !prev.slug) return prev;
      const next = { ...prev };
      delete next.name;
      if (!slugEdited) delete next.slug;
      return next;
    });
  }

  function handleSlugChange(value) {
    setSlugEdited(true);
    setField('slug', value.toLowerCase().replace(/\s+/g, '-'));
  }

  async function addFile(fileList) {
    const file = Array.from(fileList ?? []).find((item) => item.type.startsWith('image/'));
    if (!file) {
      setImageError('Only image files can be added.');
      return;
    }

    if (file.size > MAX_IMAGE_BYTES) {
      setImageError(`“${file.name}” is larger than 5 MB.`);
      return;
    }

    setImageError('');
    setImage(await readFileAsDataUrl(file));
  }

  function handleDrop(event) {
    event.preventDefault();
    setIsDragging(false);
    addFile(event.dataTransfer?.files);
  }

  function validate() {
    const next = {};
    if (!fields.name.trim()) next.name = 'Give this category a name.';

    const slug = fields.slug.trim();
    if (!slug) {
      next.slug = 'Add a URL slug.';
    } else if (!SLUG_PATTERN.test(slug)) {
      next.slug = 'Use lowercase letters, numbers and single dashes only.';
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

    try {
      const payload = {
        name: fields.name.trim(),
        slug: fields.slug.trim(),
        description: fields.description.trim(),
        image,
        parent: fields.parent || null,
        isActive: fields.isActive,
      };

      if (categoryId) {
        await updateCategory({ id: categoryId, ...payload }).unwrap();
      } else {
        await createCategory(payload).unwrap();
      }

      router.push('/categories');
    } catch (error) {
      setFormError(
        error?.data?.message ??
          (categoryId
            ? 'Could not save this category. Please try again.'
            : 'Could not create this category. Please try again.'),
      );
    }
  }

  if (isEditing && isLoadingCategory) {
    return <FormSkeleton />;
  }

  if (isEditing && isCategoryError) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-border bg-card px-4 py-16 text-center">
        <p className="text-sm font-medium text-foreground">Could not load this category</p>
        <p className="max-w-xs text-xs text-muted-foreground">
          The category may have been removed. Go back to categories and try again.
        </p>
        <Button
          variant="outline"
          size="lg"
          render={<Link href="/categories" />}
          nativeButton={false}
        >
          Back to categories
        </Button>
      </div>
    );
  }

  const parentName = categories.find((category) => category._id === fields.parent)?.name;
  const parentOptions = categories.filter((category) => category._id !== categoryId);

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_340px]"
    >
      <div className="flex min-w-0 flex-col gap-5">
        <Section title="Category image" description="Shown with the category in your catalog.">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(event) => {
              addFile(event.target.files);
              event.target.value = '';
            }}
          />

          {image ? (
            <div className="relative overflow-hidden rounded-xl border border-border bg-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image} alt="Category image" className="aspect-[16/9] w-full object-cover" />
              <button
                type="button"
                onClick={() => setImage('')}
                aria-label="Remove category image"
                className="absolute top-2 right-2 rounded-full bg-background/90 p-1.5 text-muted-foreground transition-colors hover:text-destructive"
              >
                <X className="size-3.5" aria-hidden="true" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              onDragEnter={(event) => {
                event.preventDefault();
                setIsDragging(true);
              }}
              onDragOver={(event) => event.preventDefault()}
              onDragLeave={(event) => {
                event.preventDefault();
                setIsDragging(false);
              }}
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
                Drag an image here, or click to browse
              </span>
              <span className="text-xs text-muted-foreground">JPG, PNG or WebP · up to 5 MB</span>
            </button>
          )}

          {image && (
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="h-9 w-fit"
              onClick={() => fileInputRef.current?.click()}
            >
              Replace image
            </Button>
          )}

          {imageError && <p className="text-xs text-destructive">{imageError}</p>}
        </Section>

        <Section title="Category details" description="How this category is named and addressed.">
          <Field label="Name" htmlFor="name" required error={errors.name}>
            <Input
              id="name"
              value={fields.name}
              onChange={(event) => handleNameChange(event.target.value)}
              placeholder="e.g. Beverages"
              className="h-9"
              aria-invalid={Boolean(errors.name)}
            />
          </Field>

          <Field
            label="Slug"
            htmlFor="slug"
            required
            error={errors.slug}
            hint="Used in the storefront URL. Generated from the name until you edit it."
          >
            <div className="relative">
              <span className="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-sm text-muted-foreground">
                /
              </span>
              <Input
                id="slug"
                value={fields.slug}
                onChange={(event) => handleSlugChange(event.target.value)}
                placeholder="beverages"
                className="h-9 pl-5"
                aria-invalid={Boolean(errors.slug)}
              />
            </div>
          </Field>

          <Field
            label="Description"
            htmlFor="description"
            hint="A short line customers may see alongside the category."
          >
            <textarea
              id="description"
              rows={4}
              value={fields.description}
              onChange={(event) => setField('description', event.target.value)}
              placeholder="e.g. Tea, coffee and packaged drinks."
              className={cn(fieldClass, 'min-h-24 resize-y py-2')}
            />
          </Field>

          <Field
            label="Parent category"
            htmlFor="parent"
            hint="Leave empty to keep this as a top-level category."
          >
            <Select
              id="parent"
              value={fields.parent}
              onChange={(event) => setField('parent', event.target.value)}
            >
              <option value="">No parent (top level)</option>
              {parentOptions.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </Select>
          </Field>
        </Section>
      </div>

      <aside className="flex min-w-0 flex-col gap-4 lg:sticky lg:top-20">
        <div className="rounded-xl border border-border bg-card p-4">
          <h2 className="text-sm font-semibold text-foreground">Category preview</h2>

          <div className="mt-3 flex gap-3">
            <div className="relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-muted text-muted-foreground">
              {image ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={image} alt="" className="size-full object-cover" />
              ) : (
                <ImagePlus className="size-5" aria-hidden="true" />
              )}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">
                {fields.name.trim() || 'Category name'}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                /{fields.slug.trim() || 'slug'}
              </p>
              <p className="mt-1 truncate text-[11px] text-muted-foreground">
                {parentName ? `Subcategory of ${parentName}` : 'Top-level category'}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold text-foreground">Active</p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                Hide it from customers without deleting it.
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={fields.isActive}
              aria-label="Active"
              onClick={() => setField('isActive', !fields.isActive)}
              className={cn(
                'relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition-colors',
                fields.isActive ? 'bg-primary' : 'bg-input',
              )}
            >
              <span
                className={cn(
                  'absolute top-0.5 left-0.5 size-5 rounded-full bg-background shadow-sm transition-transform',
                  fields.isActive && 'translate-x-5',
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
              <Save className="size-4" aria-hidden="true" />
            )}
            {isSubmitting
              ? isEditing
                ? 'Saving…'
                : 'Creating…'
              : isEditing
                ? 'Save changes'
                : 'Create category'}
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="h-10 w-full"
            render={<Link href="/categories" />}
            nativeButton={false}
          >
            Cancel
          </Button>
        </div>

        <p className="text-[11px] text-muted-foreground">
          {isEditing
            ? 'Changes are saved to this category on your vendor account, Himalayan Mart.'
            : 'This category is created under your vendor account, Himalayan Mart.'}
        </p>
      </aside>
    </form>
  );
}
