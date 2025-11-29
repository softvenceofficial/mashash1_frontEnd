import Icon from "@/components/common/Icon";
import bg from "@/assets/svgs/dashboard-home-bg.svg";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";

export default function DashboardPage() {
  return (
    <section className="space-y-5">
      <div className="max-w-md mx-auto mt-20">
        <Icon src={bg} className="text-[#454F5B] mx-auto" />
        <p className="text-base font-normal text-secondary-foreground mt-3">Nothing here yet. Bring your ideas to life with a new artbook.</p>
        <div className="flex justify-center mt-7">
          <Link to="/Creator">
          <Button variant="default" className="mt-4">
            Create New Artbook
          </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
