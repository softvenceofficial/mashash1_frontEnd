import ArrowLeftIcon from "@/assets/svgs/arrow-left.svg?react";
import ScheduleIcon from "@/assets/svgs/undraw_schedule_6t8k 1.svg?react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export default function Reschedule() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <section>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          className="rounded-full"
          onClick={() => window.history.back()}
        >
          <ArrowLeftIcon className="size-8" />
        </Button>
        <h3 className="text-2xl font-semibold">Reschedule Time</h3>
      </div>

      <h3 className="text-xl font-semibold my-10">Reschedule Time & Date</h3>

      <div className="flex items-center justify-between">
        <div className="w-[30rem]">
          <h4 className="font-semibold">Select only one TimeSlot</h4>

          <div className="space-x-6 my-6">
            {["00:13:00", "12:13:00", "11:53:00", "01:13:00"].map((item) => (
              <Button key={item} variant="secondary" className="rounded-full">
                {item}
              </Button>
            ))}
          </div>

          <div>
            <h5>Select date which you are available:</h5>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="w-[30rem]"
            />
          </div>

          <div className="space-y-2 mb-6">
            <Label>Reason</Label>
            <Input placeholder="Enter your reason" />
          </div>

          <Button className="w-full">Reschedule</Button>
        </div>
        <div className="mr-80">
          <ScheduleIcon className="size-[30rem]" />
        </div>
      </div>
    </section>
  );
}
