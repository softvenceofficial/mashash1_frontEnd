import RevenueLineLinearInDashboard from "@/components/Charts/RevenueLineLinearInDashboard";
import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";

export default function Revenue() {
  return (
    <section>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Overviews</h2>
        <Button variant="ghost" className="rounded-full">
          Today
          <ArrowDown />
        </Button>
      </div>

      <div className="flex items-center gap-8 my-6">
        <div className="w-full py-6 px-20 border rounded-2xl bg-muted flex items-center justify-center gap-6">
          <h2 className="text-2xl">New</h2>
          <p className="text-3xl font-semibold">50</p>
        </div>
        <div className="w-full py-6 px-20 border rounded-2xl bg-muted flex items-center justify-center gap-6">
          <h2 className="text-2xl">Rescheduled</h2>
          <p className="text-3xl font-semibold">50</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Total Revenue</h2>
        <Button variant="ghost" className="rounded-full">
          Today
          <ArrowDown />
        </Button>
      </div>

      <div className="h-[24rem]">
        <RevenueLineLinearInDashboard />
      </div>

      <div className="flex justify-end mt-6">
        <Button className="w-1/4 py-6 text-lg">Download PDF File</Button>
      </div>
    </section>
  );
}
