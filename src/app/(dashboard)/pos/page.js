export const metadata = {
  title: 'POS Terminal — SastoPasal',
  description: 'In-store point of sale terminal for fast checkout and inventory scanning.',
};

export default function PosPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-3">
      <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center">
        <span className="text-primary text-xl">ICON</span>
      </div>
      <h1 className="text-xl font-semibold text-foreground">POS Terminal</h1>
      <p className="text-sm text-muted-foreground max-w-sm">
        Point of sale checkout, barcode scanning, and receipt printing will be built here.
      </p>
    </div>
  );
}
