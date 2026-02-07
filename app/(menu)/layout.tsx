'use client';

import Header from '@/components/layout/Header';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from '@/components/layout/Sidebar';

export default function MenuLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <Header />
          <main className="flex-1 overflow-y-auto bg-muted/40 p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
