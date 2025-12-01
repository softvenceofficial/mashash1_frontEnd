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
import { useState } from "react";
import useProfileSettings from "../Auth/hooks/use-profile-setting";
import OpenModal from "../Modal/OpenModal";

export default function ViewProfilePage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { form, onSubmit } = useProfileSettings(setLoading);
  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-10 max-w-2xl mx-auto"
        >
          {/* Avatar */}
          <div className="w-full flex justify-center">
            <div className="relative">
              <img
                src="/avatar.png"
                className="w-36 h-36 rounded-full object-cover border"
              />
              <button
                type="button"
                className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full"
              >
                <Camera className="text-white size-7" />
              </button>
            </div>
          </div>

          {/* NAME FIELDS ---------------------------------------------------------------- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* First Name */}
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
                      className=" dark:text-white h-12 dark:bg-[#0F172B] bg-white rounded-xl! outline-none! ring-0! ring-offset-0! shadow-none! focus:outline-none! focus:ring-0! focus:ring-offset-0! focus:!shadow-nonefocus-visible:!outline-none focus-visible:ring-0! focus-visible:ring-offset-0! focus-visible:shadow-none! dark:placeholder:text-[#62748E]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Last Name */}
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
                      className=" dark:text-white h-12 dark:bg-[#0F172B] bg-white rounded-xl! outline-none! ring-0! ring-offset-0! shadow-none! focus:outline-none! focus:ring-0! focus:ring-offset-0! focus:!shadow-nonefocus-visible:!outline-none focus-visible:ring-0! focus-visible:ring-offset-0! focus-visible:shadow-none! dark:placeholder:text-[#62748E]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* EMAIL + PASSWORD ----------------------------------------------------------- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Email */}
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
                      className=" dark:text-white h-12 dark:bg-[#0F172B] bg-white rounded-xl! outline-none! ring-0! ring-offset-0! shadow-none! focus:outline-none! focus:ring-0! focus:ring-offset-0! focus:!shadow-nonefocus-visible:!outline-none focus-visible:ring-0! focus-visible:ring-offset-0! focus-visible:shadow-none! dark:placeholder:text-[#62748E]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Current Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <Label className="dark:text-white">Password</Label>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        {...field}
                        placeholder="••••••••"
                        className=" dark:text-white h-12 dark:bg-[#0F172B] bg-white rounded-xl! outline-none! ring-0! ring-offset-0! shadow-none! focus:outline-none! focus:ring-0! focus:ring-offset-0! focus:!shadow-nonefocus-visible:!outline-none focus-visible:ring-0! focus-visible:ring-offset-0! focus-visible:shadow-none! dark:placeholder:text-[#62748E]"
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

          {/* Done Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-32 bg-[#6A6CF3] text-white h-11 rounded-lg text-base font-medium cursor-pointer"
          >
            {loading ? "Saving..." : "Done"}
          </Button>

          {/* CHANGE PASSWORD SECTION ------------------------------------------------------ */}
          <h3 className="dark:text-white font-medium">Change Password</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* New Password */}
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <Label className="dark:text-white">New Password</Label>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showNewPassword ? "text" : "password"}
                        {...field}
                        placeholder="••••••••"
                        className=" dark:text-white h-12 dark:bg-[#0F172B] bg-white rounded-xl! outline-none! ring-0! ring-offset-0! shadow-none! focus:outline-none! focus:ring-0! focus:ring-offset-0! focus:!shadow-nonefocus-visible:!outline-none focus-visible:ring-0! focus-visible:ring-offset-0! focus-visible:shadow-none! dark:placeholder:text-[#62748E]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 dark:text-white"
                      >
                        {showNewPassword ? (
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

            {/* Confirm Password */}
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <Label className="dark:text-white">Confirm Password</Label>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        {...field}
                        placeholder="••••••••"
                        className=" dark:text-white h-12 dark:bg-[#0F172B] bg-white rounded-xl! outline-none! ring-0! ring-offset-0! shadow-none! focus:outline-none! focus:ring-0! focus:ring-offset-0! focus:!shadow-nonefocus-visible:!outline-none focus-visible:ring-0! focus-visible:ring-offset-0! focus-visible:shadow-none! dark:placeholder:text-[#62748E]"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 dark:text-white"
                      >
                        {showConfirmPassword ? (
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
            className="w-44 bg-[#6A6CF3] text-white h-11 rounded-lg text-base font-medium cursor-pointer"
          >
            Change Password
          </Button>

          {/* DELETE ACCOUNT -------------------------------------------------------------- */}
          <OpenModal query={[{ modalId: "modal", openId: "account-delete" }]} >
            <button
              type="button"
              className="flex items-center gap-2 text-[#FF4842] mt-6 text-xl font-medium cursor-pointer"
            >
              <Trash2 className="size-5" />
              Delete Account
            </button>
          </OpenModal>
        </form>
      </Form>
    </div>
  );
}
