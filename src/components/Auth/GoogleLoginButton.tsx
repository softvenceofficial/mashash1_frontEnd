import { useGoogleLogin } from "@react-oauth/google";
import { Button } from "@/components/ui/button";
import Icon from "@/components/common/Icon";
import googleIcon from "@/assets/svgs/google.svg";
import { useGoogleLoginMutation } from "@/redux/endpoints/authApi";
import { toast } from "sonner";
import { useNavigate } from "react-router";

export default function GoogleLoginButton({ text = "Log in with Google" }: { text?: string }) {
  const [googleApiLogin, { isLoading }] = useGoogleLoginMutation();
  const navigate = useNavigate();

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        await googleApiLogin({
          access_token: tokenResponse.access_token,
        }).unwrap();
        
        toast.success("Google Login Successful!");
        navigate("/dashboard/home");
      } catch (error: any) {
        console.error("Google Login Error:", error);
        toast.error(error?.data?.message || "Google Login failed");
      }
    },
    onError: () => {
      toast.error("Google Login Failed to connect");
    },
  });

  return (
    <Button
      variant="outline"
      type="button"
      disabled={isLoading}
      onClick={() => login()}
      className="w-full mt-6 bg-transparent! border-black rounded-full h-12 hover:text-foreground cursor-pointer"
    >
      <Icon src={googleIcon} className="size-5" />
      <span className="font-medium text-black">{isLoading ? "Connecting..." : text}</span>
    </Button>
  );
}
