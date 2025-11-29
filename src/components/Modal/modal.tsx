import { cn } from "@/lib/utils";
import type { PropsWithChildren } from "react";
import { useSearchParams } from "react-router";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

interface ModalProps {
  modalId: string;
  openId: string;
  closeModals?: string[];
  className?: string;
}

export default function Modal({
  openId,
  modalId,
  children,
  closeModals,
  className,
}: PropsWithChildren<ModalProps>) {
  const [searchParams, setSearchParams] = useSearchParams();
  const modal = searchParams.get(modalId);

  const handleOpenChange = (open: boolean) => {
    if (open) {
      searchParams.set(modalId, openId);
    } else {
      searchParams.delete(modalId);
      if (closeModals && closeModals.length > 0) {
        closeModals.forEach((id) => searchParams.delete(id));
      }
    }

    setSearchParams(searchParams);
  };

  return (
    <Dialog open={modal === openId} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild hidden />
      <DialogContent
        className={cn(
          "max-h-[90dvh] w-full max-w-[90vw] overflow-y-auto px-2 py-4 sm:px-6",
          className,
        )}
      >
        <DialogHeader hidden>
          <DialogTitle hidden />
          <DialogDescription hidden />
        </DialogHeader>
        {children}
        <DialogFooter hidden />
      </DialogContent>
    </Dialog>
  );
}
