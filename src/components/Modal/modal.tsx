import type { PropsWithChildren } from "react";
import { useSearchParams } from "react-router";
import { Dialog, DialogContent } from "../ui/dialog";

interface ModalProps {
  modalId: string;
  openId: string;
}

export default function Modal({
  openId,
  modalId,
  children,
}: PropsWithChildren<ModalProps>) {
  const [searchParams, setSearchParams] = useSearchParams();
  const modal = searchParams.get(modalId);

  const handleOpenChange = (open: boolean) => {
    if (open) {
      searchParams.set(modalId, openId);
    } else {
      searchParams.delete(modalId);
    }

    setSearchParams(searchParams);
  };

  return (
    <Dialog open={modal === openId} onOpenChange={handleOpenChange}>
      <DialogContent className="w-full max-w-[95vw] sm:max-w-[60vw] max-h-[90dvh] px-2 sm:px-6 py-4">
        {children}
      </DialogContent>
    </Dialog>
  );
}
