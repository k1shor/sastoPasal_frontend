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
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Products', href: '/products', icon: Package },
  { label: 'Categories', href: '/categories', icon: LayoutGrid },
  { label: 'Orders', href: '/orders', icon: ShoppingBag, badge: '12' },
  { label: 'Sales', href: '/sales', icon: BarChart3 },
  { label: 'POS Terminal', href: '/pos', icon: MonitorSmartphone },
];

function NavItem({ item, isCollapsed }) {
  const pathname = usePathname();
  const isActive = pathname.startsWith(item.href);
  const Icon = item.icon;

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        render={<Link href={item.href} />}
        isActive={isActive}
        tooltip={
          isCollapsed ? (item.badge ? `${item.label} (${item.badge})` : item.label) : undefined
        }
        className={cn(
          'h-10 gap-2.5 rounded-lg px-3 transition-colors',
          isActive
            ? 'bg-sidebar-primary text-sidebar-primary-foreground data-active:bg-sidebar-primary data-active:text-sidebar-primary-foreground font-medium hover:bg-sidebar-primary hover:text-sidebar-primary-foreground'
            : 'text-muted-foreground hover:bg-muted hover:text-foreground',
        )}
      >
        <Icon className="size-5 shrink-0" />
        {!isCollapsed && <span className="truncate">{item.label}</span>}
        {!isCollapsed && item.badge && (
          <Badge
            variant="secondary"
            className={cn(
              'ml-auto shrink-0 text-xs font-semibold',
              isActive ? 'bg-white/20 text-white' : 'bg-warning/20 text-warning-foreground',
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
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      {/* ── Header: Collapse control + logo ── */}
      <SidebarHeader className="px-4 py-3">
        <div
          className={cn(
            'flex min-w-0 gap-2',
            isCollapsed ? 'flex-col items-center' : 'flex-row items-center justify-between',
          )}
        >
          <div className="flex items-center mt-2 gap-2 min-w-0">
            {/* SVG logo mark — always visible */}
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              className="shrink-0"
              aria-hidden="true"
            >
              <rect width="32" height="32" rx="8" className="fill-primary" />
              <path
                d="M9 12h14M9 16h10M9 20h12"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle cx="23" cy="20" r="3" fill="white" />
            </svg>
            {/* Wordmark — hidden when icon-only */}
            {!isCollapsed && (
              <div className="min-w-0">
                <span className="block font-bold text-base leading-tight tracking-tight text-foreground truncate">
                  SastoPasal
                </span>
                <span className="block text-[11px] text-muted-foreground leading-tight truncate">
                  Vendor Portal
                </span>
              </div>
            )}
          </div>

          <SidebarTrigger className="size-8 shrink-0 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
            {isCollapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
          </SidebarTrigger>
        </div>

        {/* Store status pill */}
        {!isCollapsed && (
          <div className="mt-2 flex items-center gap-1.5 px-1">
            <span className="size-2 rounded-full bg-success animate-pulse shrink-0" />
            <span className="text-xs text-muted-foreground truncate">
              Kathmandu Hub · Store Online
            </span>
          </div>
        )}
      </SidebarHeader>

      <Separator className="bg-sidebar-border" />

      {/* ── Nav ── */}
      <SidebarContent className="px-2 py-3">
        <SidebarGroup>
          {!isCollapsed && (
            <SidebarGroupLabel className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-2 mb-1">
              Omnichannel Catalog
            </SidebarGroupLabel>
          )}
          <SidebarMenu className="gap-0.5">
            {navItems.map((item) => (
              <NavItem key={item.href} item={item} isCollapsed={isCollapsed} />
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* ── Footer: Help ── */}
      <SidebarFooter className="px-2 pb-4">
        <Separator className="mb-3 bg-sidebar-border" />

        <SidebarMenu>
          <NavItem
            item={{ label: 'Help & Support', href: '/help', icon: HelpCircle }}
            isCollapsed={isCollapsed}
          />
        </SidebarMenu>
      </SidebarFooter>

      {/* Resize rail for drag-to-resize (desktop) */}
      <SidebarRail />
    </Sidebar>
  );
}
