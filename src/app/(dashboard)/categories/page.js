export const metadata = {
  title: 'Categories — SastoPasal',
  description: 'Organize your product catalog with categories and subcategories.',
};

export default function CategoriesPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-3">
      <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center">
        <span className="text-primary text-xl">ICON</span>
      </div>
      <h1 className="text-xl font-semibold text-foreground">Categories</h1>
      <p className="text-sm text-muted-foreground max-w-sm">
        Category management will be built here.
      </p>
    </div>
  );
}
