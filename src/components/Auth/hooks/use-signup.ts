import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { passwordValidation } from "./use-login";
import { useUserSignUpMutation } from "@/redux/endpoints/authApi";

// Signup form validation schema
const signupSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email format"),
    phone: z.string().optional(),

    password: passwordValidation,
    confirmPassword: passwordValidation,

    agree: z.boolean().refine((v) => v === true, {
      message: "You must agree to the terms",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignupSchema = z.infer<typeof signupSchema>;

export default function useSignup({ setLoading }: { setLoading: (loading: boolean) => void }) {
  const navigate = useNavigate();
  const [userSignUp] = useUserSignUpMutation();
  const form = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      agree: false,
    },
  });

  async function onSubmit(values: SignupSchema) {
    setLoading(true);
    toast.loading("Creating your account...");
    const formData = new FormData();
    formData.append("first_name", values.firstName);
    formData.append("last_name", values.lastName);
    formData.append("email", values.email);
    formData.append("phone_number", values.phone || "");
    formData.append("password", values.password);
    formData.append("confirm_password", values.confirmPassword);

    try {
      const response = await userSignUp(formData).unwrap();
      console.log("Signup Response:", response);

      if (response.code === 201 || response.status === 'success') {
        toast.dismiss();
        toast.success(response.message || "Account created successfully!");
        navigate("/auth/congrats");
      }
    } catch (error: any) {
      console.error("Signup error:", error);
      toast.dismiss();
      const errMsg = error?.data?.message || "Failed to create account.";
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  }

  return { form, onSubmit };
}
