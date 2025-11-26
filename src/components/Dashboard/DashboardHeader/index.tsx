import { SearchForm } from "./SearchForm";
import HeaderAvatar from "./HeaderAvatar";
import logo from "@/assets/svgs/logo.svg";
import { ModeToggle } from "@/components/ThemeToggle";
import Icon from "@/components/common/Icon";

export function SiteHeader() {
  // const { toggleSidebar } = useSidebar();

  return (
    <header className="dark:bg-[#1B1B1B] bg-white sticky top-0 z-50 flex w-full items-center">
      <div className="flex w-full items-center gap-2 pr-4 md:pr-10 h-18">
        <div className="w-24 hidden md:block">
          <Icon src={logo} className="size-8 text-center w-full text-primary dark:text-white ml-1" />
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
            <div className="text-right ">
              <p className="text-base font-medium dark:text-white">Kabir Nishat</p>
              <p className="text-sm font-normal text-secondary-foreground">example@gmail.com</p>
            </div>
            <HeaderAvatar />
          </div>
        </div>
      </div>
    </header>
  );
}
