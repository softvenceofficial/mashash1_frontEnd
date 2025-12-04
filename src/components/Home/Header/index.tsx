import { Button } from "@/components/ui/button";
import Logo from "@/assets/svgs/logo.svg";
import { ModeToggle } from "@/components/ThemeToggle";
import { Link } from "react-router";
import useCurrentUser from "@/hooks/useCurrentUser";
import { Input } from "@/components/ui/input";
import Search from "@/assets/svgs/search.svg?react";
import Icon from "@/components/common/Icon";

export default function Header() {
  const user = useCurrentUser();
  console.log(user);

  return (
    <nav className="relative z-10 py-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-10">
          <Link to="/">
            <Icon src={Logo} className="size-8 text-white" />
          </Link>

          <div className="relative">
            <Input placeholder="Search" className="w-90 pr-16" />
            <Button className="absolute! top-0 right-0 px-5! h-9 rounded-l-none!">
              <Search className="size-5" />
            </Button>
          </div>
        </div>

        <ul className="flex items-center gap-4 font-semibold">
          <li >
            <Link to="/auth/signup" className="border border-white py-3 px-10 rounded-lg text-white hover:bg-white hover:text-black transition-colors duration-300 ease-in-out">Register</Link>
          </li>
          <li  >
            <Link to="/auth/signin" className="bg-white py-3 px-10 rounded-lg text-black border border-white">Log In</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
