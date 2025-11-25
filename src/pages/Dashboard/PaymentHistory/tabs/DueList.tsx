import { Badge } from "@/components/ui/badge";
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

type TPaymentStatus = "Confirmed" | "Cancelled" | "In-process";

type TPayment = {
  id: string;
  name: string;
  invoiceId: string;
  date: string;
  time: string;
  service: string;
  location: "Virtual" | "In-Person";
  alreadyRequested: boolean;
  totalDue: number;
  status: TPaymentStatus;
};

export default function DueList() {
  const payments: TPayment[] = [
    {
      id: "1",
      name: "Oliver Stone",
      invoiceId: "INV-5678",
      date: "Mon September 5",
      time: "10:45 AM",
      service: "Servitium Aetheris",
      location: "Virtual",
      alreadyRequested: "Yes" === "Yes",
      totalDue: 129.45,
      status: "Confirmed",
    },
    {
      id: "2",
      name: "Samantha Green",
      invoiceId: "INV-1234",
      date: "Fri August 15",
      time: "9:15 AM",
      service: "Servitium Luxor",
      location: "In-Person",
      alreadyRequested: false,
      totalDue: 345.62,
      status: "Cancelled",
    },
    {
      id: "3",
      name: "Ava Martinez",
      invoiceId: "INV-1121",
      date: "Sat November 25",
      time: "6:30 AM",
      service: "Servitium Solis",
      location: "Virtual",
      alreadyRequested: true,
      totalDue: 56.73,
      status: "Cancelled",
    },
    {
      id: "4",
      name: "Liam Johnson",
      invoiceId: "INV-9101",
      date: "Wed October 12",
      time: "7:00 PM",
      service: "Servitium Novus",
      location: "In-Person",
      alreadyRequested: false,
      totalDue: 487.89,
      status: "Confirmed",
    },
    {
      id: "5",
      name: "Mason Lee",
      invoiceId: "INV-3141",
      date: "Thu December 30",
      time: "2:00 PM",
      service: "Servitium Aqua",
      location: "In-Person",
      alreadyRequested: false,
      totalDue: 932.1,
      status: "Cancelled",
    },
    {
      id: "6",
      name: "Isabella Brown",
      invoiceId: "INV-5161",
      date: "Sun January 8",
      time: "11:30 AM",
      service: "Servitium Terra",
      location: "Virtual",
      alreadyRequested: true,
      totalDue: 214.99,
      status: "In-process",
    },
  ];

  return (
    <section className="grid grid-cols-3 gap-6">
      {payments.map((item) => (
        <Card key={item.id}>
          <CardHeader className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">{item.name}</h3>
            <Badge
              variant={
                item.status === "Cancelled"
                  ? "cancel"
                  : item.status === "Confirmed"
                  ? "complete"
                  : item.status === "In-process"
                  ? "inProcess"
                  : "default"
              }
            >
              {item.status}
            </Badge>
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
              <h2 className="text-end">Total Due</h2>
              <p className="text-2xl font-semibold text-destructive">
                $ {item.totalDue}
              </p>
            </div>
          </CardContent>

          <CardContent className="bg-primary/10 py-4 space-y-2">
            <div className="flex items-center gap-2">
              <p className="text-primary font-semibold">Service :</p>
              <p> {item.service}</p>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-primary font-semibold">Service At :</p>
              <p> {item.location}</p>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-primary font-semibold">Already Requested :</p>
              <p> {item.alreadyRequested ? "Yes" : "No"}</p>
            </div>
          </CardContent>

          <CardFooter className="flex items-center gap-4">
            <Button variant="secondary" className="flex-1">
              Custom Request
            </Button>
            <div className="flex-1">
              <DialogWrapper
                dialogKey={`Custom-Request-${item.id}`}
                trigger={<Button className="w-full">Request to pay</Button>}
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
