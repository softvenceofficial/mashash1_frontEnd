import { Button } from "@/components/ui/button";
import Logo from "@/assets/react.svg?react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../Auth/AuthDialog";
import SignUpLogIn from "../../Auth/SignUpLogIn";
import { ModeToggle } from "@/components/ThemeToggle";
import { Link } from "react-router";
import useCurrentUser from "@/hooks/useCurrentUser";
import { Input } from "@/components/ui/input";
import Search from "@/assets/svgs/search.svg?react";
import Notification from "@/components/Dashboard/DashboardHeader/Notification";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import assets from "@/assets";
import { MessageCircle } from "lucide-react";

export default function Header() {
  const user = useCurrentUser();
  console.log(user);

  return (
    <nav className="border-b border-primary/30 bg-background py-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-10">
          <Link to="/">
            <Logo className="size-8 text-primary" />
          </Link>

          {user && (
            <div className="relative">
              <Input placeholder="Search" className="w-90 pr-16" />
              <Button className="!absolute top-0 right-0 !px-5 h-9 !rounded-l-none">
                <Search className="size-5" />
              </Button>
            </div>
          )}
        </div>

        {user ? (
          <ul className="flex items-center gap-12 font-semibold">
            <li>
              <Dialog>
                <DialogTrigger>
                  <span className="cursor-pointer select-none">
                    Sell Your Services
                  </span>
                </DialogTrigger>
                <DialogContent className="h-[80vh]">
                  <DialogHeader className="hidden ">
                    <DialogTitle></DialogTitle>
                  </DialogHeader>
                  <DialogDescription className="hidden "></DialogDescription>

                  <SignUpLogIn activatedTab="signup" />
                </DialogContent>
              </Dialog>
            </li>
            <li>
              <Dialog>
                <DialogTrigger>
                  <Button variant={"ghost"}>Log In</Button>
                </DialogTrigger>
                <DialogContent className="h-[80vh]">
                  <DialogHeader className="hidden ">
                    <DialogTitle></DialogTitle>
                  </DialogHeader>
                  <DialogDescription className="hidden "></DialogDescription>

                  <SignUpLogIn activatedTab="login" />
                </DialogContent>
              </Dialog>
            </li>
            <li>
              <Dialog>
                <DialogTrigger>
                  <Button variant={"outline"} className="border-2">
                    Sign Up
                  </Button>
                </DialogTrigger>
                <DialogContent className="h-[80vh]">
                  <DialogHeader className="hidden ">
                    <DialogTitle></DialogTitle>
                  </DialogHeader>
                  <DialogDescription className="hidden "></DialogDescription>

                  <SignUpLogIn activatedTab="signup" />
                </DialogContent>
              </Dialog>
            </li>
            <li>
              <ModeToggle />
            </li>
          </ul>
        ) : (
          <ul className="flex items-center gap-5 font-semibold">
            <li>
              <Notification />
            </li>
            <li>
              <MessageCircle className="cursor-pointer" />
            </li>
            <li>
              <Link to="/">
                <Avatar className="size-8 rounded-full">
                  {/* <AvatarImage src='https://avatar.iran.liara.run/public' alt='user avatar' /> */}
                  <AvatarImage
                    src={assets.image.DefaultPlaceholder}
                    alt="user avatar"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </Link>
            </li>

            <li>
              <ModeToggle />
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
}
