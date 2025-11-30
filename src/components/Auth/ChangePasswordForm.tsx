import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "../ui/label";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import useChangePassword from "./hooks/use-change-password";

export default function ChangePasswordForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const { form, onSubmit } = useChangePassword({ setLoading });
  return (
    <div className="w-full max-w-md mx-auto py-10 min-h-[calc(100vh-300px)] flex flex-col justify-center">
      <div className="text-center mb-14">
        <h2 className="text-[40px] font-bold mb-4 text-black">Set Password</h2>
        <p className="text-base font-normal text-auth-foreground">
          Your new password must be unique from those previously used
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <Label className="font-medium text-base text-black">
                  Password<span className="text-red-500">*</span>
                </Label>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Min. 8 characters"
                      {...field}
                      className="h-12 rounded-[10px] border-[#E5E7EB] placeholder:text-[#9CA3AF] text-base focus:ring-0 dark:bg-transparent text-black"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <Eye className="size-5" />
                      ) : (
                        <EyeOff className="size-5" />
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
                <Label className="font-medium text-base text-black">
                  Confirm Password<span className="text-red-500">*</span>
                </Label>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showConfirm ? "text" : "password"}
                      placeholder="Min. 8 characters"
                      {...field}
                      className="h-12 rounded-[10px] border-[#E5E7EB] placeholder:text-[#9CA3AF] text-base focus:ring-0 dark:bg-transparent text-black"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                      onClick={() => setShowConfirm(!showConfirm)}
                    >
                      {showConfirm ? (
                        <Eye className="size-5" />
                      ) : (
                        <EyeOff className="size-5" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-black h-12 hover:bg-black text-base font-medium rounded-full mt-7 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Setting..." : "Set Password"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
