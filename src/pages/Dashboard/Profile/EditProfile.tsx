import SideImage from "@/assets/svgs/undraw_profile-details_6fky 1.svg?react";
import UploadImage from "@/assets/svgs/Upload cloud.svg?react";
import ArrowLeftIcon from "@/assets/svgs/arrow-left.svg?react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function EditProfile() {
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
        <h3 className="text-2xl font-semibold">Edit Profile</h3>
      </div>

      <div className="flex items-center justify-between">
        <div className="w-[35%] space-y-6">
          <div className="mx-auto size-52 rounded-xl bg-muted text-muted-foreground flex flex-col items-center justify-center">
            <UploadImage className="size-10" />
            <p>Upload Profile Photo</p>
          </div>

          <div className="w-full py-6 rounded-xl bg-muted text-muted-foreground flex flex-col items-center justify-center">
            <UploadImage className="size-10" />
            <p>Upload Cover Photo(s)</p>
          </div>

          <div className="space-y-2">
            <Label>Name</Label>
            <Input placeholder="Add a title here..." />
          </div>

          <div className="space-y-2">
            <Label>About</Label>
            <Textarea placeholder="Write an about here..." />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea placeholder="Write here..." />
          </div>

          <div className="space-y-2">
            <Label>Social Media</Label>
            <Input placeholder="Linked your account" />
          </div>

          <Button className="w-full py-6 text-lg">Confirm</Button>
        </div>

        <div>
          <SideImage className="size-[35rem] mr-40" />
        </div>
      </div>
    </section>
  );
}
