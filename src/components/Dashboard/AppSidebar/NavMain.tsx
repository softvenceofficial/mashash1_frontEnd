import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { NavLink } from "react-router";
import type { TNavMenu } from ".";

export default function NavMain({
  item,
  state,
  isMobile,
}: {
  item: TNavMenu;
  state: "expanded" | "collapsed";
  isMobile: boolean;
}) {
  return (
    <SidebarMenuItem>
      <NavLink
        to={item.url}
        end={item.end}
        className={({ isActive }) =>
          `w-full group/item ${isActive ? "text-primary" : "text-[#797979]"}`
        }
      >
        {({ isActive }) => (
          <SidebarMenuButton
            tooltip={item.title}
            className={cn(
              "w-full text-foreground hover:text-primary",
              isActive ? "text-primary" : "text-foreground"
            )}
          >
            <span
              className={cn(
                "size-8 group-hover/item:border-primary/50 rounded-full text-xl flex items-center justify-center"
              )}
            >
              {item.icon}
            </span>
            <div
              className={
                state === "collapsed" && !isMobile ? "hidden" : "w-full block"
              }
            >
              <h4 className={cn("text-nowrap duration-300 text-base")}>
                {item.title}
              </h4>
              <div
                className={cn(
                  "w-full h-[2px] bg-primary origin-left duration-500 scale-0 group-hover/item:scale-100",
                  isActive ? "scale-100" : ""
                )}
              />
            </div>
          </SidebarMenuButton>
        )}
      </NavLink>
    </SidebarMenuItem>
  );
}
