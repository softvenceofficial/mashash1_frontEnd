import assets from "@/assets";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Dot } from "lucide-react";
// import NewSectionIcon from "@/assets/svgs/new-section.svg?react";
import ClockIcon from "@/assets/svgs/clock.svg?react";
import MapPinIcon from "@/assets/svgs/Map pin.svg?react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";

export default function ClientCard({
  isActionButton = true,
}: {
  isActionButton?: boolean;
}) {
  return (
    <Card className="py-2.5 shadow-lg shadow-primary/20">
      <CardHeader className="flex items-center justify-between px-2.5 ">
        <div className="flex items-center gap-4">
          <img
            alt="client-image"
            src={assets.image.DefaultPlaceholder}
            className="size-[2.875rem] rounded-2xl border-2"
          />
          <Link
            to="/dashboard/bookings/client-profile"
            className="hover:underline"
          >
            <h2 className="text-xl font-semibold">Client Name</h2>
          </Link>
        </div>
        {/* <NewSectionIcon className="text-primary size-8" /> */}
      </CardHeader>
      <CardContent className="px-2.5 ">
        <div className="flex items-center gap-2">
          <ClockIcon className="text-primary size-6" />
          Tue July 20
          <Dot className="text-gray-500 size-8" />
          8:00 - 8:30 AM
        </div>
        <div className="flex items-center gap-2">
          <MapPinIcon className="text-primary size-8" />
          <p className="line-clamp-1">
            Location : 2436 Main Street, Springfield, IL 62704, United States
          </p>
        </div>
        {isActionButton && (
          <Link to={"/dashboard/bookings/reschedule"}>
            <p className="text-primary pl-8">Or Tap Here To Reschedule</p>
          </Link>
        )}
      </CardContent>
      {isActionButton && (
        <CardFooter className="w-full flex items-center gap-6 px-2.5">
          <Button variant="secondary" className="flex-1 rounded-2xl">
            Reject
          </Button>
          <Button className="flex-1 rounded-2xl">Approve</Button>
        </CardFooter>
      )}
    </Card>
  );
}
