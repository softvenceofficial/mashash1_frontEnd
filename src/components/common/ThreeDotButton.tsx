import { Ellipsis } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import share from "@/assets/svgs/share.svg";
import bin from "@/assets/svgs/trash.svg";
import { Button } from "../ui/button";
import Icon from "./Icon";
import OpenModal from "../Modal/OpenModal";

export default function ThreeDotButton() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Ellipsis className="rotate-90 cursor-pointer" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="mt-5 dark:border-[#51686E] border-border rounded-xl p-5 space-y-2"
      >
        {/* Add dropdown items here if needed */}
        <DropdownMenuItem className="dark:hover:bg-[#212B36] hover:bg-primary/10 hover:text-black dark:hover:text-white py-0.5 p-0">
          <OpenModal query={[{ modalId: "modal", openId: "share" }]}>
            <Button
              variant="ghost"
              className="flex items-center gap-2 w-full justify-start px-2 dark:hover:bg-[#212B36] hover:bg-primary/10 cursor-pointer hover:text-black dark:hover:text-white"
            >
              <Icon src={share} className="size-5 text-black dark:text-white" />
              <span className="text-base font-normal">Share</span>
            </Button>
          </OpenModal>
        </DropdownMenuItem>
        <Button
          variant="ghost"
          className="flex items-center gap-2 w-full justify-start px-2 dark:hover:bg-[#212B36] hover:bg-primary/10 cursor-pointer hover:text-black dark:hover:text-white"
        >
          <Icon src={bin} className="size-5 text-black dark:text-white" />
          <span className="text-base font-normal">Move to trash</span>
        </Button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
