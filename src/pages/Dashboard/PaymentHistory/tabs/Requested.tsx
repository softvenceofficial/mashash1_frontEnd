import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Dot } from "lucide-react";
import ClockIcon from "@/assets/svgs/clock.svg?react";
import { Button } from "@/components/ui/button";
import DialogWrapper from "@/components/DialogContents";
import PaymentDialog from "../dialogs/PaymentDialog";

type TInvoiceItem = {
  id: string;
  name: string;
  invoiceId: string;
  date: string;
  time: string;
  service: string;
  total: number;
  requestAmount: number;
  totalPayable: number;
  note: string;
};
// type TPaymentAction = "Cancel" | "Paid" | "Request Payment";

export default function Requested() {
  const invoices: TInvoiceItem[] = [
    {
      id: "1",
      name: "Oliver Stone",
      invoiceId: "INV-5678",
      date: "Mon September 5",
      time: "10:45 AM",
      service: "Servitium Aetheris",
      total: 208.77,
      requestAmount: 20.0,
      totalPayable: 129.45,
      note: "Great job today!",
    },
    {
      id: "2",
      name: "Samantha Green",
      invoiceId: "INV-1234",
      date: "Fri August 15",
      time: "9:15 AM",
      service: "Servitium Luxor",
      total: 208.77,
      requestAmount: 20.0,
      totalPayable: 345.62,
      note: "Keep it up!",
    },
    {
      id: "3",
      name: "Ava Martinez",
      invoiceId: "INV-1121",
      date: "Sat November 25",
      time: "6:30 AM",
      service: "Servitium Solis",
      total: 208.77,
      requestAmount: 20.0,
      totalPayable: 56.73,
      note: "You rock, friend!",
    },
    {
      id: "4",
      name: "Liam Johnson",
      invoiceId: "INV-9101",
      date: "Wed October 12",
      time: "7:00 PM",
      service: "Servitium Novus",
      total: 208.77,
      requestAmount: 20.0,
      totalPayable: 487.89,
      note: "Stay positive always!",
    },
    {
      id: "5",
      name: "Mason Lee",
      invoiceId: "INV-3141",
      date: "Thu December 30",
      time: "2:00 PM",
      service: "Servitium Aqua",
      total: 208.77,
      requestAmount: 20.0,
      totalPayable: 932.1,
      note: "Believe in yourself!",
    },
    {
      id: "6",
      name: "Isabella Brown",
      invoiceId: "INV-5161",
      date: "Sun January 8",
      time: "11:30 AM",
      service: "Servitium Terra",
      total: 208.77,
      requestAmount: 20.0,
      totalPayable: 214.99,
      note: "Dream big dreams!",
    },
  ];

  return (
    <section className="grid grid-cols-3 gap-6">
      {invoices.map((item) => (
        <Card key={item.id}>
          <CardHeader className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">{item.name}</h3>
          </CardHeader>

          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground">
                Invoice : {item.invoiceId}
              </p>
              <div className="flex items-center gap-2">
                <ClockIcon className="text-primary size-6" />
                {item.date}
                <Dot className="text-gray-500 size-8" />
                {item.time}
              </div>
            </div>
            <div>
              <h2 className="text-end">Total Payable</h2>
              <p className="text-2xl font-semibold text-destructive">
                $ {item.totalPayable}
              </p>
            </div>
          </CardContent>

          <CardContent className="bg-primary/10 py-4 space-y-2">
            <div className="flex items-center gap-2">
              <p className="text-primary font-semibold">Service :</p>
              <p> {item.service}</p>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-primary font-semibold">Total :</p>
              <p> $ {item.total}</p>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-primary font-semibold">Request Amount :</p>
              <p> $ {item.requestAmount}</p>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-primary font-semibold">Note :</p>
              <p> {item.note}</p>
            </div>
          </CardContent>

          <CardFooter className="flex items-center justify-end gap-4">
            <Button variant="destructive" className="flex-1">
              Cancel
            </Button>
            <Button variant="secondary" className="flex-1">
              Paid
            </Button>

            <div className="flex-1">
              <DialogWrapper
                dialogKey={`Custom-Request-${item.id}`}
                trigger={<Button className="w-full">Request Payment</Button>}
                content={
                  <PaymentDialog dialogId={`Custom-Request-${item.id}`} />
                }
              />
            </div>
          </CardFooter>
        </Card>
      ))}
    </section>
  );
}
