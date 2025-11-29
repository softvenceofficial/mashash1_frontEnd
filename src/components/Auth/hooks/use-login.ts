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

export default function useLogin() {
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
    // Do something with the form values.
    // This will be type-safe and validated.
    console.log(values);
    const formData = new FormData();
    formData.append("email", values.email);
    formData.append("password", values.password);
    console.log("Form Data:", formData.get("email"), formData.get("password"));
    try{
      const response = await userLogin(formData);
      console.log("Login Response:", response);
      if(response.data.code === 200){
        toast.success(response.data.message);
      }

    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Login failed. Please check your credentials and try again.");
      return;
    }
    // Navigate to the dashboard or home page after successful login
    navigate("/dashboard");
  }

  return { form, onSubmit };
}
