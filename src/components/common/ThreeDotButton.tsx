import { useRef } from "react";
import { Ellipsis, ImagePlus } from "lucide-react";
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
import useModal from "../Modal/useModal";
import { useDeleteBookMutation, useUpdateBookMutation } from "@/redux/endpoints/bookApi";
import { toast } from "sonner";

export default function ThreeDotButton({ bookId }: { bookId: number }) {
  const [deleteBook, { isLoading: isDeleting }] = useDeleteBookMutation();
  const [updateBook, { isLoading: isUpdating }] = useUpdateBookMutation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { open } = useModal();

  const handleDelete = async () => {
    try {
      const result = await deleteBook(bookId).unwrap();
      if (result.success) {
        toast.success("Book moved to trash");
      }
    } catch (error) {
      toast.error("Failed to delete book");
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      return;
    }

    const formData = new FormData();
    formData.append("cover_image", file);

    const toastId = toast.loading("Updating cover image...");

    try {
      await updateBook({ id: bookId, data: formData }).unwrap();
      toast.success("Cover image updated successfully!", { id: toastId });
    } catch (error) {
      toast.error("Failed to update cover image", { id: toastId });
      console.error("Update Error:", error);
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger disabled={isUpdating || isDeleting}>
          <Ellipsis className={`rotate-90 cursor-pointer ${isUpdating ? "opacity-50" : ""}`} />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="mt-5 dark:border-[#51686E] border-border rounded-xl p-5 space-y-2"
        >
          <DropdownMenuItem
            className="dark:hover:bg-[#212B36] hover:bg-primary/10 hover:text-black dark:hover:text-white py-0.5 p-0"
            onClick={(e) => {
              e.preventDefault();
              fileInputRef.current?.click();
            }}
          >
            <Button
              variant="ghost"
              className="flex items-center gap-2 w-full justify-start px-2 dark:hover:bg-[#212B36] hover:bg-primary/10 cursor-pointer hover:text-black dark:hover:text-white"
            >
              <ImagePlus className="size-5 text-black dark:text-white" />
              <span className="text-base font-normal">
                {isUpdating ? "Uploading..." : "Update Cover"}
              </span>
            </Button>
          </DropdownMenuItem>

          <DropdownMenuItem 
            className="dark:hover:bg-[#212B36] hover:bg-primary/10 hover:text-black dark:hover:text-white py-0.5 p-0"
            onClick={() => open([{ modalId: "modal", openId: "share" }])}
          >
            <Button
              variant="ghost"
              className="flex items-center gap-2 w-full justify-start px-2 dark:hover:bg-[#212B36] hover:bg-primary/10 cursor-pointer hover:text-black dark:hover:text-white"
            >
              <Icon src={share} className="size-5 text-black dark:text-white" />
              <span className="text-base font-normal">Share</span>
            </Button>
          </DropdownMenuItem>

          <Button
            variant="ghost"
            className="flex items-center gap-2 w-full justify-start px-2 dark:hover:bg-[#212B36] hover:bg-primary/10 cursor-pointer hover:text-black dark:hover:text-white"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            <Icon src={bin} className="size-5 text-black dark:text-white" />
            <span className="text-base font-normal">{isDeleting ? "Moving..." : "Move to trash"}</span>
          </Button>
        </DropdownMenuContent>
      </DropdownMenu>

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/png, image/jpeg, image/webp"
        onChange={handleFileChange}
      />
    </>
  );
}
