import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { passwordValidation } from "./use-login";

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

export default function useSignup() {
  const navigate = useNavigate();

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

  function onSubmit(values: SignupSchema) {
    console.log("Signup Data:", values);

    toast.success("Account created successfully!");

    navigate("/dashboard", { replace: true });
  }

  return { form, onSubmit };
}
