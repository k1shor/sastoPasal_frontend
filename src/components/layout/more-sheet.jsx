'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, BarChart3, Settings, HelpCircle } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

const moreLinks = [
  { label: 'Categories', href: '/categories', icon: LayoutGrid },
  { label: 'Sales', href: '/sales', icon: BarChart3 },
];

const secondaryLinks = [
  { label: 'Store Settings', href: '/settings', icon: Settings },
  { label: 'Help & Support', href: '/help', icon: HelpCircle },
];

/**
 * Bottom sheet triggered by the "More" tab on mobile.
 * Contains nav items that don't fit in the bottom tab bar.
 */
export function MoreSheet({ open, onOpenChange }) {
  const pathname = usePathname();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-2xl pb-safe">
        <SheetHeader className="pb-3">
          <SheetTitle className="text-base font-semibold">More</SheetTitle>
          <SheetDescription className="sr-only">
            Additional navigation options for Categories, Sales, Settings, and Help.
          </SheetDescription>
        </SheetHeader>

        <nav className="flex flex-col gap-1" aria-label="More navigation">
          {moreLinks.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => onOpenChange(false)}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors min-h-[44px]',
                  isActive ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-muted',
                )}
              >
                <Icon className="size-5 shrink-0" />
                {item.label}
              </Link>
            );
          })}

          <Separator className="my-2" />

          {secondaryLinks.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => onOpenChange(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors min-h-[44px]"
              >
                <Icon className="size-5 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
