import { Check, Zap, Trophy, Crown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface Plan {
  name: string;
  month?: string;
  price: string;
  icon: React.ReactNode;
  yearly: string;
}

export default function PricingSection() {
  return (
    <div className="mt-10">
      <h1 className="text-3xl md:text-4xl lg:text-[40px] font-bold  max-w-2xl mx-auto text-center mb-12 text-white">
        Choose the Plan That Fits Your Creativity
      </h1>
      <div className="w-full bg-black p-5 flex justify-center pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7 container w-full">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`
              bg-[#0F0F0F] border border-neutral-800 text-white rounded-2xl 
               flex flex-col justify-between relative transition-all duration-300 hover:shadow-[0_0_2px_#232323,0_0_5px_#635C5A,0_0_30px_#64607C] hover:scale-105 group
            `}
            >
              {/* Icon */}
              <div className="absolute top-6 right-6 bg-[#222222] p-2.5 rounded-full">
                {plan.icon}
              </div>

              <CardContent>
                <div className="space-y-2">
                  <h2 className="text-xl font-bold">{plan.name}</h2>
                  <p className="text-[56px] font-bold">
                    {plan.price}
                    <span className="text-xl font-bold">{plan.month}</span>
                  </p>
                  <p className="text-base font-normal text-[#6E6E6E]">
                    {plan.yearly}
                  </p>
                </div>

                <Separator className="my-8 bg-[#262626]" />
                <div className=" space-y-5">
                  {Array(3)
                    .fill(0)
                    .map((_, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-white" />
                        <span className="text-sm text-[#6E6E6E]">
                          Feature text goes here
                        </span>
                      </div>
                    ))}
                </div>
              </CardContent>

              {/* Button */}
              <div className="px-5">
                <Button
                  className={`
                mt-12 w-full h-11 rounded-full font-medium bg-[#171717] group-hover:bg-white! group-hover:text-black! transition-colors duration-300 ease-in-out cursor-pointer`}
                >
                  Get started
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

const plans: Plan[] = [
  {
    name: "Basic plan",
    price: "$19",
    month: "/mo",
    yearly: "or $199 yearly",
    icon: <Zap className="h-5 w-5 text-white" />,
  },
  {
    name: "Business plan",
    price: "$29",
    month: "/mo",
    yearly: "or $299 yearly",
    icon: <Trophy className="h-5 w-5 text-white" />,
  },
  {
    name: "Enterprise plan",
    price: "$49",
    month: "/mo",
    yearly: "or $499 yearly",
    icon: <Crown className="h-5 w-5 text-white" />,
  },
];
