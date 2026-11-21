import { cn } from '@/lib/utils';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const ORDER_STATUS = {
  pending: {
    label: 'Pending',
    className: 'border-warning/30 bg-warning/10 text-warning-foreground dark:text-warning',
  },
  accepted: {
    label: 'Accepted',
    className: 'border-info/30 bg-info/10 text-info',
  },
  shipped: {
    label: 'Shipped',
    className: 'border-primary/30 bg-primary/10 text-primary',
  },
  delivered: {
    label: 'Delivered',
    className: 'border-success/30 bg-success/10 text-success',
  },
  cancelled: {
    label: 'Cancelled',
    className: 'border-destructive/30 bg-destructive/10 text-destructive',
  },
};

export const PAYMENT_STATUS = {
  pending: {
    label: 'Unpaid',
    className: 'text-foreground dark:text-warning',
  },
  paid: {
    label: 'Paid',
    className: 'text-success',
  },
  failed: {
    label: 'Failed',
    className: 'text-destructive',
  },
  refunded: {
    label: 'Refunded',
    className: 'text-muted-foreground',
  },
};

export const PAYMENT_METHOD = {
  cod: 'Cash on delivery',
  online: 'Online',
};

export const STATUS_TABS = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
];

export function formatDate(iso) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '—';

  return `${String(date.getUTCDate()).padStart(2, '0')} ${MONTHS[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}

export function shortId(id) {
  return `#${String(id ?? '')
    .slice(-6)
    .toUpperCase()}`;
}

// `items.product` is an ObjectId unless the API populates it (see docs/API_CONTRACT.md).
export function firstProduct(order) {
  const product = order.items?.[0]?.product;
  return product && typeof product === 'object' ? product : null;
}

export function productLabel(item) {
  const product = item.product;
  if (product && typeof product === 'object') return product.name || 'Product';
  return `Product ${shortId(product)}`;
}

export function filterOrders(orders, status, search) {
  const query = search.trim().toLowerCase();

  return orders.filter((order) => {
    if (status !== 'all' && order.orderStatus !== status) return false;
    if (!query) return true;

    const haystack = [
      order._id,
      order.shippingAddress?.fullName,
      order.shippingAddress?.city,
      ...order.items.map((item) => productLabel(item)),
    ];

    return haystack.some((value) => value?.toLowerCase().includes(query));
  });
}

export function countOrdersByStatus(orders) {
  const counts = { all: orders.length };

  for (const order of orders) {
    counts[order.orderStatus] = (counts[order.orderStatus] ?? 0) + 1;
  }

  return counts;
}

export function StatusBadge({ label, className }) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center rounded-full border px-2.5 py-1 text-sm font-semibold whitespace-nowrap',
        className,
      )}
    >
      {label}
    </span>
  );
}
