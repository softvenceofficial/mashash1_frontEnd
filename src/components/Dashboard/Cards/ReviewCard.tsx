import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import QuitIcon from "@/assets/svgs/Group 6.svg?react";
import Star from "@/assets/svgs/Star 2.svg?react";
import ThumbsDown from "@/assets/svgs/thumbs-down.svg?react";
import ThumbsUp from "@/assets/svgs/thumbs-up.svg?react";
import assets from "@/assets";

export default function ReviewCard() {
  return (
    <Card className="border-muted">
      <CardHeader className="flex items-center justify-between">
        <QuitIcon className="size-6" />
        <div className="flex items-center gap-2">
          <Star />
          <Star />
          <Star />
          <Star />
          <Star />
        </div>
      </CardHeader>
      <CardContent>
        I’ve used other kits, but this one is the best. The attention to detail
        and usability are truly amazing for all designers.
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img
            src={assets.image.DefaultPlaceholder}
            alt="user image"
            className="rounded-full size-12"
          />
          <div>
            <h2 className="text-xl font-semibold">Mirana Marci</h2>
            <p className="text-muted-foreground">Posted on : 13 May 2025</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <ThumbsUp className="size-6" />
          <ThumbsDown className="size-6" />
        </div>
      </CardFooter>
    </Card>
  );
}
