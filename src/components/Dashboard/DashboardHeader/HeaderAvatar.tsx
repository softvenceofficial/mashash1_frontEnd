import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LogoutIcon from "@/assets/svgs/logout.svg?react";
import ProfileIcon from "@/assets/svgs/Profile.svg?react";
import assets from "@/assets";
import { useNavigate } from "react-router";
import useCurrentUser from "@/hooks/useCurrentUser";
import { useUserLogoutMutation } from "@/redux/endpoints/authApi";
import { getImageUrl } from "@/lib/utils";

export default function HeaderAvatar() {
  const userData = useCurrentUser();
  const navigate = useNavigate();
  const [userLogout] = useUserLogoutMutation();

  const handleLogout = async () => {
    try {
      const res = await userLogout("").unwrap();
      console.log("Logout Response:", res);
      navigate("/auth/signin", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <section>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="size-8 rounded-full cursor-pointer">
            {/* <AvatarImage src='https://avatar.iran.liara.run/public' alt='user avatar' /> */}
            <AvatarImage
              src={userData?.avatar ? getImageUrl(userData.avatar) : assets.image.DefaultPlaceholder}
              alt="user avatar"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56.5 space-y-2 mt-5" align="end">
          <DropdownMenuItem
            className="bg-background hover:bg-primary/10 hover:text-primary group p-2 cursor-pointer"
            onClick={() => navigate("/dashboard/view-profile")}
          >
            <span className="w-9 h-9 p-1 border group-hover:border-primary/50 rounded-full text-xl flex items-center justify-center">
              <ProfileIcon className="group-hover:text-primary" />
            </span>
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleLogout} className="bg-background hover:bg-primary/10 group text-red-500 cursor-pointer">
            <span className="w-9 h-9 p-1 border border-red-500! group-hover:border-red-500/50 rounded-full text-xl flex items-center justify-center">
              <LogoutIcon className="text-red-500" />
            </span>
            Log Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </section>
  );
}
