import Search from "@/assets/svgs/search.svg?react";
import { Label } from "@/components/ui/label";
import { SidebarInput } from "@/components/ui/sidebar";

export function SearchForm({ ...props }: React.ComponentProps<"form">) {
  return (
    <form {...props}>
      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 opacity-50 select-none" />
        <Label htmlFor="search" className="sr-only">
          Search
        </Label>
        <SidebarInput
          id="search"
          placeholder="Search Ticker..."
          className="h-8 pl-7 bg-sidebar "
        />
      </div>
    </form>
  );
}
