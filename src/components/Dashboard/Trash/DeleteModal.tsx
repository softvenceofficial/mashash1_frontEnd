import useModal from "@/components/Modal/useModal";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

export default function DeleteModal() {
    const {close} = useModal();
    const handleDelete = () => {
        // Add delete logic here
        toast.success("File deleted permanently");
        close(["modal"]);
    }
  return (
    <div className="">
      <h2 className="text-2xl font-semibold">Permanently delete file</h2>
      <Separator className="my-6 bg-gray-200 dark:bg-[#3B3B3B]" />
      <p className="text-2xl">
        You sure you want to delete this file permanently? You won’t be able to
        restore it.
      </p>
      <Separator className="my-6 bg-gray-200 dark:bg-[#3B3B3B]" />
        <div className="gap-6 flex items-center justify-end">
            <Button onClick={() => close(["modal"])} className="text-2xl font-medium px-7 h-12 bg-white! text-black cursor-pointer">Cancel</Button>
            <Button onClick={handleDelete} variant="destructive" className="text-2xl font-medium px-7 h-12 bg-[#EF4444]! cursor-pointer">Permanently delete</Button>
        </div>
    </div>
  );
}
