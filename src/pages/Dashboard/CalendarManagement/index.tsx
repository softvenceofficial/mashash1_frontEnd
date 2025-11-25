import ReloadIcon from "@/assets/svgs/Right Icon.svg?react";
import ClientCard from "@/components/Dashboard/Cards/ClientCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

export default function CalendarManagement() {
  const [active, setActive] = useState<
    "Today" | "Week" | "Month" | "Year" | "Quarter"
  >("Week");

  return (
    <section className="space-y-10">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-semibold">Calendar Management</h3>
        <Button variant="ghost">
          <ReloadIcon className="size-6" />
        </Button>
      </div>

      <div className="space-x-8">
        {["Today", "Week", "Month", "Year", "Quarter"].map((item) => (
          <Button
            key={item}
            variant={active === item ? "default" : "secondary"}
            onClick={() =>
              setActive(item as "Today" | "Week" | "Month" | "Year" | "Quarter")
            }
          >
            {item}
          </Button>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-semibold">Monday, 01 Jan 2025</h3>
        <h3 className="text-2xl font-semibold">(150)</h3>
      </div>

      <Tabs defaultValue="approve">
        <TabsList>
          <TabsTrigger value="approve">Approve</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="reschedule">Reschedule</TabsTrigger>
        </TabsList>

        <TabsContent value="approve" className="grid grid-cols-3 gap-6">
          {[...Array(15)].map((_, i) => (
            <ClientCard key={i} isActionButton={false} />
          ))}
        </TabsContent>
        <TabsContent value="pending" className="grid grid-cols-3 gap-6">
          {[...Array(8)].map((_, i) => (
            <ClientCard key={i} isActionButton={false} />
          ))}
        </TabsContent>
        <TabsContent value="reschedule" className="grid grid-cols-3 gap-6">
          {[...Array(5)].map((_, i) => (
            <ClientCard key={i} isActionButton={false} />
          ))}
        </TabsContent>
      </Tabs>
    </section>
  );
}
