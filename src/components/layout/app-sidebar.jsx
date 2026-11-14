'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Package,
  LayoutGrid,
  ShoppingBag,
  BarChart3,
  MonitorSmartphone,
  HelpCircle,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Badge } from '@/components/ui/badge';
import { Logo } from '@/components/layout/logo';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Products', href: '/products', icon: Package },
  { label: 'Categories', href: '/categories', icon: LayoutGrid },
  { label: 'Orders', href: '/orders', icon: ShoppingBag, badge: '12' },
  { label: 'Sales', href: '/sales', icon: BarChart3 },
  { label: 'POS Terminal', href: '/pos', icon: MonitorSmartphone },
];

function NavItem({ item }) {
  const pathname = usePathname();
  const isActive = pathname.startsWith(item.href);
  const Icon = item.icon;

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        render={<Link href={item.href} />}
        isActive={isActive}
        tooltip={item.badge ? `${item.label} (${item.badge})` : item.label}
        className={cn(
          'h-12 gap-3.5 rounded-full px-4 text-[15px] transition-colors',
          isActive
            ? 'bg-primary font-medium text-primary-foreground shadow-sm hover:bg-primary/90 hover:text-primary-foreground data-active:bg-primary data-active:text-primary-foreground'
            : 'font-normal text-sidebar-foreground/65 hover:bg-sidebar-foreground/5 hover:text-sidebar-foreground',
        )}
      >
        <Icon className="size-5 shrink-0" strokeWidth={1.75} />
        <span className="truncate group-data-[collapsible=icon]:hidden">{item.label}</span>
        {item.badge && (
          <Badge
            variant="secondary"
            className={cn(
              'ml-auto shrink-0 rounded-full px-2 text-[11px] font-semibold group-data-[collapsible=icon]:hidden',
              isActive
                ? 'bg-primary-foreground/20 text-primary-foreground'
                : 'bg-sidebar-foreground/10 text-sidebar-foreground/70',
            )}
          >
            {item.badge}
          </Badge>
        )}
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      {/* ── Brand + collapse control ── */}
      <SidebarHeader className="px-4 pt-6 pb-4">
        <div className="flex items-center justify-between gap-3 group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:pt-1 group-data-[collapsible=icon]:gap-2.5">
          <Link
            href="/products"
            className="flex min-w-0 items-center rounded-lg outline-hidden focus-visible:ring-2 focus-visible:ring-sidebar-ring"
            aria-label="SastoPasal home"
          >
            <Logo showName nameClassName="group-data-[collapsible=icon]:hidden" />
          </Link>

          <SidebarTrigger className="size-8 shrink-0 rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground group-data-[collapsible=icon]:size-7" />
        </div>
      </SidebarHeader>

      {/* ── Navigation ── */}
      <SidebarContent className="px-3 pt-6 pb-2">
        <SidebarMenu className="gap-2.5">
          {navItems.map((item) => (
            <NavItem key={item.href} item={item} />
          ))}
        </SidebarMenu>
      </SidebarContent>

      {/* ── Help ── */}
      <SidebarFooter className="px-3 pt-2 pb-4">
        <SidebarMenu>
          <NavItem item={{ label: 'Help & Support', href: '/help', icon: HelpCircle }} />
        </SidebarMenu>
      </SidebarFooter>

      {/* Resize rail for drag-to-resize (desktop) */}
      <SidebarRail />
    </Sidebar>
  );
}
