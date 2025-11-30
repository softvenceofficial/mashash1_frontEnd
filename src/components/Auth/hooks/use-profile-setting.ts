// hooks/useProfileSettings.ts
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import useCurrentUser from "@/hooks/useCurrentUser";

// OPTIONAL: replace with your API mutation
// import { useUpdateProfileMutation } from "@/redux/endpoints/profileApi";

const passwordValidation = z
  .string()
  .min(6, "Password must be at least 6 characters")
  .optional();

export const profileSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email("Invalid email"),
  password: passwordValidation,
  newPassword: passwordValidation,
  confirmPassword: passwordValidation,
});

export default function useProfileSettings(
  setLoading: (loading: boolean) => void
) {
  // const [updateProfile] = useUpdateProfileMutation();
  const user = useCurrentUser();

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
        firstName: user?.first_name || "",
      lastName: user?.last_name || "",
      email: user?.email || "",
      password: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof profileSchema>) {
    setLoading(true);
    toast.loading("Updating...");

    try {
      console.log("Profile Submitted:", values);

      // Uncomment when API ready
      // const response = await updateProfile(values).unwrap();

      toast.dismiss();
      toast.success("Profile updated");
    } catch (error) {
      toast.dismiss();
      toast.error("Something went wrong.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return { form, onSubmit };
}
