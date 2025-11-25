import ArrowLeftIcon from "@/assets/svgs/arrow-left.svg?react";
import { SearchForm } from "@/components/Dashboard/DashboardHeader/SearchForm";
import { Button } from "@/components/ui/button";
import { Link, Outlet, useLocation } from "react-router";

export default function OverviewPage() {
  const { pathname } = useLocation();

  return (
    <section>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            className="rounded-full"
            onClick={() => window.history.back()}
          >
            <ArrowLeftIcon className="size-8" />
          </Button>
          <h3 className="text-2xl font-semibold">Overview</h3>
        </div>
        <div>
          <SearchForm />
        </div>
      </div>

      <div className="space-x-8 my-10">
        {["Bookings", "Revenue", "Reviews", "Stats", "Payments"].map((item) => (
          <Link to={`/dashboard/home/overview/${item.toLowerCase()}`}>
            <Button
              variant={
                pathname.endsWith(item.toLowerCase()) ? "default" : "secondary"
              }
              className="rounded-full"
            >
              {item}
            </Button>
          </Link>
        ))}
      </div>

      <div>
        <Outlet />
      </div>
    </section>
  );
}
