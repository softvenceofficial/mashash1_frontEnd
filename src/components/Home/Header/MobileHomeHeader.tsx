import Icon from "@/components/common/Icon";
import { Link } from "react-router";
import Logo from "@/assets/svgs/logo.svg";
import { MenuIcon } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import hand from "@/assets/svgs/hand-fist.svg";
import dollar_sign from "@/assets/svgs/badge-dollar-sign.svg";
import notebook_pen from "@/assets/svgs/notebook-pen.svg";
import house from "@/assets/svgs/house.svg";
import panel from "@/assets/svgs/panel-top-open.svg";
import { useState } from "react";
import useCurrentUser from "@/hooks/useCurrentUser";

export default function MobileHomeHeader() {
  const [open, setOpen] = useState(false);
   const user = useCurrentUser();
    console.log(user);
  const links = [
    {
      name: "Home",
      id: "home",
      icon: <Icon src={house} className="size-6 white" />,
    },
    {
      name: "About us",
      id: "about",
      icon: <Icon src={panel} className="size-6 white" />,
    },
    {
      name: "Create your own book",
      id: "create-book",
      icon: <Icon src={notebook_pen} className="size-6 white" />,
    },
    {
      name: "Pricing",
      id: "pricing",
      icon: <Icon src={dollar_sign} className="size-6 white" />,
    },
    {
      name: "Support",
      id: "support",
      icon: <Icon src={hand} className="size-6 white" />,
    },
  ];

  const handleNavigate = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });

      // Wait for scroll animation to start before closing the sheet
      setTimeout(() => setOpen(false), 300);
    }
  };

  return (
    <nav className="relative z-10 py-4 lg:hidden px-5">
      <div className="flex items-center justify-between">
        <Link to="/">
          <Icon src={Logo} className="size-8 text-white" />
        </Link>

        <Sheet open={open} onOpenChange={setOpen} modal={false}>
          <SheetTrigger asChild>
            <button className="bg-white p-1.5 rounded-lg">
              <MenuIcon className="w-6 h-6 text-primary" />
            </button>
          </SheetTrigger>
          <SheetContent
            onOpenAutoFocus={(e) => e.preventDefault()}
            onCloseAutoFocus={(e) => e.preventDefault()}
            className="border-white bg-black"
          >
            <Link to="/" className="pt-2 pl-4">
              <Icon src={Logo} className="size-8 text-white" />
            </Link>

            <div className="">
              <ul className="flex flex-col items-start gap-5 text-white font-medium pl-4 mt-5">
                {links.map((link) => (
                  <li key={link.name}>
                    <button
                      onClick={() => handleNavigate(link.id)}
                      className="text-lg font-normal cursor-pointer flex items-center gap-2"
                    >
                      {link.icon}
                      {link.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            {user ? (
              <Link
                to="/dashboard"
                className="bg-white text-black py-3 px-10 rounded-lg text-lg mx-4 mt-6 block text-center font-semibold"
              >
                Dashboard
              </Link>
            ) : (
              <div className="flex flex-col gap-4 mt-6 px-4">
                  <Link
                    to="/auth/signup"
                    className="border border-white py-3 px-10 rounded-lg text-white hover:bg-white hover:text-black transition-colors duration-300 ease-in-out text-center font-semibold"
                  >
                    Register
                  </Link>
                  <Link
                    to="/auth/signin"
                    className="bg-white py-3 px-10 rounded-lg text-black border border-white text-center font-semibold"
                  >
                    Log In
                  </Link>
              </div>
            )}
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
