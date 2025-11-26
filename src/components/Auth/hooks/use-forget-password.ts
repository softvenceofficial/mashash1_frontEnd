import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useNavigate } from "react-router";

const forgetPasswordSchema = z.object({
  email: z.string().email("Invalid email"),
});

export type ForgetPasswordSchema = z.infer<typeof forgetPasswordSchema>;

export default function useForgetPassword() {
  const navigate = useNavigate();

  const form = useForm<ForgetPasswordSchema>({
    resolver: zodResolver(forgetPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  function onSubmit(values: ForgetPasswordSchema) {
    console.log("Forget Password Data:", values);
    toast.success("OTP sent to your email!");
    navigate("/verify-otp", { replace: true });
  }

  const goBack = () => navigate(-1);

  return { form, onSubmit, goBack };
}
