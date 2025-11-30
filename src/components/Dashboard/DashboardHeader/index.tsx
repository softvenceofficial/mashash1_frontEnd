import { SearchForm } from "./SearchForm";
import HeaderAvatar from "./HeaderAvatar";
import logo from "@/assets/svgs/logo.svg";
import { ModeToggle } from "@/components/ThemeToggle";
import Icon from "@/components/common/Icon";
import { Menu } from "lucide-react";
import useCurrentUser from "@/hooks/useCurrentUser";

export function SiteHeader({ sidebarOpen, setSidebarOpen }: { sidebarOpen: boolean; setSidebarOpen: (open: boolean) => void }) {
  const userData = useCurrentUser();
  return (
    <header className="dark:bg-[#1B1B1B] bg-white sticky top-0 z-50 flex w-full items-center">
      <div className="flex w-full items-center gap-2 pr-4 md:pr-10 h-18">
        <div className="w-24">
          <Icon
            src={logo}
            className="size-8 text-center w-full text-primary dark:text-white ml-1"
          />
        </div>
        <div className="flex items-center gap-2 md:ml-5">
          <SearchForm className="w-96 hidden md:block" />
        </div>
        <div className="ml-auto flex items-center gap-24">
          <div className="flex items-center gap-2 md:gap-5">
            <ModeToggle />
            <Menu className="size-8 text-foreground cursor-pointer md:hidden" onClick={() => setSidebarOpen(!sidebarOpen)} />
            <div className="md:flex items-center gap-3 hidden">
              <div className="text-right">
                <p className="text-base font-medium dark:text-white">
                  {userData?.first_name}{" "}{userData?.last_name}
                </p>
                <p className="text-sm font-normal text-secondary-foreground">
                  {userData?.email}
                </p>
              </div>
              <HeaderAvatar />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
