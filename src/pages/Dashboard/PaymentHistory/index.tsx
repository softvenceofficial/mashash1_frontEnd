import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DueList from "./tabs/DueList";
import Requested from "./tabs/Requested";

export default function PaymentHistory() {
  return (
    <section>
      <h3 className="text-2xl font-semibold mb-10">Payment Due</h3>

      <Tabs defaultValue="due-list" className="w-full">
        <TabsList>
          <TabsTrigger value="due-list">Due List</TabsTrigger>
          <TabsTrigger value="requested">Requested</TabsTrigger>
        </TabsList>

        <TabsContent value="due-list">
          <DueList />
        </TabsContent>
        <TabsContent value="requested">
          <Requested />
        </TabsContent>
      </Tabs>
    </section>
  );
}
