import { Ellipsis } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import OpenModal from "../Modal/OpenModal";

export default function TrashThreeDotButton() {
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
        <Button
          variant="ghost"
          className="flex items-center gap-2 w-full justify-start px-2 dark:hover:bg-[#212B36] hover:bg-primary/10 cursor-pointer hover:text-black dark:hover:text-white h-10"
        >
          {/* <Icon src={share} className="size-5 text-black dark:text-white" /> */}
          <span className="text-base font-normal">Restore</span>
        </Button>
        <DropdownMenuItem className="dark:hover:bg-[#212B36] hover:bg-primary/10 hover:text-black dark:hover:text-white py-0.5 ">
          <OpenModal query={[{ modalId: "modal", openId: "permanent-delete" }]}>
            <Button
              variant="ghost"
              className="flex items-center gap-2 w-full justify-start px-0 py-0 hover:bg-transparent! hover:text-black dark:hover:text-white cursor-pointer"
            >
              {/* <Icon src={bin} className="size-5 text-black dark:text-white" /> */}
              <span className="text-base font-normal">Delete Permanently</span>
            </Button>
          </OpenModal>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
