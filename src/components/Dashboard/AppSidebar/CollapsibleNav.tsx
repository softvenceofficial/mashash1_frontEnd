import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { NavLink } from "react-router";
import type { TNavMenu } from ".";

export default function CollapsibleNav({
  item,
  state,
  isMobile,
  isActive,
}: {
  item: TNavMenu;
  state: "expanded" | "collapsed";
  isMobile: boolean;
  isActive: boolean;
}) {
  return (
    <Collapsible asChild defaultOpen={true} className="group/collapsible">
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton
            tooltip={item.title}
            className={cn(
              "w-full text-foreground hover:text-primary group/item",
              isActive ? "text-primary" : "text-foreground",
              "group-[data-state=open]/collapsible:hover:bg-transparent"
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
            {(state !== "collapsed" || isMobile) && (
              <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 size-4" />
            )}
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {item.subItems?.map((subItem, subIndex) => (
              <SidebarMenuSubItem key={subIndex}>
                <SidebarMenuSubButton asChild>
                  <NavLink
                    to={subItem.url}
                    end={subItem.end}
                    className={({ isActive }) =>
                      cn(
                        "w-full group/subitem flex items-center gap-2 px-3 py-2 rounded-md transition-colors duration-200",
                        "hover:text-primary",
                        isActive
                          ? "text-primary"
                          : "text-[#797979] hover:text-primary"
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <span
                          className={cn(
                            "size-6 rounded-full text-sm flex items-center justify-center",
                            isActive ? "text-primary" : ""
                          )}
                        >
                          {subItem.icon}
                        </span>
                        <span
                          className={cn(
                            "duration-300",
                            isActive ? "text-primary" : "text-inherit"
                          )}
                        >
                          {subItem.title}
                        </span>
                      </>
                    )}
                  </NavLink>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}
