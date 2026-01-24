import { toast } from "sonner";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import useModal from "../Modal/useModal";
import { useDeleteAccountMutation } from "@/redux/endpoints/userApi";
import { useState } from "react";
import { useNavigate } from "react-router";
import { removeUserInfo } from "@/redux/slices/authSlice";
import { useAppDispatch } from "@/redux/hooks";

export default function DeleteAccountModal() {
  const { close } = useModal();
  const [deleteAccount] = useDeleteAccountMutation();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleDelete = async () => {
    setLoading(true);
    toast.loading("Deleting account...");

    try {
      await deleteAccount().unwrap();
      toast.dismiss();
      toast.success("Account deleted permanently");
      dispatch(removeUserInfo());
      close(["modal"]);
      navigate("/auth/signin");
    } catch (error: any) {
      toast.dismiss();
      const errMsg = error?.data?.message || "Failed to delete account";
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="">
      <h2 className=" text-xl md:text-2xl font-semibold">Permanently delete account</h2>
      <Separator className="my-6 bg-gray-200 dark:bg-[#3B3B3B]" />
      <p className="text-base md:text-xl">
        You sure you want to delete this account permanently? You won't be able to
        restore it.
      </p>
      <Separator className="my-6 bg-gray-200 dark:bg-[#3B3B3B]" />
      <div className="gap-6 flex max-sm:flex-col items-center justify-end">
        <Button
          onClick={() => close(["modal"])}
          disabled={loading}
          className="text-base md:text-xl font-medium px-7 h-12 bg-white! text-black cursor-pointer max-sm:w-full"
        >
          Cancel
        </Button>
        <Button
          onClick={handleDelete}
          disabled={loading}
          variant="destructive"
          className="text-base md:text-xl font-medium px-7 h-12 bg-[#EF4444]! cursor-pointer max-sm:w-full"
        >
          Permanently delete
        </Button>
      </div>
    </div>
  );
}
