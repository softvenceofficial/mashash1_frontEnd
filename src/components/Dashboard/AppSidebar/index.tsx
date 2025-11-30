import * as React from "react";
import { Sidebar, SidebarContent, SidebarMenu } from "@/components/ui/sidebar";
import home from "@/assets/svgs/home.svg";
import file from "@/assets/svgs/my-file.svg";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import NavMain from "./NavMain";
import useTheme from "@/theme";
import Icon from "@/components/common/Icon";
import Trash from "@/assets/svgs/trash.svg";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import MobileSidebar from "./MobileSidebar";
import logo from "@/assets/svgs/logo.svg";

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

export function AppSidebar({
  sidebarOpen,
  setSidebarOpen,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}) {
  const isMobile = useIsMobile();
  const { theme } = useTheme();

  const items: TNavMenu[] = [
    {
      title: "Home",
      url: "/dashboard/home",
      icon: <Icon src={home} className="size-5 md:size-7" />,
      end: false,
    },
    {
      title: "My Files",
      url: "/dashboard/my-files",
      icon: <Icon src={file} className="size-5 md:size-7" />,
      end: false,
    },
    {
      title: "Trash",
      url: "/dashboard/trash",
      icon: <Icon src={Trash} className="size-5 md:size-7" />,
      end: false,
    },
  ];

  if (items.length < 0) {
    return;
  }

  return (
    <div>
      {isMobile && sidebarOpen && (
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent className="bg-white dark:bg-background">
            <div className="w-24 mt-4 mb-5">
              <Icon
                src={logo}
                className="size-8 text-center w-full text-primary dark:text-white ml-1"
              />
            </div>
            <div>
              {items.map((item, i) => {
                return <MobileSidebar key={i} item={item} />;
              })}
            </div>
          </SheetContent>
        </Sheet>
      )}
      <div
        className=" w-26 bg-white dark:bg-[#1B1B1B] fixed top-12 left-0 h-full"
        {...props}
      >
        <SidebarContent
          className={cn(
            "h-full py-6",
            !isMobile ? "px-2" : "px-4",
            theme === "light" ? "" : "bg-[#1B1B1B]",
          )}
        >
          <SidebarMenu className="flex flex-col gap-5 mt-8 h-[calc(100%-4rem)]">
            {items.map((item, i) => {
              return <NavMain key={i} isMobile={isMobile} item={item} />;
            })}
          </SidebarMenu>
        </SidebarContent>
      </div>
    </div>
  );
}
