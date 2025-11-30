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
      if (res.code === 200) {
        // Set OTP expire time in localStorage
        const expireAt = Date.now() + COUNTDOWN_DURATION * 1000;
        localStorage.setItem("otp_expire_at", expireAt.toString());

        toast.dismiss();
        toast.success("OTP sent to your email!");
        setLoading(false);
        navigate({
          pathname: "/auth/verify-otp",
          search: `?email=${btoa(values.email)}`,
        });
      }
    } catch (error) {
      console.error("Forgot Password Error:", error);
      toast.dismiss();
      toast.error("Failed to send OTP. Please try again.");
      setLoading(false);
    }
  }

  const goBack = () => navigate(-1);

  return { form, onSubmit, goBack };
}
