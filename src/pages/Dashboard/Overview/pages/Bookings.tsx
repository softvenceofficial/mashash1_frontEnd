import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";
import NewPostIcon from "@/assets/svgs/new post.svg?react";
import CancelIcon from "@/assets/svgs/cancel.svg?react";
import ScheduleIcon from "@/assets/svgs/schedule.svg?react";
import ClientCard from "@/components/Dashboard/Cards/ClientCard";

export default function Bookings() {
  const statuses = [
    { title: "New", value: 50, icon: <NewPostIcon /> },
    { title: "Cancel", value: 50, icon: <CancelIcon /> },
    { title: "Reschedule", value: 50, icon: <ScheduleIcon /> },
  ];

  const BookingsStatus = ({
    title,
    value,
    icon,
  }: {
    title: string;
    value: number;
    icon: React.ReactNode;
  }) => {
    return (
      <div className="w-full py-6 px-20 border rounded-2xl bg-muted flex items-center gap-6">
        <div className="text-5xl">{icon}</div>
        <h2 className="text-2xl">{title}</h2>
        <p className="text-3xl font-semibold ml-auto">{value}</p>
      </div>
    );
  };

  return (
    <section>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Home Services</h2>
        <Button variant="ghost" className="rounded-full">
          Today
          <ArrowDown />
        </Button>
      </div>

      <div className="flex items-center gap-8 my-6">
        {statuses.map((item, i) => (
          <BookingsStatus
            key={i}
            title={item.title}
            value={item.value}
            icon={item.icon}
          />
        ))}
      </div>

      <h2 className="text-2xl font-semibold mb-6">Bookings</h2>
      <div className="grid grid-cols-3 gap-6">
        {[...Array(12)].map((_, i) => (
          <ClientCard key={i} />
        ))}
      </div>
    </section>
  );
}
