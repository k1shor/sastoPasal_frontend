export const metadata = {
  title: 'Sales — SastoPasal',
  description: 'View sales analytics, revenue reports, and performance metrics.',
};

export default function SalesPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-3">
      <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center">
        <span className="text-primary text-xl">ICON</span>
      </div>
      <h1 className="text-xl font-semibold text-foreground">Sales</h1>
      <p className="text-sm text-muted-foreground max-w-sm">
        Sales analytics and reporting will be built here.
      </p>
    </div>
  );
}
