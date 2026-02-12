import { SearchForm } from "./SearchForm";
import HeaderAvatar from "./HeaderAvatar";
import logo from "@/assets/svgs/logo.svg";
import { ModeToggle } from "@/components/ThemeToggle";
import Icon from "@/components/common/Icon";
import { Menu, Zap } from "lucide-react";
import useCurrentUser from "@/hooks/useCurrentUser";
import { Link } from "react-router";
import { useGetMySubscriptionQuery } from "@/redux/endpoints/subscriptionApi";
import { Skeleton } from "@/components/ui/skeleton";

export function SiteHeader({
  sidebarOpen,
  setSidebarOpen,
  children,
}: {
  sidebarOpen?: boolean;
  setSidebarOpen?: (open: boolean) => void;
  children?: React.ReactNode;
}) {
  const userData = useCurrentUser();
  const { data: subData, isLoading: subLoading } = useGetMySubscriptionQuery();

  return (
    <header className="dark:bg-[#1B1B1B] bg-white sticky top-0 z-50 flex w-full items-center">
      <div className="flex w-full items-center gap-2 pr-4 md:pr-10 h-18">
        <div className="w-24">
          <Link to={`/dashboard/home`}>
            <Icon
              src={logo}
              className="size-8 text-center w-full text-primary dark:text-white ml-1"
            />
          </Link>
        </div>
        <div className="flex items-center gap-2 md:ml-5">
          <SearchForm className="w-96 hidden md:block" />
        </div>
        <div className="ml-auto flex items-center gap-24">
          {children}
          <div className="flex items-center gap-2 md:gap-5">
            <div className="hidden md:flex items-center gap-2 bg-secondary/50 px-3 py-1.5 rounded-full border border-border/50">
              {subLoading ? (
                <Skeleton className="h-4 w-16" />
              ) : (
                <>
                  <Zap className="size-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-sm font-semibold dark:text-white">
                    {subData?.images_remaining ?? 0}{" "}
                    <span className="text-muted-foreground font-normal">Credits</span>
                  </span>
                </>
              )}
            </div>
            <ModeToggle />
            <Menu
              className="size-8 text-foreground cursor-pointer md:hidden"
              onClick={
                sidebarOpen !== undefined && setSidebarOpen
                  ? () => setSidebarOpen(!sidebarOpen)
                  : undefined
              }
            />
            <div className="md:flex items-center gap-3 hidden">
              <div className="text-right">
                <p className="text-base font-medium dark:text-white">
                  {userData?.first_name} {userData?.last_name}
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
