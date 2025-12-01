import { toast } from "sonner";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import useModal from "../Modal/useModal";

export default function DeleteAccountModal() {
     const {close} = useModal();
    const handleDelete = () => {
        // Add delete logic here
        toast.success("Account deleted permanently");
        close(["modal"]);
    }
  return (
    <div className="">
      <h2 className="text-2xl font-semibold">Permanently delete account</h2>
      <Separator className="my-6 bg-gray-200 dark:bg-[#3B3B3B]" />
      <p className="text-2xl">
        You sure you want to delete this account permanently? You won’t be able to
        restore it.
      </p>
      <Separator className="my-6 bg-gray-200 dark:bg-[#3B3B3B]" />
      <div className="gap-6 flex items-center justify-end">
        <Button
          onClick={() => close(["modal"])}
          className="text-2xl font-medium px-7 h-12 bg-white! text-black cursor-pointer"
        >
          Cancel
        </Button>
        <Button
          onClick={handleDelete}
          variant="destructive"
          className="text-2xl font-medium px-7 h-12 bg-[#EF4444]! cursor-pointer"
        >
          Permanently delete
        </Button>
      </div>
    </div>
  );
}
