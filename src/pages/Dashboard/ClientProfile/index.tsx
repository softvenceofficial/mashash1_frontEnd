import ClientProfileCard from "@/components/Dashboard/Cards/ClientProfileCard";
import { Button } from "@/components/ui/button";
import ArrowLeftIcon from "@/assets/svgs/arrow-left.svg?react";
import CalendarIcon from "@/assets/svgs/calendar-time.svg?react";
import ClockIcon from "@/assets/svgs/clock.svg?react";
import WalletIcon from "@/assets/svgs/wallet.svg?react";

export default function ClientProfile() {
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
        <h3 className="text-2xl font-semibold">Client Profile</h3>
      </div>

      <div className="flex items-start gap-8">
        <ClientProfileCard />

        <div className="w-1/2">
          <div className="bg-accent p-4 rounded-2xl flex items-center justify-around">
            <div>
              <div className="flex items-center gap-2.5 font-semibold text-xl text-gray-600 dark:text-gray-300">
                <CalendarIcon />
                <p>18 Jan</p>
              </div>
              <p className="text-center text-accent-foreground">Date</p>
            </div>

            <hr className="w-[2px] h-[4rem] bg-gray-600" />

            <div>
              <div className="flex items-center gap-2.5 font-semibold text-xl text-gray-600 dark:text-gray-300">
                <ClockIcon />
                <p>11:00 AM</p>
              </div>
              <p className="text-center text-accent-foreground">Time </p>
            </div>

            <hr className="w-[2px] h-[4rem] bg-gray-600" />

            <div>
              <div className="flex items-center gap-2.5 font-semibold text-xl text-gray-600 dark:text-gray-300">
                <WalletIcon />
                <p>$ 50</p>
              </div>
              <p className="text-center text-accent-foreground">Avg Spending</p>
            </div>
          </div>

          <div className="space-y-1 mt-6">
            <h4 className="text-lg font-semibold">Preference</h4>
            <p>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
