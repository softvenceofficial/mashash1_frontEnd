
import { useVerifyOTPPasswordMutation } from "@/redux/endpoints/authApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
    otp: z.string().min(4, {
        message: "Your one-time password must be 4 characters.",
    }),
});

export default function useOtpVerify() {
      const navigate = useNavigate();
      const [verifyOTPPassword] = useVerifyOTPPasswordMutation();
      const [searchParams] = useSearchParams();
      const encodedEmail = searchParams.get("email");
      const email = encodedEmail ? atob(encodedEmail) : null;

    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            otp: '',
        },
    });

    // 2. Define a submit handler.
      async function onSubmit(values: z.infer<typeof formSchema>) {
        console.log("Forget Password Data:", values);
        const formData = new FormData();
        formData.append("email", email || "");
        formData.append("otp_code", values.otp);
        try {
            const res = await verifyOTPPassword(formData).unwrap();
            console.log("OTP Verification Response:", res);
            if (res.code === 200) {
                toast.success("OTP verified successfully!");
                navigate(`/auth/change-password?token=${res.data.reset_token}`);
            }
        } catch (error) {
          console.error("OTP Verification Error:", error);
          toast.error("Failed to verify OTP. Please try again.");
          return;
        }
      }
    
      const goBack = () => navigate(-1);
    return { form, onSubmit , goBack};
}