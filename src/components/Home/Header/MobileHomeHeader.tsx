import Icon from "@/components/common/Icon";
import { Link } from "react-router";
import Logo from "@/assets/svgs/logo.svg";
import { MenuIcon } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";


export default function MobileHomeHeader() {
  return (
    <nav className="relative z-10 py-4 md:hidden px-5">
        <div className="flex items-center justify-between">
            <Link to="/">
            <Icon src={Logo} className="size-8 text-white" />
          </Link>
        
        <Sheet>
            <SheetTrigger asChild>
                <button className="bg-white p-1.5 rounded-lg">
                    <MenuIcon className="w-6 h-6 text-primary" />
                </button>
            </SheetTrigger>
            <SheetContent>
                sd
            </SheetContent>
        </Sheet>
        </div>

    </nav>
  )
}
