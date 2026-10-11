export const metadata = {
  title: 'Products — SastoPasal',
  description: 'Manage your product catalog and inventory across all channels.',
};

export default function ProductsPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-3">
      <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center">
        <span className="text-primary text-xl">ICON</span>
      </div>
      <h1 className="text-xl font-semibold text-foreground">Products</h1>
      <p className="text-sm text-muted-foreground max-w-sm">
        Product inventory, search, filters, and management will be built here.
      </p>
    </div>
  );
}
