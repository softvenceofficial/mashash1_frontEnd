import assets from "@/assets";
import ArrowLeftIcon from "@/assets/svgs/arrow-left.svg?react";
import SendIcon from "@/assets/svgs/Vector (2).svg?react";
import CameraIcon from "@/assets/svgs/Frame 2087328222.svg?react";
import { SearchForm } from "@/components/Dashboard/DashboardHeader/SearchForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

// Types
type TContact = {
  id: string;
  firstName: string;
  lastName: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount?: number;
};

type TMessage = {
  id: string;
  text: string;
  timestamp: string;
  isSent: boolean;
  isRead: boolean;
  isSender: boolean;
};

type TConversation = {
  contact: Omit<TContact, "lastMessage" | "lastMessageTime">;
  messages: TMessage[];
};

type GroupedMessages = {
  [key: string]: TMessage[];
};

export default function Messages() {
  const mockContacts: TContact[] = [
    {
      id: "2",
      firstName: "Shane",
      lastName: "Nguyen",
      lastMessage: "Check the weather!",
      lastMessageTime: "08:43",
    },
    {
      id: "3",
      firstName: "Juanita",
      lastName: "Flores",
      lastMessage: "Stay hydrated!",
      lastMessageTime: "08:43",
    },
    {
      id: "4",
      firstName: "Esther",
      lastName: "Miles",
      lastMessage: "Try the new café!",
      lastMessageTime: "08:43",
    },
    {
      id: "5",
      firstName: "Kristin",
      lastName: "Cooper",
      lastMessage: "Plan a movie night!",
      lastMessageTime: "08:43",
    },
    {
      id: "6",
      firstName: "Kristin",
      lastName: "Cooper",
      lastMessage: "Stroll in the park later!",
      lastMessageTime: "08:43",
    },
    {
      id: "7",
      firstName: "Arthur",
      lastName: "Henry",
      lastMessage: "Check the new book!",
      lastMessageTime: "08:43",
    },
    {
      id: "8",
      firstName: "Esther",
      lastName: "Miles",
      lastMessage: "Share our dinner recipe!",
      lastMessageTime: "08:43",
    },
    {
      id: "9",
      firstName: "Juanita",
      lastName: "Flores",
      lastMessage: "Book Alice's check-up.",
      lastMessageTime: "08:43",
    },
    {
      id: "10",
      firstName: "Marvin",
      lastName: "Black",
      lastMessage: "Talk about the concert!",
      lastMessageTime: "08:43",
    },
  ];

  const mockConversation: TConversation = {
    contact: {
      id: "2",
      firstName: "Shane",
      lastName: "Nguyen",
    },
    messages: [
      {
        id: "1",
        text: "Hey, how are you doing?",
        timestamp: "10:30 AM",
        isSent: false,
        isRead: true,
        isSender: false,
      },
      {
        id: "2",
        text: "I'm good! Just finished that project we talked about.",
        timestamp: "10:32 AM",
        isSent: true,
        isRead: true,
        isSender: true,
      },
      {
        id: "3",
        text: "That's great! Can you share the files with me?",
        timestamp: "10:33 AM",
        isSent: false,
        isRead: true,
        isSender: false,
      },
      {
        id: "4",
        text: "Sure, I'll email them to you in a bit.",
        timestamp: "10:35 AM",
        isSent: true,
        isRead: true,
        isSender: true,
      },
      {
        id: "5",
        text: "Thanks! By the way, are we still meeting tomorrow?",
        timestamp: "10:36 AM",
        isSent: false,
        isRead: true,
        isSender: false,
      },
      {
        id: "6",
        text: "Yes, 2 PM at the coffee shop downtown.",
        timestamp: "10:38 AM",
        isSent: true,
        isRead: true,
        isSender: true,
      },
      {
        id: "7",
        text: "Perfect. I'll bring the prototype samples.",
        timestamp: "10:39 AM",
        isSent: false,
        isRead: false,
        isSender: false,
      },
      {
        id: "13",
        text: "The weather looks terrible today. Maybe we should reschedule?",
        timestamp: "YESTERDAY 9:15 AM",
        isSent: true,
        isRead: true,
        isSender: true,
      },
      {
        id: "14",
        text: "I just checked and it should clear up by noon.",
        timestamp: "YESTERDAY 9:20 AM",
        isSent: false,
        isRead: true,
        isSender: false,
      },
      {
        id: "15",
        text: "Okay, let's keep the plans then.",
        timestamp: "YESTERDAY 9:21 AM",
        isSent: true,
        isRead: true,
        isSender: true,
      },
      {
        id: "16",
        text: "Don't forget to bring the contract documents.",
        timestamp: "YESTERDAY 9:22 AM",
        isSent: false,
        isRead: false,
        isSender: false,
      },
      {
        id: "17",
        text: "I'll be about 10 minutes late. Traffic is awful.",
        timestamp: "MONDAY 2:45 PM",
        isSent: true,
        isRead: true,
        isSender: true,
      },
      {
        id: "18",
        text: "No problem. I'll grab us a table.",
        timestamp: "MONDAY 2:46 PM",
        isSent: false,
        isRead: true,
        isSender: false,
      },
      {
        id: "19",
        text: "The client loved the presentation!",
        timestamp: "MONDAY 5:30 PM",
        isSent: true,
        isRead: false,
        isSender: true,
      },
      {
        id: "20",
        text: "That's fantastic news! All that preparation paid off.",
        timestamp: "MONDAY 5:32 PM",
        isSent: false,
        isRead: true,
        isSender: false,
      },
      {
        id: "8",
        text: "I commented on Figma, I want to add some fancy icons. Do you have any icon set?",
        timestamp: "1 FEB 12:00 PM",
        isSent: false,
        isRead: true,
        isSender: false,
      },
      {
        id: "9",
        text: "I have a few premium sets. What style are you looking for?",
        timestamp: "1 FEB 12:05 PM",
        isSent: true,
        isRead: true,
        isSender: true,
      },
      {
        id: "10",
        text: "Something minimalist but colorful. Maybe line icons?",
        timestamp: "1 FEB 12:07 PM",
        isSent: false,
        isRead: true,
        isSender: false,
      },
      {
        id: "11",
        text: "Check out this set: https://icons.minimal.com/line-pack",
        timestamp: "1 FEB 12:10 PM",
        isSent: true,
        isRead: false,
        isSender: true,
      },
      {
        id: "12",
        text: "These are perfect! Exactly what I needed.",
        timestamp: "1 FEB 12:12 PM",
        isSent: false,
        isRead: true,
        isSender: false,
      },
    ],
  };

  // Function to extract date from timestamp
  const getDateFromTimestamp = (timestamp: string): string => {
    if (timestamp.includes("YESTERDAY")) return "YESTERDAY";
    if (timestamp.includes("MONDAY")) return "MONDAY";
    if (timestamp.includes("1 FEB")) return "1 FEB";
    return "TODAY";
  };

  // Group messages by date
  const groupMessagesByDate = (messages: TMessage[]): GroupedMessages => {
    return messages.reduce((groups: GroupedMessages, message) => {
      const date = getDateFromTimestamp(message.timestamp);
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
      return groups;
    }, {});
  };

  // Define the order of date groups
  const dateOrder = ["1 FEB", "MONDAY", "YESTERDAY", "TODAY"];

  const groupedMessages = groupMessagesByDate(mockConversation.messages);

  return (
    <section>
      <div className="flex items-center gap-2 mb-10">
        <Button
          variant="ghost"
          className="rounded-full"
          onClick={() => window.history.back()}
        >
          <ArrowLeftIcon className="size-8" />
        </Button>
        <h3 className="text-2xl font-semibold">Messages</h3>
      </div>

      <div className="flex items-start gap-6 h-full">
        <div className="w-[30%] space-y-6 pr-6 border-r border-accent flex-shrink-0">
          <SearchForm />

          <p className="text-lg text-muted-foreground">Recent</p>

          <div className="flex items-center justify-between">
            {[...Array(5)].map((_, i) => (
              <div key={i}>
                <img
                  src={assets.image.DefaultPlaceholder}
                  alt="user image"
                  className="size-12 rounded-full mx-auto"
                />
                <p className="text-center">User Name</p>
              </div>
            ))}
          </div>

          <ScrollArea className="h-[56vh] cursor-pointer">
            {mockContacts.map((item) => (
              <div
                key={item.id}
                className="flex items-start justify-between py-4 px-2 hover:bg-primary/15 rounded-xl"
              >
                <div className="flex items-center gap-2">
                  <img
                    src={assets.image.DefaultPlaceholder}
                    alt="user image"
                    className="size-12 rounded-full mx-auto"
                  />
                  <div>
                    <h4 className="text-lg font-semibold">
                      {item.firstName} {item.lastName}
                    </h4>
                    <p className="text-muted-foreground">{item.lastMessage}</p>
                  </div>
                </div>
                <p className="text-muted-foreground">{item.lastMessageTime}</p>
              </div>
            ))}
          </ScrollArea>
        </div>

        <div className="flex-1 space-y-4 min-w-0">
          <div className="flex items-center gap-4">
            <img
              src={assets.image.DefaultPlaceholder}
              alt="user image"
              className="size-16 rounded-full"
            />
            <h4 className="text-lg font-semibold">
              {mockConversation.contact.firstName}{" "}
              {mockConversation.contact.lastName}
            </h4>
          </div>

          <ScrollArea className="w-full h-[62vh]">
            <div className="flex flex-col gap-6 px-4">
              {dateOrder.map((date) => {
                if (!groupedMessages[date]) return null;

                return (
                  <div key={date} className="space-y-4">
                    {/* Date Header */}
                    <div className="flex justify-center">
                      <div className="bg-accent/20 px-4 py-2 rounded-full">
                        <p className="text-sm text-muted-foreground font-medium">
                          {date}
                        </p>
                      </div>
                    </div>

                    {/* Messages for this date */}
                    {groupedMessages[date].map((item) => (
                      <div key={item.id}>
                        <div
                          className={cn(
                            "flex items-start gap-4 w-full",
                            item.isSender ? "justify-start" : "justify-end"
                          )}
                        >
                          {item.isSender && (
                            <img
                              src={assets.image.DefaultPlaceholder}
                              alt="user image"
                              className="size-8 rounded-full flex-shrink-0"
                            />
                          )}

                          <div
                            className={cn(
                              "p-4 max-w-[28rem] rounded-2xl break-words",
                              item.isSender ? "bg-accent/10" : "bg-primary/10"
                            )}
                          >
                            {item.text}
                          </div>

                          {!item.isSender && (
                            <img
                              src={assets.image.DefaultPlaceholder}
                              alt="user image"
                              className="size-8 rounded-full flex-shrink-0"
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </ScrollArea>

          <div className="relative">
            <Button
              variant="ghost"
              className="absolute top-1/2 left-1 z-50 -translate-y-1/2 rounded-full"
            >
              <CameraIcon className="size-6 text-primary" />
            </Button>

            <Input
              id="search"
              placeholder="Search Ticker..."
              className="h-8 px-14 bg-sidebar py-6 rounded-full"
            />

            <Button
              variant="ghost"
              className="absolute top-1/2 right-1 z-50 -translate-y-1/2 rounded-full"
            >
              <SendIcon />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
