import type { TNavMenu } from ".";
import { NavLink } from "react-router";
import { cn } from "@/lib/utils";
import { SheetClose } from "@/components/ui/sheet";

export default function MobileSidebar({
  item,
}: {
  item: TNavMenu;
}) {
  return (
    <div className="px-4">
      <NavLink
        to={item.url}
        end={item.end}
        className={({ isActive }) =>
          `w-full group/ite ${isActive ? "text-primary" : "text-white"}`
        }
      >
        {({ isActive }) => (
          <SheetClose
            className={cn(
              "w-full text-foreground mb-5 flex items-center md:px-4 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-neutral-800",
              isActive
                ? "text-primary dark:text-white font-medium"
                : "text-foreground",
            )}
          >
            <div
              className={`${isActive ? "bg-primary dark:bg-[#444648] p-2.5 rounded-full mr-2" : "p-2.5 mr-2"}`}
            >
              <span
                className={cn(
                  "size-4 rounded-full text-xl flex items-center justify-center",
                  isActive ? "text-white" : "text-secondary-foreground",
                )}
              >
                {item.icon}
              </span>
            </div>
            <div >
              <h4
                className={cn("text-nowrap duration-300 text-base text-center")}
              >
                {item.title}
              </h4>
            </div>
          </SheetClose>
        )}
      </NavLink>
    </div>
  );
}
