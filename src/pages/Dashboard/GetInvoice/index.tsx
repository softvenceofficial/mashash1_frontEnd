import { Button } from "@/components/ui/button";
import ArrowLeftIcon from "@/assets/svgs/arrow-left.svg?react";
import AddIcon from "@/assets/svgs/add.svg?react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function GetInvoice() {
  const [template, setTemplate] = useState<number>(1);

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
          <h3 className="text-2xl font-semibold">Get Invoice</h3>
        </div>
        <Button>
          <AddIcon /> Add
        </Button>
      </div>

      <div className="w-full flex items-start gap-12">
        <div className="w-full space-y-8">
          <p>Invoice Summary here</p>

          <div className="space-y-4">
            <h4 className="text-xl font-semibold">Issue To :</h4>
            <div className="text-accent-foreground space-y-2">
              <p>Micheal</p>
              <p>micheal123@gmail.com</p>
              <p>New York, NY</p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-xl font-semibold">Pay To :</h4>
            <div className="text-accent-foreground space-y-2">
              <p>Micheal</p>
              <p>First National Bank</p>
              <p>1234567890</p>
            </div>
          </div>
        </div>

        <div className="w-full">
          <Card
            className={
              template === 0
                ? "bg-transparent"
                : template === 1
                ? "bg-[#FBF3EF] dark:bg-[#fbf3ef31]"
                : template === 2
                ? "bg-[#E6F2E6] dark:bg-[#e6f2e654]"
                : ""
            }
          >
            <CardHeader>
              <h4 className="text-xl font-semibold">Summary</h4>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p>Total item</p>
                  <p>3</p>
                </div>

                <div className="flex items-center justify-between">
                  <p>Total amount</p>
                  <p>$300</p>
                </div>

                <div className="flex items-center justify-between">
                  <p>Tax fee</p>
                  <p>$2.00</p>
                </div>
              </div>

              <hr className="border-gray-500" />

              <div className="flex items-center justify-between font-semibold text-xl">
                <p>Sub Total</p>
                <p>$302</p>
              </div>
            </CardContent>
          </Card>

          <Button size="lg" className="w-full mt-6">
            Confirm
          </Button>
        </div>
      </div>

      <div className="mt-10 space-y-4">
        <h4 className="text-xl font-semibold">Select Template </h4>

        <div className="flex items-center gap-6">
          {[...Array(3)].map((_, i) => (
            <Card
              key={i}
              className={cn(
                "border-transparent hover:border-primary cursor-pointer",
                i === 0
                  ? "bg-transparent"
                  : i === 1
                  ? "bg-[#FBF3EF] dark:bg-[#fbf3ef31]"
                  : i === 2
                  ? "bg-[#E6F2E6] dark:bg-[#e6f2e654]"
                  : "",
                template === i ? "border-primary" : "border-gray-500/25"
              )}
              onClick={() => setTemplate(i)}
            >
              <CardHeader>
                <h4 className="text-xl font-semibold">Summary</h4>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p>Total item</p>
                    <p>3</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <p>Total amount</p>
                    <p>$300</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <p>Tax fee</p>
                    <p>$2.00</p>
                  </div>
                </div>

                <hr className="border-gray-500" />

                <div className="flex items-center justify-between font-semibold text-xl">
                  <p>Sub Total</p>
                  <p>$302</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
