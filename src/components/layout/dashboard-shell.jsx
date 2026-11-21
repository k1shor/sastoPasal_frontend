'use client';

import { useState } from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { Navbar } from '@/components/layout/navbar';
import { MobileTabBar } from '@/components/layout/mobile-tab-bar';
import { MoreSheet } from '@/components/layout/more-sheet';

export function DashboardShell({ children }) {
  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <SidebarProvider defaultOpen={true}>
      {/* Sidebar — hidden on mobile  */}
      <AppSidebar />

      {/* Main content area — SidebarInset handles the left offset */}
      <SidebarInset className="flex flex-col min-h-screen">
        <Navbar />

        <main className="flex-1 p-4 md:p-6 pb-20 md:pb-6">{children}</main>
      </SidebarInset>

      <MobileTabBar onMorePress={() => setMoreOpen(true)} />
      <MoreSheet open={moreOpen} onOpenChange={setMoreOpen} />
    </SidebarProvider>
  );
}
