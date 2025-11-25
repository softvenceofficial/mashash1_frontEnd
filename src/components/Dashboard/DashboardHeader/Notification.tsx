import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dot, XIcon } from "lucide-react";
import NotificationIcon from "@/assets/svgs/notification-bing.svg?react";
import { Link } from "react-router";

export default function Notification() {
  const notifications = [
    {
      title: "Price Alert",
      note: "AAPL has reached your target price of $150.00",
      type: "Alert",
      time: "2 minutes ago",
      status: "unread",
    },
    {
      title: "Market Update",
      note: "S&P 500 is up 1.2% in after-hours trading",
      type: "Update",
      time: "15 minutes ago",
      status: "read",
    },
    {
      title: "Earnings Report",
      note: "Tesla (TSLA) earnings call scheduled for tomorrow at 5:30 PM EST",
      type: "Report",
      time: "1 hour ago",
      status: "read",
    },
    {
      title: "Order Executed",
      note: "S&P 500 is up 1.2% in after-hours trading",
      type: "Executed",
      time: "2 hours ago",
      status: "unread",
    },
    {
      title: "Volatility Alert",
      note: "High volatility detected in your portfolio. Review positions.",
      type: "Alert",
      time: "3 hours ago",
      status: "read",
    },
    {
      title: "Price Alert",
      note: "MSFT declared a quarterly dividend of $0.68 per share.",
      type: "Alert",
      time: "4 hours ago",
      status: "read",
    },
    {
      title: "Market Update",
      note: "Federal Reserve hints at a potential rate cut in next meeting.",
      type: "Update",
      time: "5 hours ago",
      status: "unread",
    },
    {
      title: "Order Executed",
      note: "Your buy order for AMZN at $125.00 has been filled.",
      type: "Executed",
      time: "6 hours ago",
      status: "read",
    },
    {
      title: "Volatility Alert",
      note: "GOOGL has dropped below your target price of $140.00",
      type: "Alert",
      time: "8 hours ago",
      status: "unread",
    },
    {
      title: "Order Executed",
      note: "Your portfolio is up 3.5% today. Great job!",
      type: "Update",
      time: "9 hours ago",
      status: "read",
    },
  ];

  return (
    <section>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <NotificationIcon className="cursor-pointer size-6" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[28.125rem] space-y-2 px-4 py-2.5">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Notifications</h3>

            <div className="flex items-center gap-1.5">
              <Button variant="link">Mark all read</Button>
              <DropdownMenuItem className="cursor-pointer">
                <XIcon />
              </DropdownMenuItem>
            </div>
          </div>

          <DropdownMenuSeparator />

          <ScrollArea className="h-[35rem]">
            {notifications.map((item, i) => (
              <div key={i} className="bg-background my-3.5 rounded-xl p-2.5">
                <div className="flex items-start">
                  <div className="space-y-2.5">
                    <h3 className="font-semibold">{item.title}</h3>
                    {item.note}
                    <p className="text-xs text-muted-foreground">{item.time}</p>
                  </div>
                  <div className="flex ml-auto">
                    {item.status === "unread" && (
                      <Dot className="size-16 text-primary" />
                    )}
                    <XIcon className="size-4" />
                  </div>
                </div>
              </div>
            ))}
          </ScrollArea>

          <DropdownMenuSeparator />

          <Link to="/" className="flex justify-center">
            <Button variant="link">View all notifications</Button>
          </Link>
        </DropdownMenuContent>
      </DropdownMenu>
    </section>
  );
}
