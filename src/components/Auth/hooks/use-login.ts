import { useUserLoginMutation } from "@/redux/endpoints/authApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { z } from "zod";

export const passwordValidation = z
  .string()
  .min(6, "Password must be at least 6 characters long")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(
    /[^A-Za-z0-9]/,
    "Password must contain at least one number and one special character",
  );

const formSchema = z.object({
  email: z.string().min(1, "Username or email is required"),
  password: passwordValidation,
  rememberMe: z.boolean().optional(),
});

export default function useLogin({setLoading}: {setLoading: (loading: boolean) => void}) {
  const navigate = useNavigate();
  const [userLogin] = useUserLoginMutation();

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    toast.loading("Logging in...");
    const formData = new FormData();
    formData.append("email", values.email);
    formData.append("password", values.password);
    console.log("Form Data:", formData.get("email"), formData.get("password"));
    try{
      const response = await userLogin(formData);
      console.log("Login Response:", response);
      if(response.data.code === 200){
        toast.dismiss();
        toast.success(response.data.message);
        setLoading(false);
        navigate("/dashboard");
      }

    } catch (error) {
      console.error("Login failed:", error);
      toast.dismiss();
      toast.error("Login failed. Please check your credentials and try again.");
      setLoading(false);
    }
  }

  return { form, onSubmit };
}
