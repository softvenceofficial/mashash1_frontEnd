import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useNavigate, useSearchParams } from "react-router";
import { useResetPasswordMutation } from "@/redux/endpoints/authApi";

// Reusable password validation
export const passwordValidation = z
  .string()
  .min(6, "Password must be at least 6 characters long")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number");

// Form schema
const formSchema = z
  .object({
    password: passwordValidation,
    confirmPassword: passwordValidation,
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export default function useChangePassword({ setLoading }: { setLoading: (loading: boolean) => void }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [resetPassword] = useResetPasswordMutation();
  console.log("Reset Token from URL:", token);

  // 1. Form setup
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  // 2. Submit handler
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    toast.loading("Setting new password...");
    const formData = new FormData();
    formData.append("new_password", values.password);
    formData.append("confirm_password", values.confirmPassword);
    formData.append("reset_token", token || "");

    try {
      const res = await resetPassword(formData).unwrap();
      toast.dismiss();
      toast.success(res.message || "Password set successfully!");
      setLoading(false);
      navigate("/auth/signin", { replace: true });
    } catch (error) {
      console.error("Reset Password Error:", error);
      toast.dismiss();
      toast.error("Failed to set password. Please try again.");
      setLoading(false);
    }
  }

  return { form, onSubmit };
}
