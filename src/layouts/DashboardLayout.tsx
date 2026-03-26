import { AppSidebar } from "@/components/Dashboard/AppSidebar";
import { SiteHeader } from "@/components/Dashboard/DashboardHeader";
import Modals from "@/components/Modal";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useState } from "react";
import { Outlet } from "react-router";

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <>
      <div className="flex h-screen w-full overflow-hidden bg-background">
        <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:shrink-0 border-r border-border">
          <SidebarProvider>
            <AppSidebar
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
            />
          </SidebarProvider>
        </aside>
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <SiteHeader
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />
          <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
        <Modals />
      </div>
    </>
  );
}
