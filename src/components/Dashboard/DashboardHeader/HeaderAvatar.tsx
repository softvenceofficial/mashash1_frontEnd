import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LogoutIcon from "@/assets/svgs/logout.svg?react";
import ProfileIcon from "@/assets/svgs/Profile.svg?react";
import ArchiveIcon from "@/assets/svgs/archive-book.svg?react";
import assets from "@/assets";
import { useNavigate } from "react-router";

export default function HeaderAvatar() {
  const navigate = useNavigate();

  return (
    <section>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="size-8 rounded-full">
            {/* <AvatarImage src='https://avatar.iran.liara.run/public' alt='user avatar' /> */}
            <AvatarImage
              src={assets.image.DefaultPlaceholder}
              alt="user avatar"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[14.125rem] space-y-2">
          <DropdownMenuItem
            className="bg-background hover:bg-primary/10 hover:text-primary group p-2"
            onClick={() => navigate("/dashboard/view-profile")}
          >
            <span className="w-9 h-9 p-1 border group-hover:border-primary/50 rounded-full text-xl flex items-center justify-center">
              <ProfileIcon className="group-hover:text-primary" />
            </span>
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem
            className="bg-background hover:bg-primary/10 hover:text-primary group p-2"
            onClick={() => navigate("/dashboard/booking-history")}
          >
            <span className="w-9 h-9 p-1 border group-hover:border-primary/50 rounded-full text-xl flex items-center justify-center">
              <ArchiveIcon className="group-hover:text-primary" />
            </span>
            Booking History
          </DropdownMenuItem>
          <DropdownMenuItem className="bg-background hover:bg-primary/10 group text-red-500">
            <span className="w-9 h-9 p-1 border group-hover:border-red-500/50 rounded-full text-xl flex items-center justify-center">
              <LogoutIcon className="text-red-500" />
            </span>
            Log Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </section>
  );
}
