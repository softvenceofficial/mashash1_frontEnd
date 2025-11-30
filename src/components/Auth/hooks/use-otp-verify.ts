
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

export default function useOtpVerify({ setLoading }: { setLoading: (loading: boolean) => void }) {
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
        setLoading(true);
        toast.loading("Verifying OTP...");
        const formData = new FormData();
        formData.append("email", email || "");
        formData.append("otp_code", values.otp);
        try {
            const res = await verifyOTPPassword(formData).unwrap();
            if (res.code === 200) {
                toast.dismiss();
                toast.success("OTP verified successfully!");
                setLoading(false);
                navigate(`/auth/change-password?token=${res.data.reset_token}`);
                
            }
        } catch (error) {
          console.error("OTP Verification Error:", error);
          toast.dismiss();
          toast.error("Failed to verify OTP. Please try again.");
          setLoading(false);
        }
      }
    
      const goBack = () => navigate(-1);
    return { form, onSubmit , goBack};
}