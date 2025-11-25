import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { useDispatch, useSelector } from "react-redux";
import { openDialog, resetDialog } from "@/redux/slices/dialogSlice";
import type { RootState } from "@/redux/store";

export default function DialogWrapper({
  trigger,
  content,
  dialogKey,
}: {
  trigger: React.ReactNode;
  content: React.ReactNode;
  dialogKey: string;
}) {
  const dispatch = useDispatch();
  const open = useSelector((state: RootState) => state.dialog[dialogKey]);

  return (
    <>
      <span onClick={() => dispatch(openDialog(dialogKey))}>{trigger}</span>
      <Dialog
        open={open}
        onOpenChange={(val) => {
          if (val) dispatch(openDialog(dialogKey));
          else dispatch(resetDialog(dialogKey));
        }}
      >
        <DialogContent>
          <DialogTitle></DialogTitle>
          {content}
        </DialogContent>
      </Dialog>
    </>
  );
}
