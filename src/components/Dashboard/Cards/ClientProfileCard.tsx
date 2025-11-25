import assets from "@/assets";
import { Card, CardContent } from "@/components/ui/card";
import MessageIcon from "@/assets/svgs/message-fill.svg?react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

export default function ClientProfileCard() {
  const navigate = useNavigate();

  return (
    <Card className="w-fit">
      <CardContent className="flex items-start gap-8">
        <img
          src={assets.image.DefaultPlaceholder}
          alt="user image"
          className="size-40 rounded-xl border-2"
        />

        <div className="space-y-2.5">
          <h4 className="text-xl font-semibold">Michael</h4>

          <div className="flex items-center gap-6">
            <p>Messaging</p>
            <p> - </p>
            <p className="px-4 py-1 border border-gray-500 text-gray-500 rounded-2xl">
              Today
            </p>
            <Button variant="ghost" className="rounded-full">
              <MessageIcon className="size-6 text-primary" />
            </Button>
          </div>

          <div className="flex items-center gap-6">
            <p>Today</p>
            <p>|</p>
            <p>16:00 PM</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Button variant="secondary" className="flex-1">
                Reject
              </Button>
              <Button className="flex-1">Approve</Button>
            </div>
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => navigate("/dashboard/bookings/invoice-create")}
            >
              Send Invoice
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
