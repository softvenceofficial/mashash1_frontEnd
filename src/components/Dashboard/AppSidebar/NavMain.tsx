import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { NavLink } from "react-router";
import type { TNavMenu } from ".";

export default function NavMain({
  item,
  isMobile,
}: {
  item: TNavMenu;
  isMobile: boolean;
}) {
  return (
    <SidebarMenuItem>
      <NavLink
        to={item.url}
        end={item.end}
        className={({ isActive }) =>
          `w-full group/item ${isActive ? "text-primary" : "text-white"}`
        }
      >
        {({ isActive }) => (
          <SidebarMenuButton
            tooltip={item.title}
            className={cn(
              "w-full text-foreground flex flex-col items-center py-3 px-2 md:px-4 rounded-lg",
              isActive ? "text-primary dark:text-white font-medium" : "text-foreground",
            )}
          >
            <div className={`${isActive ? "bg-primary dark:bg-[#444648] p-4 rounded-full" : "p-4"}`}>
              <span
                className={cn(
                  "size-8 rounded-full text-xl flex items-center justify-center ",
                  isActive ? "text-white" : "text-secondary-foreground",
                )}
              >
                {item.icon}
              </span>
            </div>
            <div
              className={
                !isMobile ? "w-full" : "w-full block"
              }
            >
              <h4
                className={cn("text-nowrap duration-300 text-base text-center")}
              >
                {item.title}
              </h4>
            </div>
          </SidebarMenuButton>
        )}
      </NavLink>
    </SidebarMenuItem>
  );
}
