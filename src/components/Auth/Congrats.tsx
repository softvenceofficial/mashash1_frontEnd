import Icon from "../common/Icon";
import congrats from "@/assets/svgs/congrats.svg";
import { Button } from "../ui/button";
import { useNavigate } from "react-router";

export default function Congrats() {
  const navigate = useNavigate();
  return (
    <div className="min-h-[calc(100vh-300px)] flex justify-center items-center flex-col">
      <Icon src={congrats} className="mx-auto mb-6 size-52" />
      <div className="text-center">
        <h2 className="text-[40px] font-bold mb-3 text-black">Congratulations!</h2>
        <p className="text-base font-normal text-auth-foreground">
          You have successfully create your account.
        </p>
      </div>
      {/* Back */}
      <div className="w-36 mx-auto">
        <Button
          type="button"
          onClick={() => navigate("/auth/signin")}
          variant="outline"
          className="w-full h-12 rounded-full text-base font-medium border border-black bg-transparent hover:bg-transparent cursor-pointer mt-16 dark:bg-transparent dark:hover:bg-transparent text-black!"
        >
          Back to Sign In
        </Button>
      </div>
    </div>
  );
}
