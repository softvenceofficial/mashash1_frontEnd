import { Button } from "@/components/ui/button";
import ArrowLeftIcon from "@/assets/svgs/arrow-left.svg?react";
import AddIcon from "@/assets/svgs/add.svg?react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useNavigate } from "react-router";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Invoice() {
  const navigate = useNavigate();
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <section>
      <div className="flex items-center justify-between  mb-10">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            className="rounded-full"
            onClick={() => window.history.back()}
          >
            <ArrowLeftIcon className="size-8" />
          </Button>
          <h3 className="text-2xl font-semibold">Invoice</h3>
        </div>
        <Button>
          <AddIcon /> Add
        </Button>
      </div>

      <div className="w-full flex items-start gap-12">
        <ScrollArea className="w-full h-[77vh]">
          <div className="space-y-8">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input placeholder="Add a title here..." />
            </div>

            <div className="space-y-4">
              <h4 className="text-xl font-semibold">Issue To :</h4>

              <div className="space-y-2">
                <Label>Name</Label>
                <Input placeholder="Name here" />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input placeholder="Email here" />
              </div>
              <div className="space-y-2">
                <Label>Address</Label>
                <Input placeholder="Address here" />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-xl font-semibold">Pay To :</h4>

              <div className="space-y-2">
                <Label>Name</Label>
                <Input placeholder="Name here" />
              </div>
              <div className="space-y-2">
                <Label>Bank Name</Label>
                <Input placeholder="Bank name here" />
              </div>
              <div className="space-y-2">
                <Label>Account Number</Label>
                <Input placeholder="Account number here" />
              </div>
              <div className="space-y-2">
                <Label>Advance</Label>
                <Input placeholder="Advance amount" />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Select Your Provided Service</Label>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Virtual Service" />
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

              <div className="space-y-2">
                <Label>Service at</Label>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Virtual Service" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="apple">In-Person</SelectItem>
                      <SelectItem value="banana">At Home</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Enter your location</Label>
                <Input placeholder="Write your location" />
              </div>

              <div className="space-y-2">
                <Label>Select only one TimeSlot</Label>
                <div className="space-x-6">
                  {["00:13:00", "12:13:00", "11:53:00", "01:13:00"].map(
                    (item) => (
                      <Button
                        key={item}
                        variant="secondary"
                        className="rounded-full"
                      >
                        {item}
                      </Button>
                    )
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Select date which you are available:</Label>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="w-full">
          <Card>
            <CardHeader className="flex items-center justify-between">
              <h4 className="text-xl font-semibold">Description</h4>
              <Button>
                <AddIcon /> Add item
              </Button>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <p>Booking payment</p>
                    <p>$100</p>
                  </div>
                ))}
              </div>

              <hr className="border-gray-500" />

              <div className="flex items-center justify-between">
                <p>Sub Total</p>
                <p>$300</p>
              </div>
              <div className="flex items-center justify-between">
                <p>Advance</p>
                <p>$100</p>
              </div>

              <hr className="border-gray-500" />

              <div className="flex items-center justify-between font-semibold text-xl">
                <p>Total Due</p>
                <p>$200</p>
              </div>
            </CardContent>
          </Card>

          <Button
            size="lg"
            className="w-full mt-6"
            onClick={() => navigate("/dashboard/bookings/get-invoice")}
          >
            Get Invoice
          </Button>
        </div>
      </div>
    </section>
  );
}
