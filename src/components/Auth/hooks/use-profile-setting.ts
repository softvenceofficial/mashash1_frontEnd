/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import useCurrentUser from "@/hooks/useCurrentUser";
import { useUpdateUserProfileMutation } from "@/redux/endpoints/userApi";
import { useState, useEffect, useRef } from "react";
import { getFullApiUrl } from "@/utils/apiHelper";

export const profileSchema = z.object({
  firstName: z.string().min(1, "First Name is required"),
  lastName: z.string().min(1, "Last Name is required"),
  phone: z.string().optional(),
  dob: z.string().optional(),
  email: z.string().email("Invalid email address"),
  password: z.string().optional(),
  newPassword: z.string().optional(),
  confirmPassword: z.string().optional(),
}).refine((data) => {
  if (data.newPassword && data.newPassword !== data.confirmPassword) {
    return false;
  }
  return true;
}, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export default function useProfileSettings(
  setLoading: (loading: boolean) => void
) {
  const [updateProfile] = useUpdateUserProfileMutation();
  const user = useCurrentUser();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const isInitialized = useRef(false);

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      dob: "",
      email: "",
      password: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (user && !isInitialized.current) {
      form.reset({
        firstName: user.first_name || "",
        lastName: user.last_name || "",
        phone: user.phone_number || "",
        dob: user.date_of_birth || "",
        email: user.email || "",
      });
      
      setAvatarPreview(getFullApiUrl(user.avatar));
      isInitialized.current = true;
    }
  }, [user]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  async function onSubmit(values: z.infer<typeof profileSchema>) {
    setLoading(true);
    toast.loading("Updating Profile...");

    const formData = new FormData();
    formData.append("first_name", values.firstName);
    formData.append("last_name", values.lastName);
    
    if (values.phone) formData.append("phone_number", values.phone);
    if (values.dob) formData.append("date_of_birth", values.dob);
    
    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }

    try {
      const response = await updateProfile(formData).unwrap();
      toast.dismiss();
      toast.success(response.message || "Profile updated successfully");
      
      if (avatarFile && response.data?.avatar) {
        setAvatarPreview(getFullApiUrl(response.data.avatar));
        setAvatarFile(null);
      }
      
      if (values.newPassword) {
        form.setValue("password", "");
        form.setValue("newPassword", "");
        form.setValue("confirmPassword", "");
      }
    } catch (error: any) {
      toast.dismiss();
      const errMsg = error?.data?.message || "Failed to update profile.";
      toast.error(errMsg);
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return { 
    form, 
    onSubmit, 
    handleAvatarChange, 
    avatarPreview, 
    user,
    setAvatarFile,
    avatarFile
  };
}
