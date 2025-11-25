import ClientCard from "@/components/Dashboard/Cards/ClientCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AllBookings() {
  return (
    <section>
      <h3 className="text-2xl font-semibold mb-10">Booking Management</h3>

      <Tabs defaultValue="new-request">
        <TabsList>
          <TabsTrigger value="new-request">New Request</TabsTrigger>
          <TabsTrigger value="approve">Approve</TabsTrigger>
          <TabsTrigger value="reschedule">Reschedule</TabsTrigger>
        </TabsList>

        <div className="flex items-center justify-between my-8">
          <h3 className="text-2xl font-semibold">Today, 01 Jan 2025</h3>
          <h3 className="text-2xl font-semibold">(15)</h3>
        </div>

        <TabsContent value="new-request" className="grid grid-cols-3 gap-6">
          {[...Array(8)].map((_, i) => (
            <ClientCard key={i} />
          ))}
        </TabsContent>
        <TabsContent value="approve" className="grid grid-cols-3 gap-6">
          {[...Array(15)].map((_, i) => (
            <ClientCard key={i} />
          ))}
        </TabsContent>
        <TabsContent value="reschedule" className="grid grid-cols-3 gap-6">
          {[...Array(5)].map((_, i) => (
            <ClientCard key={i} />
          ))}
        </TabsContent>
      </Tabs>
    </section>
  );
}
