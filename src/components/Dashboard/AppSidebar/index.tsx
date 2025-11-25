/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
} from "@/components/ui/sidebar";
import assets from "@/assets";
import DashboardIcon from "@/assets/svgs/home.svg?react";
import CalculatorIcon from "@/assets/svgs/calendar-plus.svg?react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import NavMain from "./NavMain";
import useTheme from "@/theme";

export type TNavMenu = {
  title: string;
  url: string;
  icon: React.ReactNode;
  end: boolean;
  subItems?: {
    title: string;
    url: string;
    icon: React.ReactNode;
    end: boolean;
  }[];
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // const { state } = useSidebar();
  const state = "collapsed";
  const isMobile = useIsMobile();
  // const location = useLocation();
  const { theme } = useTheme();

  const items: TNavMenu[] = [
    {
      title: "Dashboard",
      url: "/dashboard/home",
      icon: <DashboardIcon />,
      end: false,
    },
    {
      title: "Calendar",
      url: "/dashboard/calendar-management",
      icon: <CalculatorIcon />,
      end: true,
    },
  ];

  // Helper function to check if any sub-item is active
  // const isSubItemActive = (subItems: any[]) => {
  //   return subItems.some((subItem) => {
  //     if (subItem.end) {
  //       return location.pathname === subItem.url;
  //     }
  //     return location.pathname.startsWith(subItem.url);
  //   });
  // };

  // Helper function to check if main item is active (excluding parent items with sub-items)
  // const isItemActive = (item: any) => {
  //   // For items with sub-items, only check direct URL match, not sub-items
  //   if (item.subItems) {
  //     if (item.end) {
  //       return location.pathname === item.url;
  //     }
  //     return (
  //       location.pathname.startsWith(item.url) &&
  //       !isSubItemActive(item.subItems)
  //     );
  //   }
  //   // For items without sub-items, check normally
  //   if (item.end) {
  //     return location.pathname === item.url;
  //   }
  //   return location.pathname.startsWith(item.url);
  // };

  if (items.length < 0) {
    return;
  }

  return (
    <div
      className="top-(--header-height) h-[calc(100vh-var(--header-height))]! w-28 bg-white!"
      {...props}
    >
      <div className="md:hidden py-5">
        <img src={assets.image.logo} alt="logo" className="w-[12rem] mx-auto" />
      </div>

      <SidebarContent
        className={cn(
          "h-full rounded-r-3xl py-6",
          state === "collapsed" && !isMobile ? "px-2" : "px-4",
          theme === "light" ? "" : "sidebar-dark border-r-2"
        )}
      >
        <SidebarMenu>
          {items.map((item, i) => {
            // const isActive = isItemActive(item);
            return (
              <NavMain key={i} isMobile={isMobile} item={item} state={state} />
            );
          })}
        </SidebarMenu>
      </SidebarContent>
    </div>
  );
}
