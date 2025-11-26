import { Link } from "react-router";
import Icon from "../common/Icon";
import { Button } from "../ui/button";
import google from "@/assets/svgs/google.svg";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "../ui/label";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import useSignup from "./hooks/use-signup";

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { form, onSubmit } = useSignup();
  return (
    <div>
      <div className="text-center">
        <h2 className="text-[40px] font-bold mb-4">Registration</h2>
        <p className="text-base font-normal text-auth-foreground">
          Create your new account.
        </p>
        <Button
          variant="outline"
          className="w-full mt-6 bg-transparent! border-black rounded-full h-12 hover:text-foreground"
        >
          <Icon src={google} className="size-5" />
          <span className="font-medium">Register with Google</span>
        </Button>
      </div>
      <div className="flex w-full items-center my-5 md:my-10">
        <div className="bg-auth-border h-px w-1/2 ml-10"></div>
        <p className="mx-4 text-auth-foreground">or</p>
        <div className="bg-auth-border h-px w-1/2 mr-10"></div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* First + Last Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <Label className="font-medium text-base">
                    First Name<span className="text-red-500">*</span>
                  </Label>
                  <FormControl>
                    <Input
                      placeholder="Esther"
                      className="h-12 rounded-[10px] border-[#E5E7EB] placeholder:text-[#9CA3AF] text-base focus:ring-0 focus:ring-offset-0"
                      {...field}
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
                  <Label className="font-medium text-base">
                    Last Name<span className="text-red-500">*</span>
                  </Label>
                  <FormControl>
                    <Input
                      placeholder="Howard"
                      className="h-12 rounded-[10px] border-[#E5E7EB] placeholder:text-[#9CA3AF] text-base focus:ring-0 focus:ring-offset-0"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <Label className="font-medium text-base">
                  Email<span className="text-red-500">*</span>
                </Label>
                <FormControl>
                  <Input
                    placeholder="your@email.com"
                    className="h-12 rounded-[10px] border-[#E5E7EB] placeholder:text-[#9CA3AF] text-base focus:ring-0"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Phone Number */}
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <Label className="font-medium text-base">Phone Number</Label>
                <FormControl>
                  <Input
                    placeholder="your@email.com"
                    className="h-12 rounded-[10px] border-[#E5E7EB] placeholder:text-[#9CA3AF] text-base focus:ring-0"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <Label className="font-medium text-base">
                  Password<span className="text-red-500">*</span>
                </Label>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Min. 8 characters"
                      {...field}
                      className="h-12 rounded-[10px] border-[#E5E7EB] placeholder:text-[#9CA3AF] text-base focus:ring-0"
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
                <Label className="font-medium text-base">
                  Confirm Password<span className="text-red-500">*</span>
                </Label>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showConfirm ? "text" : "password"}
                      placeholder="Min. 6 characters"
                      {...field}
                      className="h-12 rounded-[10px] border-[#E5E7EB] placeholder:text-[#9CA3AF] text-base focus:ring-0"
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

          {/* Checkbox */}
          <div className="flex items-center gap-2 pt-2">
            <FormField
              control={form.control}
              name="agree"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="border-auth-border [&>svg]:h-10 [&>svg]:w-7"
                    />
                  </FormControl>
                  <FormLabel className="text-sm md:text-base md:font-medium">
                    Lorem ipsum dolor sit amet consectetur. Habitant feugiat pretium gravida fringilla phasellus.
                  </FormLabel>
                </FormItem>
              )}
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-black h-12 hover:bg-black text-base font-medium rounded-full mt-7 cursor-pointer"
          >
            Register Now
          </Button>
        </form>
      </Form>

      <div className="mt-7 text-center">
        <p className="text-base font-medium text-black">
          Already have an account?{" "}
          <Link
            to="/auth/signin"
            className="text-auth-text cursor-pointer font-medium text-base"
          >
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}
