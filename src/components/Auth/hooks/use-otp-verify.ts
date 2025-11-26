
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
    otp: z.string().min(4, {
        message: "Your one-time password must be 4 characters.",
    }),
});

export default function useOtpVerify() {
      const navigate = useNavigate();

    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            otp: '',
        },
    });

    // 2. Define a submit handler.
      function onSubmit(values: z.infer<typeof formSchema>) {
        console.log("Forget Password Data:", values);
        toast.success("OTP sent to your email!");
        navigate("/auth/change-password", { replace: true });
      }
    
      const goBack = () => navigate(-1);
    return { form, onSubmit , goBack};
}