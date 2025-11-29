import { AppSidebar } from "@/components/Dashboard/AppSidebar";
import { SiteHeader } from "@/components/Dashboard/DashboardHeader";
import Modals from "@/components/Modal";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router";

export default function DashboardLayout() {
  return (
    <>
      <div className="[--header-height:calc(--spacing(14))]">
        <SidebarProvider className="flex flex-col">
          <SiteHeader />
          <div className="flex flex-1">
            <AppSidebar />
            <SidebarInset className="p-4 md:p-10 ml-26">
              <Outlet />
            </SidebarInset>
          </div>
        </SidebarProvider>
        <Modals />
      </div>
    </>
  );
}
