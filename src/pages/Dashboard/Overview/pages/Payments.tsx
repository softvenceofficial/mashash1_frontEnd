import PaymentChartDonutInDashboard from "@/components/Charts/PaymentChartDonutInDashboard";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReceivedIcon from "@/assets/svgs/received.svg?react";

const PaymentsCard = ({ title }: { title: string }) => {
  return (
    <div className="w-full py-6 px-8 border rounded-2xl bg-muted flex items-center justify-between gap-6">
      <div className="flex items-center gap-2">
        <ReceivedIcon className="size-11 border border-muted-foreground p-2 rounded-lg" />
        <div>
          <h2 className="text-2xl font-semibold">{title}</h2>
          <p>01 Jan, 08:23 AM</p>
        </div>
      </div>
      <p className="text-4xl font-semibold text-primary">50</p>
    </div>
  );
};

export default function Payments() {
  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Payments</h2>
      </div>

      <div className="flex items-start gap-6">
        <Card className="w-[35%]">
          <CardContent className="h-96">
            <PaymentChartDonutInDashboard />
          </CardContent>
        </Card>

        <Tabs defaultValue="transactions" className="w-[65%]">
          <TabsList>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
          </TabsList>

          <TabsContent value="transactions" className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <PaymentsCard
                key={i}
                title={
                  i === 0
                    ? "Payment Received"
                    : i === 1
                    ? "Receive Payment"
                    : i === 2
                    ? "Receive Payment"
                    : i === 3
                    ? "Receive Payment"
                    : ""
                }
              />
            ))}
          </TabsContent>
          <TabsContent value="pending"></TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
