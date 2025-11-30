import { AppSidebar } from "@/components/Dashboard/AppSidebar";
import { SiteHeader } from "@/components/Dashboard/DashboardHeader";
import Modals from "@/components/Modal";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useState } from "react";
import { Outlet } from "react-router";

export default function DashboardLayout() {
  const [ sidebarOpen, setSidebarOpen] = useState(false)
  return (
    <>
      <div className="[--header-height:calc(--spacing(14))]">
        <SidebarProvider className="flex flex-col">
          <SiteHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <div className="flex flex-1">
              <AppSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <SidebarInset className="p-4 md:p-10 md:ml-26">
              <Outlet />
            </SidebarInset>
          </div>
        </SidebarProvider>
        <Modals />
      </div>
    </>
  );
}
