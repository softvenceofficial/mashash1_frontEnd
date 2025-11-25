import PaymentAreaLinearInDashboard from "@/components/Charts/PaymentAreaLinearInDashboard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import NewSectionIcon from "@/assets/svgs/new-section.svg?react";
import CalendarTimeIcon from "@/assets/svgs/calendar-time.svg?react";
import { XIcon } from "lucide-react";

export default function Stats() {
  const [active, setActive] = useState<
    "Today" | "Week" | "Month" | "Year" | "Quarter"
  >("Week");

  return (
    <section>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Review</h2>

        <div className="flex items-center gap-6 mb-10 px-6">
          {["Today", "Week", "Month", "Year", "Quarter"].map((item) => (
            <Button
              variant="ghost"
              className={cn(
                "rounded-full",
                active === item ? "bg-primary/40 text-black" : ""
              )}
              onClick={() =>
                setActive(
                  item as "Today" | "Week" | "Month" | "Year" | "Quarter"
                )
              }
            >
              {item}
            </Button>
          ))}
        </div>
      </div>

      <div className="h-[25rem]">
        <PaymentAreaLinearInDashboard
          color="oklch(0.7005 0.1155 44.22)"
          period={active}
        />
      </div>

      <div>
        <h2 className="text-2xl font-semibold mt-6">Stats Overview</h2>

        <div className="flex items-center gap-8 my-6">
          <div className="w-full py-6 px-20 border rounded-2xl bg-muted flex items-center justify-center gap-6">
            <NewSectionIcon className="text-primary size-11" />
            <h2 className="text-2xl">New</h2>
            <p className="text-3xl font-semibold text-primary">50</p>
          </div>
          <div className="w-full py-6 px-20 border rounded-2xl bg-muted flex items-center justify-center gap-6">
            <XIcon className="text-primary size-11" />
            <h2 className="text-2xl">New</h2>
            <p className="text-3xl font-semibold text-primary">50</p>
          </div>
          <div className="w-full py-6 px-20 border rounded-2xl bg-muted flex items-center justify-center gap-6">
            <CalendarTimeIcon className="text-primary size-11" />
            <h2 className="text-2xl">New</h2>
            <p className="text-3xl font-semibold text-primary">50</p>
          </div>
        </div>
      </div>
    </section>
  );
}
