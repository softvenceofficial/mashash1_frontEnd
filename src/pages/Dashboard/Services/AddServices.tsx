import SideImage from "@/assets/svgs/Group 1171276986.svg?react";
import UploadImage from "@/assets/svgs/Upload cloud.svg?react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";

export default function AddServices() {
  return (
    <section>
      <h3 className="text-2xl font-semibold mb-10">Service Page</h3>

      <div className="flex items-center justify-between">
        <div className="w-[35%] space-y-6">
          <h2 className="text-3xl font-semibold mb-6">Add your service</h2>

          <div className="space-y-2">
            <Label>Service Title</Label>
            <Input placeholder="Add a title here..." />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea placeholder="Write here..." />
          </div>

          <div className="space-y-2">
            <Label>Service Charges</Label>
            <Input placeholder="Add Price" />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Available Time Slots :</h3>

            <div className="flex items-center justify-between">
              {["6: 45 am", "5:45 am", "8: 20 am", "5: 40 am"].map((item) => (
                <Button variant="ghost" className="rounded-full">
                  {item}
                </Button>
              ))}
              <Button className="rounded-full">Add</Button>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Location :</h3>

            <RadioGroup
              defaultValue="virtual"
              className="flex items-center justify-between gap-4"
            >
              <Label
                htmlFor="r1"
                className="flex items-center gap-3 w-full px-6 py-4 bg-muted rounded-xl border border-transparent hover:border-border"
              >
                <RadioGroupItem value="virtual" id="r1" />
                Virtual
              </Label>

              <Label
                htmlFor="r2"
                className="flex items-center gap-3 w-full px-6 py-4 bg-muted rounded-xl border border-transparent hover:border-border"
              >
                <RadioGroupItem value="in-person" id="r2" /> In-Person
              </Label>
            </RadioGroup>

            <div className="w-full py-2 bg-primary/10 border text-primary text-center font-semibold rounded-xl">
              Add Location
            </div>

            <div className="w-full py-4 bg-primary/10 border text-primary text-center font-semibold rounded-xl">
              <UploadImage className="size-10 mx-auto" />
              Upload Image(s)
            </div>
          </div>

          <Button className="w-full py-6 text-lg">Add</Button>
        </div>

        <div>
          <SideImage className="size-[45rem] mr-36" />
        </div>
      </div>
    </section>
  );
}
