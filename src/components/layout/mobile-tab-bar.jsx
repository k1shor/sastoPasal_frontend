'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Package, ShoppingBag, MonitorSmartphone, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

const tabs = [
  { label: 'Products', href: '/products', icon: Package },
  { label: 'Orders', href: '/orders', icon: ShoppingBag },
  { label: 'POS', href: '/pos', icon: MonitorSmartphone },
];

/**
 * Fixed bottom tab bar shown only on mobile (< md).
 * The "More" tab is handled by the parent — it triggers the MoreSheet.
 */
export function MobileTabBar({ onMorePress }) {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 flex h-16 items-end justify-around border-t border-border bg-background/95 backdrop-blur-sm pb-safe md:hidden"
      aria-label="Mobile navigation"
    >
      {tabs.map((tab) => {
        const isActive = pathname.startsWith(tab.href);
        const Icon = tab.icon;

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              'flex flex-1 flex-col items-center gap-0.5 pt-2 pb-1 text-[11px] font-medium transition-colors min-h-[44px] justify-center',
              isActive ? 'text-primary' : 'text-muted-foreground',
            )}
          >
            <Icon className="size-5" />
            <span>{tab.label}</span>
          </Link>
        );
      })}

      {/* "More" button — triggers the sheet */}
      <button
        type="button"
        onClick={onMorePress}
        className="flex flex-1 flex-col items-center gap-0.5 pt-2 pb-1 text-[11px] font-medium text-muted-foreground transition-colors min-h-[44px] justify-center"
        aria-label="More navigation options"
      >
        <MoreHorizontal className="size-5" />
        <span>More</span>
      </button>
    </nav>
  );
}
