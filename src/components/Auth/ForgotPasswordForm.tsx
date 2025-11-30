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
import useForgetPassword from "./hooks/use-forget-password";
import { useState } from "react";

export default function ForgotPasswordForm() {
  const [loading, setLoading] = useState(false);
  const { form, onSubmit, goBack } = useForgetPassword({ setLoading });

  return (
    <div className="w-full max-w-md mx-auto py-10 min-h-[calc(100vh-300px)] flex flex-col justify-center">
      <div className="text-center">
        <h2 className="text-[40px] font-bold mb-3 text-black">Forget Password</h2>
        <p className="text-base font-normal text-auth-foreground">
          Please enter your email address to reset your password
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-7 mt-12"
        >
          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <Label className="font-medium text-base gap-0 text-black">
                  Email address<span className="text-red-500">*</span>
                </Label>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    className="rounded-[10px] h-12 placeholder:text-auth-foreground 
                    placeholder:text-base placeholder:font-normal text-base font-normal 
                    border-[#E5E7EB] focus:ring-0 focus:ring-offset-0 focus:border-border dark:bg-transparent text-black"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Send OTP */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-black h-12 hover:bg-black text-base font-medium rounded-full cursor-pointer mt-12 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Sending..." : "Send OTP"}
          </Button>

          {/* Back */}
          <Button
            type="button"
            onClick={goBack}
            variant="outline"
            className="w-full h-12 rounded-full text-base font-medium border border-black bg-transparent! hover:bg-transparent! cursor-pointer text-black!"
          >
            Back
          </Button>
        </form>
      </Form>
    </div>
  );
}
