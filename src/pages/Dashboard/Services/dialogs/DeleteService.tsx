import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { closeDialog } from "@/redux/slices/dialogSlice";
import { useDispatch } from "react-redux";
import MaskIcon from "@/assets/svgs/Mask group.svg?react";
import { useState } from "react";

export default function DeleteService({ dialogId }: { dialogId: string }) {
  const dispatch = useDispatch();
  const [currentDialog, setCurrentDialog] = useState<1 | 2 | 3>(1);

  return (
    <section>
      {currentDialog === 1 ? (
        <div className="space-y-6">
          <h1 className="text-lg font-semibold text-center">
            Enter Your Password
          </h1>
          <Input type="password" />
          <Button className="w-full" onClick={() => setCurrentDialog(2)}>
            Confirm PIN
          </Button>
        </div>
      ) : currentDialog === 2 ? (
        <div>
          <h2 className="text-lg font-semibold text-center">
            Are you sure want to <br /> delete this selected service?
          </h2>

          <div className="flex items-center justify-center gap-4 mt-8">
            <Button
              variant="ghost"
              onClick={() => {
                dispatch(closeDialog(dialogId));
              }}
            >
              No
            </Button>
            <Button onClick={() => setCurrentDialog(3)}>Yes</Button>
          </div>
        </div>
      ) : currentDialog === 3 ? (
        <div>
          <div className="space-y-4">
            <MaskIcon className="text-primary size-20 mx-auto" />
            <h2 className="text-lg font-semibold text-center">
              You’ve successfully deleted
              <br /> the service.
            </h2>
            <Button
              className="w-full"
              onClick={() => {
                dispatch(closeDialog(dialogId));
              }}
            >
              View service page
            </Button>
          </div>
        </div>
      ) : (
        <></>
      )}
    </section>
  );
}
