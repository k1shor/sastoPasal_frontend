'use client';

import { usePathname } from 'next/navigation';
import { Sun, Moon, Bell } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Logo } from '@/components/layout/logo';

const PAGE_TITLES = {
  products: 'Products',
  categories: 'Categories',
  orders: 'Orders',
  sales: 'Sales',
  pos: 'POS Terminal',
};

function usePageTitle() {
  const pathname = usePathname();
  const segment = pathname.split('/').filter(Boolean)[0] ?? 'products';
  return PAGE_TITLES[segment] ?? 'Dashboard';
}

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      className="size-9 rounded-lg text-muted-foreground hover:text-foreground"
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      aria-label="Toggle colour theme"
    >
      <Sun className="size-4 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute size-4 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
    </Button>
  );
}

export function Navbar() {
  const title = usePageTitle();

  return (
    <header className="sticky top-0 z-40 flex h-14 md:h-16 items-center gap-2 border-b border-border bg-card px-4 md:px-6">
      {/* ── Left:  ── */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        {/* Mobile logo — sidebar is hidden below md */}
        <div className="flex md:hidden">
          <Logo size="sm" showName />
        </div>

        {/* Page title — desktop/tablet only */}
        <span className="hidden md:block truncate font-semibold text-base text-foreground">
          {title}
        </span>
      </div>

      {/* ── Right: store status (desktop), theme toggle, notifications, avatar ── */}
      <div className="flex items-center gap-1.5">
        {/* Store online indicator — desktop only */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-success/10 text-success text-xs font-medium mr-1">
          <span className="size-1.5 rounded-full bg-success animate-pulse" />
          Physical + Online Live
        </div>

        <ThemeToggle />

        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="relative size-9 rounded-lg text-muted-foreground hover:text-foreground"
          aria-label="View notifications"
        >
          <Bell className="size-4" />
          {/* Static badge — placeholder */}
          <Badge className="absolute -top-0.5 -right-0.5 size-4 p-0 flex items-center justify-center text-[10px] font-bold bg-destructive text-white border-0">
            3
          </Badge>
        </Button>

        <Separator orientation="vertical" className="mx-1 h-6" />

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <button
                className="flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-muted transition-colors"
                aria-label="Open user menu"
              />
            }
          >
            <Avatar className="size-7">
              <AvatarFallback className="text-xs font-semibold bg-primary text-primary-foreground">
                HM
              </AvatarFallback>
            </Avatar>
            <div className="hidden md:flex flex-col text-left leading-tight">
              <span className="text-xs font-semibold text-foreground truncate max-w-[120px]">
                Himalayan Mart
              </span>
              <span className="text-[11px] text-muted-foreground">Vendor Admin</span>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>
              <div className="flex flex-col leading-tight">
                <span className="font-semibold">Himalayan Mart</span>
                <span className="text-xs text-muted-foreground font-normal">Kalanki Branch</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Store Settings</DropdownMenuItem>
            <DropdownMenuItem>Account</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
