import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Camera, Trash2 } from "lucide-react";
import { useState, useRef } from "react";
import useProfileSettings from "../Auth/hooks/use-profile-setting";
import useModal from "../Modal/useModal";

export default function ViewProfilePage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { form, onSubmit, handleAvatarChange, avatarPreview } = useProfileSettings(setLoading);
  const fileInputRef = useRef<HTMLInputElement>(null);
console.log(imageError);
  const demo  = avatarPreview.replace('/api/', '/');  
  

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-10 max-w-2xl mx-auto"
        >
          {/* Avatar */}
          <div className="w-full flex justify-center">
            <div className="relative group">
              <img
                src={demo}
                onError={() => setImageError(true)}
                className="w-36 h-36 rounded-full object-cover border"
                alt="Profile"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Camera className="text-white size-7" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  handleAvatarChange(e);
                  setImageError(false);
                }}
              />
            </div>
          </div>

          {/* NAME FIELDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <Label className="dark:text-white text-sm">First Name</Label>
                  <FormControl>
                    <Input
                      placeholder="Enter first name"
                      {...field}
                      className="dark:text-white h-12 dark:bg-[#0F172B] bg-white rounded-xl"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <Label className="dark:text-white">Last Name</Label>
                  <FormControl>
                    <Input
                      placeholder="Enter last name"
                      {...field}
                      className="dark:text-white h-12 dark:bg-[#0F172B] bg-white rounded-xl"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* EMAIL + PHONE */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <Label className="dark:text-white">Email Address</Label>
                  <FormControl>
                    <Input
                      placeholder="example@gmail.com"
                      {...field}
                      disabled
                      className="dark:text-white h-12 dark:bg-[#0F172B] bg-white rounded-xl opacity-70"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <Label className="dark:text-white">Phone Number</Label>
                  <FormControl>
                    <Input
                      placeholder="Enter phone number"
                      {...field}
                      className="dark:text-white h-12 dark:bg-[#0F172B] bg-white rounded-xl"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* DATE OF BIRTH + PASSWORD */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormField
              control={form.control}
              name="dob"
              render={({ field }) => (
                <FormItem>
                  <Label className="dark:text-white">Date of Birth</Label>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                      className="dark:text-white h-12 dark:bg-[#0F172B] bg-white rounded-xl"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <Label className="dark:text-white">Current Password</Label>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        {...field}
                        placeholder="••••••••"
                        className="dark:text-white h-12 dark:bg-[#0F172B] bg-white rounded-xl"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 dark:text-white"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <Eye className="size-4" />
                        ) : (
                          <EyeOff className="size-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-32 bg-[#6A6CF3] text-white h-11 rounded-lg text-base font-medium cursor-pointer"
          >
            {loading ? "Saving..." : "Done"}
          </Button>

          


          {/* DELETE ACCOUNT */}
          <button
            type="button"
            onClick={() => {
              const { open } = useModal();
              open([{ modalId: "modal", openId: "account-delete" }]);
            }}
            className="flex items-center gap-2 text-[#FF4842] mt-6 text-xl font-medium cursor-pointer"
          >
            <Trash2 className="size-5" />
            Delete Account
          </button>
        </form>
      </Form>
    </div>
  );
}
