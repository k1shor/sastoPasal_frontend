import { ClipboardList } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  ORDER_STATUS,
  PAYMENT_METHOD,
  PAYMENT_STATUS,
  StatusBadge,
  firstProduct,
  formatDate,
  productLabel,
  shortId,
} from '@/components/orders/order-display';

export function OrderRow({ order }) {
  const statusMeta = ORDER_STATUS[order.orderStatus] ?? {
    label: order.orderStatus,
    className: 'border-border bg-muted text-muted-foreground',
  };
  const payment = PAYMENT_STATUS[order.paymentStatus] ?? {
    label: order.paymentStatus,
    className: 'text-muted-foreground',
  };
  const method = PAYMENT_METHOD[order.paymentMethod] ?? order.paymentMethod ?? '—';
  const methodShort = order.paymentMethod === 'cod' ? 'COD' : method;
  const units = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const product = firstProduct(order);
  const extraItems = order.items.length - 1;

  return (
    <tr className="border-t border-border transition-colors hover:bg-muted/40">
      <td className="px-2 py-3 align-middle sm:px-4">
        <p className="font-medium whitespace-nowrap text-foreground" title={order._id}>
          {shortId(order._id)}
        </p>
        <p className="mt-0.5 text-xs whitespace-nowrap text-muted-foreground">
          {formatDate(order.createdAt)}
        </p>
      </td>

      <td className="px-2 py-3 align-middle sm:px-4">
        <div className="flex items-center gap-2 sm:gap-2.5">
          <div className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-muted text-muted-foreground sm:size-9">
            {product?.image ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={product.image} alt={product.name} className="size-full object-cover" />
            ) : (
              <ClipboardList className="size-4" aria-hidden="true" />
            )}
          </div>

          <div className="min-w-0">
            <p className="max-w-[110px] truncate font-medium text-foreground sm:max-w-[220px]">
              {product?.name || productLabel(order.items[0])}
              {extraItems > 0 && (
                <span className="ml-1 font-normal text-muted-foreground">+{extraItems}</span>
              )}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground lg:hidden">
              {units} {units === 1 ? 'unit' : 'units'}
            </p>
          </div>
        </div>
      </td>

      <td className="hidden px-4 py-3 align-middle md:table-cell">
        <p className="max-w-[180px] truncate font-medium text-foreground">
          {order.shippingAddress?.fullName || 'Guest'}
        </p>
        <p className="mt-0.5 max-w-[180px] truncate text-xs text-muted-foreground">
          {[order.shippingAddress?.phone, order.shippingAddress?.city]
            .filter(Boolean)
            .join(' · ') || '—'}
        </p>
      </td>

      <td className="hidden px-4 py-3 align-middle lg:table-cell">
        <p className="text-sm whitespace-nowrap text-foreground">
          {units} {units === 1 ? 'unit' : 'units'}
        </p>
      </td>

      <td className="px-2 py-3 text-right align-middle sm:px-4">
        <span className="text-sm font-semibold whitespace-nowrap text-foreground">
          Rs. {order.totalAmount.toLocaleString('en-IN')}
        </span>
        {/* Payment is its own column only on wide screens. */}
        <span className="mt-1 flex flex-wrap justify-end gap-x-1 text-xs xl:hidden">
          <span className="text-muted-foreground">{methodShort}</span>
          <span className={cn('font-medium', payment.className)}>{payment.label}</span>
        </span>
      </td>

      <td className="hidden px-4 py-3 align-middle xl:table-cell">
        <p className="flex flex-wrap items-center gap-x-1.5 text-sm whitespace-nowrap text-foreground">
          <span>{method}</span>
          <span className={cn('font-medium', payment.className)}>{payment.label}</span>
        </p>
      </td>

      <td className="px-2 py-3 text-right align-middle sm:px-4">
        <StatusBadge label={statusMeta.label} className={statusMeta.className} />
      </td>
    </tr>
  );
}
