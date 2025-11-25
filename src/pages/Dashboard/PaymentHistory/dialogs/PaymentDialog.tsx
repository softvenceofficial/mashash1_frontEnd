import { useDispatch } from "react-redux";
import { closeDialog } from "@/redux/slices/dialogSlice";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function PaymentDialog({ dialogId }: { dialogId: string }) {
  const dispatch = useDispatch();
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Request Payment</h2>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Amount</Label>
          <Input placeholder="Enter our amount..." />
        </div>
        <div className="space-y-2">
          <Label>Note</Label>
          <Input placeholder="Write note here..." />
        </div>
      </div>
      <div className="flex justify-end">
        <Button
          onClick={() => dispatch(closeDialog(dialogId))}
          className="w-full"
        >
          Confirm
        </Button>
      </div>
    </div>
  );
}
