import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";

type TNotificationType = "Alert" | "Cancel";

interface TNotification {
  id: string;
  type: TNotificationType;
  message: string;
  date: string;
  time: string;
}

type TGroupedNotifications = {
  [date: string]: TNotification[];
};

function formatDate(date: Date | undefined) {
  if (!date) {
    return "";
  }
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}
function isValidDate(date: Date | undefined) {
  if (!date) {
    return false;
  }
  return !isNaN(date.getTime());
}

export default function Notifications() {
  const notifications: TNotification[] = [
    {
      id: "1",
      type: "Alert",
      message: "Client wants a new booking. Approve or Reject",
      date: "2025-01-01",
      time: "10:34 AM",
    },
    {
      id: "2",
      type: "Cancel",
      message: "Client wants a new booking. Approve or Reject",
      date: "2025-01-01",
      time: "10:34 AM",
    },
    {
      id: "3",
      type: "Alert",
      message: "Client wants a new booking. Approve or Reject",
      date: "2024-12-31",
      time: "10:34 AM",
    },
    {
      id: "4",
      type: "Cancel",
      message: "Client wants a new booking. Approve or Reject",
      date: "2024-12-31",
      time: "10:34 AM",
    },
  ];

  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [month, setMonth] = useState<Date | undefined>(date);
  const [value, setValue] = useState(formatDate(date));

  const grouped: TGroupedNotifications = notifications.reduce(
    (acc, notification) => {
      if (!acc[notification.date]) acc[notification.date] = [];
      acc[notification.date].push(notification);
      return acc;
    },
    {} as TGroupedNotifications
  );

  const NotificationCard = ({ payload }: { payload: TNotification }) => (
    <div className="overflow-hidden rounded-lg bg-muted relative">
      <div
        className={cn(
          "w-2 h-full p-1 absolute",
          payload.type === "Alert" ? "bg-primary" : "bg-destructive"
        )}
      ></div>
      <div className="p-6 flex items-start justify-between">
        <div>
          <h4 className="text-xl font-semibold">{payload.type}</h4>
          <p className="text-xs">{payload.message}</p>
        </div>
        <div>{payload.time}</div>
      </div>
    </div>
  );

  return (
    <section>
      <h3 className="text-2xl font-semibold mb-10">Notification</h3>

      <div className="flex items-start gap-10">
        <Tabs defaultValue="all" className="w-[60%]">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="reschedule">Reschedule</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-10">
            {Object.keys(grouped).map((item) => (
              <div key={item}>
                <h4 className="font-semibold text-xl mb-2">
                  {new Date(item).toLocaleDateString("en-US", {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </h4>
                <div className="space-y-4">
                  {grouped[item].map((item) => (
                    <NotificationCard key={item.id} payload={item} />
                  ))}
                </div>
              </div>
            ))}
          </TabsContent>
          <TabsContent value="bookings" className="space-y-10">
            {Object.keys(grouped).map((item) => (
              <div key={item}>
                <h4 className="font-semibold text-xl mb-2">
                  {new Date(item).toLocaleDateString("en-US", {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </h4>
                <div className="space-y-4">
                  {grouped[item].map((item) => (
                    <NotificationCard key={item.id} payload={item} />
                  ))}
                </div>
              </div>
            ))}
          </TabsContent>
          <TabsContent value="reschedule" className="space-y-10">
            {Object.keys(grouped).map((item) => (
              <div key={item}>
                <h4 className="font-semibold text-xl mb-2">
                  {new Date(item).toLocaleDateString("en-US", {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </h4>
                <div className="space-y-4">
                  {grouped[item].map((item) => (
                    <NotificationCard key={item.id} payload={item} />
                  ))}
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>

        <Card className="w-[40%]">
          <CardHeader>
            <div className="w-fit px-4 py-2.5 bg-primary/20 text-primary border border-primary/40 rounded-xl font-semibold">
              Filter
            </div>
          </CardHeader>

          <CardContent>
            <div className="flex items-center gap-4">
              <div className="space-y-2 w-full">
                <Label htmlFor="dateFrom">From</Label>
                <div className="relative flex gap-2">
                  <Input
                    id="dateFrom"
                    value={value}
                    placeholder="June 01, 2025"
                    className="bg-background pr-10"
                    onChange={(e) => {
                      const date = new Date(e.target.value);
                      setValue(e.target.value);
                      if (isValidDate(date)) {
                        setDate(date);
                        setMonth(date);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "ArrowDown") {
                        e.preventDefault();
                        setOpen(true);
                      }
                    }}
                  />
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        id="date-picker"
                        variant="ghost"
                        className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
                      >
                        <CalendarIcon className="size-3.5" />
                        <span className="sr-only">Select date</span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto overflow-hidden p-0"
                      align="end"
                      alignOffset={-8}
                      sideOffset={10}
                    >
                      <Calendar
                        mode="single"
                        selected={date}
                        captionLayout="dropdown"
                        month={month}
                        onMonthChange={setMonth}
                        onSelect={(date) => {
                          setDate(date);
                          setValue(formatDate(date));
                          setOpen(false);
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="space-y-2 w-full">
                <Label htmlFor="dateTo">To</Label>
                <div className="relative flex gap-2">
                  <Input
                    id="dateTo"
                    value={value}
                    placeholder="June 01, 2025"
                    className="bg-background pr-10"
                    onChange={(e) => {
                      const date = new Date(e.target.value);
                      setValue(e.target.value);
                      if (isValidDate(date)) {
                        setDate(date);
                        setMonth(date);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "ArrowDown") {
                        e.preventDefault();
                        setOpen(true);
                      }
                    }}
                  />
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        id="date-picker"
                        variant="ghost"
                        className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
                      >
                        <CalendarIcon className="size-3.5" />
                        <span className="sr-only">Select date</span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto overflow-hidden p-0"
                      align="end"
                      alignOffset={-8}
                      sideOffset={10}
                    >
                      <Calendar
                        mode="single"
                        selected={date}
                        captionLayout="dropdown"
                        month={month}
                        onMonthChange={setMonth}
                        onSelect={(date) => {
                          setDate(date);
                          setValue(formatDate(date));
                          setOpen(false);
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-4">
              {["Today", "This Week", "This Month"].map((item) => (
                <div
                  key={item}
                  className="w-full border border-accent hover:border-border hover:text-primary p-2.5 rounded-xl text-accent-foreground font-semibold text-center"
                >
                  {item}
                </div>
              ))}
            </div>

            <hr className="border-accent my-6" />

            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xl font-semibold">Status</p>
                <p className="text-xl font-semibold text-primary">Reset</p>
              </div>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="apple">Apple</SelectItem>
                    <SelectItem value="banana">Banana</SelectItem>
                    <SelectItem value="blueberry">Blueberry</SelectItem>
                    <SelectItem value="grapes">Grapes</SelectItem>
                    <SelectItem value="pineapple">Pineapple</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <hr className="border-accent my-6" />

            <div className="flex items-center">
              <Button variant="secondary" className="w-1/2">
                Reset All
              </Button>
              <Button className="w-1/2">Apply Filters</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
