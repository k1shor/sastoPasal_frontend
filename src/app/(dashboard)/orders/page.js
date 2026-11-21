import { OrdersTable } from '@/components/orders/orders-table';

export const metadata = {
  title: 'Orders SastoPasal',
  description: 'Track customer orders, payment status and delivery progress.',
};

export default function OrdersPage() {
  return (
    <div className="flex flex-col gap-5">
      <div className="min-w-0">
        <h1 className="text-lg font-semibold text-foreground md:text-xl">Orders</h1>
        <p className="text-sm text-muted-foreground">
          Review every order, its total and where it stands in fulfilment.
        </p>
      </div>

      <OrdersTable />
    </div>
  );
}
