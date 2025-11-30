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

export default function useForgetPassword() {
  const navigate = useNavigate();
  const [forgotPassword] = useForgotPasswordMutation();

  const form = useForm<ForgetPasswordSchema>({
    resolver: zodResolver(forgetPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: ForgetPasswordSchema) {
    const formData = new FormData();
    formData.append("email", values.email);
    try {
      const res = await forgotPassword(formData).unwrap();
      console.log("Forgot Password Response:", res);
      if (res.code === 200) {
        toast.success("OTP sent to your email!");

        navigate({
          pathname: "/auth/verify-otp",
          search: `?email=${btoa(values.email)}`,
        });
      }
    } catch (error) {
      console.error("Forgot Password Error:", error);
      toast.error("Failed to send OTP. Please try again.");
      return;
    }
  }

  const goBack = () => navigate(-1);

  return { form, onSubmit, goBack };
}
