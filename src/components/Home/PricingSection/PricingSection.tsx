import { Check, Zap, Trophy, Crown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Plan {
  name: string;
  price: string;
  icon: React.ReactNode;
  yearly: string;
}

export default function PricingSection() {
  return (
    <div className="w-full bg-black p-5 flex justify-center pb-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={`
              bg-[#0F0F0F] border border-neutral-800 text-white rounded-2xl 
               flex flex-col justify-between relative transition-all duration-300 hover:shadow-[0_0_2px_#232323,0_0_5px_#635C5A,0_0_30px_#64607C] hover:scale-105 cursor-pointer group
            `}
          >
            {/* Icon */}
            <div className="absolute top-6 right-6 bg-[#222222] p-2.5 rounded-full">
              {plan.icon}
            </div>

            <CardContent className="space-y-4">
              <h2 className="text-lg font-semibold">{plan.name}</h2>
              <p className="text-4xl font-bold">{plan.price}</p>
              <p className="text-sm text-neutral-400">{plan.yearly}</p>

              <div className="mt-6 space-y-3">
                {Array(3)
                  .fill(0)
                  .map((_, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-white" />
                      <span className="text-sm text-neutral-300">
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
                mt-8 w-full h-11 rounded-full font-medium bg-[#171717] group-hover:bg-white! group-hover:text-black! transition-colors duration-300 ease-in-out cursor-pointer`}
              >
                Get started
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

const plans: Plan[] = [
  {
    name: "Basic plan",
    price: "$19/mo",
    yearly: "or $199 yearly",
    icon: <Zap className="h-5 w-5 text-white" />,
  },
  {
    name: "Business plan",
    price: "$29/mo",
    yearly: "or $299 yearly",
    icon: <Trophy className="h-5 w-5 text-white" />,
  },
  {
    name: "Enterprise plan",
    price: "$49/mo",
    yearly: "or $499 yearly",
    icon: <Crown className="h-5 w-5 text-white" />,
  },
];
