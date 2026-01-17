import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { useForgotPasswordMutation } from "@/redux/endpoints/authApi";

const forgetPasswordSchema = z.object({
  email: z.string().email("Invalid email"),
});

export type ForgetPasswordSchema = z.infer<typeof forgetPasswordSchema>;

const COUNTDOWN_DURATION = 120;

export default function useForgetPassword({
  setLoading,
}: {
  setLoading: (loading: boolean) => void;
}) {
  const navigate = useNavigate();
  const [forgotPassword] = useForgotPasswordMutation();

  const form = useForm<ForgetPasswordSchema>({
    resolver: zodResolver(forgetPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: ForgetPasswordSchema) {
    setLoading(true);
    toast.loading("Sending OTP...");
    const formData = new FormData();
    formData.append("email", values.email);

    try {
      const res = await forgotPassword(formData).unwrap();
      console.log("Forgot Password Response:", res);

      // Handle success - API may return empty body, JSON, or status code
      if (res?.code === 200 || res?.status === "success" || !res) {
        const expireAt = Date.now() + COUNTDOWN_DURATION * 1000;
        localStorage.setItem("otp_expire_at", expireAt.toString());

        toast.dismiss();
        toast.success("OTP sent to your email!");
        navigate({
          pathname: "/auth/verify-otp",
          search: `?email=${btoa(values.email)}`,
        });
      } else {
        toast.dismiss();
        toast.error("Something went wrong. Please check the email.");
      }
    } catch (error: any) {
      console.error("Forgot Password Error:", error);
      toast.dismiss();
      const errorMessage = error?.data?.message || "Failed to send OTP. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  const goBack = () => navigate(-1);

  return { form, onSubmit, goBack };
}
