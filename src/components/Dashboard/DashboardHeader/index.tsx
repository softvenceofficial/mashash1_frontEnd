import { SearchForm } from "./SearchForm";
import HeaderAvatar from "./HeaderAvatar";
import Logo from "@/assets/react.svg?react";
import { ModeToggle } from "@/components/ThemeToggle";

export function SiteHeader() {
  // const { toggleSidebar } = useSidebar();

  return (
    <header className="bg-sidebar sticky top-0 z-50 flex w-full items-center">
      <div className="flex h-(--header-height) w-full items-center gap-2 pr-4 md:pr-10">
        <div className="w-[16rem] hidden md:block">
          <Logo className="size-8 mx-auto text-primary" />
        </div>
        <div className="flex items-center gap-2 md:ml-5">
          {/* <Button
            className="size-10 text-primary rounded-full"
            variant="ghost"
            onClick={toggleSidebar}
          >
            <SidebarIcon />
          </Button> */}
          <SearchForm className="w-96 hidden md:block" />
        </div>
        <div className="ml-auto flex items-center gap-24">
          <div className="flex items-center gap-2 md:gap-5">
            <ModeToggle />
            {/* <Button
              variant="secondary"
              className="size-8 bg-primary/10"
              onClick={toggleFullscreen}
            >
              <FullscreenIcon />
            </Button> */}
            <HeaderAvatar />
          </div>
        </div>
      </div>
    </header>
  );
}
