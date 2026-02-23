import { Button } from "@/components/ui/button";
import EditIcon from "@/assets/svgs/edit.svg?react";
import MessageIcon from "@/assets/svgs/message-fill.svg?react";
import { useNavigate } from "react-router";
import { Card, CardContent } from "@/components/ui/card";
import assets from "@/assets";
import { ScrollArea } from "@/components/ui/scroll-area";
import ReviewCard from "@/components/Dashboard/Cards/ReviewCard";
import ServiceCard from "@/components/Home/Cards/ServiceCard";

export default function ViewProfile() {
  const navigate = useNavigate();

  return (
    <section>
      <div className="flex items-center justify-between mb-10">
        <h3 className="text-2xl font-semibold">View Profile</h3>
        <Button onClick={() => navigate("/dashboard/edit-profile")}>
          <EditIcon />
          Edit Profile
        </Button>
      </div>

      <div className="flex items-start gap-8">
        <div className="w-1/2 space-y-8">
          <Card>
            <CardContent className="flex items-start gap-8">
              <img
                src={assets.image.DefaultPlaceholder}
                alt="user image"
                className="size-40 rounded-xl border-2"
              />

              <div className="space-y-2.5">
                <h4 className="text-xl font-semibold">Michael</h4>

                <div className="flex items-center gap-6">
                  <p>⭐ 4.9 (120 Reviews)</p>
                  <Button variant="ghost" className="rounded-full">
                    <MessageIcon className="size-6 text-primary" />
                  </Button>
                </div>

                <div className="flex items-center gap-6">
                  <p>Total Services</p>
                  <p>:</p>
                  <p>10</p>
                </div>
                <p>Since one year</p>
              </div>
            </CardContent>
          </Card>

          <img
            src={assets.image.DefaultPlaceholder}
            alt="banner image"
            className="w-full h-[18rem] rounded-3xl object-cover"
          />

          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="text-xl font-semibold">About</h4>
              <p>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever{" "}
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-xl font-semibold">Description</h4>
              <p>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever{" "}
              </p>
            </div>

            <img
              src={assets.image.DefaultPlaceholder}
              alt="banner image"
              className="w-full h-[18rem] rounded-3xl object-cover"
            />
          </div>
        </div>

        <div className="w-1/2 space-y-10">
          <div>
            <div className="flex items-center justify-between text-xl font-semibold mb-4">
              <h4>Reviews(220)</h4>
              <h4>4.3 Rating</h4>
            </div>
            <ScrollArea className="h-[30rem]">
              <div className="space-y-4">
                <ReviewCard />
                <ReviewCard />
                <ReviewCard />
              </div>
            </ScrollArea>
          </div>

          <div>
            <div className="flex items-center justify-between text-xl font-semibold mb-4">
              <h4>All Services</h4>
              <h4 className="text-muted-foreground">See all</h4>
            </div>
            <ScrollArea className="h-[30rem]">
              <div className="space-y-4 grid grid-cols-2 gap-4">
                <ServiceCard />
                <ServiceCard />
                <ServiceCard />
                <ServiceCard />
                <ServiceCard />
                <ServiceCard />
                <ServiceCard />
                <ServiceCard />
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </section>
  );
}
