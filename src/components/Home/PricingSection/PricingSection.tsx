import { Check, Zap, Trophy, Crown, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { useGetAllPlansQuery, useCreateCheckoutSessionMutation } from "@/redux/endpoints/subscriptionApi";
import { toast } from "sonner";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] } }
};

const getIcon = (name: string) => {
  const lowerName = name.toLowerCase();
  if (lowerName.includes("basic")) return <Zap className="h-5 w-5 text-white" />;
  if (lowerName.includes("business")) return <Trophy className="h-5 w-5 text-white" />;
  return <Crown className="h-5 w-5 text-white" />;
};

export default function PricingSection() {
  const { data: plans, isLoading, isError } = useGetAllPlansQuery();
  const [createCheckout, { isLoading: isCheckingOut }] = useCreateCheckoutSessionMutation();

  const handleSubscribe = async (planId: number) => {
    try {
      const result = await createCheckout({ plan_id: planId }).unwrap();
      if (result.checkout_url) {
        window.location.href = result.checkout_url;
      }
    } catch (error) {
      console.error("Checkout failed", error);
      toast.error("Failed to initiate checkout. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <section id="pricing" className="mt-10">
        <div className="text-center text-white py-20">Loading plans...</div>
      </section>
    );
  }

  if (isError || !plans) {
    return (
      <section id="pricing" className="mt-10">
        <div className="text-center text-red-500 py-20">Failed to load plans</div>
      </section>
    );
  }

  return (
    <section id="pricing" className="mt-10">
      <motion.h1 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-3xl md:text-4xl lg:text-[40px] font-bold  max-w-2xl mx-auto text-center mb-12 text-white"
      >
        Choose the Plan That Fits Your Creativity
      </motion.h1>
      <div className="w-full bg-black p-5 flex justify-center pb-20">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-7 container w-full"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {plans.map((plan) => (
            <motion.div key={plan.id} variants={cardVariants}>
              <Card
                className="bg-[#0F0F0F] border border-neutral-800 text-white rounded-2xl flex flex-col justify-between relative transition-all duration-300 hover:shadow-[0_0_2px_#232323,0_0_5px_#635C5A,0_0_30px_#64607C] hover:scale-105 group h-full"
              >
                <div className="absolute top-6 right-6 bg-[#222222] p-2.5 rounded-full">
                  {getIcon(plan.name)}
                </div>

                <CardContent>
                  <div className="space-y-2">
                    <h2 className="text-xl font-bold">{plan.name}</h2>
                    <p className="text-[56px] font-bold">
                      ${parseFloat(plan.price_usd).toFixed(0)}
                      <span className="text-xl font-bold">/mo</span>
                    </p>
                    <p className="text-base font-normal text-[#6E6E6E]">
                      {plan.image_limit} Images per month
                    </p>
                  </div>

                  <Separator className="my-8 bg-[#262626]" />
                  <div className="space-y-5">
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-white" />
                      <span className="text-sm text-[#6E6E6E]">High Quality Generations</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-white" />
                      <span className="text-sm text-[#6E6E6E]">Commercial Usage</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-white" />
                      <span className="text-sm text-[#6E6E6E]">Priority Support</span>
                    </div>
                  </div>
                </CardContent>

                <div className="px-5 pb-5">
                  <Button
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={isCheckingOut}
                    className="mt-12 w-full h-11 rounded-full font-medium bg-[#171717] group-hover:bg-white group-hover:text-black transition-colors duration-300 ease-in-out cursor-pointer"
                  >
                    {isCheckingOut ? <Loader2 className="animate-spin" /> : "Get Started"}
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
