import { Ellipsis } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { useDeleteBookPermanentlyMutation } from "@/redux/endpoints/bookApi";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { useState } from "react";

export default function TrashThreeDotButton({ bookId }: { bookId: number }) {
  const [deleteBookPermanently, { isLoading }] = useDeleteBookPermanentlyMutation();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handlePermanentDelete = async () => {
    try {
      const result = await deleteBookPermanently(bookId).unwrap();
      if (result.success) {
        toast.success("Book deleted permanently");
        setShowDeleteDialog(false);
      }
    } catch (error) {
      toast.error("Failed to delete book");
    }
  };

  const handleRestore = () => {
    // TODO: Implement restore functionality when API is available
    toast.info("Restore functionality coming soon");
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Ellipsis className="rotate-90 cursor-pointer" />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="mt-5 dark:border-[#51686E] border-border rounded-xl p-5 space-y-2"
        >
          <Button
            variant="ghost"
            className="flex items-center gap-2 w-full justify-start px-2 dark:hover:bg-[#212B36] hover:bg-primary/10 cursor-pointer hover:text-black dark:hover:text-white h-10"
            onClick={handleRestore}
          >
            <span className="text-base font-normal">Restore</span>
          </Button>
          <DropdownMenuItem className="dark:hover:bg-[#212B36] hover:bg-primary/10 hover:text-black dark:hover:text-white py-0.5 ">
            <Button
              variant="ghost"
              className="flex items-center gap-2 w-full justify-start px-0 py-0 hover:bg-transparent! hover:text-black dark:hover:text-white cursor-pointer"
              onClick={() => setShowDeleteDialog(true)}
            >
              <span className="text-base font-normal">Delete Permanently</span>
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the book from our servers.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handlePermanentDelete}
              disabled={isLoading}
            >
              {isLoading ? "Deleting..." : "Delete Permanently"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
